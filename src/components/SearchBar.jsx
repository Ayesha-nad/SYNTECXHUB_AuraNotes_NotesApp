import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Search, 
  X, 
  ArrowUpDown, 
  Tag as TagIcon, 
  Palette
} from "lucide-react";
import { NOTE_COLORS } from "../constants/colors";

export default function SearchBar({
  searchTerm,
  setSearchTerm,
  selectedTag,
  setSelectedTag,
  selectedColorFilter,
  setSelectedColorFilter,
  sortBy,
  setSortBy,
  allTags,
  totalNotes,
  filteredCount,
}) {
  const searchInputRef = useRef(null);

  // Global shortcut to focus search input (Cmd/Ctrl + K or '/')
  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      } else if (
        e.key === "/" &&
        document.activeElement?.tagName !== "INPUT" &&
        document.activeElement?.tagName !== "TEXTAREA"
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const hasActiveFilters = Boolean(searchTerm || selectedTag !== "all" || selectedColorFilter !== "all");

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedTag("all");
    setSelectedColorFilter("all");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: 0.1 }}
      className="w-full space-y-3.5 mb-8"
    >
      {/* Search Input Row & Sort Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        {/* Main Search Input */}
        <div className="relative flex-1 group">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 dark:text-slate-500 group-focus-within:text-indigo-500 transition-colors">
            <Search className="w-4 h-4" />
          </div>
          <input
            ref={searchInputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search notes by title, content, or tags... (⌘K)"
            className="w-full pl-10 pr-20 py-2.5 rounded-2xl bg-white/90 dark:bg-[#141B2D]/90 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 text-sm font-medium shadow-soft-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 transition-all"
          />

          <div className="absolute inset-y-0 right-0 pr-2.5 flex items-center gap-1.5">
            <AnimatePresence>
              {searchTerm && (
                <motion.button
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  whileHover={{ scale: 1.15 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSearchTerm("")}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                  aria-label="Clear search text"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              )}
            </AnimatePresence>
            <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-0.5 text-[11px] font-mono text-slate-400 dark:text-slate-500 bg-slate-100 dark:bg-slate-800/80 rounded-md border border-slate-200/60 dark:border-slate-700/60">
              <span className="text-[10px]">⌘</span>K
            </kbd>
          </div>
        </div>

        {/* Sort Select */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          className="relative shrink-0 flex items-center"
        >
          <div className="absolute left-3 pointer-events-none text-slate-400">
            <ArrowUpDown className="w-3.5 h-3.5" />
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="pl-8 pr-8 py-2.5 rounded-2xl bg-white/90 dark:bg-[#141B2D]/90 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800 text-slate-800 dark:text-slate-200 text-xs font-semibold shadow-soft-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 dark:focus:border-indigo-400 cursor-pointer appearance-none transition-all"
          >
            <option value="pinned-first">📌 Pinned First</option>
            <option value="newest">🕒 Newest First</option>
            <option value="oldest">⏳ Oldest First</option>
            <option value="alphabetical">🔤 Title (A to Z)</option>
          </select>
        </motion.div>
      </div>

      {/* Filter Chips Bar (Tags + Color Filters + Results feedback) */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
        {/* Tags Filter Chips with sliding animated pill */}
        <div className="relative flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full scrollbar-none p-1 rounded-2xl bg-slate-200/40 dark:bg-slate-900/40 backdrop-blur-md">
          {/* "All Notes" button */}
          <button
            onClick={() => setSelectedTag("all")}
            className={`relative px-3 py-1 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer z-10 ${
              selectedTag === "all"
                ? "text-white dark:text-white"
                : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
            }`}
          >
            {selectedTag === "all" && (
              <motion.div
                layoutId="activeFilterPill"
                className="absolute inset-0 rounded-xl bg-slate-900 dark:bg-indigo-600 shadow-soft-sm -z-10"
                transition={{ type: "spring", stiffness: 450, damping: 30 }}
              />
            )}
            All Notes ({totalNotes})
          </button>

          {allTags.map((tag) => {
            const isSelected = selectedTag === tag;
            return (
              <button
                key={tag}
                onClick={() => setSelectedTag(isSelected ? "all" : tag)}
                className={`relative px-3 py-1 rounded-xl text-xs font-semibold transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer z-10 ${
                  isSelected
                    ? "text-white dark:text-white"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white"
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="activeFilterPill"
                    className="absolute inset-0 rounded-xl bg-indigo-600 shadow-soft shadow-indigo-600/30 -z-10"
                    transition={{ type: "spring", stiffness: 450, damping: 30 }}
                  />
                )}
                <TagIcon className="w-3 h-3 opacity-70" />
                <span>{tag}</span>
              </button>
            );
          })}
        </div>

        {/* Color Palette Filters & Clear Indicator */}
        <div className="flex items-center gap-2 ml-auto">
          <div className="flex items-center gap-1 bg-white/90 dark:bg-[#141B2D]/90 backdrop-blur-md px-2 py-1 rounded-xl border border-slate-200/80 dark:border-slate-800 shadow-soft-sm">
            <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500 mr-1 flex items-center gap-1">
              <Palette className="w-3 h-3" />
            </span>
            <motion.button
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setSelectedColorFilter("all")}
              title="All colors"
              className={`w-4 h-4 rounded-full border transition-transform cursor-pointer ${
                selectedColorFilter === "all"
                  ? "ring-2 ring-indigo-500 scale-110 bg-slate-300 dark:bg-slate-600 border-transparent"
                  : "bg-transparent border-slate-300 dark:border-slate-600 hover:scale-105"
              }`}
            />
            {NOTE_COLORS.filter((c) => c.id !== "default").map((c) => (
              <motion.button
                key={c.id}
                whileHover={{ scale: 1.3 }}
                whileTap={{ scale: 0.9 }}
                onClick={() =>
                  setSelectedColorFilter(selectedColorFilter === c.id ? "all" : c.id)
                }
                title={c.name}
                style={{ backgroundColor: c.swatch }}
                className={`w-4 h-4 rounded-full border border-black/10 dark:border-white/20 transition-all cursor-pointer ${
                  selectedColorFilter === c.id
                    ? "ring-2 ring-indigo-500 scale-125 shadow-soft"
                    : "opacity-80 hover:opacity-100"
                }`}
              />
            ))}
          </div>

          {hasActiveFilters && (
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={clearAllFilters}
              className="text-xs font-bold text-rose-500 hover:text-rose-600 dark:text-rose-400 hover:underline px-2.5 py-1 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200/60 dark:border-rose-900/60 transition-colors cursor-pointer shadow-soft-sm"
            >
              Reset filters
            </motion.button>
          )}
        </div>
      </div>

      {/* Filter match count indicator when active */}
      <AnimatePresence>
        {hasActiveFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between px-1 pt-1"
          >
            <span>
              Showing <strong className="text-slate-800 dark:text-slate-200 font-bold">{filteredCount}</strong> of {totalNotes} notes
              {searchTerm && <span> matching "<em>{searchTerm}</em>"</span>}
              {selectedTag !== "all" && <span> with tag <strong className="text-indigo-600 dark:text-indigo-400">#{selectedTag}</strong></span>}
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
