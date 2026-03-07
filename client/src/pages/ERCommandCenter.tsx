import { useAllTriageAssessments } from "@/hooks/use-triage";
import { usePatients } from "@/hooks/use-patients";
import { Card } from "@/components/ui";
import { format } from "date-fns";
import { Activity, Clock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn, getSeverityColor } from "@/lib/utils";
import type { TriageAssessment, Patient } from "@shared/schema";

export default function ERCommandCenter() {
  const { data: assessments, isLoading: aLoading } = useAllTriageAssessments();
  const { data: patients, isLoading: pLoading } = usePatients();

  const getPatientName = (id: number) => {
    return patients?.find(p => p.id === id)?.name || `Patient #${id}`;
  };

  const columns = [
    { title: "CRITICAL", severity: "CRITICAL", color: "text-destructive border-destructive" },
    { title: "HIGH", severity: "HIGH", color: "text-warning border-warning" },
    { title: "MEDIUM", severity: "MEDIUM", color: "text-[#eab308] border-[#eab308]" },
    { title: "LOW", severity: "LOW", color: "text-success border-success" },
  ];

  const getAssessmentsBySeverity = (severity: string) => {
    return assessments?.filter(a => a.severity.toUpperCase() === severity)
      .sort((a, b) => b.riskScore - a.riskScore) || [];
  };

  return (
    <div className="h-[calc(100vh-120px)] flex flex-col">
      <div className="mb-6 flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-3xl font-display font-bold text-foreground flex items-center gap-3">
            <Activity className="w-8 h-8 text-primary animate-pulse" />
            ER Command Center
          </h1>
          <p className="text-muted-foreground mt-1">Live agentic triage board prioritizing patients by severity.</p>
        </div>
        <div className="flex items-center gap-2 bg-black/30 px-4 py-2 rounded-lg border border-white/5">
          <div className="w-2 h-2 rounded-full bg-destructive animate-ping" />
          <span className="text-sm font-medium text-muted-foreground uppercase tracking-widest">Live Sync</span>
        </div>
      </div>

      {(aLoading || pLoading) ? (
        <div className="flex-1 flex items-center justify-center text-primary">Loading Board Data...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 flex-1 overflow-hidden">
          {columns.map(col => (
            <div key={col.severity} className="flex flex-col h-full bg-black/20 rounded-2xl border border-white/5 overflow-hidden">
              <div className={cn("p-4 border-b shrink-0 bg-background/50 backdrop-blur-md", col.color)}>
                <h2 className="font-display font-bold tracking-wider text-lg flex items-center justify-between">
                  {col.title}
                  <span className="bg-white/10 px-2 py-0.5 rounded text-sm">{getAssessmentsBySeverity(col.severity).length}</span>
                </h2>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                <AnimatePresence>
                  {getAssessmentsBySeverity(col.severity).map((item, idx) => (
                    <motion.div
                      key={item.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card className={cn("p-4 border-l-4 cursor-pointer hover:bg-white/5 transition-colors", getSeverityColor(item.severity).split(' ').find(c => c.startsWith('border-'))?.replace('border-', 'border-l-'))}>
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-white truncate pr-2">{getPatientName(item.patientId)}</h3>
                          <div className="text-lg font-black text-glow">{item.riskScore.toFixed(0)}</div>
                        </div>
                        <div className="text-sm text-muted-foreground line-clamp-2 mb-3 bg-black/20 p-2 rounded-md border border-white/5">
                          {item.symptoms}
                        </div>
                        <div className="flex items-center justify-between text-xs font-medium">
                          <span className="text-primary truncate max-w-[120px]">{item.recommendedDepartment}</span>
                          <span className="flex items-center gap-1 text-muted-foreground">
                            <Clock className="w-3 h-3" />
                            {format(new Date(item.createdAt || Date.now()), 'HH:mm')}
                          </span>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {getAssessmentsBySeverity(col.severity).length === 0 && (
                  <div className="h-full flex items-center justify-center text-muted-foreground/50 font-medium italic p-8 text-center border-2 border-dashed border-white/5 rounded-xl">
                    No active {col.title.toLowerCase()} cases
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
