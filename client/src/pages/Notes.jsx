import React, { useEffect, useState } from "react";
import {
  getNotes,
  createNote,
  deleteNote,
  upgradeTenant,
  getMe,
  getTenantBySlug,
  updateNote
} from "../services/api";
import NoteCard from "../components/NoteCard";

export default function Notes({ me, onUpdateMe }) {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [tenantInfo, setTenantInfo] = useState(null);


  async function loadNotes() {
    setLoading(true);
    try {
      const data = await getNotes();
      setNotes(Array.isArray(data) ? data : data.notes || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load notes");
    } finally {
      setLoading(false);
    }
  }

  function handleUpdate(id, data) {
  return updateNote(id, data).then(() => loadNotes());
}

  useEffect(() => {
    if (me?.tenant) {
      getTenantBySlug(me.tenant)
        .then((info) => setTenantInfo(info))
        .catch(() => setTenantInfo(null));
    }
  }, [me]);

  useEffect(() => {
    loadNotes();
  }, []);

  async function handleCreate(e) {
    e.preventDefault();
    setError(null);
    try {
      await createNote({ title, content });
      setTitle("");
      setContent("");
      await loadNotes();
    } catch (err) {
      setError(err?.response?.data?.message || "Create failed");
    }
  }

  async function handleDelete(id) {
    if (!confirm("Delete this note?")) return;
    await deleteNote(id);
    await loadNotes();
  }

  async function handleUpgrade() {
    if (!me) return;
    const slug = me.email.split("@")[1].split(".")[0];
    try {
      await upgradeTenant(slug);
      await loadNotes();
      const updated = await getMe();
      onUpdateMe && onUpdateMe(updated);
      alert("Upgraded to Pro");
    } catch (err) {
      console.error(err);
      alert("Upgrade failed");
    }
  }

  const tenantPlan = tenantInfo?.plan || "free";
  const reachedLimit = tenantPlan === "free" && notes.length >= 3;

  return loading ? (
    <div className="flex justify-center items-center h-40">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-slate-800"></div>
    </div>
  ) : (
    <div>
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Your notes</h2>
        <p className="text-sm text-slate-600">
          Tenant: {me?.tenant?.slug || me?.email?.split("@")[1]?.split(".")[0]}
        </p>
      </div>

      {reachedLimit && (
        <div className="mb-4 p-4 border-l-4 border-yellow-400 bg-yellow-50 rounded">
          <div className="flex justify-between items-center">
            <div>
              <strong>Free plan limit reached.</strong>
              <div className="text-sm">
                You can keep up to 3 notes on the Free plan.
              </div>
            </div>
            <div>
              {me?.role === "admin" ? (
                <button
                  onClick={handleUpgrade}
                  className="px-3 py-1 bg-slate-800 text-white rounded"
                >
                  Upgrade to Pro
                </button>
              ) : (
                <div className="text-sm">Ask your Admin to upgrade.</div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="max-w-xl bg-white p-4 rounded shadow mb-10">
        <h3 className="font-semibold mb-2">Create a note</h3>
        <form onSubmit={handleCreate} className="space-y-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="Title"
            required
          />
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="Content"
            rows={4}
            required
          />
          <div>
            <button
              disabled={reachedLimit}
              className="px-4 py-2 bg-slate-800 text-white rounded"
            >
              Create
            </button>
            {reachedLimit && (
              <span className="ml-3 text-sm text-slate-600">
                Upgrade to create more notes.
              </span>
            )}
          </div>
        </form>
        {error && <div className="text-sm text-red-600 mt-2">{error}</div>}
      </div>


      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {notes.map((n) => (
          <NoteCard
            key={n.id || n._id}
            note={{ id: n.id || n._id, title: n.title, content: n.content }}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
          />
        ))}
      </div>


    </div>
  );
}
