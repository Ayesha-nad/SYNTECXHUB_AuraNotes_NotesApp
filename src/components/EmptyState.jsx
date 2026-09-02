import React from "react";
import { motion } from "framer-motion";
import { Sparkles, SearchX, Plus, Lightbulb, Keyboard } from "lucide-react";

export default function EmptyState({
  hasActiveFilters,
  onResetFilters,
  onFocusNewNote,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.94, y: -15 }}
      transition={{ type: "spring", stiffness: 350, damping: 28 }}
      className="w-full max-w-md mx-auto my-12 p-8 text-center rounded-3xl bg-white/70 dark:bg-[#131B2D]/70 border border-slate-200/80 dark:border-slate-800/80 backdrop-blur-xl shadow-soft-lg"
    >
      {hasActiveFilters ? (
        <div className="space-y-4">
          <motion.div
            initial={{ scale: 0.5, rotate: -15 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 450, damping: 25 }}
            className="w-16 h-16 mx-auto rounded-3xl bg-rose-50 dark:bg-rose-950/50 text-rose-500 dark:text-rose-400 flex items-center justify-center border border-rose-200/50 dark:border-rose-900/50 shadow-soft"
          >
            <SearchX className="w-8 h-8" />
          </motion.div>
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
              No matching notes
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xs mx-auto leading-relaxed">
              We couldn't find any notes matching your current search query or active filter tags.
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onResetFilters}
            className="px-4 py-2 rounded-xl bg-slate-900 dark:bg-indigo-600 text-white text-xs font-bold hover:bg-slate-800 dark:hover:bg-indigo-500 shadow-soft transition-all cursor-pointer"
          >
            Clear all filters
          </motion.button>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Animated Multi-Layer Illustration */}
          <div className="relative w-20 h-20 mx-auto flex items-center justify-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
              className="absolute inset-0 rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-30 blur-md"
            />
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
              className="relative w-16 h-16 rounded-3xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-soft-lg shadow-indigo-600/35"
            >
              <Sparkles className="w-8 h-8 animate-pulse-subtle" />
            </motion.div>
          </div>

          <div className="space-y-1.5">
            <h3 className="text-lg font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
              Your canvas is fresh and clean
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-xs mx-auto leading-relaxed">
              Jot down quick thoughts, pin your high-priority goals, and color-code your ideas.
            </p>
          </div>

          <div className="pt-1">
            <motion.button
              whileHover={{ scale: 1.06, translateY: -2, boxShadow: "0 12px 28px -4px rgba(99, 102, 241, 0.35)" }}
              whileTap={{ scale: 0.95 }}
              onClick={onFocusNewNote}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs font-bold shadow-soft-lg shadow-indigo-600/30 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Create Your First Note</span>
            </motion.button>
          </div>

          {/* Quick tips list */}
          <div className="pt-4 mt-4 border-t border-slate-200/60 dark:border-slate-800/60 text-left space-y-2">
            <motion.div
              whileHover={{ x: 3 }}
              className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 transition-colors"
            >
              <Keyboard className="w-3.5 h-3.5 text-indigo-500 shrink-0" />
              <span>
                Press <kbd className="px-1.5 py-0.5 bg-slate-100 dark:bg-slate-800 rounded font-mono text-[10px] border border-slate-200/60 dark:border-slate-700/60">Ctrl + N</kbd> anywhere to start typing
              </span>
            </motion.div>
            <motion.div
              whileHover={{ x: 3 }}
              className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 transition-colors"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              <span>Notes automatically persist in local storage</span>
            </motion.div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
