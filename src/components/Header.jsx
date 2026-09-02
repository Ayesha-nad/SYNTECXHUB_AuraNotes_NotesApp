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
      className="sticky top-0 z-30 backdrop-blur-2xl bg-white/75 dark:bg-[#0B0F19]/80 border-b border-slate-200/80 dark:border-slate-800/80 transition-colors duration-300 shadow-soft-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo & Title */}
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ rotate: 15, scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center text-white shadow-soft shadow-indigo-500/30 group cursor-pointer"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
              className="absolute -inset-0.5 rounded-2xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-60 blur-sm transition-opacity"
            />
            <Sparkles className="w-5 h-5 relative z-10 animate-pulse-subtle" />
          </motion.div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-800 dark:from-white dark:via-indigo-200 dark:to-slate-300 bg-clip-text text-transparent">
                AuraNotes
              </h1>
              <motion.span
                whileHover={{ scale: 1.08 }}
                className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/80 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60 shadow-soft-sm"
              >
                v1.0
              </motion.span>
            </div>
            <motion.p
              key={notes.length}
              initial={{ opacity: 0, y: -2 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs text-slate-500 dark:text-slate-400 hidden sm:block font-medium"
            >
              {notes.length} {notes.length === 1 ? "note" : "notes"}
              {pinnedCount > 0 && ` • ${pinnedCount} pinned`}
            </motion.p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Add Note Button (on desktop) */}
          <motion.button
            whileHover={{ scale: 1.04, translateY: -2, boxShadow: "0 8px 24px -4px rgba(99, 102, 241, 0.35)" }}
            whileTap={{ scale: 0.96 }}
            onClick={onFocusNewNote}
            className="hidden sm:inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs font-bold shadow-soft shadow-indigo-600/20 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Write Note</span>
            <kbd className="hidden lg:inline-block text-[10px] bg-indigo-700/70 px-1.5 py-0.5 rounded-md text-indigo-100 font-mono">
              Ctrl+N
            </kbd>
          </motion.button>

          {/* Theme Toggle Button */}
          <motion.button
            whileHover={{ scale: 1.08, rotate: 10 }}
            whileTap={{ scale: 0.9, rotate: -15 }}
            onClick={toggleTheme}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-200/70 dark:hover:bg-slate-700/70 transition-all border border-slate-200/50 dark:border-slate-700/50 shadow-soft-sm cursor-pointer"
            aria-label="Toggle light/dark theme"
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            <AnimatePresence mode="wait" initial={false}>
              {theme === "dark" ? (
                <motion.div
                  key="sun"
                  initial={{ rotate: -90, opacity: 0, scale: 0.5 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: 90, opacity: 0, scale: 0.5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                >
                  <Sun className="w-4 h-4 text-amber-400" />
                </motion.div>
              ) : (
                <motion.div
                  key="moon"
                  initial={{ rotate: 90, opacity: 0, scale: 0.5 }}
                  animate={{ rotate: 0, opacity: 1, scale: 1 }}
                  exit={{ rotate: -90, opacity: 0, scale: 0.5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
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
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/70 dark:hover:bg-slate-700/70 transition-all border border-slate-200/50 dark:border-slate-700/50 shadow-soft-sm cursor-pointer"
              aria-label="More actions and export options"
              title="More actions"
            >
              <MoreVertical className="w-4 h-4" />
            </motion.button>

            <AnimatePresence>
              {showMenu && (
                <motion.div
                  initial={{ opacity: 0, y: 12, scale: 0.92 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.92 }}
                  transition={{ type: "spring", stiffness: 450, damping: 28 }}
                  className="absolute right-0 mt-2 w-56 rounded-2xl bg-white/95 dark:bg-[#151C2C]/95 backdrop-blur-xl shadow-soft-xl border border-slate-200/80 dark:border-slate-800 p-1.5 z-40 text-xs font-medium text-slate-700 dark:text-slate-200 divide-y divide-slate-100 dark:divide-slate-800/80"
                >
                  <div className="p-1 space-y-0.5">
                    <motion.button
                      whileHover={{ x: 3 }}
                      onClick={handleExportJSON}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/70 text-left transition-colors cursor-pointer"
                    >
                      <FileJson className="w-4 h-4 text-indigo-500" />
                      <div>
                        <p className="font-semibold">Export Backup (JSON)</p>
                        <p className="text-[10px] text-slate-400">Save all notes & metadata</p>
                      </div>
                    </motion.button>

                    <motion.button
                      whileHover={{ x: 3 }}
                      onClick={handleExportTXT}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/70 text-left transition-colors cursor-pointer"
                    >
                      <FileText className="w-4 h-4 text-emerald-500" />
                      <div>
                        <p className="font-semibold">Export as Text (TXT)</p>
                        <p className="text-[10px] text-slate-400">Readable notes archive</p>
                      </div>
                    </motion.button>
                  </div>

                  <div className="p-1 space-y-0.5">
                    <motion.button
                      whileHover={{ x: 3 }}
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/70 text-left transition-colors cursor-pointer"
                    >
                      <Upload className="w-4 h-4 text-blue-500" />
                      <div>
                        <p className="font-semibold">Import JSON Backup</p>
                        <p className="text-[10px] text-slate-400">Restore or merge notes</p>
                      </div>
                    </motion.button>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept=".json"
                      className="hidden"
                    />

                    <motion.button
                      whileHover={{ x: 3 }}
                      onClick={() => {
                        onRestoreSamples();
                        showInfo("Sample notes restored!");
                        setShowMenu(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-amber-50 dark:hover:bg-amber-950/40 text-amber-700 dark:text-amber-300 text-left transition-colors cursor-pointer"
                    >
                      <RotateCcw className="w-4 h-4 text-amber-500" />
                      <div>
                        <p className="font-semibold">Load Sample Notes</p>
                        <p className="text-[10px] opacity-75">Restore original examples</p>
                      </div>
                    </motion.button>
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
