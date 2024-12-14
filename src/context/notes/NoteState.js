import React, { useState, useEffect } from "react";
import NoteContext from "./noteContext";

const NoteState = (props) => {
  const host = "http://localhost:5000";
  const notesInt = [];
  const [notes, setNotes] = useState(notesInt);
  const [authToken, setAuthToken] = useState(localStorage.getItem("token")); // Retrieve token from local storage

  // Update the authToken if it changes and store in localStorage
  useEffect(() => {
    if (authToken) {
      localStorage.setItem("token", authToken);
    } else {
      localStorage.removeItem("token"); // Clear token if not available
    }
  }, [authToken]);

  // Function to log in the user
  const login = async (email, password) => {
    try {
      const response = await fetch(`${host}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const json = await response.json();
      if (json.success) {
        setAuthToken(json.authToken); // Store token in state
      } else {
        console.error("Login failed:", json.error);
      }
      return json;
    } catch (error) {
      console.error("Error in login:", error);
    }
  };

  // Logout function to clear token
  const logout = () => {
    setAuthToken(null);
    localStorage.removeItem("token");
  };


  // Signup function to create a new user
  const signup = async (name, email, password) => {
    try {
      const response = await fetch(`${host}/api/auth/createuser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });
      const json = await response.json();
      console.log("Response from signup API:", json); // Log the response

      if (json.success) {
        setAuthToken(json.authToken); // Store token in state
        localStorage.setItem("token", json.authToken); // Ensure token is saved in localStorage
      }
      return json; 
    } catch (error) {
      console.error("Error in signup:", error);
      return { error: "An error occurred during signup. Please try again." };
    }
  };


  // Get all Notes
  const getNotes = async () => {
    try {
      const response = await fetch(`${host}/api/notes/fetchallnotes`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "auth-token": authToken,
        },
      });
      const json = await response.json();
      setNotes(json);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  // Add a Note
  const addNote = async (title, description, tag) => {
    try {
      const response = await fetch(`${host}/api/notes/addnote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": authToken,
        },
        body: JSON.stringify({ title, description, tag }),
      });

      const json = await response.json();
      if (json) {
        setNotes([...notes, json]);
      }
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  // Delete a Note
  const deleteNote = async (id) => {
    try {
      await fetch(`${host}/api/notes/deletenote/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "auth-token": authToken,
        },
      });
      setNotes(notes.filter((note) => note._id !== id));
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  // Edit a Note
  const editNote = async (id, title, description, tag) => {
    try {
      const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "auth-token": authToken,
        },
        body: JSON.stringify({ title, description, tag }),
      });
      await response.json();
      const updatedNotes = notes.map((note) =>
        note._id === id ? { ...note, title, description, tag } : note
      );
      setNotes(updatedNotes);
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  return (
    <NoteContext.Provider value={{notes, addNote, deleteNote, editNote, getNotes, login, logout, authToken, signup}}
>
      {props.children}
    </NoteContext.Provider>
  );
};

export default NoteState;
