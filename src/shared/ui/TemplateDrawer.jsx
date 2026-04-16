import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { api } from '../api/client';
import { useDashboardData } from '../../app/providers/DashboardContext';
import { Card } from '@/shared/ui/core/Card';
import { Button } from '@/shared/ui/core/Button';
import { cn } from '@/shared/lib/utils/cn';

/**
 * TemplateDrawer - A sliding side panel for browsing and installing habit templates.
 * Redesigned with custom Framer Motion drawer and glassmorphism.
 */
export function TemplateDrawer({ open, onClose }) {
  const [templates, setTemplates] = useState([]);
  const [installing, setInstalling] = useState(null);
  const [result, setResult] = useState(null);
  const { refresh } = useDashboardData();

  useEffect(() => {
    if (open) {
      api
        .get('/templates')
        .then(({ data }) => setTemplates(data.templates || []))
        .catch(() => {});
    }
  }, [open]);

  async function install(templateId) {
    setInstalling(templateId);
    setResult(null);
    try {
      const { data } = await api.post('/templates/install', { templateId });
      setResult({ type: 'success', message: data.message });
      await refresh();
    } catch {
      setResult({ type: 'error', message: 'Failed to install template.' });
    } finally {
      setInstalling(null);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 z-50 h-full w-full sm:w-[420px] bg-slate-950 border-l border-white/5 shadow-2xl flex flex-col"
          >
            {/* Header */}
            <div className="p-6 border-b border-white/5 flex items-center justify-between bg-slate-950/50 backdrop-blur-xl">
              <div className="space-y-1">
                <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-teal-500" />
                  Habit Templates
                </h2>
                <p className="text-xs text-muted-foreground">
                  One-tap habit packs to get started fast
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-white/5 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Template list */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
              <AnimatePresence>
                {result && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className={cn(
                      "flex items-center gap-3 p-4 rounded-xl border",
                      result.type === 'success' 
                        ? "bg-teal-500/10 border-teal-500/20 text-teal-500" 
                        : "bg-red-500/10 border-red-500/20 text-red-500"
                    )}
                  >
                    {result.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
                    <p className="text-sm font-medium">{result.message}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="space-y-4">
                {templates.map((template, index) => (
                  <motion.div
                    key={template.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <Card
                      className={cn(
                        "group p-5 transition-all duration-300",
                        "bg-gradient-to-br from-slate-900/50 to-slate-950/80 border-white/5",
                        "hover:border-teal-500/30 hover:shadow-[0_8px_30px_rgb(20,184,166,0.1)]"
                      )}
                    >
                      <div className="space-y-4">
                        <div className="flex items-start gap-4">
                          <div className="text-3xl p-3 rounded-2xl bg-white/5 flex items-center justify-center">
                            {template.emoji}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-1">
                              <h4 className="font-bold text-foreground truncate">
                                {template.name}
                              </h4>
                              <span className="px-2 py-0.5 rounded-full bg-teal-500/10 text-teal-500 text-[10px] font-bold border border-teal-500/20">
                                {template.habitCount} habits
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">
                              {template.description}
                            </p>
                          </div>
                        </div>

                        <Button
                          fullWidth
                          variant="outline"
                          onClick={() => install(template.id)}
                          disabled={installing === template.id}
                          className="gap-2 border-white/10 hover:border-teal-500/50 hover:bg-teal-500/5"
                        >
                          {installing === template.id ? (
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                          ) : (
                            <Download size={16} />
                          )}
                          {installing === template.id ? 'Installing...' : 'Install Pack'}
                        </Button>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
