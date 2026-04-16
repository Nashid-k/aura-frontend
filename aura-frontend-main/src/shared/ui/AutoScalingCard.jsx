import { TrendingUp, ArrowUpCircle, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDashboard } from '../../app/providers/DashboardContext';
import { api } from '../api/client';
import { Card, CardContent } from '@/shared/ui/core/Card';
import { Button } from '@/shared/ui/core/Button';

export const AutoScalingCard = () => {
  const { dashboard, refresh } = useDashboard();

  const scalingHabit = dashboard.habits?.find(h => h.autoScaling?.suggestedIncrease);

  if (!scalingHabit) return null;

  const currentTarget = scalingHabit.targetValue || 1;
  const suggestedTarget = Math.ceil(currentTarget * 1.25);
  const metric = scalingHabit.targetMetric || 'times';

  const handleAccept = async () => {
    try {
      await api.patch(`/habits/${scalingHabit._id}`, {
        targetValue: suggestedTarget,
        'autoScaling.suggestedIncrease': false,
        'autoScaling.continuousDaysThreshold': (scalingHabit.autoScaling?.continuousDaysThreshold || 14) + 7
      });
      refresh();
    } catch (err) {
      console.error('Failed to upgrade habit:', err);
    }
  };

  const handleDecline = async () => {
    try {
      await api.patch(`/habits/${scalingHabit._id}`, {
        'autoScaling.suggestedIncrease': false,
      });
      refresh();
    } catch (err) {
      console.error('Failed to decline upgrade:', err);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="mb-8"
      >
        <Card className="relative overflow-hidden border-teal-500/20 bg-teal-500/5 backdrop-blur-2xl">
          <div className="absolute top-0 right-0 p-8 bg-teal-500/10 blur-[80px] rounded-full pointer-events-none" />
          
          <CardContent className="p-8">
            <div className="flex flex-col sm:flex-row items-center gap-8">
              <div className="w-16 h-16 rounded-2xl bg-teal-500 flex items-center justify-center text-white shadow-lg shadow-teal-500/20 shrink-0">
                <TrendingUp size={32} />
              </div>

              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-xl font-black text-slate-100 mb-1">
                  Consistency Milestone! 🚀
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed max-w-lg">
                  You've crushed <span className="text-teal-400 font-bold">{scalingHabit.title}</span> for {scalingHabit.autoScaling?.continuousDaysThreshold || 14} days straight. 
                  Ready to level up your goal?
                </p>
                
                <div className="flex items-center justify-center sm:justify-start gap-3 mt-6">
                  <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-slate-400">
                    {currentTarget} {metric}
                  </div>
                  <ArrowUpCircle size={20} className="text-teal-500" />
                  <div className="px-3 py-1 rounded-full bg-teal-500/20 border border-teal-500/30 text-xs font-black text-teal-400 shadow-sm">
                    {suggestedTarget} {metric}
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <Button 
                  onClick={handleAccept}
                  className="bg-teal-600 hover:bg-teal-500 text-white font-bold px-8 h-12 rounded-xl border-none"
                >
                  <Check size={18} className="mr-2" />
                  Level Up
                </Button>
                <Button 
                  variant="ghost"
                  onClick={handleDecline}
                  className="text-slate-500 hover:text-slate-200 hover:bg-white/5 font-bold h-12 rounded-xl"
                >
                  Not Now
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  );
};
