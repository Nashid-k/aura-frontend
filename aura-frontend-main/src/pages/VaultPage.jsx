import { motion } from 'framer-motion';
import { 
  ShieldCheck, 
  Brain, 
  Sparkles, 
  Rocket, 
  CheckCircle2, 
  Bell, 
  User,
  ChevronRight,
  Lock,
  Globe
} from 'lucide-react';
import { BackupPanel } from '@/shared/ui/BackupPanel';
import { useAuth } from '@/app/providers/AuthContext';
import { useDashboard } from '@/app/providers/DashboardContext';
import { Switch } from '@/shared/ui/core/Switch';
import { cn } from '@/shared/lib/utils/cn';

const PERSONAS = [
  { id: 'maya', name: 'Maya', desc: 'Soulful & identity-focused', icon: <Sparkles className="w-5 h-5 text-purple-500" /> },
  { id: 'stoic', name: 'The Stoic', desc: 'Firm & reality-grounded', icon: <ShieldCheck className="w-5 h-5 text-slate-500" /> },
  { id: 'visionary', name: 'The Visionary', desc: '10x growth mindset', icon: <Rocket className="w-5 h-5 text-orange-500" /> },
  { id: 'scientist', name: 'The Scientist', desc: 'Analytical & data-driven', icon: <Brain className="w-5 h-5 text-blue-500" /> },
];

export function VaultPage() {
  const { user, updatePreferences } = useAuth();
  const { backupMessage, importing, exportData, importData, loading } = useDashboard();

  const handlePersonaChange = async (personaId) => {
    await updatePreferences({ persona: personaId });
  };

  const handleToggleNotifications = async () => {
    await updatePreferences({ notificationOptIn: !user?.notificationOptIn });
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-12 px-6 space-y-8 animate-pulse">
        <div className="h-12 w-48 bg-secondary/50 rounded-xl" />
        <div className="h-64 bg-secondary/30 rounded-3xl" />
        <div className="h-96 bg-secondary/30 rounded-3xl" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto pb-32 px-6 space-y-10 bg-background">
      <header className="pt-8">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">Settings</h1>
      </header>

      {/* Account Section */}
      <section className="space-y-2">
        <div className="bg-card rounded-2xl overflow-hidden divide-y divide-border/40 border border-border/40 shadow-sm">
          <div className="p-4 flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-2xl font-bold text-primary-foreground shadow-sm">
              {user?.name?.[0]?.toUpperCase() || <User size={32} />}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-foreground">{user?.name}</h3>
              <p className="text-sm font-medium text-muted-foreground">{user?.email}</p>
            </div>
            <ChevronRight className="text-muted-foreground/30 w-5 h-5" />
          </div>
          
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-600">
                <CheckCircle2 size={18} />
              </div>
              <span className="font-semibold text-foreground">Identity Status</span>
            </div>
            <span className="text-sm font-bold text-teal-600 px-3 py-1 bg-teal-500/10 rounded-full">
              Verified
            </span>
          </div>
        </div>
      </section>

      {/* Preferences Section */}
      <section className="space-y-3">
        <h2 className="px-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">General</h2>
        <div className="bg-card rounded-2xl overflow-hidden divide-y divide-border/40 border border-border/40 shadow-sm">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-orange-500 flex items-center justify-center text-white">
                <Bell size={18} />
              </div>
              <span className="font-semibold text-foreground">Notifications</span>
            </div>
            <Switch 
              checked={user?.notificationOptIn} 
              onCheckedChange={handleToggleNotifications}
            />
          </div>
          
          <div className="p-4 flex items-center justify-between group cursor-pointer hover:bg-secondary/30 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-white">
                <Globe size={18} />
              </div>
              <span className="font-semibold text-foreground">Language</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground font-medium">English</span>
              <ChevronRight className="text-muted-foreground/30 w-5 h-5" />
            </div>
          </div>

          <div className="p-4 flex items-center justify-between group cursor-pointer hover:bg-secondary/30 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-slate-500 flex items-center justify-center text-white">
                <Lock size={18} />
              </div>
              <span className="font-semibold text-foreground">Privacy & Security</span>
            </div>
            <ChevronRight className="text-muted-foreground/30 w-5 h-5" />
          </div>
        </div>
      </section>

      {/* Persona Selection */}
      <section className="space-y-3">
        <h2 className="px-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Mentor Persona</h2>
        <div className="bg-card rounded-2xl overflow-hidden divide-y divide-border/40 border border-border/40 shadow-sm">
          {PERSONAS.map((p) => (
            <button
              key={p.id}
              onClick={() => handlePersonaChange(p.id)}
              className="w-full p-4 flex items-center justify-between hover:bg-secondary/30 transition-colors text-left"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-secondary/80 flex items-center justify-center">
                  {p.icon}
                </div>
                <div>
                  <span className="block font-semibold text-foreground">{p.name}</span>
                  <span className="text-[11px] font-medium text-muted-foreground">{p.desc}</span>
                </div>
              </div>
              {user?.preferences?.persona === p.id && (
                <CheckCircle2 className="text-primary w-5 h-5" />
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Data Section */}
      <section className="space-y-3">
        <h2 className="px-4 text-xs font-bold text-muted-foreground uppercase tracking-widest">Data Management</h2>
        <div className="bg-card rounded-2xl overflow-hidden border border-border/40 shadow-sm">
          <BackupPanel
            onExport={exportData}
            onImport={async (event) => {
              const file = event.target.files?.[0];
              await importData(file);
              event.target.value = '';
            }}
            importing={importing}
            message={backupMessage}
          />
        </div>
      </section>

      <footer className="text-center pt-8 space-y-2">
        <p className="text-xs font-medium text-muted-foreground/40">Nashid Version 2.0.0 (Apple Inspired)</p>
        <p className="text-[10px] font-bold text-muted-foreground/20 uppercase tracking-[0.2em]">Crafted for Intentional Living</p>
      </footer>
    </div>
  );
}
