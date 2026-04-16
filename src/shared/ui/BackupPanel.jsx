import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Download, AlertCircle, ChevronRight, Database } from 'lucide-react';
import { cn } from '@/shared/lib/utils/cn';
import { Button } from '@/shared/ui/core/Button';

export function BackupPanel({ onExport, onImport, importing, message }) {
  return (
    <div className="divide-y divide-border/40">
      <div className="p-4 space-y-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Backup and Restore</h3>
          <p className="text-xs text-muted-foreground font-medium mt-1 leading-relaxed">
            Keep a local JSON backup of your habits and restore it later.
          </p>
        </div>

        <AnimatePresence>
          {message && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className={cn(
                "p-3 rounded-xl border flex items-center gap-3",
                message.type === 'error' 
                  ? "bg-destructive/10 border-destructive/20 text-destructive" 
                  : "bg-teal-500/10 border-teal-500/20 text-teal-600"
              )}
            >
              <AlertCircle className="w-4 h-4 shrink-0" />
              <p className="text-xs font-bold">{message.text}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <button
        onClick={onExport}
        className="w-full p-4 flex items-center justify-between hover:bg-secondary/30 transition-colors text-left group"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center text-white">
            <Download size={18} />
          </div>
          <span className="font-semibold text-foreground text-sm">Export Data (JSON)</span>
        </div>
        <ChevronRight className="text-muted-foreground/30 w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
      </button>

      <label className="w-full p-4 flex items-center justify-between hover:bg-secondary/30 transition-colors text-left group cursor-pointer">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-white">
            <Upload size={18} />
          </div>
          <span className="font-semibold text-foreground text-sm">
            {importing ? 'Importing...' : 'Import Data (JSON)'}
          </span>
        </div>
        <input hidden type="file" accept="application/json" onChange={onImport} disabled={importing} />
        <ChevronRight className="text-muted-foreground/30 w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
      </label>
    </div>
  );
}
