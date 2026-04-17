import { useMemo, useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useIsFetching, useIsMutating } from '@tanstack/react-query';
import { 
  Calendar, 
  TrendingUp, 
  Bell, 
  Archive, 
  Trophy, 
  Plus, 
  LogOut, 
  FileText, 
  Search,
  LayoutDashboard,
  X,
  Compass,
  Command,
  Activity,
  Cloud,
  CloudOff,
  Loader2
} from 'lucide-react';
import { cn } from '@/shared/lib/utils/cn';
import { Button } from '@/shared/ui/core/Button';
import { Card } from '@/shared/ui/core/Card';
import { useAuth } from '../../app/providers/AuthContext';
import { HabitDialog } from '../../entities/habit/ui/HabitDialog';
import { AiCoachPanel } from './AiCoachPanel';
import { useHabitActions } from '../../app/providers/DashboardContext';
import { pageTransition, SPRING_TIGHT } from '../lib/utils/animations';

const navItems = [
  { label: 'Today', value: '/app/today', icon: Calendar },
  { label: 'Progress', value: '/app/progress', icon: TrendingUp },
  { label: 'Journal', value: '/app/journal', icon: FileText },
  { label: 'Identity', value: '/app/identity', icon: Activity },
  { label: 'Achievements', value: '/app/achievements', icon: Trophy },
  { label: 'Vault', value: '/app/vault', icon: Archive },
];

function SyncStatus() {
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();
  const isSyncing = isFetching > 0 || isMutating > 0;
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/50 border border-border/50 transition-all">
      {isOnline ? (
        <>
          {isSyncing ? (
            <Loader2 className="w-3 h-3 text-primary animate-spin" />
          ) : (
            <Cloud className="w-3 h-3 text-muted-foreground/50" />
          )}
          <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/70">
            {isSyncing ? 'Syncing' : 'Aura Live'}
          </span>
        </>
      ) : (
        <>
          <CloudOff className="w-3 h-3 text-destructive" />
          <span className="text-[10px] font-bold uppercase tracking-widest text-destructive/70">
            Offline
          </span>
        </>
      )}
    </div>
  );
}

export function AppShell() {
  const location = useLocation();
  const { user, logout } = useAuth();
  const { saveHabit } = useHabitActions();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingHabit, setEditingHabit] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const currentNav = useMemo(() => {
    const matched = navItems.find((item) => location.pathname.startsWith(item.value));
    return matched?.value || '/app/today';
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background text-foreground relative flex overflow-hidden font-sans selection:bg-primary/20">
      
      {/* Desktop Sidebar - Apple Inspired Focus Mode */}
      <aside className="hidden lg:flex flex-col w-72 sticky top-0 h-screen bg-background border-r border-border/50 z-50 p-6 transition-all duration-700">
        <div className="flex flex-col h-full gap-8">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-3 px-3 group">
            <div className="p-2 rounded-xl bg-primary/10 border border-primary/20 group-hover:scale-110 transition-transform">
              <Command className="w-6 h-6 text-primary" />
            </div>
            <span className="text-2xl font-black tracking-tighter">Aura</span>
          </Link>

          {/* Navigation */}
          <nav className="flex flex-col gap-1 group/nav">
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground/50 mb-4 ml-3">Ecosystem</p>
            {navItems.map((item) => {
              const active = currentNav === item.value;
              const Icon = item.icon;
              return (
                <Link
                  key={item.value}
                  to={item.value}
                  className={cn(
                    "flex items-center gap-3 py-3 px-4 rounded-2xl text-sm font-bold transition-all relative group/item",
                    active 
                      ? "text-primary bg-primary/5" 
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50 group-hover/nav:opacity-40 hover:!opacity-100"
                  )}
                >
                  {active && (
                    <motion.div 
                      layoutId="sidebar-active-pill"
                      className="absolute inset-0 bg-primary/5 rounded-2xl border border-primary/10"
                      transition={SPRING_TIGHT}
                    />
                  )}
                  <Icon className={cn("w-5 h-5 relative z-10 transition-transform group-hover/item:scale-110", active && "text-primary")} />
                  <span className="relative z-10">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Profile */}
          <div className="mt-auto p-4 rounded-[1.5rem] bg-secondary/30 border border-border/50 backdrop-blur-sm transition-opacity group-hover/nav:opacity-40 hover:!opacity-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-black text-sm shadow-lg shadow-primary/20">
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold truncate">{user?.name}</p>
                <p className="text-[10px] text-muted-foreground font-black uppercase tracking-widest opacity-60">Level {user?.identity?.level || 1}</p>
              </div>
              <button 
                onClick={logout}
                className="p-2 rounded-lg text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-screen flex flex-col min-w-0 bg-background overflow-hidden relative">
        {/* Desktop Header */}
        <header className={cn(
          "hidden lg:flex items-center justify-between px-8 py-4 sticky top-0 z-40 transition-all duration-500",
          scrolled ? "glass-panel border-b border-border shadow-sm" : "bg-transparent"
        )}>
          <div className="flex items-center gap-3 px-5 py-2.5 rounded-2xl bg-secondary/50 border border-border w-96 focus-within:bg-secondary/80 focus-within:ring-2 focus-within:ring-primary/10 transition-all group shadow-sm">
            <Search className="w-4.5 h-4.5 text-muted-foreground/60" />
            <input 
              type="text"
              placeholder="Search rituals, entries..." 
              className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-muted-foreground/40 text-foreground outline-none font-medium"
            />
            <kbd className="hidden group-focus-within:inline-flex items-center gap-1 px-2 py-0.5 rounded-lg border border-border/50 bg-background text-[10px] font-bold text-muted-foreground/60">
              Esc
            </kbd>
          </div>

          <div className="flex items-center gap-4">
            <SyncStatus />
            <div className="h-6 w-px bg-border/50" />
            <Button 
              variant="outline"
              size="icon"
              className="rounded-2xl h-11 w-11 hover:scale-105 transition-transform"
              aria-label="Notifications"
            >
              <Bell className="w-5 h-5" />
            </Button>
            <div className="h-6 w-px bg-border/50" />
            <Button 
              onClick={() => { setEditingHabit(null); setDialogOpen(true); }}
              className="rounded-2xl px-6 h-11 font-bold text-sm shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Plus className="w-4.5 h-4.5 mr-2 stroke-[3px]" />
              New Ritual
            </Button>
          </div>
        </header>

        {/* Mobile Header */}
        <header className="lg:hidden flex justify-between items-center px-6 py-4 bg-background/80 backdrop-blur-xl sticky top-0 z-40 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Command className="w-5 h-5 text-primary" />
              <span className="text-xl font-black tracking-tighter">Aura</span>
            </div>
            <SyncStatus />
          </div>
          <button 
            onClick={() => setMobileMenuOpen(true)}
            className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shadow-lg shadow-primary/20 active:scale-90 transition-transform"
          >
            {user?.name?.[0]?.toUpperCase()}
          </button>
        </header>

        {/* Content Canvas */}
        <div className="flex-1 p-page-x max-w-7xl mx-auto w-full relative overflow-y-auto hide-scrollbar">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={location.pathname}
              {...pageTransition}
              className="w-full min-h-full pb-32 lg:pb-12"
            >
              <Outlet
                context={{
                  openNewHabit: () => { setEditingHabit(null); setDialogOpen(true); },
                  editHabit: (habit) => { setEditingHabit(habit); setDialogOpen(true); },
                }}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Mobile Tab Bar */}
      <nav className="fixed bottom-6 left-6 right-6 lg:hidden z-50">
        <div className="h-16 rounded-2xl bg-card/70 backdrop-blur-2xl border border-border/50 flex items-center justify-around px-2 shadow-xl">
          {navItems.slice(0, 5).map((item) => {
            const active = currentNav === item.value;
            const Icon = item.icon;
            return (
              <Link
                key={item.value}
                to={item.value}
                className={cn(
                  "flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all relative",
                  active ? "text-primary" : "text-muted-foreground"
                )}
              >
                {active && (
                  <motion.div 
                    layoutId="mobile-nav-pill"
                    className="absolute inset-0 bg-primary/10 rounded-xl"
                    transition={SPRING_TIGHT}
                  />
                )}
                <Icon className="w-5 h-5 relative z-10" />
              </Link>
            );
          })}
        </div>
      </nav>

      <HabitDialog
        open={dialogOpen}
        initialHabit={editingHabit}
        onClose={() => { setDialogOpen(false); setEditingHabit(null); }}
        onSubmit={async (form) => {
          await saveHabit(form, editingHabit);
          setDialogOpen(false);
          setEditingHabit(null);
        }}
      />

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] lg:hidden"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 right-0 w-80 bg-background border-l border-border shadow-2xl z-[101] p-8 flex flex-col lg:hidden"
            >
              <div className="flex justify-between items-center mb-12">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-primary/10 border border-primary/20">
                    <Command className="w-6 h-6 text-primary" />
                  </div>
                  <span className="text-2xl font-black tracking-tighter">Aura</span>
                </div>
                <button 
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 hover:bg-secondary rounded-xl transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <nav className="flex-1 flex flex-col gap-2">
                {navItems.map((item) => {
                  const active = currentNav === item.value;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.value}
                      to={item.value}
                      onClick={() => setMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-4 py-4 px-5 rounded-2xl text-lg font-bold transition-all",
                        active 
                          ? "text-primary bg-primary/10 border border-primary/20" 
                          : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                      )}
                    >
                      <Icon className="w-6 h-6" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              <div className="pt-8 border-t border-border/50">
                <div className="flex items-center gap-4 mb-8 p-4 rounded-2xl bg-secondary/30 border border-border/50">
                  <div className="w-12 h-12 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-black text-lg">
                    {user?.name?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p className="font-bold text-foreground">{user?.name}</p>
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
                      Level {user?.identity?.level || 1} • {user?.identity?.archetype || 'Initiate'}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="w-full flex items-center gap-4 py-4 px-5 rounded-2xl text-lg font-bold text-destructive hover:bg-destructive/10 transition-all group"
                >
                  <LogOut className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
                  <span>Sign Out</span>
                </button>
                <p className="text-center mt-12 text-[10px] font-medium opacity-50 uppercase tracking-[0.2em]">
                  Aura v2.0.0
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <AiCoachPanel />
    </div>
  );
}
