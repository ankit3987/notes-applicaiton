import React, { useEffect, useState } from 'react';
import API from '../api';
import NoteForm from './NoteForm';

export default function Notes() {
  const [notes, setNotes] = useState([]);
  const [editing, setEditing] = useState(null);

  const fetchNotes = async () => {
    const res = await API.get('/notes');
    setNotes(res.data);
  };

  useEffect(()=>{ fetchNotes(); }, []);

  async function addNote(note) {
    await API.post('/notes', note);
    fetchNotes();
  }
  async function deleteNote(id) {
    await API.delete(`/notes/${id}`);
    fetchNotes();
  }
  async function updateNote(note) {
    await API.put(`/notes/${editing._id}`, note);
    setEditing(null);
    fetchNotes();
  }

  return (
    <>
      <NoteForm onSubmit={editing ? updateNote : addNote} note={editing} />
      <div className="notes-list">
        {notes.map(note =>
          <div className="note-card" key={note._id}>
            <div className="note-title">{note.title}</div>
            <div className="note-date">{new Date(note.date).toLocaleString()}</div>
            <div>{note.content}</div>
            <button className="edit-btn" onClick={()=>setEditing(note)}>Edit</button>
            <button className="delete-btn" onClick={()=>deleteNote(note._id)}>Delete</button>
          </div>
        )}
      </div>
    </>
  )
}
