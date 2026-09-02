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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-hidden">
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
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 15 }}
            transition={{ type: "spring", stiffness: 420, damping: 28 }}
            className={`relative w-full max-w-2xl max-h-[88vh] rounded-2xl sm:rounded-3xl p-4 sm:p-7 flex flex-col justify-between shadow-soft-xl border z-10 overflow-hidden ${
              colorConfig.light.cardBg
            } dark:${colorConfig.dark.cardBg} ${
              colorConfig.light.border
            } dark:${colorConfig.dark.border}`}
          >
            {/* Color Accent Bar on left */}
            <div
              className={`absolute top-0 left-0 bottom-0 w-1.5 sm:w-2 transition-colors ${
                colorConfig.light.accent
              } dark:${colorConfig.dark.accent}`}
            />

            {/* Scrollable Content */}
            <div className="overflow-y-auto space-y-3 sm:space-y-4 pr-1 scrollbar-thin">
              {/* Header Action Bar */}
              <div className="flex items-start justify-between gap-3 w-full">
                <div className="flex flex-wrap items-center gap-1.5 min-w-0">
                  {note.pinned && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/60 shadow-soft-sm">
                      <Pin className="w-3 h-3 fill-current rotate-45" />
                      Pinned
                    </span>
                  )}
                  {note.tags?.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-semibold bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200/70 dark:border-slate-700/70 truncate max-w-[120px]"
                    >
                      <TagIcon className="w-2.5 h-2.5 opacity-60 shrink-0" />
                      <span className="truncate">{tag}</span>
                    </span>
                  ))}
                </div>

                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer shrink-0"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Title */}
              <h2 className="text-lg sm:text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight leading-snug break-words">
                {note.title || <span className="italic text-slate-400 font-normal">Untitled Note</span>}
              </h2>

              {/* Body Content */}
              <div className="text-xs sm:text-sm text-slate-700 dark:text-slate-200 font-normal leading-relaxed whitespace-pre-wrap pt-1 break-words">
                {note.content || <span className="italic text-slate-400">No content in this note.</span>}
              </div>

              {/* Metadata details */}
              <div className="pt-3 sm:pt-4 mt-4 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[10px] sm:text-xs text-slate-400 dark:text-slate-500 font-medium">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-indigo-500 shrink-0" />
                  <span>Created: {formatFullDateTime(note.createdAt)}</span>
                </div>
                {note.updatedAt && note.updatedAt !== note.createdAt && (
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-indigo-500 shrink-0" />
                    <span>Updated: {formatFullDateTime(note.updatedAt)}</span>
                  </div>
                )}
                <span>
                  {words} words • {chars} chars
                </span>
              </div>
            </div>

            {/* Bottom Actions Footer */}
            <div className="pt-3 sm:pt-4 mt-3 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-wrap items-center justify-between gap-2 w-full">
              <div className="flex items-center gap-1 flex-wrap">
                <button
                  onClick={handleCopy}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? "Copied" : "Copy"}</span>
                </button>

                <button
                  onClick={() => handleExport("txt")}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>TXT</span>
                </button>

                <button
                  onClick={() => handleExport("md")}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>MD</span>
                </button>
              </div>

              <div className="flex items-center gap-1.5 ml-auto">
                <button
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
                  <Pin className={`w-3.5 h-3.5 ${note.pinned ? "fill-current rotate-45 text-amber-500" : ""}`} />
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onEdit(note);
                  }}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-soft transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Edit</span>
                </button>

                <button
                  onClick={() => {
                    onClose();
                    onDeleteRequest(note);
                  }}
                  className="p-2 rounded-xl text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
                  title="Delete note"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
