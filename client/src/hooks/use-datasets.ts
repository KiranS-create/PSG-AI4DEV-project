import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@shared/routes";
import type { Dataset } from "@shared/schema";

export function useDatasets() {
  return useQuery<Dataset[]>({
    queryKey: [api.datasets.list.path],
    queryFn: async () => {
      const res = await fetch(api.datasets.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch datasets");
      return res.json();
    }
  });
}

export function useCreateDataset() {
  const queryClient = useQueryClient();
  return useMutation<Dataset, Error, { name: string; description?: string; sourceRecordIds: number[] }>({
    mutationFn: async (data) => {
      const res = await fetch(api.datasets.create.path, {
        method: api.datasets.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to create dataset");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.datasets.list.path] });
    },
  });
}
