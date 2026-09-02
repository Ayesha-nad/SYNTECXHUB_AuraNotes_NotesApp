// Curated pastel color palette matching Notion / Apple Notes aesthetic
export const NOTE_COLORS = [
  {
    id: 'default',
    name: 'Default',
    swatch: '#FFFFFF',
    light: {
      cardBg: 'bg-white',
      border: 'border-slate-200/80 hover:border-slate-300',
      badgeBg: 'bg-slate-100 text-slate-700',
      accent: 'border-l-indigo-500',
      glow: 'shadow-slate-200/50',
    },
    dark: {
      cardBg: 'bg-[#161D2F]',
      border: 'border-slate-800 hover:border-slate-700',
      badgeBg: 'bg-slate-800 text-slate-300',
      accent: 'border-l-indigo-400',
      glow: 'shadow-black/40',
    },
  },
  {
    id: 'butter',
    name: 'Butter Yellow',
    swatch: '#FEF3C7',
    light: {
      cardBg: 'bg-[#FFFBEB]',
      border: 'border-amber-200/80 hover:border-amber-300',
      badgeBg: 'bg-amber-100/90 text-amber-900',
      accent: 'border-l-amber-400',
      glow: 'shadow-amber-200/40',
    },
    dark: {
      cardBg: 'bg-[#292212]',
      border: 'border-amber-900/60 hover:border-amber-800',
      badgeBg: 'bg-amber-950/80 text-amber-300',
      accent: 'border-l-amber-400',
      glow: 'shadow-amber-950/40',
    },
  },
  {
    id: 'sky',
    name: 'Sky Blue',
    swatch: '#DBEAFE',
    light: {
      cardBg: 'bg-[#F0F7FF]',
      border: 'border-blue-200/80 hover:border-blue-300',
      badgeBg: 'bg-blue-100/90 text-blue-900',
      accent: 'border-l-blue-400',
      glow: 'shadow-blue-200/40',
    },
    dark: {
      cardBg: 'bg-[#132238]',
      border: 'border-blue-900/60 hover:border-blue-800',
      badgeBg: 'bg-blue-950/80 text-blue-300',
      accent: 'border-l-blue-400',
      glow: 'shadow-blue-950/40',
    },
  },
  {
    id: 'blush',
    name: 'Blush Pink',
    swatch: '#FCE7F3',
    light: {
      cardBg: 'bg-[#FFF1F6]',
      border: 'border-pink-200/80 hover:border-pink-300',
      badgeBg: 'bg-pink-100/90 text-pink-900',
      accent: 'border-l-pink-400',
      glow: 'shadow-pink-200/40',
    },
    dark: {
      cardBg: 'bg-[#2D1625]',
      border: 'border-pink-900/60 hover:border-pink-800',
      badgeBg: 'bg-pink-950/80 text-pink-300',
      accent: 'border-l-pink-400',
      glow: 'shadow-pink-950/40',
    },
  },
  {
    id: 'mint',
    name: 'Fresh Mint',
    swatch: '#D1FAE5',
    light: {
      cardBg: 'bg-[#F0FDF4]',
      border: 'border-emerald-200/80 hover:border-emerald-300',
      badgeBg: 'bg-emerald-100/90 text-emerald-900',
      accent: 'border-l-emerald-400',
      glow: 'shadow-emerald-200/40',
    },
    dark: {
      cardBg: 'bg-[#10281F]',
      border: 'border-emerald-900/60 hover:border-emerald-800',
      badgeBg: 'bg-emerald-950/80 text-emerald-300',
      accent: 'border-l-emerald-400',
      glow: 'shadow-emerald-950/40',
    },
  },
  {
    id: 'lavender',
    name: 'Lavender Purple',
    swatch: '#EDE9FE',
    light: {
      cardBg: 'bg-[#FAF5FF]',
      border: 'border-purple-200/80 hover:border-purple-300',
      badgeBg: 'bg-purple-100/90 text-purple-900',
      accent: 'border-l-purple-400',
      glow: 'shadow-purple-200/40',
    },
    dark: {
      cardBg: 'bg-[#241738]',
      border: 'border-purple-900/60 hover:border-purple-800',
      badgeBg: 'bg-purple-950/80 text-purple-300',
      accent: 'border-l-purple-400',
      glow: 'shadow-purple-950/40',
    },
  },
  {
    id: 'peach',
    name: 'Warm Peach',
    swatch: '#FFEDD5',
    light: {
      cardBg: 'bg-[#FFF7ED]',
      border: 'border-orange-200/80 hover:border-orange-300',
      badgeBg: 'bg-orange-100/90 text-orange-900',
      accent: 'border-l-orange-400',
      glow: 'shadow-orange-200/40',
    },
    dark: {
      cardBg: 'bg-[#2C1910]',
      border: 'border-orange-900/60 hover:border-orange-800',
      badgeBg: 'bg-orange-950/80 text-orange-300',
      accent: 'border-l-orange-400',
      glow: 'shadow-orange-950/40',
    },
  },
];

export const getColorConfig = (colorId = 'default') => {
  return NOTE_COLORS.find(c => c.id === colorId) || NOTE_COLORS[0];
};

export const DEFAULT_TAGS = [
  'Work',
  'Personal',
  'Ideas',
  'Study',
  'To-Do',
  'Project',
];
