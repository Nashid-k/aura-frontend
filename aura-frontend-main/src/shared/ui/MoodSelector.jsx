import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/shared/lib/utils/cn';
import { api } from '../../shared/api/client';

const MOODS = [
  { value: 1, emoji: '😫', label: 'Rough' },
  { value: 2, emoji: '😐', label: 'Meh' },
  { value: 3, emoji: '😊', label: 'Good' },
  { value: 4, emoji: '😄', label: 'Great' },
  { value: 5, emoji: '🔥', label: 'On Fire' },
];

export function MoodSelector() {
  const [selected, setSelected] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    api
      .get('/mood/today')
      .then(({ data }) => {
        if (data.mood) setSelected(data.mood.mood);
      })
      .catch(() => {});
  }, []);

  async function handleSelect(value) {
    setSelected(value);
    setSaved(false);
    try {
      await api.post('/mood', { mood: value, energy: value });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      // silently fail
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: 'spring', stiffness: 400, damping: 28 }}
      className="p-5 rounded-2xl bg-white/[0.03] border border-white/5 backdrop-blur-md"
    >
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-xs font-black uppercase tracking-widest text-slate-500">
          How are you feeling?
        </h4>
        <AnimatePresence>
          {saved && (
            <motion.span
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-[10px] font-black text-teal-500 flex items-center gap-1 uppercase"
            >
              <Check className="w-3 h-3" />
              Saved
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <div className="flex gap-2 flex-wrap justify-center">
        {MOODS.map((mood) => {
          const active = selected === mood.value;
          return (
            <motion.button
              key={mood.value}
              whileHover={{ scale: 1.1, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleSelect(mood.value)}
              className={cn(
                "flex flex-col items-center justify-center w-14 h-14 rounded-2xl transition-all duration-300 border-2",
                active 
                  ? "bg-teal-500/10 border-teal-500/40 shadow-lg shadow-teal-500/10" 
                  : "bg-white/[0.03] border-white/5 hover:border-white/10"
              )}
            >
              <span className="text-2xl leading-none">{mood.emoji}</span>
              <span className={cn(
                "text-[8px] font-black uppercase mt-1 tracking-tighter",
                active ? "text-teal-400" : "text-slate-600"
              )}>
                {mood.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}
