import React, { useState } from "react";

export default function NoteCard({ note, onDelete, onUpdate }) {
  const [expanded, setExpanded] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(note.title);
  const [editedContent, setEditedContent] = useState(note.content);

  const previewLimit = 50;
  const isLong = note.content.length > previewLimit;
  const displayContent = expanded
    ? note.content
    : note.content.slice(0, previewLimit) + (isLong ? "..." : "");

  async function handleSave() {
    try {
      await onUpdate(note.id, { title: editedTitle, content: editedContent });
      setEditing(false);
    } catch (err) {
      console.error("Update failed:", err);
    }
  }

  return (
    <div className="border rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          {editing ? (
            <>
              <input
                type="text"
                className="w-full border rounded px-2 py-1 mb-2"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
              />
              <textarea
                className="w-full border rounded px-2 py-1 mb-2"
                rows={10}
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-500 transition"
                >
                  Save
                </button>
                <button
                  onClick={() => setEditing(false)}
                  className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <h3 className="font-semibold text-lg text-slate-800 mb-1">{note.title}</h3>
              <p className="text-sm text-slate-600 whitespace-pre-wrap">{displayContent}</p>
              {isLong && (
                <button
                  className="mt-2 text-xs text-indigo-600 hover:underline"
                  onClick={() => setExpanded(!expanded)}
                >
                  {expanded ? "Show less" : "Read more"}
                </button>
              )}
            </>
          )}
        </div>

        <div className="flex gap-2 ml-3 flex-col">
          {!editing && (
            <button
              onClick={() => setEditing(true)}
              className="px-2 py-1 text-xs bg-blue-100 text-blue-600 border border-blue-200 rounded hover:bg-blue-200 transition"
            >
              Edit
            </button>
          )}
          <button
            onClick={() => onDelete(note.id)}
            className="px-2 py-1 text-xs bg-red-100 text-red-600 border border-red-200 rounded hover:bg-red-200 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
