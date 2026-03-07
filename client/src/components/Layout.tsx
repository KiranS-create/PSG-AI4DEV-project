import { Link, useLocation } from "wouter";
import { Activity, Users, FileText, HeartPulse, Pill, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import logoPath from "@assets/IMG-20260307-WA0000_1772842531262.jpg";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const navItems = [
    { name: "Patient Dashboard", href: "/", icon: Users },
    { name: "AI Triage", href: "/triage", icon: HeartPulse },
    { name: "ER Command Center", href: "/er-board", icon: Activity },
    { name: "Health Records", href: "/records", icon: FileText },
    { name: "Medicine Market", href: "/medicine", icon: Pill },
  ];

  return (
    <div className="min-h-screen flex bg-background text-foreground">
      {/* Sidebar */}
      <aside className="w-72 border-r border-white/5 bg-card/50 backdrop-blur-xl flex flex-col hidden md:flex z-20">
        <div className="h-24 flex items-center px-6 border-b border-white/5">
          <div className="flex items-center gap-3">
            <img src={logoPath} alt="TrAIge Logo" className="w-10 h-10 rounded-xl object-cover shadow-lg shadow-primary/20" />
            <h1 className="text-2xl font-display font-bold tracking-wider text-glow text-white">
              Tr<span className="text-primary">AI</span>ge
            </h1>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 px-3 mt-4">System Modules</div>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location === item.href || (item.href !== '/' && location.startsWith(item.href));
            
            return (
              <Link 
                key={item.href} 
                href={item.href}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group",
                  isActive 
                    ? "bg-primary/10 text-primary border border-primary/20 shadow-[inset_0_0_15px_rgba(0,216,255,0.1)]" 
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                )}
              >
                <Icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
                <span className="font-medium">{item.name}</span>
                {isActive && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(0,216,255,1)]" />
                )}
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-black/20 border border-white/5">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse shadow-[0_0_8px_hsl(var(--success))]" />
            <span className="text-sm font-medium text-muted-foreground">System Online</span>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        <header className="h-20 flex items-center justify-between px-8 border-b border-white/5 bg-background/80 backdrop-blur-md sticky top-0 z-10">
          <h2 className="text-xl font-display font-semibold text-foreground/90 capitalize tracking-wide">
            {navItems.find(i => i.href === location)?.name || "Agentic Clinical Platform"}
          </h2>
          <div className="flex items-center gap-4">
            <div className="px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium flex items-center gap-2">
              <Activity className="w-4 h-4" />
              Intelligence Core Active
            </div>
          </div>
        </header>
        <div className="flex-1 overflow-y-auto p-4 md:p-8 relative">
          {children}
        </div>
      </main>
    </div>
  );
}
