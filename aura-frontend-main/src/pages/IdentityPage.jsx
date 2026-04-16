import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Fingerprint, Crown, Shield, Loader2, Sparkle, Zap, Target } from 'lucide-react';
import { useIdentityQueries } from '@/shared/lib/hooks/useIdentityQueries';
import { LivingSigil } from '@/entities/sigil/ui/LivingSigil';
import { Button } from '@/shared/ui/core/Button';
import { Card, CardContent } from '@/shared/ui/core/Card';
import { cn } from '@/shared/lib/utils/cn';

export function IdentityPage() {
  const { identity, isLoading, isForging, forge } = useIdentityQueries();
  const [showForgeAnimation, setShowForgeAnimation] = useState(false);

  const handleForge = async () => {
    setShowForgeAnimation(true);
    await forge();
    setTimeout(() => setShowForgeAnimation(false), 2000);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 2, ease: 'linear' }}
          className="p-4 rounded-full bg-secondary"
        >
          <Loader2 className="w-12 h-12 text-primary animate-spin" />
        </motion.div>
        <p className="mt-6 text-muted-foreground font-bold uppercase tracking-widest text-xs">Scanning Identity...</p>
      </div>
    );
  }

  const { archetype, description, level, sigilParams } = identity || {
    archetype: 'The Initiate',
    description: 'A seeker stepping onto the path of intentional living. No identity forged yet.',
    level: 1,
    sigilParams: { lines: 'fluid', complexity: 3, auraColor: 'oklch(0.6 0.12 210)', symmetry: 4 }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-16 pb-32 px-6 bg-background">
      <header className="space-y-4 pt-8">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-secondary">
            <Fingerprint className="text-primary w-6 h-6" />
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-foreground">Aura & Identity</h1>
        </div>
        <p className="text-lg text-muted-foreground font-medium max-w-2xl leading-relaxed">
          Your identity is a dynamic resonance of your daily rituals and long-term intentions.
        </p>
      </header>

      <div className="bg-card rounded-[2.5rem] border border-border/40 shadow-sm overflow-hidden p-8 md:p-16 text-center">
        <AnimatePresence mode="wait">
          {isForging || showForgeAnimation ? (
            <motion.div
              key="forging"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.1 }}
              className="flex flex-col items-center py-20"
            >
              <div className="relative mb-12">
                <Loader2 size={100} className="text-primary animate-spin" strokeWidth={1} />
              </div>
              <h3 className="text-4xl font-bold tracking-tight mb-4">Forging Identity</h3>
              <p className="text-lg text-muted-foreground font-medium max-w-md mx-auto leading-relaxed">
                Refining your resonance...
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="display"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-12"
            >
              <div className="space-y-4">
                <span 
                  className="inline-block px-5 py-2 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest"
                >
                  Level {level} Archetype
                </span>
                <h2 className="text-6xl md:text-8xl font-bold tracking-tight text-foreground">
                  {archetype}
                </h2>
              </div>

              <div className="relative inline-block py-12">
                <div className="relative scale-110 md:scale-125 transition-transform duration-1000">
                  <LivingSigil params={sigilParams} level={level} />
                </div>
              </div>

              <p className="text-2xl text-foreground/80 font-medium max-w-2xl mx-auto leading-tight py-8 border-y border-border/40">
                {description}
              </p>

              <div className="flex flex-col items-center gap-12 pt-8">
                <Button
                  size="lg"
                  onClick={handleForge}
                  disabled={isForging}
                  className="h-16 px-12 rounded-full text-xl font-bold tracking-tight shadow-xl shadow-primary/20 bg-primary text-primary-foreground hover:scale-105 active:scale-95 transition-all"
                >
                  <Sparkles className="mr-3 w-6 h-6" />
                  Forge Identity
                </Button>
                
                <div className="grid grid-cols-3 gap-8 w-full max-w-lg mx-auto">
                  <IdentityStat icon={<Zap className="w-5 h-5" />} label="Resonance" value="High" color="text-primary" />
                  <IdentityStat icon={<Target className="w-5 h-5" />} label="Alignment" value="Stable" color="text-teal-600" />
                  <IdentityStat icon={<Crown className="w-5 h-5" />} label="Prestige" value={`Lvl ${level}`} color="text-blue-600" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function IdentityStat({ icon, label, value, color }) {
  return (
    <div className="space-y-2 bg-secondary/30 p-6 rounded-3xl">
      <div className="flex items-center justify-center gap-2 text-muted-foreground/60">
        {icon}
        <span className="text-[10px] font-bold uppercase tracking-widest">{label}</span>
      </div>
      <div className={cn("text-xl font-bold tracking-tight", color)}>{value}</div>
    </div>
  );
}
