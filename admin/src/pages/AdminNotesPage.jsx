import React, { useState, useEffect } from 'react';
import { adminNoteService } from '../services/api';
import { Pin, Trash2, Edit2, Plus, Save, X } from 'lucide-react';

export default function AdminNotesPage() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [noteText, setNoteText] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const res = await adminNoteService.getNotes();
      setNotes(res.data?.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const handleCreateNote = async (e) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    try {
      await adminNoteService.createNote({
        note_text: noteText.trim(),
        is_pinned: isPinned ? 1 : 0
      });
      setNoteText('');
      setIsPinned(false);
      fetchNotes();
    } catch (err) {
      alert('Failed to save note');
    }
  };

  const handleUpdateNote = async (e) => {
    e.preventDefault();
    if (!editingNote || !editingNote.note_text.trim()) return;
    try {
      await adminNoteService.updateNote(editingNote.id, {
        note_text: editingNote.note_text.trim(),
        is_pinned: editingNote.is_pinned ? 1 : 0
      });
      setEditingNote(null);
      fetchNotes();
    } catch (err) {
      alert('Failed to update note');
    }
  };

  const handleDeleteNote = async (id) => {
    if (window.confirm('Delete this note?')) {
      try {
        await adminNoteService.deleteNote(id);
        fetchNotes();
      } catch (err) {
        alert('Failed to delete note');
      }
    }
  };

  return (
    <div style={{ maxWidth: '800px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontFamily: '"Plus Jakarta Sans", system-ui, -apple-system, sans-serif', fontSize: '1.45rem', color: '#520612', fontWeight: 700 }}>
          Admin Remarks & General Notebook
        </h1>
        <p style={{ fontSize: '0.78rem', color: '#64748B' }}>
          Record emergency reminders, stock procurement notes, and special customer requests
        </p>
      </div>

      {/* New Note Form */}
      <form onSubmit={handleCreateNote} style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        border: '1px solid #E2E8F0',
        padding: '16px',
        marginBottom: '24px'
      }}>
        <label className="form-label" style={{ marginBottom: '8px' }}>
          Create New Remark / Reminder
        </label>
        <textarea
          rows={3}
          required
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          placeholder="e.g. Emergency delivery required for customer XYZ (+91 9829012345)..."
          className="form-input"
          style={{ resize: 'none', marginBottom: '10px' }}
        />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#334155', cursor: 'pointer' }}>
            <input
              type="checkbox"
              checked={isPinned}
              onChange={(e) => setIsPinned(e.target.checked)}
            />
            <Pin size={14} color="#C5A059" /> Pin to top
          </label>
          <button type="submit" className="btn-primary" style={{ padding: '7px 16px', fontSize: '0.80rem' }}>
            <Save size={13} /> Save Note
          </button>
        </div>
      </form>

      {/* Notes Grid */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {notes.length === 0 ? (
          <p style={{ fontSize: '0.84rem', color: '#64748B', fontStyle: 'italic' }}>No notes saved yet.</p>
        ) : (
          notes.map((nt) => (
            <div
              key={nt.id}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: '10px',
                border: nt.is_pinned ? '1.5px solid #C5A059' : '1px solid #E2E8F0',
                padding: '14px',
                boxShadow: nt.is_pinned ? '0 2px 8px rgba(197, 160, 89, 0.15)' : 'none',
                position: 'relative'
              }}
            >
              {nt.is_pinned && (
                <div style={{ position: 'absolute', top: '10px', right: '12px', display: 'flex', alignItems: 'center', gap: '4px', color: '#C5A059', fontSize: '0.70rem', fontWeight: 700 }}>
                  <Pin size={12} /> PINNED
                </div>
              )}

              <p style={{ fontSize: '0.84rem', color: '#0F172A', lineHeight: 1.5, marginBottom: '10px', whiteSpace: 'pre-wrap' }}>
                {nt.note_text}
              </p>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #F1F5F9', paddingTop: '8px' }}>
                <span style={{ fontSize: '0.70rem', color: '#94A3B8' }}>
                  Recorded: {nt.formatted_created}
                </span>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => setEditingNote({ ...nt })}
                    style={{ background: 'none', border: 'none', color: '#64748B', cursor: 'pointer' }}
                  >
                    <Edit2 size={14} />
                  </button>
                  <button
                    onClick={() => handleDeleteNote(nt.id)}
                    style={{ background: 'none', border: 'none', color: '#991B1B', cursor: 'pointer' }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Edit Note Modal */}
      {editingNote && (
        <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(15,23,42,0.6)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
          <div style={{ backgroundColor: '#FFFFFF', borderRadius: '12px', width: '100%', maxWidth: '440px', padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#520612' }}>Edit Note</h3>
              <button onClick={() => setEditingNote(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleUpdateNote}>
              <textarea
                rows={4}
                required
                value={editingNote.note_text}
                onChange={(e) => setEditingNote({ ...editingNote, note_text: e.target.value })}
                className="form-input"
                style={{ resize: 'none', marginBottom: '10px' }}
              />
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', marginBottom: '14px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={Boolean(editingNote.is_pinned)}
                  onChange={(e) => setEditingNote({ ...editingNote, is_pinned: e.target.checked })}
                />
                Pin to top
              </label>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <button type="button" onClick={() => setEditingNote(null)} className="btn-secondary">Cancel</button>
                <button type="submit" className="btn-primary">Update Note</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
