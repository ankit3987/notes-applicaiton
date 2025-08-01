import React, { useState } from 'react';

export default function NoteForm({ onSubmit, note }) {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, content });
    setTitle('');
    setContent('');
  };
  return (
    <form onSubmit={handleSubmit} className="form-container" style={{marginBottom: 24}}>
      <input type="text" placeholder="Note title" value={title} onChange={e=>setTitle(e.target.value)} required />
      <textarea rows={4} placeholder="Note content" value={content} onChange={e=>setContent(e.target.value)} required />
      <button type="submit">{note ? 'Update' : 'Add'} Note</button>
    </form>
  );
}
