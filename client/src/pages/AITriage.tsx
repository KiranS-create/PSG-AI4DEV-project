import { useState } from "react";
import { useLocation } from "wouter";
import { usePatients } from "@/hooks/use-patients";
import { useAnalyzeTriage } from "@/hooks/use-triage";
import { Card, Button, Input, Textarea, Badge } from "@/components/ui";
import { Activity, ShieldAlert, HeartPulse, BrainCircuit, ArrowRight, FileText } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn, getSeverityColor } from "@/lib/utils";
import type { TriageAssessmentResponse } from "@shared/routes";

export default function AITriage() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const initialPatientId = searchParams.get("patientId") || "";

  const { data: patients, isLoading: pLoading } = usePatients();
  const analyzeTriage = useAnalyzeTriage();

  const [formData, setFormData] = useState({
    patientId: initialPatientId,
    heartRate: '',
    oxygenLevel: '',
    symptoms: '',
    clinicalNotes: ''
  });

  const [result, setResult] = useState<TriageAssessmentResponse | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setResult(null);
    analyzeTriage.mutate({
      patientId: parseInt(formData.patientId),
      heartRate: parseInt(formData.heartRate),
      oxygenLevel: parseInt(formData.oxygenLevel),
      symptoms: formData.symptoms,
      clinicalNotes: formData.clinicalNotes || undefined,
    }, {
      onSuccess: (data) => {
        setResult(data);
      }
    });
  };

  const isScanning = analyzeTriage.isPending;

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-display font-bold text-foreground flex items-center gap-3">
          <BrainCircuit className="w-8 h-8 text-primary" />
          Agentic Triage Intelligence
        </h1>
        <p className="text-muted-foreground mt-2 max-w-2xl">Enter patient vitals and clinical narrative. The AI orchestrator will analyze symptoms, generate risk scores, and provide evidence-based recommendations.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Input Form */}
        <div className="lg:col-span-5 space-y-6">
          <Card className={cn("p-6 relative transition-all duration-500", isScanning && "border-primary/50 shadow-[0_0_30px_rgba(0,216,255,0.15)]")}>
            {isScanning && <div className="scanner-line" />}
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Select Patient</label>
                <select 
                  required
                  disabled={isScanning}
                  className="flex h-11 w-full rounded-xl border-2 border-border bg-background/50 px-4 py-2 text-sm text-foreground focus-visible:outline-none focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10 transition-all disabled:opacity-50"
                  value={formData.patientId} 
                  onChange={e => setFormData({...formData, patientId: e.target.value})}
                >
                  <option value="" disabled>-- Select Patient --</option>
                  {patients?.map(p => (
                    <option key={p.id} value={p.id}>{p.name} (ID: {p.id})</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/20 p-4 rounded-xl border border-white/5 relative overflow-hidden">
                  <div className="absolute -right-2 -top-2 opacity-10"><HeartPulse className="w-16 h-16 text-destructive"/></div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Heart Rate (bpm)</label>
                  <Input required type="number" min="0" max="300" disabled={isScanning} className="font-display text-lg h-12 bg-transparent border-white/10" value={formData.heartRate} onChange={e => setFormData({...formData, heartRate: e.target.value})} placeholder="e.g. 85" />
                </div>
                <div className="bg-black/20 p-4 rounded-xl border border-white/5 relative overflow-hidden">
                  <div className="absolute -right-2 -top-2 opacity-10"><Activity className="w-16 h-16 text-primary"/></div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">SpO2 (%)</label>
                  <Input required type="number" min="0" max="100" disabled={isScanning} className="font-display text-lg h-12 bg-transparent border-white/10" value={formData.oxygenLevel} onChange={e => setFormData({...formData, oxygenLevel: e.target.value})} placeholder="e.g. 98" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Presenting Symptoms</label>
                <Textarea required disabled={isScanning} rows={3} value={formData.symptoms} onChange={e => setFormData({...formData, symptoms: e.target.value})} placeholder="Chief complaints..." />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-1.5">Clinical Notes (Optional)</label>
                <Textarea disabled={isScanning} rows={3} value={formData.clinicalNotes} onChange={e => setFormData({...formData, clinicalNotes: e.target.value})} placeholder="Additional observations..." />
              </div>

              <Button type="submit" size="lg" className="w-full text-lg gap-2 h-14" disabled={isScanning || !formData.patientId}>
                {isScanning ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Agentic Analysis in Progress...
                  </>
                ) : (
                  <>
                    <BrainCircuit className="w-5 h-5" />
                    Run Triage Intelligence
                  </>
                )}
              </Button>
            </form>
          </Card>
        </div>

        {/* Results Area */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {isScanning ? (
              <motion.div 
                key="scanning"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="h-full min-h-[500px] flex flex-col items-center justify-center p-8 border-2 border-dashed border-primary/20 rounded-2xl bg-primary/5"
              >
                <div className="relative w-32 h-32 mb-8">
                  <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
                  <div className="absolute inset-0 border-4 border-t-primary rounded-full animate-spin" />
                  <HeartPulse className="absolute inset-0 m-auto w-12 h-12 text-primary animate-pulse" />
                </div>
                <h3 className="text-xl font-display font-semibold text-primary mb-2">Analyzing Clinical Data</h3>
                <div className="flex flex-col items-center gap-2 text-sm text-muted-foreground">
                  <p className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-primary rounded-full animate-ping"/> Mining narrative for entities...</p>
                  <p className="flex items-center gap-2" style={{animationDelay: '1s'}}><div className="w-1.5 h-1.5 bg-primary rounded-full animate-ping"/> Correlating vitals & history...</p>
                  <p className="flex items-center gap-2" style={{animationDelay: '2s'}}><div className="w-1.5 h-1.5 bg-primary rounded-full animate-ping"/> Computing risk score...</p>
                </div>
              </motion.div>
            ) : result ? (
              <motion.div 
                key="result"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                className="space-y-6"
              >
                <Card className={cn("p-8 border-t-4", getSeverityColor(result.severity).split(' ').find(c => c.startsWith('border-'))?.replace('border-', 'border-t-'))}>
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
                    <div>
                      <h2 className="text-xs font-bold text-muted-foreground uppercase tracking-widest mb-1">AI Triage Result</h2>
                      <div className="flex items-center gap-3">
                        <span className={cn("px-4 py-1.5 rounded-md text-sm font-black tracking-widest uppercase", getSeverityColor(result.severity))}>
                          {result.severity}
                        </span>
                      </div>
                    </div>
                    <div className="text-right bg-black/30 p-4 rounded-xl border border-white/5 flex items-center gap-4">
                      <div>
                        <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-1">Risk Score</div>
                        <div className="text-4xl font-display font-black text-white text-glow">
                          {result.riskScore.toFixed(1)}<span className="text-lg text-muted-foreground">/100</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-primary/10 border border-primary/20 rounded-xl p-5 mb-8 flex items-start gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                      <ShieldAlert className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-primary mb-1">Recommendation</h4>
                      <p className="text-foreground leading-relaxed">
                        Patient requires immediate transfer to <strong className="text-white bg-white/10 px-2 py-0.5 rounded">{result.recommendedDepartment}</strong> based on the computed risk assessment.
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold border-b border-white/10 pb-3 mb-4 flex items-center gap-2">
                      <FileText className="w-5 h-5 text-muted-foreground" />
                      Extracted Clinical Evidence
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Array.isArray(result.evidenceCards) && result.evidenceCards.map((evidence: any, idx: number) => (
                        <Card key={idx} className="p-4 bg-black/20 border-white/5 hover:border-white/10 transition-colors">
                          <h4 className="font-medium text-white mb-2 line-clamp-1">{evidence.title || "Observation"}</h4>
                          <p className="text-sm text-muted-foreground leading-relaxed">{evidence.description || evidence.content}</p>
                        </Card>
                      ))}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ) : (
              <div className="h-full min-h-[500px] flex flex-col items-center justify-center p-8 border-2 border-dashed border-white/10 rounded-2xl">
                <div className="w-20 h-20 rounded-full bg-white/5 flex items-center justify-center mb-6">
                  <BrainCircuit className="w-10 h-10 text-muted-foreground opacity-50" />
                </div>
                <h3 className="text-xl font-medium text-foreground mb-2">Awaiting Input</h3>
                <p className="text-muted-foreground text-center max-w-md">Provide patient clinical details on the left to initiate the agentic triage analysis pipeline.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
