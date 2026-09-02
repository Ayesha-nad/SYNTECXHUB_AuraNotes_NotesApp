import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Sun, 
  Moon, 
  Upload, 
  RotateCcw, 
  FileText, 
  FileJson, 
  Sparkles,
  MoreVertical,
  Plus
} from "lucide-react";
import { exportAllNotesJSON, exportAllNotesTXT } from "../utils/exportUtils";
import { useToast } from "./Toast";

export default function Header({ 
  theme, 
  toggleTheme, 
  notes, 
  pinnedCount, 
  onRestoreSamples,
  onImportNotes,
  onFocusNewNote
}) {
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);
  const fileInputRef = useRef(null);
  const { showSuccess, showError, showInfo } = useToast();

  // Close menu on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleExportJSON = () => {
    exportAllNotesJSON(notes);
    showSuccess("Notes exported as JSON backup");
    setShowMenu(false);
  };

  const handleExportTXT = () => {
    exportAllNotesTXT(notes);
    showSuccess("All notes exported as Text document");
    setShowMenu(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (Array.isArray(imported)) {
          const success = onImportNotes(imported);
          if (success) {
            showSuccess(`Successfully imported ${imported.length} notes!`);
          } else {
            showError("Failed to parse notes array from file.");
          }
        } else {
          showError("Invalid JSON structure: Expected an array of notes.");
        }
      } catch (err) {
        console.error(err);
        showError("Failed to parse JSON file.");
      }
    };
    reader.readAsText(file);
    e.target.value = "";
    setShowMenu(false);
  };

  return (
    <motion.header
      initial={{ y: -25, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 350, damping: 28 }}
      className="sticky top-0 z-30 w-full backdrop-blur-2xl bg-white/80 dark:bg-[#0B0F19]/85 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors duration-300 shadow-soft-sm"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Logo & Title */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <motion.div
            whileHover={{ rotate: 15, scale: 1.08 }}
            whileTap={{ scale: 0.9 }}
            className="relative w-8 h-8 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-soft shadow-indigo-500/30 shrink-0 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse-subtle" />
          </motion.div>

          <div className="min-w-0">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <h1 className="text-base sm:text-xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-800 dark:from-white dark:via-indigo-200 dark:to-slate-300 bg-clip-text text-transparent truncate">
                AuraNotes
              </h1>
              <span className="text-[10px] sm:text-[11px] font-semibold px-1.5 sm:px-2 py-0.2 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60 shrink-0">
                v1.0
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 hidden md:block font-medium truncate">
              {notes.length} {notes.length === 1 ? "note" : "notes"}
              {pinnedCount > 0 && ` • ${pinnedCount} pinned`}
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          {/* Quick Add Note Button (on tablet/desktop) */}
          <motion.button
            whileHover={{ scale: 1.04, translateY: -1 }}
            whileTap={{ scale: 0.96 }}
            onClick={onFocusNewNote}
            className="hidden sm:inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 text-white text-xs font-bold shadow-soft shadow-indigo-600/20 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <span>Write Note</span>
            <kbd className="hidden lg:inline-block text-[10px] bg-indigo-700/70 px-1.5 py-0.5 rounded text-indigo-100 font-mono">
              Ctrl+N
            </kbd>
          </motion.button>

          {/* Theme Toggle Button */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleTheme}
            className="p-2 sm:p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-all border border-slate-200/50 dark:border-slate-700/50 shadow-soft-sm cursor-pointer"
            aria-label="Toggle light/dark theme"
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            <AnimatePresence mode="wait" initial={false}>
              {theme === "dark" ? (
                <motion.div
                  key="sun"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Sun className="w-4 h-4 text-amber-400" />
                </motion.div>
              ) : (
                <motion.div
                  key="moon"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Moon className="w-4 h-4 text-slate-700" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Export & More Dropdown Menu */}
          <div className="relative" ref={menuRef}>
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={() => setShowMenu(!showMenu)}
              className="p-2 sm:p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-all border border-slate-200/50 dark:border-slate-700/50 shadow-soft-sm cursor-pointer"
              aria-label="More actions and export options"
              title="More actions"
            >
              <MoreVertical className="w-4 h-4" />
            </motion.button>

            <AnimatePresence>
              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.94 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.94 }}
                  transition={{ type: "spring", stiffness: 450, damping: 28 }}
                  className="absolute right-0 mt-2 w-52 sm:w-56 max-w-[calc(100vw-1.5rem)] rounded-2xl bg-white/95 dark:bg-[#151C2C]/95 backdrop-blur-xl shadow-soft-xl border border-slate-200/80 dark:border-slate-800 p-1.5 z-40 text-xs font-medium text-slate-700 dark:text-slate-200 divide-y divide-slate-100 dark:divide-slate-800/80"
                >
                  <div className="p-1 space-y-0.5">
                    <button
                      onClick={handleExportJSON}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/70 text-left transition-colors cursor-pointer"
                    >
                      <FileJson className="w-4 h-4 text-indigo-500 shrink-0" />
                      <div className="min-w-0">
                        <p className="font-semibold truncate">Export Backup (JSON)</p>
                        <p className="text-[10px] text-slate-400 truncate">Save notes & tags</p>
                      </div>
                    </button>

                    <button
                      onClick={handleExportTXT}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/70 text-left transition-colors cursor-pointer"
                    >
                      <FileText className="w-4 h-4 text-emerald-500 shrink-0" />
                      <div className="min-w-0">
                        <p className="font-semibold truncate">Export as Text (TXT)</p>
                        <p className="text-[10px] text-slate-400 truncate">Readable archive</p>
                      </div>
                    </button>
                  </div>

                  <div className="p-1 space-y-0.5">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/70 text-left transition-colors cursor-pointer"
                    >
                      <Upload className="w-4 h-4 text-blue-500 shrink-0" />
                      <div className="min-w-0">
                        <p className="font-semibold truncate">Import JSON Backup</p>
                        <p className="text-[10px] text-slate-400 truncate">Restore notes</p>
                      </div>
                    </button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept=".json"
                      className="hidden"
                    />

                    <button
                      onClick={() => {
                        onRestoreSamples();
                        showInfo("Sample notes restored!");
                        setShowMenu(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-amber-50 dark:hover:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-left transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4 text-amber-500 shrink-0" />
                      <div className="min-w-0">
                        <p className="font-semibold truncate">Load Sample Notes</p>
                        <p className="text-[10px] opacity-75 truncate">Restore examples</p>
                      </div>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </motion.header>
  );
}
