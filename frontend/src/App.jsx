import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const fetchNotes = () => {
    fetch("http://localhost:5000/api/notes")
      .then((response) => response.json())
      .then((data) => setNotes(data))
      .catch((error) => console.error("Error fetching notes:", error));
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const addNote = async (event) => {
    event.preventDefault();

    if (!title.trim() || !content.trim()) {
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          content,
        }),
      });

      if (response.ok) {
        setTitle("");
        setContent("");
        fetchNotes();
      }
    } catch (error) {
      console.error("Error adding note:", error);
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