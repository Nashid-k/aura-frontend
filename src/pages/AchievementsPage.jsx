import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Lock, ShieldCheck, Star, Zap, Target } from 'lucide-react';
import { api } from '@/shared/api/client';
import { staggerContainer, fadeSlideUp } from '@/shared/lib/utils/animations';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/core/Card';
import { cn } from '@/shared/lib/utils/cn';

export function AchievementsPage() {
  const [allPossible, setAllPossible] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/ai/achievements')
      .then(({ data }) => {
        setAllPossible(data.allPossible || []);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const earned = allPossible.filter((b) => b.earned);
  const locked = allPossible.filter((b) => !b.earned);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-12 px-6 space-y-12 animate-pulse">
        <div className="h-48 bg-secondary/30 rounded-[2.5rem]" />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="h-64 bg-secondary/30 rounded-[2rem]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-32 space-y-16 bg-background pt-page-t">
      {/* Header Section */}
      <header className="space-y-6">
        <div className="flex flex-col gap-2">
          <span className="text-sm font-bold text-primary/60 uppercase tracking-widest">
            Legacy & Recognition
          </span>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground">
            Achievements
          </h1>
        </div>
        
        <div className="bg-secondary/30 rounded-[2.5rem] p-8 md:p-12 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Trophy size={160} className="text-primary" />
          </div>
          <div className="relative z-10 max-w-2xl space-y-6">
            <p className="text-2xl font-medium text-foreground/80 leading-tight">
              You have secured <span className="text-primary font-bold">{earned.length}</span> legendary marks. 
              Your legacy is built through every ritual honored.
            </p>
            
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground text-sm font-bold shadow-lg shadow-primary/20">
                <Trophy size={18} />
                <span>{earned.length} Earned</span>
              </div>
              <div className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-background border border-border/40 text-muted-foreground text-sm font-bold">
                <Lock size={18} />
                <span>{locked.length} Remaining</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Earned Section */}
      <section className="space-y-8">
        <h2 className="text-3xl font-bold tracking-tight px-2">Earned</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <AnimatePresence mode="popLayout">
            {earned.map((badge) => (
              <motion.div 
                key={badge.type} 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                layout
                className="group"
              >
                <div className="h-full bg-card rounded-[2rem] p-8 border border-border/40 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-[1.5rem] bg-secondary/50 flex items-center justify-center text-5xl mb-6 group-hover:scale-110 transition-transform">
                    {badge.emoji}
                  </div>
                  <h3 className="text-xl font-bold mb-2 text-foreground">
                    {badge.label}
                  </h3>
                  <p className="text-sm font-medium text-muted-foreground leading-relaxed mb-6">
                    {badge.desc}
                  </p>
                  {badge.habitTitle && (
                    <span className="mt-auto px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest">
                      {badge.habitTitle}
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </section>

      {/* Locked Section */}
      {locked.length > 0 && (
        <section className="space-y-8">
          <h2 className="text-3xl font-bold tracking-tight px-2 text-muted-foreground/60">Locked Potential</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {locked.map((badge) => (
              <div 
                key={badge.type} 
                className="bg-secondary/20 rounded-[2rem] p-8 border border-dashed border-border/60 flex flex-col items-center text-center opacity-60"
              >
                <div className="w-20 h-20 rounded-[1.5rem] bg-background/50 flex items-center justify-center mb-6">
                  <Lock size={32} className="text-muted-foreground/40" />
                </div>
                <h3 className="text-lg font-bold text-muted-foreground/80 mb-2">
                  {badge.label}
                </h3>
                <p className="text-xs font-medium text-muted-foreground/60">
                  {badge.desc}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {allPossible.length === 0 && !loading && (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <Trophy size={80} className="text-muted/20 mb-6" />
          <h3 className="text-2xl font-bold text-muted-foreground">No Achievements Found</h3>
        </div>
      )}
    </div>
  );
}
