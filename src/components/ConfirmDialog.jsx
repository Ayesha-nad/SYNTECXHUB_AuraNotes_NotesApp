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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-hidden">
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
            className="relative w-full max-w-sm sm:max-w-md bg-white dark:bg-[#141B2D] rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-soft-xl border border-slate-200/90 dark:border-slate-800 z-10 space-y-4 sm:space-y-5"
          >
            {/* Header */}
            <div className="flex items-start justify-between gap-2.5">
              <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center border border-rose-200/60 dark:border-rose-900/60 shrink-0 shadow-soft-sm">
                  <AlertTriangle className="w-5 h-5 sm:w-6 sm:h-6" />
                </div>
                <div className="min-w-0">
                  <h3 id="confirm-modal-title" className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 truncate">
                    {title}
                  </h3>
                  <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
                    Permanent deletion warning
                  </p>
                </div>
              </div>

              <button
                onClick={onCancel}
                className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer shrink-0"
                aria-label="Close dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Note Snippet Box */}
            {noteToDelete && (
              <div className="p-3 rounded-xl sm:rounded-2xl bg-slate-50 dark:bg-[#0B0F19] border border-slate-200/80 dark:border-slate-800/80 text-xs text-slate-700 dark:text-slate-300 space-y-1 shadow-inner break-words">
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
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={onCancel}
                className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={onConfirm}
                className="px-4 py-1.5 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-soft shadow-rose-600/30 flex items-center gap-1.5 transition-all cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Note</span>
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
