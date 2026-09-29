import { useEffect, useState } from "react";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL || "";

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  const fetchNotes = async () => {
    try {
      const response = await fetch(`${API_URL}/api/notes`);

      if (!response.ok) {
        throw new Error("Failed to fetch notes");
      }

      const data = await response.json();
      setNotes(data);
      setError("");
    } catch (error) {
      console.error("Error fetching notes:", error);
      setError("Unable to load notes.");
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const addNote = async (event) => {
    event.preventDefault();

    if (!title.trim() || !content.trim()) {
      setError("Title and content are required.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          content: content.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create note");
      }

      setTitle("");
      setContent("");
      setError("");

      await fetchNotes();
    } catch (error) {
      console.error("Error adding note:", error);
      setError("Unable to create note.");
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>DevOps Notes</h1>
        <p>Create, store and manage your notes</p>
      </header>

      <main className="container">
        <section className="note-form">
          <h2>Create a New Note</h2>

          <form onSubmit={addNote}>
            <input
              type="text"
              placeholder="Note title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />

            <textarea
              placeholder="Write your note..."
              value={content}
              onChange={(event) => setContent(event.target.value)}
              rows="5"
            />

            <button type="submit">Add Note</button>
          </form>

          {error && <p className="error">{error}</p>}
        </section>

        <section className="notes-section">
          <h2>Your Notes</h2>

          {notes.length === 0 ? (
            <p className="empty">No notes yet. Create your first note!</p>
          ) : (
            <div className="notes-grid">
              {notes.map((note) => (
                <article className="note-card" key={note._id}>
                  <h3>{note.title}</h3>
                  <p>{note.content}</p>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;