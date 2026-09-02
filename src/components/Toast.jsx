import React, { createContext, useContext, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertCircle, X, Sparkles } from "lucide-react";

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message, type = "success", duration = 3000) => {
    const id = `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  const showSuccess = useCallback((msg) => addToast(msg, "success"), [addToast]);
  const showError = useCallback((msg) => addToast(msg, "error"), [addToast]);
  const showInfo = useCallback((msg) => addToast(msg, "info"), [addToast]);

  return (
    <ToastContext.Provider value={{ addToast, showSuccess, showError, showInfo, removeToast }}>
      {children}
      {/* Toast Container - fits phone screens seamlessly */}
      <div className="fixed bottom-4 sm:bottom-6 right-3 sm:right-6 left-3 sm:left-auto max-w-full sm:max-w-sm z-50 flex flex-col gap-2 pointer-events-none">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              transition={{ type: "spring", stiffness: 450, damping: 30 }}
              className={`pointer-events-auto flex items-center justify-between gap-2.5 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-xl sm:rounded-2xl shadow-soft-xl border backdrop-blur-md text-xs sm:text-sm font-medium ${
                toast.type === "success"
                  ? "bg-emerald-950/90 text-emerald-100 border-emerald-500/30 dark:bg-emerald-950/95 dark:text-emerald-200"
                  : toast.type === "error"
                  ? "bg-rose-950/90 text-rose-100 border-rose-500/30 dark:bg-rose-950/95 dark:text-rose-200"
                  : "bg-slate-900/90 text-slate-100 border-slate-700/50 dark:bg-slate-900/95"
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                {toast.type === "success" && (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                )}
                {toast.type === "error" && (
                  <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
                )}
                {toast.type === "info" && (
                  <Sparkles className="w-4 h-4 text-indigo-400 shrink-0" />
                )}
                <span className="leading-snug truncate">{toast.message}</span>
              </div>
              <button
                onClick={() => removeToast(toast.id)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer shrink-0"
                aria-label="Close notification"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}
