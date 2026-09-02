export function formatRelativeTime(timestamp) {
  if (!timestamp) return "";
  const now = Date.now();
  const diffInMs = now - Number(timestamp);
  const diffInSec = Math.floor(diffInMs / 1000);
  const diffInMin = Math.floor(diffInSec / 60);
  const diffInHours = Math.floor(diffInMin / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInSec < 45) return "Just now";
  if (diffInMin < 60) return `${diffInMin}m ago`;
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInDays === 1) return "Yesterday";
  if (diffInDays < 7) return `${diffInDays}d ago`;

  const date = new Date(timestamp);
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: date.getFullYear() !== new Date().getFullYear() ? "numeric" : undefined,
  });
}

export function formatFullDateTime(timestamp) {
  if (!timestamp) return "";
  const date = new Date(timestamp);
  return date.toLocaleString(undefined, {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function getWordAndCharCount(text = "") {
  const trimmed = text.trim();
  const words = trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0;
  const chars = text.length;
  return { words, chars };
}
