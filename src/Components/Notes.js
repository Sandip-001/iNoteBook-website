import { useContext, useEffect, useRef, useState } from "react";
import noteContext from "../context/notes/noteContext";
import NotesItems from "./NotesItems";

const Notes = ({ showAlert }) => {
  const context = useContext(noteContext);
  const { notes, getNotes, editNote, authToken } = context; // Make sure editNote is destructured here
  const [note, setNote] = useState({ id: "", title: "", description: "", tag: "General" });


  useEffect(() => {
    if (authToken) {
      getNotes();
    }
  }, [authToken, getNotes]); 

  const ref = useRef(null);

  const updateNote = (currentNote) => {
    setNote({
      id: currentNote._id,
      title: currentNote.title,
      description: currentNote.description,
      tag: currentNote.tag,
    });
    ref.current.click(); // Trigger modal opening
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (note.title.length >= 5 && note.description.length >= 5) {
    editNote(note.id, note.title, note.description, note.tag);
    // Close modal programmatically after submission
    document.getElementById("closeModalButton").click();
    showAlert("Note updated successfully!", "info");  // Show updated alert with light blue background
    }
  };

  const onChange = (e) => {
    setNote({ ...note, [e.target.name]: e.target.value });
  };

  return (
    <>
      {/* Hidden button to open modal */}
      <button
        type="button"
        className="d-none"
        ref={ref}
        data-bs-toggle="modal"
        data-bs-target="#exampleModal"
      >
        Launch modal
      </button>

      {/* Modal */}
      <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">Edit Note</h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" id="closeModalButton"></button>
            </div>

            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    name="title"
                    value={note.title}
                    onChange={onChange}
                  />
                  {note.title.length > 0 && note.title.length < 5 && (
                    <small className="text-danger">Title must be at least 5 characters long.</small>
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
                  />
                  {note.description.length > 0 && note.description.length < 5 && (
                    <small className="text-danger">Description must be at least 5 characters long.</small>
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
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  <button disabled={note.title.length < 5 || note.description.length < 5} type="submit" className="btn btn-primary">Update Note</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="row my-3">
        <h3>Your Notes</h3>
        <div className="container">
          {notes.length === 0 && 'No notes to display'}
        </div>
        {notes.map((note, index) => ( //ai index use na korleo kno osubidha nei but consolea error asbe unique key id missing bole but index use korle every notes ar unique id generate hoba and console a error show hoba na
          <NotesItems key={note._id || index} updateNote={updateNote} note={note} showAlert={showAlert} />
        ))}
      </div>
    </>
  );
};

export default Notes;

