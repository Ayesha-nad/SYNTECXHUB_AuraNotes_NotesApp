const STORAGE_KEY = "notes-app-data-v1";
const THEME_KEY = "notes-app-theme";

export const SAMPLE_NOTES = [
  {
    id: "sample-1",
    title: "✨ Welcome to AuraNotes!",
    content: "AuraNotes is designed for clarity, focus, and fluidity.\n\n• Press Ctrl + N (or Cmd + N) to jot a note anytime.\n• Tap the Pin icon to lock high-priority notes at the top.\n• Click any card to preview or edit inline.\n• Switch between light and dark mode in the header.",
    color: "butter",
    pinned: true,
    tags: ["Personal", "Ideas"],
    createdAt: Date.now() - 3600000 * 2,
    updatedAt: Date.now() - 3600000 * 2,
  },
  {
    id: "sample-2",
    title: "🎨 Design System & Animation Checklist",
    content: "1. Spring easing for card expansion\n2. Staggered grid entrance on initial load\n3. Responsive masonry columns for any screen size\n4. HSL pastel cards with soft multi-layer box shadows\n5. Smooth re-layout when filtering or pinning",
    color: "sky",
    pinned: true,
    tags: ["Project", "Work"],
    createdAt: Date.now() - 3600000 * 5,
    updatedAt: Date.now() - 3600000 * 1,
  },
  {
    id: "sample-3",
    title: "💡 Next Breakthrough Product Idea",
    content: "AI-assisted canvas for connected thoughts: dynamic mind-mapping with instant markdown export and semantic clustering. Explore integrating vector embeddings on local browser SQLite.",
    color: "lavender",
    pinned: false,
    tags: ["Ideas"],
    createdAt: Date.now() - 3600000 * 24,
    updatedAt: Date.now() - 3600000 * 24,
  },
  {
    id: "sample-4",
    title: "🌱 Daily Morning Routine",
    content: "- 10 min mindful breathing\n- Review daily priorities & pin top 3 goals\n- 45 min deep work focus sprint without notifications\n- Hydrate & light stretching",
    color: "mint",
    pinned: false,
    tags: ["Personal", "To-Do"],
    createdAt: Date.now() - 3600000 * 48,
    updatedAt: Date.now() - 3600000 * 48,
  }
];

export function loadNotes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // First-time user experience: return helpful sample notes
      saveNotes(SAMPLE_NOTES);
      return SAMPLE_NOTES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error("Failed to load notes from localStorage:", error);
    return [];
  }
}

export function saveNotes(notes) {
  try {
    if (!Array.isArray(notes)) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
  } catch (error) {
    console.error("Failed to save notes to localStorage:", error);
  }
}

export function loadTheme() {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) return saved;
    return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  } catch {
    return "light";
  }
}

export function saveTheme(theme) {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch (error) {
    console.error("Failed to save theme:", error);
  }
}
