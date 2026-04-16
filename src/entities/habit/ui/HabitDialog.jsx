import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Check, Info, Clock, Tag, Target, Type, Palette, Sparkles, Wand2 } from 'lucide-react';
import { cn } from '@/shared/lib/utils/cn';
import { Button } from '@/shared/ui/core/Button';
import { Input } from '@/shared/ui/core/Input';
import { Label } from '@/shared/ui/core/Label';

const colorOptions = [
  '#14B8A6', // Teal
  '#0EA5E9', // Ocean
  '#3B82F6', // Blue
  '#2DD4BF', // Aquamarine
  '#065F46', // Deep Emerald
  '#075985', // Deep Sky
];

const defaultForm = {
  title: '',
  description: '',
  icon: 'bolt',
  color: '#14B8A6',
  category: 'Personal',
  kind: 'build',
  reminder: '08:00',
  notes: '',
  targetMetric: '',
  targetValue: 0,
  frequency: {
    mode: 'daily',
    targetCount: 7,
    daysOfWeek: [1, 2, 3, 4, 5],
  },
};

const slideUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1]
    },
  }),
};

function buildFormState(initialHabit) {
  return initialHabit
    ? {
        ...initialHabit,
        frequency: {
          mode: initialHabit.frequency?.mode || 'daily',
          targetCount: initialHabit.frequency?.targetCount || 7,
          daysOfWeek: initialHabit.frequency?.daysOfWeek || [1, 2, 3, 4, 5],
        },
        targetMetric: initialHabit.targetMetric || '',
        targetValue: initialHabit.targetValue || 0,
      }
    : defaultForm;
}

export function HabitDialog({ open, initialHabit, onClose, onSubmit }) {
  const [form, setForm] = useState(defaultForm);

  useEffect(() => {
    if (open) {
      setForm(buildFormState(initialHabit));
    }
  }, [initialHabit, open]);

  const handleField = (field) => (event) => {
    setForm((current) => ({ ...current, [field]: event.target.value }));
  };

  const handleFrequencyMode = (value) => {
    setForm((current) => ({
      ...current,
      frequency: {
        ...current.frequency,
        mode: value,
      },
    }));
  };

  const toggleDay = (day) => {
    setForm((current) => {
      const currentDays = current.frequency.daysOfWeek || [];
      const daysOfWeek = currentDays.includes(day)
        ? currentDays.filter((entry) => entry !== day)
        : [...currentDays, day].sort();

      return {
        ...current,
        frequency: {
          ...current.frequency,
          daysOfWeek,
        },
      };
    });
  };

  const submit = () => {
    onSubmit(form);
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        {/* Immersive Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-slate-950/90 backdrop-blur-md"
        />

        {/* Dialog Content */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 30 }}
          className="relative w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-[2.5rem] border border-white/10 bg-slate-900 shadow-[0_0_100px_rgba(0,0,0,0.8)] flex flex-col"
        >
          {/* Top Decorative bar */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-teal-500 via-sky-500 to-teal-500 opacity-50 z-20" />
          
          {/* Header */}
          <div className="relative p-8 pb-6 bg-gradient-to-b from-white/[0.02] to-transparent">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <div className="flex items-center gap-2 mb-2">
                  <div className="p-1.5 rounded-lg bg-teal-500/10 border border-teal-500/20">
                    <Sparkles className="w-4 h-4 text-teal-400" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-teal-500/70">Protocol Initialization</span>
                </div>
                <h3 className="text-4xl font-black tracking-tighter text-white">
                  {initialHabit ? 'Refine Ritual' : 'Cast New Sigil'}
                </h3>
              </div>
              <button 
                onClick={onClose}
                className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 transition-all hover:rotate-90"
              >
                <X className="w-6 h-6 text-slate-400" />
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-8 space-y-10 scrollbar-none">
            {/* Primary Info */}
            <motion.div custom={0} variants={slideUp} initial="hidden" animate="visible" className="space-y-6">
              <div className="space-y-3">
                <Label>Habit Identity</Label>
                <div className="relative group">
                  <Type className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-teal-400 transition-colors" />
                  <Input
                    placeholder="Morning Meditation, Deep Work, etc."
                    value={form.title}
                    onChange={handleField('title')}
                    className="pl-12 h-14 text-lg font-black"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <Label>Ritual Intent</Label>
                <div className="relative group">
                  <Info className="absolute left-4 top-4 w-5 h-5 text-slate-600 group-focus-within:text-teal-400 transition-colors" />
                  <textarea
                    placeholder="Why does this matter? What is the trigger?"
                    value={form.description}
                    onChange={handleField('description')}
                    rows={3}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-700 focus:outline-none focus:ring-2 focus:ring-teal-500/50 transition-all font-medium resize-none leading-relaxed"
                  />
                </div>
              </div>
            </motion.div>

            {/* Metrics & Parameters */}
            <motion.div custom={1} variants={slideUp} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label>Metric Unit</Label>
                <div className="relative group">
                  <Target className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-teal-400 transition-colors" />
                  <Input
                    placeholder="Pages, Minutes, Liters..."
                    value={form.targetMetric}
                    onChange={handleField('targetMetric')}
                    className="pl-12 font-bold"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <Label>Target Capacity</Label>
                <Input
                  type="number"
                  placeholder="Target Value"
                  value={form.targetValue}
                  onChange={handleField('targetValue')}
                  className="font-black text-center"
                />
              </div>
            </motion.div>

            {/* Time & Category */}
            <motion.div custom={2} variants={slideUp} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-3">
                <Label>Archetype / Category</Label>
                <div className="relative group">
                  <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-teal-400 transition-colors" />
                  <Input
                    placeholder="Mind, Body, Flow..."
                    value={form.category}
                    onChange={handleField('category')}
                    className="pl-12 font-bold"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <Label>Activation Time</Label>
                <div className="relative group">
                  <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-teal-400 transition-colors" />
                  <Input
                    type="time"
                    value={form.reminder}
                    onChange={handleField('reminder')}
                    className="pl-12 font-black"
                  />
                </div>
              </div>
            </motion.div>

            {/* Frequency Pulse */}
            <motion.div custom={3} variants={slideUp} initial="hidden" animate="visible" className="space-y-6">
              <Label>Frequency Pulse</Label>
              <div className="flex bg-white/[0.03] p-1.5 rounded-2xl border border-white/5">
                {['daily', 'weekdays', 'weekly-target'].map((mode) => (
                  <button
                    key={mode}
                    onClick={() => handleFrequencyMode(mode)}
                    className={cn(
                      "flex-1 py-3 px-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all",
                      form.frequency.mode === mode 
                        ? "bg-teal-500 text-slate-950 shadow-lg shadow-teal-500/20" 
                        : "text-slate-500 hover:text-white"
                    )}
                  >
                    {mode.replace('-', ' ')}
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                {form.frequency.mode === 'weekdays' && (
                  <motion.div
                    key="weekdays"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="flex flex-wrap gap-3 justify-center py-4"
                  >
                    {[
                      ['S', 0], ['M', 1], ['T', 2], ['W', 3], ['T', 4], ['F', 5], ['S', 6]
                    ].map(([label, value]) => (
                      <button
                        key={value}
                        onClick={() => toggleDay(value)}
                        className={cn(
                          "w-12 h-12 rounded-2xl border-2 flex items-center justify-center font-black transition-all duration-300",
                          (form.frequency.daysOfWeek || []).includes(value)
                            ? "bg-teal-500 border-teal-400 text-slate-950 shadow-lg shadow-teal-500/20"
                            : "bg-white/5 border-white/5 text-slate-600 hover:text-slate-300 hover:border-white/10"
                        )}
                      >
                        {label}
                      </button>
                    ))}
                  </motion.div>
                )}

                {form.frequency.mode === 'weekly-target' && (
                  <motion.div
                    key="weekly-target"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="py-4 space-y-4"
                  >
                    <div className="flex justify-between items-center px-2">
                      <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">Ritual Repetitions</span>
                      <span className="text-xl font-black text-teal-400">{form.frequency.targetCount}x</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="7"
                      step="1"
                      value={form.frequency.targetCount}
                      onChange={(e) => setForm(c => ({ ...c, frequency: { ...c.frequency, targetCount: Number(e.target.value) } }))}
                      className="w-full accent-teal-500 h-2 bg-white/10 rounded-full appearance-none cursor-pointer"
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Aesthetic Aura */}
            <motion.div custom={4} variants={slideUp} initial="hidden" animate="visible" className="space-y-4">
              <Label>Aesthetic Aura</Label>
              <div className="flex flex-wrap gap-4 p-6 rounded-[2rem] bg-white/[0.02] border border-white/5 justify-center">
                {colorOptions.map((color) => (
                  <button
                    key={color}
                    onClick={() => setForm(c => ({ ...c, color }))}
                    className={cn(
                      "w-12 h-12 rounded-full transition-all duration-500 relative group",
                      form.color === color ? "scale-110 shadow-2xl" : "hover:scale-110 opacity-40 hover:opacity-100"
                    )}
                    style={{ 
                      backgroundColor: color,
                      boxShadow: form.color === color ? `0 0 30px ${color}66` : 'none'
                    }}
                  >
                    <AnimatePresence>
                      {form.color === color && (
                        <motion.div
                          initial={{ scale: 0, rotate: -45 }}
                          animate={{ scale: 1, rotate: 0 }}
                          exit={{ scale: 0, rotate: -45 }}
                          className="absolute inset-0 flex items-center justify-center"
                        >
                          <Check className="w-6 h-6 text-slate-950" strokeWidth={4} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </button>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Footer Actions */}
          <div className="p-8 pt-4 bg-slate-950/50 border-t border-white/10 flex gap-4">
            <Button
              variant="ghost"
              onClick={onClose}
              className="flex-1 rounded-2xl h-14 font-black text-slate-500 hover:text-white hover:bg-white/5 transition-all uppercase tracking-widest"
            >
              Cancel
            </Button>
            <Button
              onClick={submit}
              className="flex-1 rounded-2xl h-14 font-black shadow-2xl transition-all relative overflow-hidden group"
              style={{ backgroundColor: form.color, color: '#0f172a' }}
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
              <span className="relative z-10 flex items-center justify-center gap-2">
                {initialHabit ? <Wand2 className="w-5 h-5" /> : <PlusCircle className="w-5 h-5" />}
                {initialHabit ? 'Update Ritual' : 'Commit Ritual'}
              </span>
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
