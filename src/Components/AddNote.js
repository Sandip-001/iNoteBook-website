import React, { useState, useContext } from 'react';
import noteContext from "../context/notes/noteContext";

const AddNote = ({ showAlert }) => {
  const context = useContext(noteContext);
  const { addNote } = context;
  const [note, setNote] = useState({ title: "", description: "", tag: "General" });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (note.title.length >= 5 && note.description.length >= 5) {
      addNote(note.title, note.description, note.tag);
      setNote({ title: "", description: "", tag: "General" }); // Clear form after adding
      showAlert("Note added successfully!", "success"); // Show success alert
    }
  };

  const onChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <h1>Add Notes</h1>
      <form className="my-3">
        <div className="mb-3">
          <label htmlFor="title" className="form-label">Title</label>
          <input
            type="text"
            className="form-control"
            id="title"
            name="title"
            value={note.title}
            onChange={onChange}
            required
          />
          {note.title.length > 0 && note.title.length < 5 && (
            <small className="text-danger">Title must be at least 5 characters long.</small> //title lenght jodi 5 ar thaka choto hoi tahole akta niche error message show hoba
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <input
            type="text"
            className="form-control"
            id="description"
            name="description"
            value={note.description}
            onChange={onChange}
            required
          />
          {note.description.length > 0 && note.description.length < 5 && (
            <small className="text-danger">Description must be at least 5 characters long.</small> //description lenght jodi 5 ar thaka choto hoi tahole akta niche error message show hoba
          )}
        </div>

        <div className="mb-3">
          <label htmlFor="tag" className="form-label">Tag</label>
          <input
            type="text"
            className="form-control"
            id="tag"
            name="tag"
            value={note.tag}
            onChange={onChange}
          />
        </div>

        <button
          disabled={note.title.length < 5 || note.description.length < 5} //jotokhon na description and title length 5 ar thaka choto thakbe totokhon submit button ta disabled thakbe
          type="submit"
          className="btn btn-primary"
          onClick={handleSubmit}
        >
          Add Note
        </button>
      </form>
    </div>
  );
};

export default AddNote;
