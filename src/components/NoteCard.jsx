import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Pin, 
  Edit3, 
  Trash2, 
  Copy, 
  Check, 
  Download, 
  Tag as TagIcon, 
  Maximize2,
  CopyPlus
} from "lucide-react";
import { getColorConfig } from "../constants/colors";
import { formatRelativeTime } from "../utils/dateUtils";
import { exportSingleNote } from "../utils/exportUtils";
import { useToast } from "./Toast";

export default function NoteCard({
  note,
  onEdit,
  onDeleteRequest,
  onTogglePin,
  onDuplicate,
  onViewNote,
  isRecentlySaved,
}) {
  const [copied, setCopied] = useState(false);
  const { showSuccess } = useToast();
  const colorConfig = getColorConfig(note.color);

  const handleCopy = (e) => {
    e.stopPropagation();
    const textToCopy = `${note.title ? note.title + "\n\n" : ""}${note.content || ""}`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    showSuccess("Note copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExport = (e) => {
    e.stopPropagation();
    exportSingleNote(note, "txt");
    showSuccess("Note exported as .txt");
  };

  const handlePin = (e) => {
    e.stopPropagation();
    onTogglePin(note.id);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDeleteRequest(note);
  };

  const handleDuplicate = (e) => {
    e.stopPropagation();
    onDuplicate(note.id);
    showSuccess("Note duplicated!");
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(note);
  };

  return (
    <motion.div
      layout="position"
      initial={{ opacity: 0, scale: 0.88, y: 25 }}
      animate={{ 
        opacity: 1, 
        scale: 1, 
        y: 0,
        transition: { type: "spring", stiffness: 380, damping: 26 }
      }}
      exit={{ 
        opacity: 0, 
        scale: 0.82, 
        y: -15,
        rotate: -2,
        transition: { duration: 0.22, ease: "easeInOut" }
      }}
      whileHover={{ 
        y: -6, 
        scale: 1.015,
        transition: { type: "spring", stiffness: 400, damping: 20 }
      }}
      onClick={() => onViewNote(note)}
      className={`group relative rounded-3xl p-5 sm:p-6 transition-colors duration-300 border flex flex-col justify-between cursor-pointer overflow-hidden backdrop-blur-xl ${
        colorConfig.light.cardBg
      } dark:${colorConfig.dark.cardBg} ${
        colorConfig.light.border
      } dark:${colorConfig.dark.border} shadow-soft hover:shadow-soft-xl ${
        isRecentlySaved ? "ring-2 ring-indigo-500 shadow-glow-indigo animate-pulse-subtle" : ""
      }`}
    >
      {/* Colored Left Accent Border with smooth transition */}
      <motion.div
        layout
        className={`absolute top-0 left-0 bottom-0 w-1.5 transition-colors duration-300 ${
          colorConfig.light.accent
        } dark:${colorConfig.dark.accent}`}
      />

      {/* Top Card Area: Pin & Title & Actions */}
      <div>
        <div className="flex items-start justify-between gap-2.5 mb-2.5">
          {/* Note Title */}
          <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 tracking-tight leading-snug line-clamp-2 pr-1 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
            {note.title || <span className="italic text-slate-400 font-normal">Untitled Note</span>}
          </h3>

          {/* Pin Button */}
          <motion.button
            whileHover={{ scale: 1.25, rotate: note.pinned ? 45 : 15 }}
            whileTap={{ scale: 0.85 }}
            onClick={handlePin}
            className={`p-1.5 rounded-xl shrink-0 transition-all cursor-pointer ${
              note.pinned
                ? "bg-amber-100 text-amber-600 dark:bg-amber-950/90 dark:text-amber-400 shadow-soft-sm"
                : "opacity-0 group-hover:opacity-100 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80"
            }`}
            title={note.pinned ? "Unpin note" : "Pin to top"}
            aria-label={note.pinned ? "Unpin note" : "Pin note"}
          >
            <motion.div
              animate={{ rotate: note.pinned ? 45 : 0 }}
              transition={{ type: "spring", stiffness: 450, damping: 25 }}
            >
              <Pin className={`w-4 h-4 ${note.pinned ? "fill-current text-amber-500" : ""}`} />
            </motion.div>
          </motion.button>
        </div>

        {/* Note Content Preview */}
        {note.content && (
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-normal line-clamp-6 whitespace-pre-line mb-3">
            {note.content}
          </p>
        )}

        {/* Tags Row */}
        {note.tags && note.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 my-2.5">
            {note.tags.map((tag) => (
              <motion.span
                key={tag}
                whileHover={{ scale: 1.05 }}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-semibold bg-slate-100/90 text-slate-700 dark:bg-slate-800/90 dark:text-slate-300 border border-slate-200/60 dark:border-slate-700/60 shadow-soft-sm"
              >
                <TagIcon className="w-2.5 h-2.5 opacity-60" />
                {tag}
              </motion.span>
            ))}
          </div>
        )}
      </div>

      {/* Card Footer: Timestamp & Quick Action Toolbar */}
      <div className="pt-3 mt-1 border-t border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between text-xs text-slate-400 dark:text-slate-500">
        {/* Relative Timestamp */}
        <span className="font-medium text-[11px] tracking-wide">
          {formatRelativeTime(note.updatedAt || note.createdAt)}
        </span>

        {/* Hover-revealed quick actions */}
        <div className="flex items-center gap-1 opacity-90 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          {/* Copy Button */}
          <motion.button
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.88 }}
            onClick={handleCopy}
            className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer"
            title="Copy content"
            aria-label="Copy note content"
          >
            <AnimatePresence mode="wait">
              {copied ? (
                <motion.div
                  key="check"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <Check className="w-3.5 h-3.5 text-emerald-500" />
                </motion.div>
              ) : (
                <motion.div key="copy" initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
                  <Copy className="w-3.5 h-3.5" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Full View Modal */}
          <motion.button
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.88 }}
            onClick={(e) => {
              e.stopPropagation();
              onViewNote(note);
            }}
            className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer"
            title="Expand view"
            aria-label="Expand note view"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </motion.button>

          {/* Duplicate Button */}
          <motion.button
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.88 }}
            onClick={handleDuplicate}
            className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer"
            title="Duplicate note"
            aria-label="Duplicate note"
          >
            <CopyPlus className="w-3.5 h-3.5" />
          </motion.button>

          {/* Export Button */}
          <motion.button
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.88 }}
            onClick={handleExport}
            className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer"
            title="Export as .txt"
            aria-label="Export note"
          >
            <Download className="w-3.5 h-3.5" />
          </motion.button>

          {/* Edit Button */}
          <motion.button
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.88 }}
            onClick={handleEdit}
            className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors cursor-pointer"
            title="Edit note"
            aria-label="Edit note"
          >
            <Edit3 className="w-3.5 h-3.5" />
          </motion.button>

          {/* Delete Button */}
          <motion.button
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.88 }}
            onClick={handleDelete}
            className="p-1.5 rounded-lg text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/60 transition-colors cursor-pointer"
            title="Delete note"
            aria-label="Delete note"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
