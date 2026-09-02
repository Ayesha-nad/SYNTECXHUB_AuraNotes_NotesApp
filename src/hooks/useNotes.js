import { useState, useEffect, useMemo } from "react";
import { loadNotes, saveNotes, SAMPLE_NOTES } from "../utils/localStorage";

export function useNotes() {
  const [notes, setNotes] = useState(() => loadNotes());
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTag, setSelectedTag] = useState("all");
  const [selectedColorFilter, setSelectedColorFilter] = useState("all");
  const [sortBy, setSortBy] = useState("pinned-first"); // 'pinned-first' | 'newest' | 'oldest' | 'alphabetical'
  const [lastSavedId, setLastSavedId] = useState(null);

  // Sync to localStorage
  useEffect(() => {
    saveNotes(notes);
  }, [notes]);

  // Add Note
  const addNote = (newNoteData) => {
    const id = typeof crypto !== "undefined" && crypto.randomUUID 
      ? crypto.randomUUID() 
      : `note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const newNote = {
      id,
      title: (newNoteData.title || "").trim(),
      content: (newNoteData.content || "").trim(),
      color: newNoteData.color || "default",
      pinned: Boolean(newNoteData.pinned),
      tags: Array.isArray(newNoteData.tags) ? newNoteData.tags : [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    setNotes((prev) => [newNote, ...prev]);
    setLastSavedId(id);
    return id;
  };

  // Update Note
  const updateNote = (id, updates) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id
          ? {
              ...note,
              ...updates,
              title: updates.title !== undefined ? updates.title.trim() : note.title,
              content: updates.content !== undefined ? updates.content.trim() : note.content,
              updatedAt: Date.now(),
            }
          : note
      )
    );
    setLastSavedId(id);
  };

  // Delete Note
  const deleteNote = (id) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
  };

  // Toggle Pin
  const togglePin = (id) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id ? { ...note, pinned: !note.pinned, updatedAt: Date.now() } : note
      )
    );
  };

  // Duplicate Note
  const duplicateNote = (id) => {
    const original = notes.find((n) => n.id === id);
    if (!original) return null;

    const newId = typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const duplicated = {
      ...original,
      id: newId,
      title: original.title ? `${original.title} (Copy)` : "Untitled (Copy)",
      pinned: false,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    setNotes((prev) => [duplicated, ...prev]);
    setLastSavedId(newId);
    return newId;
  };

  // Restore Default Sample Notes
  const restoreSamples = () => {
    setNotes(SAMPLE_NOTES);
  };

  // Clear All Notes
  const clearAllNotes = () => {
    setNotes([]);
  };

  // Import Notes
  const importNotes = (importedList) => {
    if (!Array.isArray(importedList)) return false;
    const validated = importedList.map((item, idx) => ({
      id: item.id || `imported-${Date.now()}-${idx}`,
      title: item.title || "",
      content: item.content || "",
      color: item.color || "default",
      pinned: Boolean(item.pinned),
      tags: Array.isArray(item.tags) ? item.tags : [],
      createdAt: item.createdAt || Date.now(),
      updatedAt: item.updatedAt || Date.now(),
    }));

    setNotes((prev) => {
      // Merge unique by ID
      const existingIds = new Set(prev.map((n) => n.id));
      const fresh = validated.filter((n) => !existingIds.has(n.id));
      return [...fresh, ...prev];
    });
    return true;
  };

  // Compute all unique tags
  const allTags = useMemo(() => {
    const tagsSet = new Set();
    notes.forEach((n) => {
      if (Array.isArray(n.tags)) {
        n.tags.forEach((t) => tagsSet.add(t));
      }
    });
    return Array.from(tagsSet);
  }, [notes]);

  // Filtered and Sorted Notes
  const filteredNotes = useMemo(() => {
    return notes
      .filter((note) => {
        // Search term filter
        if (searchTerm.trim()) {
          const query = searchTerm.toLowerCase();
          const matchTitle = (note.title || "").toLowerCase().includes(query);
          const matchContent = (note.content || "").toLowerCase().includes(query);
          const matchTags = (note.tags || []).some((t) => t.toLowerCase().includes(query));
          if (!matchTitle && !matchContent && !matchTags) return false;
        }

        // Tag filter
        if (selectedTag !== "all") {
          if (!note.tags || !note.tags.includes(selectedTag)) return false;
        }

        // Color filter
        if (selectedColorFilter !== "all") {
          if ((note.color || "default") !== selectedColorFilter) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === "pinned-first") {
          if (a.pinned && !b.pinned) return -1;
          if (!a.pinned && b.pinned) return 1;
          return (b.updatedAt || b.createdAt) - (a.updatedAt || a.createdAt);
        }
        if (sortBy === "newest") {
          return (b.createdAt || 0) - (a.createdAt || 0);
        }
        if (sortBy === "oldest") {
          return (a.createdAt || 0) - (b.createdAt || 0);
        }
        if (sortBy === "alphabetical") {
          const titleA = (a.title || a.content || "").toLowerCase();
          const titleB = (b.title || b.content || "").toLowerCase();
          return titleA.localeCompare(titleB);
        }
        return 0;
      });
  }, [notes, searchTerm, selectedTag, selectedColorFilter, sortBy]);

  const pinnedNotes = useMemo(
    () => filteredNotes.filter((n) => n.pinned),
    [filteredNotes]
  );
  const otherNotes = useMemo(
    () => filteredNotes.filter((n) => !n.pinned),
    [filteredNotes]
  );

  return {
    notes,
    filteredNotes,
    pinnedNotes,
    otherNotes,
    allTags,
    totalCount: notes.length,
    pinnedCount: notes.filter((n) => n.pinned).length,
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
    clearAllNotes,
    importNotes,
  };
}
