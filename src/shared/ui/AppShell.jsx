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

const navItems = [
  { label: 'Today', value: '/app/today', icon: Calendar },
  { label: 'Progress', value: '/app/progress', icon: TrendingUp },
  { label: 'Journal', value: '/app/journal', icon: FileText },
  { label: 'Identity', value: '/app/identity', icon: Activity },
  { label: 'Achievements', value: '/app/achievements', icon: Trophy },
  { label: 'Vault', value: '/app/vault', icon: Archive },
];

const springTransition = { type: "spring", stiffness: 400, damping: 30 };

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
      
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 fixed top-0 left-0 bottom-0 glass-panel border-r border-border z-50 p-6">
        <div className="flex flex-col h-full gap-8">
          {/* Brand */}
          <Link to="/" className="flex items-center gap-3 px-2 group">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
              <Command className="w-6 h-6" />
            </div>
            <span className="text-2xl font-semibold tracking-tight">Aura</span>
          </Link>

          {/* Navigation */}
          <nav className="flex flex-col gap-1">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-2 ml-3">Menu</p>
            {navItems.map((item) => {
              const active = currentNav === item.value;
              const Icon = item.icon;
              return (
                <Link
                  key={item.value}
                  to={item.value}
                  className={cn(
                    "flex items-center gap-3 py-2.5 px-3 rounded-xl text-sm font-medium transition-all relative group",
                    active 
                      ? "text-primary bg-secondary/50" 
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/30"
                  )}
                >
                  {active && (
                    <motion.div 
                      layoutId="sidebar-active-pill"
                      className="absolute inset-0 bg-secondary/50 rounded-xl"
                      transition={springTransition}
                    />
                  )}
                  <div className="relative z-10">
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <span className="relative z-10">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User Profile */}
          <div className="mt-auto p-4 rounded-2xl bg-secondary/30 border border-border/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shadow-sm">
                {user?.name?.[0]?.toUpperCase()}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">{user?.name}</p>
                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight">Personal Workspace</p>
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
      <main className="flex-1 lg:pl-72 pb-24 lg:pb-0 min-h-screen flex flex-col relative z-10">
        
        {/* Desktop Header */}
        <header className={cn(
          "hidden lg:flex h-16 items-center justify-between px-8 sticky top-0 z-40 transition-all",
          scrolled ? "glass-panel border-b border-border shadow-sm" : "bg-transparent"
        )}>
          <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-secondary/50 border border-border w-96 focus-within:bg-secondary/80 focus-within:ring-2 focus-within:ring-primary/20 transition-all group">
            <Search className="w-4 h-4 text-muted-foreground" />
            <input 
              type="text"
              placeholder="Search..." 
              className="bg-transparent border-none focus:ring-0 text-sm w-full placeholder:text-muted-foreground text-foreground outline-none"
            />
            <kbd className="hidden group-focus-within:inline-flex items-center gap-1 px-1.5 py-0.5 rounded border border-border bg-background text-[10px] font-medium text-muted-foreground">
              Esc
            </kbd>
          </div>

          <div className="flex items-center gap-4">
            <SyncStatus />
            <div className="h-6 w-px bg-border" />
            <Button 
              variant="outline"
              size="icon"
              className="rounded-xl"
              aria-label="Notifications"
            >
              <Bell className="w-4.5 h-4.5" />
            </Button>
            <div className="h-6 w-px bg-border" />
            <Button 
              onClick={() => { setEditingHabit(null); setDialogOpen(true); }}
              className="rounded-xl px-5 h-10 font-semibold text-sm shadow-sm"
            >
              <Plus className="w-4 h-4 mr-2" />
              New Entry
            </Button>
          </div>
        </header>

        {/* Mobile Header */}
        <header className="lg:hidden flex justify-between items-center px-6 py-4 bg-background/80 backdrop-blur-xl sticky top-0 z-40 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Command className="w-5 h-5 text-primary" />
              <span className="text-xl font-bold tracking-tight">Aura</span>
            </div>
            <SyncStatus />
          </div>
          <button 
            onClick={() => setMobileMenuOpen(true)}
            className="w-9 h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm shadow-sm"
          >
            {user?.name?.[0]?.toUpperCase()}
          </button>
        </header>

        {/* Content Canvas */}
        <div className="flex-1 p-page-x max-w-7xl mx-auto w-full relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={springTransition}
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
        <div className="h-16 rounded-2xl bg-card/70 backdrop-blur-2xl border border-border flex items-center justify-around px-2 shadow-lg">
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
                    transition={springTransition}
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
              className="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100] lg:hidden"
            />
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={springTransition}
              className="fixed top-0 right-0 bottom-0 w-full max-w-sm bg-card z-[101] p-8 shadow-2xl border-l border-border lg:hidden flex flex-col"
            >
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-xl bg-primary/10">
                    <Compass className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-lg font-bold">Settings</span>
                </div>
                <button 
                  onClick={() => setMobileMenuOpen(false)} 
                  className="p-2 hover:bg-secondary rounded-xl transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <Card className="flex flex-col items-center p-8 mb-8 border-none bg-secondary/30">
                <div className="w-20 h-20 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center text-3xl font-bold mb-4 shadow-md">
                  {user?.name?.[0]?.toUpperCase()}
                </div>
                <h3 className="font-bold text-xl">{user?.name}</h3>
                <p className="text-muted-foreground text-xs font-medium uppercase tracking-wider mt-1">Free Tier</p>
              </Card>

              <div className="space-y-3">
                 <Button 
                  variant="destructive"
                  onClick={() => { logout(); setMobileMenuOpen(false); }}
                  className="w-full rounded-xl h-12 font-bold uppercase tracking-wider text-[10px]"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
              
              <div className="mt-auto pt-8 border-t border-border">
                <div className="flex justify-center gap-6 mb-4">
                  <Link to="#" className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors">Privacy</Link>
                  <Link to="#" className="text-xs font-medium text-muted-foreground hover:text-primary transition-colors">Terms</Link>
                </div>
                <p className="text-center text-muted-foreground text-[10px] font-medium opacity-50 uppercase tracking-[0.2em]">
                  Aura v1.0.0
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
