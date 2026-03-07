import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import type { InsertPatient, Patient } from "@shared/schema";

export function usePatients() {
  return useQuery<Patient[]>({
    queryKey: [api.patients.list.path],
    queryFn: async () => {
      const res = await fetch(api.patients.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch patients");
      const data = await res.json();
      return api.patients.list.responses[200].parse(data);
    },
  });
}

export function usePatient(id: number) {
  return useQuery<Patient | null>({
    queryKey: [api.patients.get.path, id],
    queryFn: async () => {
      if (!id) return null;
      const url = buildUrl(api.patients.get.path, { id });
      const res = await fetch(url, { credentials: "include" });
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch patient");
      const data = await res.json();
      return api.patients.get.responses[200].parse(data);
    },
    enabled: !!id,
  });
}

export function useCreatePatient() {
  const queryClient = useQueryClient();
  return useMutation<Patient, Error, InsertPatient>({
    mutationFn: async (data) => {
      const res = await fetch(api.patients.create.path, {
        method: api.patients.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) {
        if (res.status === 400) {
          const err = await res.json();
          throw new Error(err.message || "Validation failed");
        }
        throw new Error("Failed to create patient");
      }
      return api.patients.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.patients.list.path] });
    },
  });
}
