import React, { forwardRef } from "react";
import { cn } from "@/lib/utils";

// --- Button ---
export const Button = forwardRef<HTMLButtonElement, React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: 'default' | 'outline' | 'ghost' | 'danger', size?: 'sm' | 'default' | 'lg' }>(
  ({ className, variant = 'default', size = 'default', ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-xl text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50",
          {
            "bg-primary text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0": variant === 'default',
            "border-2 border-border bg-transparent hover:bg-secondary hover:border-primary/50 text-foreground": variant === 'outline',
            "hover:bg-secondary text-foreground": variant === 'ghost',
            "bg-destructive text-destructive-foreground shadow-lg shadow-destructive/20 hover:shadow-destructive/40 hover:-translate-y-0.5 active:translate-y-0": variant === 'danger',
            "h-9 px-4 py-2": size === 'default',
            "h-8 rounded-lg px-3 text-xs": size === 'sm',
            "h-11 rounded-xl px-8": size === 'lg',
          },
          className
        )}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

// --- Input ---
export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "flex h-11 w-full rounded-xl border-2 border-border bg-background/50 px-4 py-2 text-sm text-foreground ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-50 transition-all",
          className
        )}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

// --- Textarea ---
export const Textarea = forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          "flex min-h-[100px] w-full rounded-xl border-2 border-border bg-background/50 px-4 py-3 text-sm text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-primary focus-visible:ring-4 focus-visible:ring-primary/10 disabled:cursor-not-allowed disabled:opacity-50 transition-all",
          className
        )}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

// --- Card ---
export function Card({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("glass-panel rounded-2xl shadow-xl shadow-black/40 overflow-hidden", className)} {...props}>
      {children}
    </div>
  );
}

// --- Badge ---
export function Badge({ className, variant = 'default', children, ...props }: React.HTMLAttributes<HTMLDivElement> & { variant?: 'default' | 'outline' | 'critical' | 'high' | 'medium' | 'low' }) {
  return (
    <div className={cn(
      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
      {
        "bg-primary/20 text-primary border border-primary/30": variant === 'default',
        "border border-border text-foreground": variant === 'outline',
        "bg-destructive/10 text-destructive border border-destructive/30 glow-critical": variant === 'critical',
        "bg-warning/10 text-warning border border-warning/30 glow-high": variant === 'high',
        "bg-[#eab308]/10 text-[#eab308] border border-[#eab308]/30 glow-medium": variant === 'medium',
        "bg-success/10 text-success border border-success/30 glow-low": variant === 'low',
      },
      className
    )} {...props}>
      {children}
    </div>
  );
}

// --- Modal ---
export function Modal({ isOpen, onClose, title, children }: { isOpen: boolean, onClose: () => void, title: string, children: React.ReactNode }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity" onClick={onClose} />
      <Card className="relative w-full max-w-lg shadow-2xl border border-white/10 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <h2 className="text-xl font-display font-semibold text-foreground">{title}</h2>
          <button onClick={onClose} className="p-2 text-muted-foreground hover:text-foreground hover:bg-white/5 rounded-full transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinelinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
      </Card>
    </div>
  );
}
