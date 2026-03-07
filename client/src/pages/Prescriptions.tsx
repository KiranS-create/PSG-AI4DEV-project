import { useState } from "react";
import { usePatientPrescriptions, useCreatePrescription } from "@/hooks/use-prescriptions";
import { usePatients } from "@/hooks/use-patients";
import { Card, Button, Input, Badge, Modal } from "@/components/ui";
import { Pill, Plus, ClipboardList, Loader2, Calendar } from "lucide-react";
import { format } from "date-fns";

export default function PrescriptionTab() {
  const { data: patients } = usePatients();
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(null);
  const { data: prescriptions, isLoading } = usePatientPrescriptions(selectedPatientId || 0);
  const createPrescription = useCreatePrescription();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    medication: "",
    dosage: "",
    frequency: "",
    duration: "",
    instructions: ""
  });

  const handleCreate = async () => {
    if (!selectedPatientId) return;
    await createPrescription.mutateAsync({
      patientId: selectedPatientId,
      ...formData
    });
    setFormData({ medication: "", dosage: "", frequency: "", duration: "", instructions: "" });
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground flex items-center gap-3">
            <Pill className="w-8 h-8 text-primary" />
            Prescription Management
          </h1>
          <p className="text-muted-foreground mt-2">Manage active medications and treatment plans across the clinical network.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} disabled={!selectedPatientId}>
          <Plus className="w-4 h-4 mr-2" /> New Prescription
        </Button>
      </div>

      <Card className="p-6 bg-card/30 border-white/5">
        <label className="text-sm font-medium text-muted-foreground mb-2 block">Select Patient to View Prescriptions</label>
        <select 
          className="w-full max-w-md h-11 rounded-xl border-2 border-border bg-background/50 px-4 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10 transition-all"
          value={selectedPatientId || ""}
          onChange={e => setSelectedPatientId(Number(e.target.value))}
        >
          <option value="">-- Choose Patient --</option>
          {patients?.map(p => <option key={p.id} value={p.id}>{p.name} (ID: {p.id})</option>)}
        </select>
      </Card>

      {selectedPatientId ? (
        isLoading ? (
          <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {prescriptions?.map(p => (
              <Card key={p.id} className="p-5 border-white/5 bg-black/20 hover:border-primary/20 transition-all">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Pill className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-lg">{p.medication}</h4>
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Calendar className="w-3 h-3" /> Started {format(new Date(p.createdAt!), 'MMM d, yyyy')}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div className="bg-white/5 p-2 rounded-lg">
                    <div className="text-[10px] text-muted-foreground uppercase font-bold">Dosage</div>
                    <div className="text-white">{p.dosage}</div>
                  </div>
                  <div className="bg-white/5 p-2 rounded-lg">
                    <div className="text-[10px] text-muted-foreground uppercase font-bold">Frequency</div>
                    <div className="text-white">{p.frequency}</div>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground bg-white/5 p-3 rounded-lg border border-white/5 italic">
                  "{p.instructions}"
                </div>
                <div className="mt-4 pt-4 border-t border-white/5 text-[10px] text-muted-foreground uppercase tracking-widest text-center">
                  Duration: {p.duration}
                </div>
              </Card>
            ))}
            {prescriptions?.length === 0 && (
              <div className="col-span-full text-center py-20 bg-black/20 rounded-2xl border border-dashed border-white/10">
                <ClipboardList className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                <h3 className="text-lg font-medium text-muted-foreground">No active prescriptions</h3>
                <p className="text-sm text-muted-foreground/60">Click 'New Prescription' to add one for this patient.</p>
              </div>
            )}
          </div>
        )
      ) : (
        <div className="text-center py-20 bg-black/20 rounded-2xl border border-dashed border-white/10">
          <Users className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-20" />
          <h3 className="text-lg font-medium text-muted-foreground">Please select a patient</h3>
        </div>
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="New Prescription">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-xs font-bold text-muted-foreground uppercase mb-1.5 block">Medication Name</label>
              <Input value={formData.medication} onChange={e => setFormData({...formData, medication: e.target.value})} placeholder="e.g. Amoxicillin" />
            </div>
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase mb-1.5 block">Dosage</label>
              <Input value={formData.dosage} onChange={e => setFormData({...formData, dosage: e.target.value})} placeholder="e.g. 500mg" />
            </div>
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase mb-1.5 block">Frequency</label>
              <Input value={formData.frequency} onChange={e => setFormData({...formData, frequency: e.target.value})} placeholder="e.g. Twice daily" />
            </div>
            <div>
              <label className="text-xs font-bold text-muted-foreground uppercase mb-1.5 block">Duration</label>
              <Input value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} placeholder="e.g. 7 days" />
            </div>
          </div>
          <div>
            <label className="text-xs font-bold text-muted-foreground uppercase mb-1.5 block">Special Instructions</label>
            <Textarea value={formData.instructions} onChange={e => setFormData({...formData, instructions: e.target.value})} placeholder="e.g. Take with food" />
          </div>
          <Button className="w-full h-12 text-lg" onClick={handleCreate} disabled={!formData.medication || createPrescription.isPending}>
            {createPrescription.isPending ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : "Save Prescription"}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
