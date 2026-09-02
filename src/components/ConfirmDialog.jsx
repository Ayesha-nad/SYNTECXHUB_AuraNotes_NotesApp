import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, AlertTriangle, X } from "lucide-react";

export default function ConfirmDialog({
  isOpen,
  title = "Delete Note",
  message = "Are you sure you want to delete this note? This action cannot be undone.",
  noteToDelete,
  onConfirm,
  onCancel,
}) {
  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e) {
      if (!isOpen) return;
      if (e.key === "Escape") {
        onCancel();
      } else if (e.key === "Enter") {
        e.preventDefault();
        onConfirm();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onCancel, onConfirm]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop Blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-md transition-opacity"
          />

          {/* Modal Card */}
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-modal-title"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
            transition={{ type: "spring", stiffness: 450, damping: 28 }}
            className="relative w-full max-w-md bg-white dark:bg-[#141B2D] rounded-3xl p-6 sm:p-7 shadow-soft-xl border border-slate-200/90 dark:border-slate-800 z-10 space-y-5"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3.5">
                <motion.div
                  initial={{ scale: 0.7 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 500, damping: 20 }}
                  className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-200/60 dark:border-rose-900/60 shrink-0 shadow-soft-sm"
                >
                  <AlertTriangle className="w-6 h-6" />
                </motion.div>
                <div>
                  <h3 id="confirm-modal-title" className="text-base font-bold text-slate-900 dark:text-slate-100">
                    {title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Permanent deletion warning
                  </p>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
                onClick={onCancel}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>

            {/* Note Snippet Box */}
            {noteToDelete && (
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0B0F19] border border-slate-200/80 dark:border-slate-800/80 text-xs text-slate-700 dark:text-slate-300 space-y-1 shadow-inner">
                <p className="font-semibold text-slate-900 dark:text-slate-100 line-clamp-1">
                  {noteToDelete.title || "Untitled Note"}
                </p>
                {noteToDelete.content && (
                  <p className="text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {noteToDelete.content}
                  </p>
                )}
              </div>
            )}

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              {message}
            </p>

            {/* Buttons */}
            <div className="flex items-center justify-end gap-2.5 pt-2">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.96 }}
                type="button"
                onClick={onCancel}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </motion.button>

              <motion.button
                type="button"
                whileHover={{ 
                  scale: 1.04, 
                  x: [0, -2, 2, -2, 2, 0],
                  transition: { duration: 0.3 }
                }}
                whileTap={{ scale: 0.96 }}
                onClick={onConfirm}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-soft shadow-rose-600/30 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Note</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
