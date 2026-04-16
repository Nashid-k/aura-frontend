import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { 
  PlusCircle, 
  RefreshCw, 
  Trash2, 
  CheckCircle, 
  FastForward,
  Sparkles,
  X,
  Send,
  Mic,
  History,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/shared/lib/utils/cn';
import { api } from '../api/client';
import { useDashboardData } from '../../app/providers/DashboardContext';
import { useAuth } from '../../app/providers/AuthContext';

const quickPrompts = [
  'Analyze my momentum this week',
  'Help me simplify my routine',
  'Give me a realistic plan for today',
  'Break down my hardest habit',
];

const actionConfig = {
  habit_created: { color: '#007AFF', icon: <PlusCircle size={14} /> },
  habit_updated: { color: '#5856D6', icon: <RefreshCw size={14} /> },
  habit_deleted: { color: '#FF3B30', icon: <Trash2 size={14} /> },
  habit_completed: { color: '#34C759', icon: <CheckCircle size={14} /> },
  habit_skipped: { color: '#FF9500', icon: <FastForward size={14} /> },
};

function storageKey(userId) {
  return `aura-ai-chat-history-${userId || 'guest'}`;
}

function loadHistory(userId) {
  try {
    const saved = localStorage.getItem(storageKey(userId));
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

function saveHistory(messages, userId) {
  try {
    localStorage.setItem(storageKey(userId), JSON.stringify(messages.slice(-40)));
  } catch {
    // ignore
  }
}

function MarkdownBody({ content }) {
  const components = useMemo(
    () => ({
      p: ({ children }) => (
        <p className="text-[15px] leading-snug mb-2 last:mb-0">
          {children}
        </p>
      ),
      ul: ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>,
      ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 space-y-1">{children}</ol>,
      li: ({ children }) => <li className="text-[15px]">{children}</li>,
      strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
      code: ({ inline, children }) =>
        inline ? (
          <code className="px-1 py-0.5 rounded bg-black/5 dark:bg-white/10 font-mono text-[13px]">
            {children}
          </code>
        ) : (
          <code className="block font-mono text-[13px] whitespace-pre-wrap break-words">
            {children}
          </code>
        ),
      pre: ({ children }) => (
        <pre className="my-2 p-3 rounded-xl bg-black/5 dark:bg-white/5 overflow-x-auto">
          {children}
        </pre>
      ),
    }),
    []
  );

  return <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>{content}</ReactMarkdown>;
}

export function AiCoachPanel() {
  const { user } = useAuth();
  const { refresh } = useDashboardData();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(() => loadHistory(user?.id));
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [historyLoaded, setHistoryLoaded] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const endRef = useRef(null);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    setMessages(loadHistory(user?.id));
    setHistoryLoaded(false);
  }, [user?.id]);

  useEffect(() => {
    if (open && !historyLoaded) {
      setHistoryLoaded(true);
      api.get('/ai/history').then(({ data }) => {
        if (data.messages?.length) {
          const next = data.messages.map((m) => ({ role: m.role, content: m.content, actions: m.actions || [] }));
          setMessages(next);
          saveHistory(next, user?.id);
        }
      }).catch(() => {});
    }
  }, [open, historyLoaded, user?.id]);

  useEffect(() => {
    if (messages.length || user?.id) saveHistory(messages, user?.id);
  }, [messages, user?.id]);

  useEffect(() => {
    if (open) {
      endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, loading, open]);

  const sendMessage = useCallback(async (text) => {
    const userMessage = text || input.trim();
    if (!userMessage || loading) return;
    const next = [...messages, { role: 'user', content: userMessage }];
    setMessages(next);
    setInput('');
    setLoading(true);
    try {
      const { data } = await api.post('/ai/chat', {
        messages: next.map((m) => ({ role: m.role, content: m.content })),
      });
      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply, actions: data.actions || [] }]);
      if (data.actions?.length) await refresh();
    } catch {
      setMessages((prev) => [...prev, {
        role: 'assistant',
        content: "I'm your AI Coach. I'm here to help you stay on track with your goals. How can I assist you today?",
      }]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages, refresh]);

  function handleKeyDown(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  }

  async function clearHistory() {
    setMessages([]);
    localStorage.removeItem(storageKey(user?.id));
    try {
      await api.delete('/ai/history');
    } catch {
      // ignore
    }
  }

  function startVoice() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (event) => {
      setInput(event.results[0][0].transcript);
      setIsListening(false);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    recognition.start();
  }

  return (
    <>
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.8, y: 20 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setOpen(true)}
            className="fixed right-6 bottom-24 lg:bottom-8 z-40 w-14 h-14 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center border border-primary/20"
          >
            <Sparkles className="w-6 h-6" />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/20 dark:bg-black/40 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed bottom-0 right-0 left-0 sm:left-auto sm:right-6 sm:bottom-6 sm:top-6 w-full sm:w-[400px] bg-background/80 dark:bg-card/80 backdrop-blur-xl sm:rounded-[2rem] rounded-t-[2rem] border border-border/50 z-50 flex flex-col shadow-2xl overflow-hidden"
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-border/50 flex items-center justify-between bg-background/50">
                <div>
                  <h3 className="text-lg font-bold tracking-tight">AI Coach</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Ready to help</span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {messages.length > 0 && (
                    <button 
                      onClick={clearHistory}
                      className="p-2 hover:bg-secondary rounded-full transition-colors text-muted-foreground"
                      title="Clear History"
                    >
                      <History className="w-4 h-4" />
                    </button>
                  )}
                  <button 
                    onClick={() => setOpen(false)}
                    className="p-2 hover:bg-secondary rounded-full transition-colors"
                  >
                    <X className="w-5 h-5 text-muted-foreground" />
                  </button>
                </div>
              </div>

              {/* Chat Content */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-none">
                {!messages.length && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6 py-8"
                  >
                    <div className="text-center space-y-2">
                      <div className="w-16 h-16 bg-primary/10 rounded-3xl flex items-center justify-center mx-auto mb-4">
                        <Sparkles className="w-8 h-8 text-primary" />
                      </div>
                      <h4 className="font-bold text-xl tracking-tight">How can I help you?</h4>
                      <p className="text-muted-foreground text-sm max-w-[240px] mx-auto leading-relaxed">
                        I can help you analyze your habits, plan your day, or stay motivated.
                      </p>
                    </div>
                    <div className="grid gap-2 px-4">
                      {quickPrompts.map((prompt, i) => (
                        <motion.button
                          key={prompt}
                          initial={{ opacity: 0, x: 10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                          onClick={() => sendMessage(prompt)}
                          className="w-full text-left p-4 rounded-2xl bg-secondary/50 hover:bg-secondary border border-border/50 text-sm font-medium transition-all flex items-center justify-between group"
                        >
                          {prompt}
                          <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                        </motion.button>
                      ))}
                    </div>
                  </motion.div>
                )}

                {messages.map((m, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "flex flex-col",
                      m.role === 'user' ? "items-end" : "items-start"
                    )}
                  >
                    <div className={cn(
                      "max-w-[85%] px-4 py-3 rounded-[1.25rem] shadow-sm",
                      m.role === 'user' 
                        ? "bg-primary text-primary-foreground rounded-tr-none" 
                        : "bg-secondary text-secondary-foreground rounded-tl-none"
                    )}>
                      {m.role === 'user' ? (
                        <p className="text-[15px] leading-snug">{m.content}</p>
                      ) : (
                        <MarkdownBody content={m.content} />
                      )}
                    </div>
                    
                    {m.actions?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {m.actions.map((action, j) => {
                          const config = actionConfig[action.type] || actionConfig.habit_completed;
                          return (
                            <motion.div 
                              initial={{ scale: 0.9, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              key={j}
                              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border"
                              style={{ color: config.color, borderColor: `${config.color}33`, backgroundColor: `${config.color}11` }}
                            >
                              {config.icon}
                              {action.label}
                            </motion.div>
                          );
                        })}
                      </div>
                    )}
                  </motion.div>
                ))}

                {loading && (
                  <div className="flex items-start gap-2">
                    <div className="px-4 py-3 rounded-[1.25rem] bg-secondary text-secondary-foreground rounded-tl-none flex items-center gap-1.5">
                      <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5 }} className="w-1.5 h-1.5 rounded-full bg-current" />
                      <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }} className="w-1.5 h-1.5 rounded-full bg-current" />
                      <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }} className="w-1.5 h-1.5 rounded-full bg-current" />
                    </div>
                  </div>
                )}
                <div ref={endRef} />
              </div>

              {/* Input Area */}
              <div className="p-4 border-t border-border/50 bg-background/50">
                <div className="relative flex items-end gap-2 bg-secondary/50 rounded-[1.5rem] p-2 focus-within:bg-secondary transition-colors border border-transparent focus-within:border-border/50">
                  <textarea
                    rows={1}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder="Ask anything..."
                    className="flex-1 bg-transparent border-none focus:ring-0 text-[15px] p-2 resize-none max-h-32 scrollbar-none outline-none leading-tight"
                  />
                  <div className="flex items-center gap-1">
                    <button 
                      onClick={startVoice}
                      className={cn(
                        "p-2 rounded-full transition-colors",
                        isListening 
                          ? "bg-red-500 text-white animate-pulse" 
                          : "hover:bg-background/50 text-muted-foreground"
                      )}
                    >
                      <Mic className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={() => sendMessage()}
                      disabled={!input.trim() || loading}
                      className={cn(
                        "p-2 rounded-full transition-all",
                        input.trim() 
                          ? "bg-primary text-primary-foreground scale-100" 
                          : "text-muted-foreground scale-90 opacity-50"
                      )}
                    >
                      <Send className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
