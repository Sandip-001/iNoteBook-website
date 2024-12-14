import React, { useContext } from 'react';
import noteContext from "../context/notes/noteContext";

const NotesItems = ({ note, updateNote, showAlert }) => {
  const context = useContext(noteContext);
  const { deleteNote } = context;

  const handleDelete = () => {
    deleteNote(note._id);
    showAlert("Note deleted successfully!", "danger");  // Show delete alert with red background
  };

  return (
    <div className="col-md-3">
      <div className="card my-3">
        <div className="card-body">
          <div className="d-flex justify-content-center align-items-center mb-3">
            <h5 className="card-title me-auto">{note.title}</h5>
            <i className="fa-solid fa-pen-to-square p-2" style={{ cursor: "pointer" }} onClick={() => updateNote(note)}></i>
            <i className="fa-solid fa-trash mx-2 p-2" style={{ cursor: "pointer" }} onClick={handleDelete}></i>
          </div>
          <p className="card-text">{note.description}</p>
        </div>
      </div>
    </div>
  );
};

export default NotesItems;
