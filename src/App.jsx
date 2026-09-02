import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Plus } from "lucide-react";
import Header from "./components/Header";
import SearchBar from "./components/SearchBar";
import NoteForm from "./components/NoteForm";
import NoteList from "./components/NoteList";
import ConfirmDialog from "./components/ConfirmDialog";
import ViewNoteModal from "./components/ViewNoteModal";
import { ToastProvider, useToast } from "./components/Toast";
import { useNotes } from "./hooks/useNotes";
import { useTheme } from "./hooks/useTheme";

function MainApp() {
  const { theme, toggleTheme } = useTheme();
  const {
    notes,
    filteredNotes,
    pinnedNotes,
    otherNotes,
    allTags,
    totalCount,
    pinnedCount,
    searchTerm,
    setSearchTerm,
    selectedTag,
    setSelectedTag,
    selectedColorFilter,
    setSelectedColorFilter,
    sortBy,
    setSortBy,
    lastSavedId,
    addNote,
    updateNote,
    deleteNote,
    togglePin,
    duplicateNote,
    restoreSamples,
    importNotes,
  } = useNotes();

  const [editingNote, setEditingNote] = useState(null);
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [viewingNote, setViewingNote] = useState(null);
  const [formFocusTrigger, setFormFocusTrigger] = useState(0);

  const { showSuccess } = useToast();

  // Keyboard shortcut Ctrl+N / Cmd+N to focus note creation
  useEffect(() => {
    function handleKeyDown(e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "n") {
        e.preventDefault();
        setEditingNote(null);
        setFormFocusTrigger((prev) => prev + 1);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleEditNote = (note) => {
    setEditingNote(note);
    setViewingNote(null);
  };

  const handleCancelEdit = () => {
    setEditingNote(null);
  };

  const handleDeleteRequest = (note) => {
    setNoteToDelete(note);
  };

  const handleConfirmDelete = () => {
    if (noteToDelete) {
      deleteNote(noteToDelete.id);
      showSuccess(`Deleted "${noteToDelete.title || "Untitled note"}"`);
      if (viewingNote?.id === noteToDelete.id) {
        setViewingNote(null);
      }
      if (editingNote?.id === noteToDelete.id) {
        setEditingNote(null);
      }
      setNoteToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setNoteToDelete(null);
  };

  const handleFocusNewNote = () => {
    setEditingNote(null);
    setFormFocusTrigger((prev) => prev + 1);
  };

  const hasActiveFilters = Boolean(
    searchTerm || selectedTag !== "all" || selectedColorFilter !== "all"
  );

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedTag("all");
    setSelectedColorFilter("all");
  };

  return (
    <div className="relative min-h-screen w-full max-w-full bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 bg-dot-pattern transition-colors duration-500 flex flex-col overflow-x-hidden">
      {/* Ambient background animated blur orbs */}
      <div className="ambient-glow-1" />
      <div className="ambient-glow-2" />

      {/* Sticky Header */}
      <Header
        theme={theme}
        toggleTheme={toggleTheme}
        notes={notes}
        pinnedCount={pinnedCount}
        onRestoreSamples={restoreSamples}
        onImportNotes={importNotes}
        onFocusNewNote={handleFocusNewNote}
      />

      {/* Main Content Area - exact full fit on mobile without cuts */}
      <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Expandable Note Creator / Inline Editor */}
        <NoteForm
          onAddNote={addNote}
          onUpdateNote={updateNote}
          editingNote={editingNote}
          onCancelEdit={handleCancelEdit}
          formFocusTrigger={formFocusTrigger}
        />

        {/* Live Search, Tag Filters, Color Filters & Sorter */}
        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedTag={selectedTag}
          setSelectedTag={setSelectedTag}
          selectedColorFilter={selectedColorFilter}
          setSelectedColorFilter={setSelectedColorFilter}
          sortBy={sortBy}
          setSortBy={setSortBy}
          allTags={allTags}
          totalNotes={totalCount}
          filteredCount={filteredNotes.length}
        />

        {/* Notes Grid with Animation */}
        <NoteList
          filteredNotes={filteredNotes}
          pinnedNotes={pinnedNotes}
          otherNotes={otherNotes}
          sortBy={sortBy}
          onEdit={handleEditNote}
          onDeleteRequest={handleDeleteRequest}
          onTogglePin={togglePin}
          onDuplicate={duplicateNote}
          onViewNote={setViewingNote}
          lastSavedId={lastSavedId}
          hasActiveFilters={hasActiveFilters}
          onResetFilters={handleResetFilters}
          onFocusNewNote={handleFocusNewNote}
        />
      </main>

      {/* Floating Action Button (for mobile quick add) */}
      <div className="fixed bottom-5 right-4 z-30 sm:hidden">
        <motion.button
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.9 }}
          onClick={handleFocusNewNote}
          className="w-13 h-13 rounded-full bg-gradient-to-tr from-indigo-600 to-indigo-500 text-white shadow-soft-xl flex items-center justify-center border-2 border-white dark:border-slate-800 cursor-pointer shadow-indigo-600/40"
          aria-label="Create note"
        >
          <Plus className="w-6 h-6" />
        </motion.button>
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={Boolean(noteToDelete)}
        noteToDelete={noteToDelete}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />

      {/* Full Note View / Inspect Modal */}
      <ViewNoteModal
        isOpen={Boolean(viewingNote)}
        note={viewingNote}
        onClose={() => setViewingNote(null)}
        onEdit={handleEditNote}
        onDeleteRequest={handleDeleteRequest}
        onTogglePin={togglePin}
      />

      {/* Minimal Footer */}
      <footer className="relative z-10 mt-auto py-4 sm:py-6 border-t border-slate-200/60 dark:border-slate-800/60 text-center text-[11px] sm:text-xs text-slate-400 dark:text-slate-500 font-medium px-3">
        <p>AuraNotes — Built with React, Tailwind CSS & Framer Motion. Data stored locally.</p>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <ToastProvider>
      <MainApp />
    </ToastProvider>
  );
}
