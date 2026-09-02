import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Pin, Layers } from "lucide-react";
import NoteCard from "./NoteCard";
import EmptyState from "./EmptyState";

export default function NoteList({
  filteredNotes,
  pinnedNotes,
  otherNotes,
  sortBy,
  onEdit,
  onDeleteRequest,
  onTogglePin,
  onDuplicate,
  onViewNote,
  lastSavedId,
  hasActiveFilters,
  onResetFilters,
  onFocusNewNote,
}) {
  if (filteredNotes.length === 0) {
    return (
      <EmptyState
        hasActiveFilters={hasActiveFilters}
        onResetFilters={onResetFilters}
        onFocusNewNote={onFocusNewNote}
      />
    );
  }

  // If sort is 'pinned-first' and there are pinned notes, separate into Pinned and Other sections
  const showSeparatedSections = sortBy === "pinned-first" && pinnedNotes.length > 0 && otherNotes.length > 0;

  return (
    <div className="w-full space-y-6 sm:space-y-10">
      {showSeparatedSections ? (
        <>
          {/* Pinned Notes Section */}
          <section className="space-y-3 sm:space-y-4 w-full">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 px-0.5">
              <Pin className="w-3.5 h-3.5 fill-current rotate-45" />
              <span>Pinned Notes ({pinnedNotes.length})</span>
            </div>
            
            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-5 w-full"
            >
              <AnimatePresence mode="popLayout">
                {pinnedNotes.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    onEdit={onEdit}
                    onDeleteRequest={onDeleteRequest}
                    onTogglePin={onTogglePin}
                    onDuplicate={onDuplicate}
                    onViewNote={onViewNote}
                    isRecentlySaved={lastSavedId === note.id}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          </section>

          {/* Other Notes Section */}
          <section className="space-y-3 sm:space-y-4 pt-4 sm:pt-6 border-t border-slate-200/60 dark:border-slate-800/60 w-full">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 px-0.5">
              <Layers className="w-3.5 h-3.5" />
              <span>Other Notes ({otherNotes.length})</span>
            </div>

            <motion.div
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-5 w-full"
            >
              <AnimatePresence mode="popLayout">
                {otherNotes.map((note) => (
                  <NoteCard
                    key={note.id}
                    note={note}
                    onEdit={onEdit}
                    onDeleteRequest={onDeleteRequest}
                    onTogglePin={onTogglePin}
                    onDuplicate={onDuplicate}
                    onViewNote={onViewNote}
                    isRecentlySaved={lastSavedId === note.id}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          </section>
        </>
      ) : (
        /* Unified Grid for other sort modes or when all/none are pinned */
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 sm:gap-5 w-full"
        >
          <AnimatePresence mode="popLayout">
            {filteredNotes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onEdit={onEdit}
                onDeleteRequest={onDeleteRequest}
                onTogglePin={onTogglePin}
                onDuplicate={onDuplicate}
                onViewNote={onViewNote}
                isRecentlySaved={lastSavedId === note.id}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
