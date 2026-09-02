import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Pin, 
  Palette, 
  Tag as TagIcon, 
  Check, 
  X, 
  CornerDownLeft
} from "lucide-react";
import confetti from "canvas-confetti";
import { NOTE_COLORS, getColorConfig, DEFAULT_TAGS } from "../constants/colors";
import { getWordAndCharCount } from "../utils/dateUtils";
import { useToast } from "./Toast";

export default function NoteForm({
  onAddNote,
  onUpdateNote,
  editingNote,
  onCancelEdit,
  formFocusTrigger,
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [color, setColor] = useState("default");
  const [pinned, setPinned] = useState(false);
  const [tags, setTags] = useState([]);
  const [customTagInput, setCustomTagInput] = useState("");
  const [showTagPicker, setShowTagPicker] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);

  const containerRef = useRef(null);
  const titleInputRef = useRef(null);
  const contentInputRef = useRef(null);
  const { showSuccess } = useToast();

  // Populate fields when entering edit mode
  useEffect(() => {
    if (editingNote) {
      setTitle(editingNote.title || "");
      setContent(editingNote.content || "");
      setColor(editingNote.color || "default");
      setPinned(Boolean(editingNote.pinned));
      setTags(Array.isArray(editingNote.tags) ? editingNote.tags : []);
      setIsExpanded(true);

      const timer = setTimeout(() => {
        containerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        if (titleInputRef.current) {
          titleInputRef.current.focus();
          const val = titleInputRef.current.value;
          titleInputRef.current.setSelectionRange(val.length, val.length);
        } else if (contentInputRef.current) {
          contentInputRef.current.focus();
          const val = contentInputRef.current.value;
          contentInputRef.current.setSelectionRange(val.length, val.length);
        }
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [editingNote]);

  // Handle external focus triggers (e.g., Ctrl+N or header button)
  useEffect(() => {
    if (formFocusTrigger > 0 && !editingNote) {
      setIsExpanded(true);
      const timer = setTimeout(() => {
        titleInputRef.current?.focus();
        containerRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [formFocusTrigger, editingNote]);

  // Initial Auto-Focus on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      if (titleInputRef.current) {
        if (document.activeElement === document.body || !document.activeElement) {
          titleInputRef.current.focus();
        }
      }
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  // Outside click detection to collapse empty form
  useEffect(() => {
    function handleClickOutside(e) {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        if (!editingNote && !title.trim() && !content.trim()) {
          setIsExpanded(false);
          setShowColorPicker(false);
          setShowTagPicker(false);
        }
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [editingNote, title, content]);

  // Global Keyboard Shortcuts inside form
  const handleKeyDown = (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
      e.preventDefault();
      handleSubmit(e);
    } else if (e.key === "Escape") {
      if (editingNote) {
        handleCancel();
      } else if (!title.trim() && !content.trim()) {
        setIsExpanded(false);
        setShowColorPicker(false);
        setShowTagPicker(false);
      }
    }
  };

  const handleReset = () => {
    setTitle("");
    setContent("");
    setColor("default");
    setPinned(false);
    setTags([]);
    setCustomTagInput("");
    setShowTagPicker(false);
    setShowColorPicker(false);
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!title.trim() && !content.trim()) {
      return;
    }

    if (editingNote) {
      onUpdateNote(editingNote.id, {
        title,
        content,
        color,
        pinned,
        tags,
      });
      showSuccess("Note updated successfully!");
      if (onCancelEdit) onCancelEdit();
      handleReset();
      setIsExpanded(false);
    } else {
      onAddNote({
        title,
        content,
        color,
        pinned,
        tags,
      });

      // Joyful confetti on note creation
      confetti({
        particleCount: 40,
        spread: 70,
        origin: { y: 0.35, x: 0.5 },
        colors: ["#6366F1", "#A855F7", "#EC4899", "#3B82F6", "#10B981"],
        disableForReducedMotion: true,
      });

      showSuccess("New note created!");
      handleReset();

      // Refocus input immediately for rapid note-taking
      setTimeout(() => {
        titleInputRef.current?.focus();
      }, 50);
    }
  };

  const handleCancel = () => {
    handleReset();
    if (editingNote && onCancelEdit) {
      onCancelEdit();
    }
    setIsExpanded(false);
  };

  const toggleTag = (tag) => {
    if (tags.includes(tag)) {
      setTags(tags.filter((t) => t !== tag));
    } else {
      setTags([...tags, tag]);
    }
  };

  const handleAddCustomTag = (e) => {
    e.preventDefault();
    const trimmed = customTagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setCustomTagInput("");
    }
  };

  const colorConfig = getColorConfig(color);
  const { words, chars } = getWordAndCharCount(content);

  return (
    <div className="w-full max-w-2xl mx-auto mb-10 px-2 sm:px-0">
      <motion.div
        ref={containerRef}
        layout
        transition={{ type: "spring", stiffness: 350, damping: 30 }}
        className={`relative rounded-3xl transition-all duration-300 border backdrop-blur-2xl shadow-soft-lg overflow-hidden ${
          colorConfig.light.cardBg
        } dark:${colorConfig.dark.cardBg} ${
          colorConfig.light.border
        } dark:${colorConfig.dark.border} ${
          isExpanded ? "ring-2 ring-indigo-500/30 shadow-glow-indigo dark:shadow-glow-indigo" : ""
        }`}
      >
        {/* Color accent strip on left with animated width */}
        <motion.div
          layout
          className={`absolute top-0 left-0 bottom-0 w-1.5 transition-colors duration-300 ${
            colorConfig.light.accent
          } dark:${colorConfig.dark.accent}`}
        />

        <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="p-4 sm:p-5 pl-5 sm:pl-6">
          {/* Header Row: Title & Pin Toggle */}
          <div className="flex items-center justify-between gap-3">
            <input
              ref={titleInputRef}
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onFocus={() => setIsExpanded(true)}
              placeholder={isExpanded ? "Note Title..." : "Take a note... (Ctrl + N)"}
              className="w-full bg-transparent font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none tracking-tight"
            />

            {/* Pin Toggle Button */}
            <motion.button
              type="button"
              whileHover={{ scale: 1.2, rotate: pinned ? 45 : 15 }}
              whileTap={{ scale: 0.85 }}
              onClick={() => {
                setPinned(!pinned);
                setIsExpanded(true);
              }}
              className={`p-2 rounded-xl transition-all cursor-pointer ${
                pinned
                  ? "bg-amber-100 text-amber-600 dark:bg-amber-950/80 dark:text-amber-400 shadow-soft-sm"
                  : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/60"
              }`}
              title={pinned ? "Unpin note" : "Pin note to top"}
              aria-label="Toggle pin"
            >
              <motion.div
                animate={{ rotate: pinned ? 45 : 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <Pin className={`w-4 h-4 ${pinned ? "fill-current text-amber-500" : ""}`} />
              </motion.div>
            </motion.button>
          </div>

          {/* Expandable Section: Content Area + Tags + Colors + Action Bar */}
          <AnimatePresence initial={false}>
            {isExpanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                className="space-y-4 pt-3"
              >
                {/* Textarea for Note Content */}
                <textarea
                  ref={contentInputRef}
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your thoughts, checklist, or ideas..."
                  rows={4}
                  className="w-full bg-transparent text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none resize-none leading-relaxed font-normal"
                />

                {/* Selected Tags Display */}
                {tags.length > 0 && (
                  <motion.div
                    layout
                    className="flex flex-wrap gap-1.5 pt-1"
                  >
                    {tags.map((tag) => (
                      <motion.span
                        key={tag}
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-indigo-100/90 text-indigo-800 dark:bg-indigo-950/90 dark:text-indigo-300 border border-indigo-200/60 dark:border-indigo-800/60 shadow-soft-sm"
                      >
                        #{tag}
                        <button
                          type="button"
                          onClick={() => toggleTag(tag)}
                          className="hover:text-indigo-950 dark:hover:text-white cursor-pointer"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </motion.span>
                    ))}
                  </motion.div>
                )}

                {/* Tag Picker Popover */}
                <AnimatePresence>
                  {showTagPicker && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.96 }}
                      transition={{ type: "spring", stiffness: 450, damping: 28 }}
                      className="p-3.5 rounded-2xl bg-white/95 dark:bg-[#101726]/95 border border-slate-200 dark:border-slate-800 shadow-soft-xl space-y-2.5 backdrop-blur-md"
                    >
                      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Select or add tags</p>
                      <div className="flex flex-wrap gap-1.5">
                        {DEFAULT_TAGS.map((t) => (
                          <motion.button
                            key={t}
                            type="button"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => toggleTag(t)}
                            className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                              tags.includes(t)
                                ? "bg-indigo-600 text-white shadow-soft-sm"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                            }`}
                          >
                            #{t}
                          </motion.button>
                        ))}
                      </div>
                      <div className="flex gap-1.5 pt-1">
                        <input
                          type="text"
                          value={customTagInput}
                          onChange={(e) => setCustomTagInput(e.target.value)}
                          placeholder="Add custom tag..."
                          className="flex-1 px-2.5 py-1 text-xs rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        />
                        <motion.button
                          whileHover={{ scale: 1.04 }}
                          whileTap={{ scale: 0.96 }}
                          type="button"
                          onClick={handleAddCustomTag}
                          className="px-3 py-1 rounded-lg bg-indigo-600 text-white text-xs font-medium hover:bg-indigo-700 cursor-pointer shadow-soft-sm"
                        >
                          Add
                        </motion.button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Color Swatch Picker */}
                <AnimatePresence>
                  {showColorPicker && (
                    <motion.div
                      initial={{ opacity: 0, y: -8, scale: 0.96 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -6, scale: 0.96 }}
                      transition={{ type: "spring", stiffness: 450, damping: 28 }}
                      className="flex items-center gap-2 p-2.5 rounded-2xl bg-white/95 dark:bg-[#101726]/95 border border-slate-200 dark:border-slate-800 shadow-soft-xl backdrop-blur-md overflow-x-auto"
                    >
                      {NOTE_COLORS.map((c) => (
                        <motion.button
                          key={c.id}
                          type="button"
                          whileHover={{ scale: 1.25 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setColor(c.id)}
                          title={c.name}
                          style={{ backgroundColor: c.swatch }}
                          className={`w-7 h-7 rounded-full border border-black/10 dark:border-white/20 transition-all flex items-center justify-center shrink-0 cursor-pointer ${
                            color === c.id
                              ? "ring-2 ring-indigo-600 scale-110 shadow-soft"
                              : "hover:scale-105"
                          }`}
                        >
                          {color === c.id && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", stiffness: 500, damping: 25 }}
                            >
                              <Check className="w-4 h-4 text-slate-800" />
                            </motion.div>
                          )}
                        </motion.button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Bottom Control Bar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200/50 dark:border-slate-800/50">
                  {/* Tool buttons: Color, Tag, Word stats */}
                  <div className="flex items-center gap-1.5">
                    {/* Color Swatch Trigger */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => {
                        setShowColorPicker(!showColorPicker);
                        setShowTagPicker(false);
                      }}
                      className={`p-2 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                        showColorPicker
                          ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 shadow-soft-sm"
                          : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                      }`}
                      title="Select card color"
                    >
                      <Palette className="w-4 h-4" />
                      <span className="hidden sm:inline">Color</span>
                    </motion.button>

                    {/* Tag Trigger */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={() => {
                        setShowTagPicker(!showTagPicker);
                        setShowColorPicker(false);
                      }}
                      className={`p-2 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                        showTagPicker
                          ? "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 shadow-soft-sm"
                          : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60"
                      }`}
                      title="Add tags"
                    >
                      <TagIcon className="w-4 h-4" />
                      <span className="hidden sm:inline">Tags</span>
                    </motion.button>

                    {/* Word and Character Count */}
                    {(chars > 0 || words > 0) && (
                      <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500 ml-2 hidden sm:inline">
                        {words} {words === 1 ? "word" : "words"} • {chars} chars
                      </span>
                    )}
                  </div>

                  {/* Action Buttons: Cancel + Save */}
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={handleCancel}
                      className="px-3.5 py-1.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors cursor-pointer"
                    >
                      Cancel
                    </motion.button>

                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.04, translateY: -1 }}
                      whileTap={{ scale: 0.96 }}
                      disabled={!title.trim() && !content.trim()}
                      className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-soft transition-all ${
                        title.trim() || content.trim()
                          ? "bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-600 text-white shadow-indigo-600/30 cursor-pointer"
                          : "bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed"
                      }`}
                    >
                      <span>{editingNote ? "Update Note" : "Save Note"}</span>
                      <CornerDownLeft className="w-3.5 h-3.5 opacity-80" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </motion.div>
    </div>
  );
}
