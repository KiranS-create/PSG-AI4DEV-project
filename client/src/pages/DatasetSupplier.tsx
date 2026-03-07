import { useState } from "react";
import { useDatasets, useCreateDataset } from "@/hooks/use-datasets";
import { usePatients } from "@/hooks/use-patients";
import { usePatientRecords } from "@/hooks/use-records";
import { Card, Button, Input, Textarea, Badge } from "@/components/ui";
import { Database, Plus, FileJson, CheckCircle2, Loader2 } from "lucide-react";
import { format } from "date-fns";

export default function DatasetSupplier() {
  const { data: datasets, isLoading: dLoading } = useDatasets();
  const { data: patients } = usePatients();
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);
  const { data: records } = usePatientRecords(selectedPatientId || 0);
  const [selectedRecords, setSelectedRecords] = useState<number[]>([]);
  const [name, setName] = useState("");
  const createDataset = useCreateDataset();

  const handleToggleRecord = (id: number) => {
    setSelectedRecords(prev => 
      prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]
    );
  };

  const handleCreate = async () => {
    if (!name || selectedRecords.length === 0) return;
    await createDataset.mutateAsync({
      name,
      sourceRecordIds: selectedRecords
    });
    setName("");
    setSelectedRecords([]);
    setSelectedPatientId(null);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-display font-bold text-foreground flex items-center gap-3">
          <Database className="w-8 h-8 text-primary" />
          Dataset Supplier
        </h1>
        <p className="text-muted-foreground mt-2">Convert clinical narratives into structured training datasets for medical AI models.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <Card className="p-6 space-y-4 lg:col-span-1">
          <h3 className="text-lg font-semibold">New Dataset</h3>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-muted-foreground">Dataset Name</label>
              <Input value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Cardiac_Training_Set_01" />
            </div>
            <div>
              <label className="text-sm font-medium text-muted-foreground">Source Patient</label>
              <select 
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={selectedPatientId || ""}
                onChange={e => setSelectedPatientId(Number(e.target.value))}
              >
                <option value="">Select a patient...</option>
                {patients?.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
              </select>
            </div>
            
            {records && records.length > 0 && (
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Select Records ({selectedRecords.length})</label>
                <div className="max-h-60 overflow-y-auto space-y-2 pr-2">
                  {records.map(r => (
                    <div 
                      key={r.id}
                      onClick={() => handleToggleRecord(r.id)}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${selectedRecords.includes(r.id) ? 'bg-primary/10 border-primary' : 'bg-black/20 border-white/5'}`}
                    >
                      <div className="text-xs font-bold text-primary mb-1">{r.type}</div>
                      <div className="text-xs text-muted-foreground line-clamp-2">{r.content}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button 
              className="w-full" 
              disabled={!name || selectedRecords.length === 0 || createDataset.isPending}
              onClick={handleCreate}
            >
              {createDataset.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Plus className="w-4 h-4 mr-2" />}
              Generate Dataset
            </Button>
          </div>
        </Card>

        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-lg font-semibold">Generated Datasets</h3>
          {dLoading ? (
            <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {datasets?.map(d => (
                <Card key={d.id} className="p-4 border-white/10 bg-card/30">
                  <div className="flex items-center justify-between mb-2">
                    <FileJson className="w-5 h-5 text-primary" />
                    <Badge variant="default" className="bg-success/20 text-success border-success/30">
                      <CheckCircle2 className="w-3 h-3 mr-1" /> {d.status}
                    </Badge>
                  </div>
                  <h4 className="font-bold text-white">{d.name}</h4>
                  <p className="text-xs text-muted-foreground mt-1">Source Records: {d.sourceRecordIds.length}</p>
                  <div className="text-[10px] text-muted-foreground mt-4">{format(new Date(d.createdAt!), 'PPP p')}</div>
                </Card>
              ))}
              {datasets?.length === 0 && (
                <div className="col-span-full text-center p-12 text-muted-foreground">No datasets generated yet.</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
