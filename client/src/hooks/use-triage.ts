import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type TriageAnalyzeInput, type TriageAssessmentResponse } from "@shared/routes";
import type { TriageAssessment } from "@shared/schema";

export function useAllTriageAssessments() {
  return useQuery<TriageAssessment[]>({
    queryKey: [api.triage.listAll.path],
    queryFn: async () => {
      const res = await fetch(api.triage.listAll.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch triage assessments");
      const data = await res.json();
      return api.triage.listAll.responses[200].parse(data);
    },
    refetchInterval: 10000, // Real-time board update every 10s
  });
}

export function usePatientTriageAssessments(patientId: number) {
  return useQuery<TriageAssessment[]>({
    queryKey: [api.triage.listByPatient.path, patientId],
    queryFn: async () => {
      if (!patientId) return [];
      const url = buildUrl(api.triage.listByPatient.path, { patientId });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch triage history");
      const data = await res.json();
      return api.triage.listByPatient.responses[200].parse(data);
    },
    enabled: !!patientId,
  });
}

export function useAnalyzeTriage() {
  const queryClient = useQueryClient();
  return useMutation<TriageAssessmentResponse, Error, TriageAnalyzeInput>({
    mutationFn: async (data) => {
      const res = await fetch(api.triage.analyze.path, {
        method: api.triage.analyze.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) {
        if (res.status === 400) {
          const err = await res.json();
          throw new Error(err.message || "Validation failed");
        }
        throw new Error("AI Triage Analysis failed");
      }
      return api.triage.analyze.responses[201].parse(await res.json());
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [api.triage.listAll.path] });
      queryClient.invalidateQueries({ 
        queryKey: [api.triage.listByPatient.path, variables.patientId] 
      });
    },
  });
}
