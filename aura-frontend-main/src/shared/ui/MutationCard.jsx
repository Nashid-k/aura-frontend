import { Wand2, TrendingUp, RotateCcw } from 'lucide-react';
import { motion } from 'framer-motion';
import { Card } from '@/shared/ui/core/Card';
import { Button } from '@/shared/ui/core/Button';
import { cn } from '@/shared/lib/utils/cn';

/**
 * MutationCard - Displays habit suggestions and evolutions.
 * Redesigned with glassmorphism and growth-themed aesthetics.
 */
export const MutationCard = ({ suggestion, onAccept, onDismiss, className }) => {
  if (!suggestion) return null;

  const config = {
    'habit_stack': {
      title: 'Ritual Fusion',
      color: 'text-teal-500',
      bgColor: 'bg-teal-500/10',
      borderColor: 'border-teal-500/20',
      icon: <Wand2 className="w-5 h-5" />,
      action: 'Fuse Rituals',
      btnVariant: 'default'
    },
    'level-up': {
      title: 'Standard Evolution',
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      borderColor: 'border-blue-500/20',
      icon: <TrendingUp className="w-5 h-5" />,
      action: 'Accept New Standard',
      btnVariant: 'default'
    },
    'recovery': {
      title: 'Recovery Protocol',
      color: 'text-cyan-500',
      bgColor: 'bg-cyan-500/10',
      borderColor: 'border-cyan-500/20',
      icon: <RotateCcw className="w-5 h-5" />,
      action: 'Enter Recovery Mode',
      btnVariant: 'default'
    }
  }[suggestion.type] || {
    title: 'Alchemy Mutation',
    color: 'text-teal-500',
    bgColor: 'bg-teal-500/10',
    borderColor: 'border-teal-500/20',
    icon: <Wand2 className="w-5 h-5" />,
    action: 'Accept',
    btnVariant: 'default'
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={className}
    >
      <Card
        className={cn(
          "relative overflow-hidden p-6 border-l-4",
          config.borderColor,
          "bg-gradient-to-br from-card/90 to-background/50 backdrop-blur-xl"
        )}
      >
        {/* Background Decoration */}
        <div className={cn("absolute -top-4 -right-4 opacity-5 rotate-12", config.color)}>
          {config.icon && <div className="scale-[5]">{config.icon}</div>}
        </div>
        
        <div className="relative z-10 space-y-4">
          <div className="flex items-center space-x-2">
            <div className={cn("p-1.5 rounded-lg", config.bgColor, config.color)}>
              {config.icon}
            </div>
            <span className={cn("text-xs font-bold uppercase tracking-widest", config.color)}>
              {config.title}
            </span>
          </div>

          <h3 className="text-xl font-black tracking-tight text-foreground">
            {suggestion.title || (suggestion.type === 'level-up' ? 'Level Up Available' : 'Recovery Suggested')}
          </h3>

          <p className="text-sm leading-relaxed text-muted-foreground">
            {suggestion.description || suggestion.reason}
          </p>

          <div className="flex items-center space-x-3 pt-2">
            <Button 
              size="sm"
              onClick={onAccept}
              variant={config.btnVariant}
              className="px-6 font-semibold"
            >
              {config.action}
            </Button>
            {onDismiss && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onDismiss} 
                className="text-muted-foreground hover:text-foreground"
              >
                Dismiss
              </Button>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
};

