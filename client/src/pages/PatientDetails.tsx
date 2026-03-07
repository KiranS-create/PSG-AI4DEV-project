import { useRoute } from "wouter";
import { usePatient } from "@/hooks/use-patients";
import { usePatientRecords, useCreateRecord } from "@/hooks/use-records";
import { usePatientTriageAssessments } from "@/hooks/use-triage";
import { Card, Badge, Button, Modal, Textarea } from "@/components/ui";
import { format } from "date-fns";
import { FileText, Activity, Clock, Plus } from "lucide-react";
import { useState } from "react";
import { cn, getSeverityColor } from "@/lib/utils";

export default function PatientDetails() {
  const [, params] = useRoute("/patients/:id");
  const patientId = parseInt(params?.id || "0");
  
  const { data: patient, isLoading: pLoading } = usePatient(patientId);
  const { data: records, isLoading: rLoading } = usePatientRecords(patientId);
  const { data: triages, isLoading: tLoading } = usePatientTriageAssessments(patientId);
  
  const createRecord = useCreateRecord();
  
  const [activeTab, setActiveTab] = useState<'overview' | 'records'>('overview');
  const [isRecordModalOpen, setRecordModalOpen] = useState(false);
  const [recordData, setRecordData] = useState({ type: 'General Checkup', content: '' });

  const handleCreateRecord = (e: React.FormEvent) => {
    e.preventDefault();
    createRecord.mutate({
      patientId,
      type: recordData.type,
      content: recordData.content
    }, {
      onSuccess: () => {
        setRecordModalOpen(false);
        setRecordData({ type: 'General Checkup', content: '' });
      }
    });
  };

  if (pLoading) return <div className="animate-pulse flex items-center justify-center h-64 text-primary">Loading Clinical Profile...</div>;
  if (!patient) return <div className="text-center text-destructive mt-20">Patient not found.</div>;

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Patient Header */}
      <Card className="p-8 border-t-4 border-t-primary relative overflow-hidden">
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <Activity className="w-64 h-64" />
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-display font-bold text-white tracking-tight">{patient.name}</h1>
              <Badge variant="outline" className="bg-background/50 border-white/10 px-3 py-1 text-sm">ID: {patient.id}</Badge>
            </div>
            <div className="flex flex-wrap items-center gap-4 text-muted-foreground text-sm">
              <span className="flex items-center gap-1"><span className="text-foreground font-medium">Age:</span> {patient.age}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
              <span className="flex items-center gap-1"><span className="text-foreground font-medium">Gender:</span> {patient.gender}</span>
              {patient.bloodType && (
                <>
                  <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
                  <span className="flex items-center gap-1"><span className="text-destructive font-medium">Blood:</span> {patient.bloodType}</span>
                </>
              )}
              <span className="w-1.5 h-1.5 rounded-full bg-white/20" />
              <span className="flex items-center gap-1"><span className="text-foreground font-medium">Registered:</span> {format(new Date(patient.createdAt || Date.now()), 'MMM d, yyyy')}</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-px">
        <button 
          onClick={() => setActiveTab('overview')}
          className={cn("px-6 py-3 font-medium text-sm transition-colors border-b-2", activeTab === 'overview' ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground")}
        >
          Clinical Overview
        </button>
        <button 
          onClick={() => setActiveTab('records')}
          className={cn("px-6 py-3 font-medium text-sm transition-colors border-b-2", activeTab === 'records' ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground")}
        >
          Medical Records ({records?.length || 0})
        </button>
      </div>

      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-primary" />
                Medical History
              </h3>
              {patient.medicalHistory ? (
                <p className="text-muted-foreground leading-relaxed bg-black/20 p-4 rounded-xl border border-white/5">{patient.medicalHistory}</p>
              ) : (
                <p className="text-muted-foreground italic bg-black/20 p-4 rounded-xl border border-white/5 text-center">No significant prior medical history recorded.</p>
              )}
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                Recent Triage Events
              </h3>
              {tLoading ? (
                <div className="animate-pulse h-20 bg-white/5 rounded-xl" />
              ) : triages?.length === 0 ? (
                <p className="text-muted-foreground text-center py-6">No triage assessments found for this patient.</p>
              ) : (
                <div className="space-y-4">
                  {triages?.slice(0, 3).map(triage => (
                    <div key={triage.id} className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl border border-white/5 bg-background/50 hover:bg-white/5 transition-colors gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-medium text-foreground">{format(new Date(triage.createdAt || Date.now()), 'MMM d, HH:mm')}</span>
                          <span className={cn("px-2.5 py-0.5 rounded text-[10px] font-bold tracking-wider", getSeverityColor(triage.severity))}>
                            {triage.severity}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-1">{triage.symptoms}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="text-2xl font-display font-bold text-primary">{triage.riskScore.toFixed(1)}<span className="text-sm text-muted-foreground font-sans">/100</span></div>
                        <div className="text-xs text-muted-foreground uppercase">{triage.recommendedDepartment}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6 bg-gradient-to-br from-card to-card border-primary/20 shadow-[inset_0_0_20px_rgba(0,216,255,0.05)]">
              <h3 className="text-lg font-semibold mb-2 text-primary">Quick Actions</h3>
              <p className="text-sm text-muted-foreground mb-6">Perform immediate clinical operations for this patient.</p>
              <div className="space-y-3">
                <Button className="w-full justify-start gap-3 h-12 text-md" asChild>
                  <a href={`/triage?patientId=${patient.id}`}>
                    <Activity className="w-5 h-5" />
                    Run AI Triage
                  </a>
                </Button>
                <Button variant="outline" className="w-full justify-start gap-3 h-12 text-md" onClick={() => setActiveTab('records')}>
                  <FileText className="w-5 h-5" />
                  View Records
                </Button>
              </div>
            </Card>
          </div>
        </div>
      )}

      {activeTab === 'records' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">Clinical Records</h2>
            <Button onClick={() => setRecordModalOpen(true)} className="gap-2">
              <Plus className="w-4 h-4" />
              Add Record
            </Button>
          </div>

          {rLoading ? (
            <div className="space-y-4">
              {[1,2].map(i => <div key={i} className="h-32 bg-white/5 animate-pulse rounded-xl" />)}
            </div>
          ) : records?.length === 0 ? (
             <div className="text-center py-16 border-2 border-dashed border-white/10 rounded-2xl">
               <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
               <p className="text-muted-foreground">No medical records uploaded yet.</p>
             </div>
          ) : (
            <div className="space-y-4">
              {records?.map(record => (
                <Card key={record.id} className="p-6 border-l-4 border-l-primary/50">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg text-primary">{record.type}</h3>
                    <span className="text-sm text-muted-foreground">{format(new Date(record.createdAt || Date.now()), 'PPpp')}</span>
                  </div>
                  <p className="text-foreground/90 whitespace-pre-wrap">{record.content}</p>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      <Modal isOpen={isRecordModalOpen} onClose={() => setRecordModalOpen(false)} title="Add Medical Record">
        <form onSubmit={handleCreateRecord} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1.5">Record Type</label>
            <select 
              className="flex h-11 w-full rounded-xl border-2 border-border bg-background/50 px-4 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10 transition-all"
              value={recordData.type} onChange={e => setRecordData({...recordData, type: e.target.value})}
            >
              <option value="Consultation">Consultation</option>
              <option value="Surgery">Surgery</option>
              <option value="Lab Results">Lab Results</option>
              <option value="Prescription">Prescription</option>
              <option value="Imaging">Imaging</option>
              <option value="Discharge Summary">Discharge Summary</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-1.5">Clinical Content</label>
            <Textarea 
              required 
              rows={6}
              value={recordData.content} 
              onChange={e => setRecordData({...recordData, content: e.target.value})} 
              placeholder="Enter detailed clinical notes, lab findings, or summaries..." 
            />
          </div>
          <div className="pt-4 border-t border-white/5 flex justify-end gap-3">
            <Button type="button" variant="ghost" onClick={() => setRecordModalOpen(false)}>Cancel</Button>
            <Button type="submit" disabled={createRecord.isPending}>
              {createRecord.isPending ? "Saving..." : "Save Record"}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
