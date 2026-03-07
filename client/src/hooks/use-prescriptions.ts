import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import type { Prescription } from "@shared/schema";
import { z } from "zod";

export function usePatientPrescriptions(patientId: number) {
  return useQuery<Prescription[]>({
    queryKey: [api.prescriptions.listByPatient.path, patientId],
    queryFn: async () => {
      if (!patientId) return [];
      const url = buildUrl(api.prescriptions.listByPatient.path, { patientId });
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch prescriptions");
      return res.json();
    },
    enabled: !!patientId,
  });
}

type CreatePrescriptionInput = z.infer<typeof api.prescriptions.create.input>;

export function useCreatePrescription() {
  const queryClient = useQueryClient();
  return useMutation<Prescription, Error, CreatePrescriptionInput>({
    mutationFn: async (data) => {
      const res = await fetch(api.prescriptions.create.path, {
        method: api.prescriptions.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to add prescription");
      return res.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: [api.prescriptions.listByPatient.path, variables.patientId] 
      });
    },
  });
}
