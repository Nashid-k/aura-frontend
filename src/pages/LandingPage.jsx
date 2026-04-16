import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  PenTool, 
  Activity, 
  Palette, 
  ArrowRight, 
  Zap, 
  Brain, 
  LayoutGrid,
  ChevronRight,
  Shield,
  MousePointer2,
  Trophy,
  Waves,
  Loader2
} from 'lucide-react';
import { LivingSigil } from '@/entities/sigil/ui/LivingSigil';
import { Button } from '@/shared/ui/core/Button';
import { Card, CardContent } from '@/shared/ui/core/Card';
import { cn } from '@/shared/lib/utils/cn';

export function LandingPage() {
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, 400]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -400]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9]);

  const [demoText, setDemoText] = useState('');
  const [extractedHabits, setExtractedHabits] = useState([]);
  const [isParsing, setIsParsing] = useState(false);

  // Simulated AI Parsing for the landing page demo
  useEffect(() => {
    if (!demoText) {
      setExtractedHabits([]);
      return;
    }

    const timer = setTimeout(() => {
      setIsParsing(true);
      const habits = [];
      const lower = demoText.toLowerCase();
      if (lower.includes('read')) habits.push({ name: 'Reading', color: 'hsl(var(--primary))', icon: <PenTool className="w-4 h-4" /> });
      if (lower.includes('run') || lower.includes('gym') || lower.includes('workout')) habits.push({ name: 'Fitness', color: 'hsl(var(--destructive))', icon: <Zap className="w-4 h-4" /> });
      if (lower.includes('meditate') || lower.includes('breath')) habits.push({ name: 'Mindfulness', color: 'hsl(var(--success))', icon: <Brain className="w-4 h-4" /> });
      
      setTimeout(() => {
        setExtractedHabits(habits);
        setIsParsing(false);
      }, 800);
    }, 500);

    return () => clearTimeout(timer);
  }, [demoText]);

  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/30">
      {/* Background Orchestration */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,hsl(var(--primary)/0.15),transparent_70%)]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_80%,hsl(var(--success)/0.1),transparent_50%)]" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMjAwIj48ZmlsdGVyIGlkPSJuIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iMC42NSIgbnVtT2N0YXZlcz0iMyIgc3RpdGNoVGlsZXM9InN0aXRjaCIvPjwvZmlsdGVyPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbHRlcj0idXJsKCNuKSIvPjwvc3ZnPg==')] opacity-[0.03] dark:opacity-[0.08] mix-blend-overlay pointer-events-none" />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 p-6 md:p-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center glass-panel rounded-2xl px-6 py-3 shadow-2xl shadow-black/5 dark:shadow-black/20">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="p-1.5 rounded-lg bg-primary/10 border border-primary/20 group-hover:scale-110 transition-transform">
              <Sparkles className="text-primary w-6 h-6" />
            </div>
            <span className="text-2xl font-black tracking-tighter">Aura</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/auth" className="text-sm font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors px-4">
              Sign In
            </Link>
            <Button asChild className="rounded-full px-6 shadow-lg shadow-primary/20">
              <Link to="/auth">Join Sanctuary</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 md:pt-64 md:pb-40 z-10">
        <motion.div style={{ y: y1, opacity, scale }} className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="text-center lg:text-left space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="space-y-6"
              >
                <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-[0.3em]">
                  Beyond Checkboxes
                </span>
                <h1 className="text-6xl md:text-8xl font-black tracking-tighter leading-[0.9] text-transparent bg-clip-text bg-gradient-to-br from-foreground via-foreground to-muted-foreground/50">
                  Your Identity <br />
                  <span className="text-primary italic">Is A Living Sigil.</span>
                </h1>
                <p className="text-xl md:text-2xl text-muted-foreground font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  Aura isn't just a tracker. It's a behavioral mirror. Our AI synthesizes your journals into dynamic geometric art that grows, shifts, and evolves as you do.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
              >
                <Button 
                  size="lg" 
                  asChild
                  className="h-16 px-10 rounded-2xl text-lg font-black tracking-tight shadow-2xl shadow-primary/20 group"
                >
                  <Link to="/auth">
                    Enter the Sanctuary
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="h-16 px-10 rounded-2xl text-lg font-black tracking-tight border-border/50 hover:bg-secondary/50"
                  onClick={() => document.getElementById('demo-section').scrollIntoView({ behavior: 'smooth' })}
                >
                  Witness the Growth
                </Button>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative aspect-square flex items-center justify-center lg:scale-125"
            >
              <div className="absolute inset-0 bg-primary/10 blur-[160px] rounded-full animate-pulse" />
              <div className="relative z-10 w-full max-w-[400px]">
                <LivingSigil 
                  level={42} 
                  params={{ lines: 'fluid', complexity: 8, auraColor: 'oklch(0.6 0.12 210)', symmetry: 6 }} 
                />
              </div>
              
              {/* Floating Stat Card */}
              <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                className="absolute top-10 right-0 p-6 rounded-2xl glass-panel shadow-2xl space-y-2 group cursor-default"
              >
                <div className="flex items-center gap-2 text-primary">
                  <Waves size={16} />
                  <span className="text-[10px] font-black uppercase tracking-widest">Archetype</span>
                </div>
                <div className="text-xl font-black tracking-tight">The Kinetic Warrior</div>
                <div className="w-full bg-muted/20 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-primary h-full w-[85%]" />
                </div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 20, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                className="absolute bottom-10 left-0 p-5 rounded-2xl glass-panel shadow-2xl flex items-center gap-4"
              >
                <div className="p-2 rounded-xl bg-success/10 text-success">
                  <Trophy size={20} />
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Milestone</div>
                  <div className="text-sm font-bold">42 Day Ascension</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Interactive Demo Section */}
      <section id="demo-section" className="py-40 relative z-10 overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl aspect-square bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="container mx-auto px-6 relative">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto space-y-6 mb-16"
          >
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-tight">Write Your Day. <br/> <span className="text-primary">Maya Analyzes Your Growth.</span></h2>
            <p className="text-xl text-muted-foreground font-medium">Try typing: "I read for an hour and then went for a gym workout."</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <Card className="overflow-hidden border-primary/20 bg-card/60 backdrop-blur-3xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] dark:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)]">
              <div className="p-10 space-y-8">
                <textarea
                  placeholder="How was your day? Aura's NLP will detect your progress..."
                  className="w-full h-32 bg-transparent border-none focus:ring-0 text-3xl font-medium placeholder:text-muted-foreground/20 resize-none outline-none"
                  value={demoText}
                  onChange={(e) => setDemoText(e.target.value)}
                />

                <div className="flex flex-wrap gap-4 min-h-[48px] items-center">
                  <AnimatePresence>
                    {isParsing && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="flex items-center gap-3 px-4 py-2 rounded-xl bg-primary/10 border border-primary/20"
                      >
                        <Loader2 className="w-4 h-4 text-primary animate-spin" />
                        <span className="text-xs font-black uppercase tracking-widest text-primary">Maya is reflecting...</span>
                      </motion.div>
                    )}
                    {extractedHabits.map((h, i) => (
                      <motion.div
                        key={h.name}
                        initial={{ scale: 0, opacity: 0, x: -20 }}
                        animate={{ scale: 1, opacity: 1, x: 0 }}
                        transition={{ type: 'spring', delay: i * 0.1 }}
                        className="flex items-center gap-3 px-5 py-2.5 rounded-2xl border shadow-xl transition-all hover:scale-105 group cursor-default"
                        style={{ backgroundColor: `${h.color}15`, borderColor: `${h.color}30`, color: h.color }}
                      >
                        <div className="group-hover:rotate-12 transition-transform">{h.icon}</div>
                        <span className="text-sm font-black uppercase tracking-tighter">{h.name} Detected</span>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
              <div className="bg-muted/30 px-10 py-4 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 border-t border-border/10">
                <span>Natural Language Processing Engine v4.0</span>
                <span className="flex items-center gap-2">Maya Core <Shield size={12} /></span>
              </div>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Feature Grid */}
      <section className="py-40 container mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<Brain className="w-8 h-8 text-primary" />}
            title="Identity Archetypes"
            description="Our AI maps your habits to 10 psychological archetypes. Are you 'The Serene Architect' or 'The Grindmaster'? Your sigil reveals the truth."
            delay={0.1}
          />
          <FeatureCard 
            icon={<Zap className="w-8 h-8 text-destructive" />}
            title="Habit Mutations"
            description="Aura detects when you miss habits together and suggests 'Fusions' or 'Stacks' to fix your momentum before it breaks."
            delay={0.2}
          />
          <FeatureCard 
            icon={<Palette className="w-8 h-8 text-success" />}
            title="Aesthetic Casting"
            description="Colors aren't random. Aura generates a unique color palette for each habit based on its semantic meaning and your emotional state."
            delay={0.3}
          />
        </div>
      </section>
      
      {/* Footer */}
      <footer className="py-20 border-t border-border/10 container mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3 grayscale opacity-50 hover:grayscale-0 hover:opacity-100 transition-all cursor-default">
            <Sparkles className="text-primary w-6 h-6" />
            <span className="text-2xl font-black tracking-tighter">Aura</span>
          </div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground/40">
            © {new Date().getFullYear()} Aura Habit Studio. Built for the intentional.
          </p>
          <div className="flex gap-8">
            {['Privacy', 'Terms', 'Ascension'].map(item => (
              <a key={item} href="#" className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors">{item}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description, delay }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay }}
      whileHover={{ y: -10 }}
      className="group"
    >
      <Card className="h-full p-8 md:p-10 glass-panel hover:border-primary/30 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/5">
        <div className="mb-8 p-4 rounded-2xl bg-secondary border border-border/50 w-fit group-hover:bg-primary/10 group-hover:border-primary/20 transition-all duration-500">
          {icon}
        </div>
        <h3 className="text-2xl font-black tracking-tight mb-4 text-foreground group-hover:text-primary transition-colors">{title}</h3>
        <p className="text-muted-foreground leading-relaxed font-medium">{description}</p>
        <div className="mt-8 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0">
          Learn More <ChevronRight size={14} />
        </div>
      </Card>
    </motion.div>
  );
}
