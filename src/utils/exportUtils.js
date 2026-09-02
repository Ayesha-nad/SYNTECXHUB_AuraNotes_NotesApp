export function exportSingleNote(note, format = "txt") {
  const dateStr = new Date(note.updatedAt || note.createdAt).toISOString().split("T")[0];
  const safeTitle = (note.title || "Untitled_Note").replace(/[^a-z0-9_-]/gi, "_").toLowerCase();
  const filename = `${safeTitle}_${dateStr}.${format}`;

  let content = "";
  if (format === "md") {
    content = `# ${note.title || "Untitled"}\n\n`;
    if (note.tags?.length) {
      content += `*Tags: ${note.tags.join(", ")}*\n`;
    }
    content += `*Last updated: ${new Date(note.updatedAt || note.createdAt).toLocaleString()}*\n\n---\n\n`;
    content += note.content || "";
  } else {
    content = `TITLE: ${note.title || "Untitled"}\n`;
    content += `DATE: ${new Date(note.updatedAt || note.createdAt).toLocaleString()}\n`;
    if (note.tags?.length) content += `TAGS: ${note.tags.join(", ")}\n`;
    content += `\n----------------------------------------\n\n`;
    content += note.content || "";
  }

  downloadFile(content, filename, format === "md" ? "text/markdown" : "text/plain");
}

export function exportAllNotesJSON(notes) {
  const dateStr = new Date().toISOString().split("T")[0];
  const filename = `auranotes_backup_${dateStr}.json`;
  const dataStr = JSON.stringify(notes, null, 2);
  downloadFile(dataStr, filename, "application/json");
}

export function exportAllNotesTXT(notes) {
  const dateStr = new Date().toISOString().split("T")[0];
  const filename = `auranotes_export_${dateStr}.txt`;
  
  let output = `AURANOTES BACKUP - ${new Date().toLocaleString()}\nTotal Notes: ${notes.length}\n`;
  output += `=====================================================\n\n`;

  notes.forEach((note, index) => {
    output += `[Note ${index + 1}] ${note.title || "Untitled"}\n`;
    output += `Color: ${note.color || "default"} | Pinned: ${note.pinned ? "Yes" : "No"}\n`;
    if (note.tags?.length) output += `Tags: ${note.tags.join(", ")}\n`;
    output += `Updated: ${new Date(note.updatedAt || note.createdAt).toLocaleString()}\n`;
    output += `-----------------------------------------------------\n`;
    output += `${note.content || ""}\n\n`;
    output += `=====================================================\n\n`;
  });

  downloadFile(output, filename, "text/plain");
}

function downloadFile(content, filename, contentType) {
  const blob = new Blob([content], { type: `${contentType};charset=utf-8;` });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
