import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getSeverityColor(severity: string) {
  switch (severity.toUpperCase()) {
    case 'CRITICAL': return 'bg-destructive/10 text-destructive border-destructive/30 glow-critical';
    case 'HIGH': return 'bg-warning/10 text-warning border-warning/30 glow-high';
    case 'MEDIUM': return 'bg-[#eab308]/10 text-[#eab308] border-[#eab308]/30 glow-medium';
    case 'LOW': return 'bg-success/10 text-success border-success/30 glow-low';
    default: return 'bg-muted text-muted-foreground border-border';
  }
}
