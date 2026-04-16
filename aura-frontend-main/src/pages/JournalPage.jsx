import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import dayjs from 'dayjs';
import { 
  Edit3, 
  Sparkles, 
  Share2, 
  Brain, 
  Loader2, 
  CheckCircle2, 
  Info,
  Calendar,
  Zap,
  Quote,
  Clock
} from 'lucide-react';
import { api } from '@/shared/api/client';
import { useDashboard } from '@/app/providers/DashboardContext';
import { nativeBridge } from '@/shared/lib/utils/nativeBridge';
import { Card, CardContent } from '@/shared/ui/core/Card';
import { Button } from '@/shared/ui/core/Button';
import { cn } from '@/shared/lib/utils/cn';

export function JournalPage() {
  const { refresh } = useDashboard();
  const [content, setContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [psychology, setPsychology] = useState(null);
  const [toast, setToast] = useState(null);
  const saveTimeoutRef = useRef(null);

  const todayKey = dayjs().format('YYYY-MM-DD');

  useEffect(() => {
    const loadEntry = async () => {
      try {
        const { data } = await api.get('/journal');
        const todayEntry = data.find((e) => e.date === todayKey);
        if (todayEntry) {
          setContent(todayEntry.content);
          setPsychology(todayEntry.psychology);
        }
      } catch (err) {
        console.error('Failed to load journal', err);
      }
    };
    loadEntry();
  }, [todayKey]);

  const handleSave = async (nextContent = content, forceAnalyze = false) => {
    setSaving(true);
    if (forceAnalyze) setAnalyzing(true);
    try {
      const { data } = await api.post('/journal', {
        date: todayKey,
        content: nextContent,
      });

      if (forceAnalyze) {
        setPsychology(data.psychology);
        if (data.detectedActions?.length > 0) {
          const uniqueHabits = [...new Set(data.detectedActions.map((a) => a.title))];
          setToast({ message: `AI detected and logged: ${uniqueHabits.join(', ')}`, type: 'success' });
          await refresh();
        } else {
          setToast({ message: 'AI analyzed your entry, but no new habits were detected.', type: 'info' });
        }
      }
    } catch (err) {
      console.error(err);
      if (forceAnalyze) setToast({ message: 'Failed to analyze journal.', type: 'error' });
    } finally {
      setSaving(false);
      setAnalyzing(false);
    }
  };

  const handleContentChange = (e) => {
    const nextContent = e.target.value;
    setContent(nextContent);
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => handleSave(nextContent, false), 2000);
  };

  const handleSyncToNotes = async () => {
    const result = await nativeBridge.syncToNotes(`Nashid Journal - ${dayjs().format('LL')}`, content);
    if (result === 'clipboard') {
      setToast({ message: 'Sync sheet not available. Copied to clipboard instead.', type: 'info' });
    } else if (result) {
      setToast({ message: 'Journal synced to native notes.', type: 'success' });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-12 pb-32 px-6 bg-background">
      <header className="flex flex-col gap-2 pt-8">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-primary/60 uppercase tracking-widest">
            {dayjs().format('MMMM D, YYYY')}
          </span>
          <div className="flex items-center gap-4">
            <AnimatePresence>
              {saving && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 text-xs font-medium text-muted-foreground"
                >
                  <Loader2 size={12} className="animate-spin" />
                  Saving...
                </motion.div>
              )}
            </AnimatePresence>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleSyncToNotes}
              className="rounded-full hover:bg-secondary/80"
            >
              <Share2 size={20} className="text-primary" />
            </Button>
          </div>
        </div>
        <h1 className="text-5xl font-bold tracking-tight text-foreground">
          Journal
        </h1>
      </header>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative group"
      >
        <textarea
          value={content}
          onChange={handleContentChange}
          placeholder="What's on your mind?"
          className="w-full min-h-[500px] bg-transparent border-none focus:ring-0 text-xl md:text-2xl font-medium leading-relaxed placeholder:text-muted-foreground/20 resize-none outline-none selection:bg-primary/20"
        />
      </motion.div>

      <div className="fixed bottom-12 right-12 z-40">
        <Button
          disabled={analyzing || !content.trim()}
          onClick={() => handleSave(content, true)}
          className="h-14 px-8 rounded-full font-bold text-lg shadow-xl shadow-primary/20 bg-primary text-primary-foreground hover:scale-105 active:scale-95 transition-all"
        >
          {analyzing ? (
            <Loader2 className="w-6 h-6 animate-spin" />
          ) : (
            <>
              <Sparkles className="mr-2 w-5 h-5" />
              Analyze with Maya
            </>
          )}
        </Button>
      </div>

      {/* Maya's Psychological Reflection */}
      <AnimatePresence>
        {psychology && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="pt-12 border-t border-border/40"
          >
            <div className="bg-secondary/30 rounded-[2.5rem] p-8 md:p-12 space-y-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                  <Brain size={24} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold tracking-tight">Maya's Reflection</h3>
                  <p className="text-sm font-medium text-muted-foreground">{psychology.sentiment}</p>
                </div>
              </div>

              <p className="text-3xl font-semibold leading-tight text-foreground/90">
                "{psychology.reframe}"
              </p>

              {psychology.distortions?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {psychology.distortions.map((d) => (
                    <span 
                      key={d} 
                      className="px-4 py-2 rounded-full bg-background border border-border/40 text-sm font-bold text-primary"
                    >
                      {d}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="fixed bottom-28 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-3rem)] max-w-sm"
          >
            <div className={cn(
              "p-4 rounded-3xl border border-border/40 backdrop-blur-2xl shadow-2xl flex items-center gap-4",
              toast.type === 'success' ? "bg-background/90" : "bg-destructive/10"
            )}>
              <div className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center",
                toast.type === 'success' ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"
              )}>
                {toast.type === 'success' ? <CheckCircle2 size={20} /> : <Info size={20} />}
              </div>
              <p className="font-bold text-sm flex-1">{toast.message}</p>
              <button onClick={() => setToast(null)} className="text-muted-foreground hover:text-foreground">
                <Clock size={16} className="rotate-45" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
