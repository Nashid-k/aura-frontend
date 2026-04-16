import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Sparkles, Shield, Brain, ArrowRight, Loader2, Mail, Lock, User } from 'lucide-react';
import { useAuth } from '@/app/providers/AuthContext';
import { LivingSigil } from '@/entities/sigil/ui/LivingSigil';
import { Button } from '@/shared/ui/core/Button';
import { cn } from '@/shared/lib/utils/cn';

const defaultRegister = { name: '', email: '', password: '' };
const defaultLogin = { email: '', password: '' };

export function AuthPage() {
  const [mode, setMode] = useState('login');
  const [loginForm, setLoginForm] = useState(defaultLogin);
  const [registerForm, setRegisterForm] = useState(defaultRegister);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || '/today';

  async function handleSubmit(e) {
    if (e) e.preventDefault();
    try {
      setLoading(true);
      setError('');
      if (mode === 'login') {
        await login(loginForm);
      } else {
        await register(registerForm);
      }
      navigate(redirectTo, { replace: true });
    } catch (requestError) {
      setError(requestError.response?.data?.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground overflow-hidden">
      
      {/* Left Promotional / Ambient Pane (Hidden on Mobile) */}
      <div className="hidden lg:flex flex-1 relative overflow-hidden flex-col justify-center p-16 bg-gradient-to-br from-slate-950 to-background border-r border-border/10">
        {/* Background Sigil elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10 pointer-events-none w-[120%]">
          <LivingSigil params={{ lines: 'angular', complexity: 12, symmetry: 8, auraColor: 'oklch(0.6 0.12 210)' }} />
        </div>

        <div className="relative z-10 max-w-xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8 }}
          >
            <Link to="/" className="flex items-center gap-4 mb-12 group">
              <div className="p-2 rounded-xl bg-primary/10 border border-primary/20 group-hover:scale-110 transition-transform">
                <Sparkles className="w-8 h-8 text-primary" />
              </div>
              <span className="text-3xl font-black tracking-tighter">Nashid</span>
            </Link>

            <h1 className="text-6xl font-black leading-tight mb-6 tracking-tighter">
              Begin Your <br/><span className="text-primary">Metamorphosis.</span>
            </h1>
            <p className="text-xl text-muted-foreground font-medium mb-12 leading-relaxed">
              Step into a space where your daily actions become living art. Track with intention, grow with intelligence.
            </p>
            
            <div className="space-y-8">
              <FeatureItem 
                icon={<Brain className="text-primary w-6 h-6" />}
                title="Cognitive Growth"
                desc="AI archetypes that adapt to your unique behavioral psychology."
              />
              <FeatureItem 
                icon={<Shield className="text-primary w-6 h-6" />}
                title="Sanctuary Mode"
                desc="Privacy-first, local-ready architecture. Your growth is your own."
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right Form Pane */}
      <div className="flex-1 lg:max-w-[600px] flex flex-col justify-center items-center p-8 sm:p-16 relative bg-background/50 backdrop-blur-3xl">
        {/* Ambient glow */}
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="w-full max-w-[400px] relative z-10">
          <AnimatePresence mode="wait">
            <motion.div
              key={mode}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            >
              <div className="lg:hidden flex flex-col items-center mb-12">
                <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20 mb-4">
                  <Sparkles className="w-10 h-10 text-primary" />
                </div>
                <h2 className="text-3xl font-black tracking-tighter">Nashid</h2>
              </div>

              <div className="mb-10">
                <h3 className="text-4xl font-black tracking-tighter mb-2">
                  {mode === 'login' ? 'Welcome back' : 'Create account'}
                </h3>
                <p className="text-muted-foreground font-medium">
                  {mode === 'login' ? 'Enter your details to access your sanctuary.' : 'Join the studio and start your journey.'}
                </p>
              </div>

              {/* Custom Tabs */}
              <div className="flex p-1 bg-muted/50 rounded-xl mb-8 border border-border/10">
                <button
                  onClick={() => setMode('login')}
                  className={cn(
                    "flex-1 py-2.5 text-sm font-bold rounded-lg transition-all",
                    mode === 'login' ? "bg-card text-primary shadow-sm border border-border/50" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Login
                </button>
                <button
                  onClick={() => setMode('register')}
                  className={cn(
                    "flex-1 py-2.5 text-sm font-bold rounded-lg transition-all",
                    mode === 'register' ? "bg-card text-primary shadow-sm border border-border/50" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  Register
                </button>
              </div>

              {error && (
                <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium animate-in fade-in slide-in-from-top-2">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-5">
                {mode === 'register' && (
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Display Name</label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                      <input
                        required
                        type="text"
                        name="name"
                        autocomplete="name"
                        placeholder="What should we call you?"
                        className="w-full pl-12 pr-4 py-4 bg-card/50 border border-border/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground/50"
                        value={registerForm.name}
                        onChange={(e) => setRegisterForm({ ...registerForm, name: e.target.value })}
                      />
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Email Address</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input
                      required
                      type="email"
                      name="email"
                      autocomplete="email"
                      placeholder="name@example.com"
                      className="w-full pl-12 pr-4 py-4 bg-card/50 border border-border/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground/50"
                      value={mode === 'login' ? loginForm.email : registerForm.email}
                      onChange={(e) => mode === 'login'
                        ? setLoginForm({ ...loginForm, email: e.target.value })
                        : setRegisterForm({ ...registerForm, email: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
                    <input
                      required
                      type="password"
                      name="password"
                      autocomplete={mode === 'login' ? 'current-password' : 'new-password'}
                      placeholder="••••••••"
                      className="w-full pl-12 pr-4 py-4 bg-card/50 border border-border/50 rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground/50"
                      value={mode === 'login' ? loginForm.password : registerForm.password}
                      onChange={(e) => mode === 'login'
                        ? setLoginForm({ ...loginForm, password: e.target.value })
                        : setRegisterForm({ ...registerForm, password: e.target.value })}
                    />
                  </div>
                </div>

                <Button
                  disabled={loading}
                  className="w-full py-7 text-lg font-black tracking-tight mt-4 rounded-2xl shadow-xl shadow-primary/20"
                >
                  {loading ? (
                    <Loader2 className="w-6 h-6 animate-spin" />
                  ) : (
                    <span className="flex items-center gap-2">
                      {mode === 'login' ? 'Enter Sanctuary' : 'Begin Journey'}
                      <ArrowRight className="w-5 h-5" />
                    </span>
                  )}
                </Button>

                <p className="text-xs text-muted-foreground text-center mt-6 font-medium leading-relaxed">
                  By continuing, you agree to the Nashid <Link to="#" className="text-primary hover:underline font-bold">Terms of Growth</Link> and <Link to="#" className="text-primary hover:underline font-bold">Privacy Rituals</Link>.
                </p>
              </form>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function FeatureItem({ icon, title, desc }) {
  return (
    <div className="flex gap-6 items-start group">
      <div className="p-4 rounded-2xl bg-white/5 border border-white/10 group-hover:bg-primary/10 group-hover:border-primary/20 transition-all duration-500">
        {icon}
      </div>
      <div>
        <h4 className="text-xl font-bold mb-1 tracking-tight text-foreground group-hover:text-primary transition-colors">{title}</h4>
        <p className="text-muted-foreground leading-relaxed font-medium">{desc}</p>
      </div>
    </div>
  );
}
