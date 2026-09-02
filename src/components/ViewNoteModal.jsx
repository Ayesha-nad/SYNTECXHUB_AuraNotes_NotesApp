import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  X, 
  Pin, 
  Edit3, 
  Trash2, 
  Copy, 
  Check, 
  Download, 
  Tag as TagIcon, 
  Calendar,
  Clock
} from "lucide-react";
import { getColorConfig } from "../constants/colors";
import { formatFullDateTime, getWordAndCharCount } from "../utils/dateUtils";
import { exportSingleNote } from "../utils/exportUtils";
import { useToast } from "./Toast";

export default function ViewNoteModal({
  note,
  isOpen,
  onClose,
  onEdit,
  onDeleteRequest,
  onTogglePin,
}) {
  const [copied, setCopied] = useState(false);
  const { showSuccess } = useToast();

  useEffect(() => {
    function handleKeyDown(e) {
      if (!isOpen) return;
      if (e.key === "Escape") {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!note) return null;

  const colorConfig = getColorConfig(note.color);
  const { words, chars } = getWordAndCharCount(note.content || "");

  const handleCopy = () => {
    const textToCopy = `${note.title ? note.title + "\n\n" : ""}${note.content || ""}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    showSuccess("Note copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExport = (format) => {
    exportSingleNote(note, format);
    showSuccess(`Exported as .${format}`);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-md transition-opacity"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 25 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 15 }}
            transition={{ type: "spring", stiffness: 420, damping: 28 }}
            className={`relative w-full max-w-2xl max-h-[85vh] rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-soft-xl border z-10 overflow-hidden ${
              colorConfig.light.cardBg
            } dark:${colorConfig.dark.cardBg} ${
              colorConfig.light.border
            } dark:${colorConfig.dark.border}`}
          >
            {/* Color Accent Bar on left */}
            <div
              className={`absolute top-0 left-0 bottom-0 w-2 transition-colors ${
                colorConfig.light.accent
              } dark:${colorConfig.dark.accent}`}
            />

            {/* Scrollable Content */}
            <div className="overflow-y-auto space-y-4 pr-1 scrollbar-thin">
              {/* Header Action Bar */}
              <div className="flex items-start justify-between gap-4">
                <div className="flex flex-wrap items-center gap-2">
                  {note.pinned && (
                    <motion.span
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/60 shadow-soft-sm"
                    >
                      <Pin className="w-3.5 h-3.5 fill-current rotate-45" />
                      Pinned
                    </motion.span>
                  )}
                  {note.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200/70 dark:border-slate-700/70"
                    >
                      <TagIcon className="w-3 h-3 opacity-60" />
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Close Button */}
                <motion.button
                  whileHover={{ scale: 1.15, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={onClose}
                  className="p-2 rounded-2xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </motion.button>
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-snug">
                {note.title || <span className="italic text-slate-400 font-normal">Untitled Note</span>}
              </h2>

              {/* Body Content */}
              <div className="text-sm sm:text-base text-slate-700 dark:text-slate-200 font-normal leading-relaxed whitespace-pre-wrap pt-2">
                {note.content || <span className="italic text-slate-400">No content in this note.</span>}
              </div>

              {/* Metadata details */}
              <div className="pt-4 mt-6 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-400 dark:text-slate-500 font-medium">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Created: {formatFullDateTime(note.createdAt)}</span>
                </div>
                {note.updatedAt && note.updatedAt !== note.createdAt && (
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-indigo-500" />
                    <span>Updated: {formatFullDateTime(note.updatedAt)}</span>
                  </div>
                )}
                <span>
                  {words} words • {chars} characters
                </span>
              </div>
            </div>

            {/* Bottom Actions Footer */}
            <div className="pt-5 mt-4 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-1.5">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCopy}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied!" : "Copy"}</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleExport("txt")}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export TXT</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleExport("md")}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export MD</span>
                </motion.button>
              </div>

              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.1, rotate: note.pinned ? 45 : 15 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    onTogglePin(note.id);
                  }}
                  className={`p-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                    note.pinned
                      ? "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 shadow-soft-sm"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300"
                  }`}
                  title="Toggle pin"
                >
                  <Pin className={`w-4 h-4 ${note.pinned ? "fill-current rotate-45 text-amber-500" : ""}`} />
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => {
                    onClose();
                    onEdit(note);
                  }}
                  className="px-4 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-soft transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit Note</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    onClose();
                    onDeleteRequest(note);
                  }}
                  className="p-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
                  title="Delete note"
                >
                  <Trash2 className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
