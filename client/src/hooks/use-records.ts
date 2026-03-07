import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import type { MedicalRecord } from "@shared/schema";
import { z } from "zod";

export function usePatientRecords(patientId: number) {
  return useQuery<MedicalRecord[]>({
    queryKey: [api.medicalRecords.listByPatient.path, patientId],
    queryFn: async () => {
      if (!patientId) return [];
      const url = buildUrl(api.medicalRecords.listByPatient.path, { patientId });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch medical records");
      const data = await res.json();
      return api.medicalRecords.listByPatient.responses[200].parse(data);
    },
    enabled: !!patientId,
  });
}

type CreateRecordInput = z.infer<typeof api.medicalRecords.create.input>;

export function useCreateRecord() {
  const queryClient = useQueryClient();
  return useMutation<MedicalRecord, Error, CreateRecordInput>({
    mutationFn: async (data) => {
      const res = await fetch(api.medicalRecords.create.path, {
        method: api.medicalRecords.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to add medical record");
      return api.medicalRecords.create.responses[201].parse(await res.json());
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: [api.medicalRecords.listByPatient.path, variables.patientId] 
      });
    },
  });
}
