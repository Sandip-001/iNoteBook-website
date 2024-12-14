const express = require('express');
const router = express.Router();
const { body, validationResult } = require("express-validator");
const Note = require('../models/Note');  // Import the Note model
const fetchUser = require('../middleware/fetchuser'); // Middleware to fetch user ID from auth token



// Route to fetch all notes of an authenticated user : GET "/api/note/fetchallnotes". Login required
router.get('/fetchallnotes', fetchUser, async (req, res) => {
    try {
        // Fetch all notes created by the authenticated user
        const notes = await Note.find({ user: req.user.id });
        
        // Return notes to the user
        res.json(notes);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});



// Route to add a new note for the authenticated user : POST "/api/note/addnote"
router.post(
  '/addnote',
  fetchUser,
  [
      body('title', 'Title is required').isLength({ min: 3 }),
      body('description', 'Description is required').isLength({ min: 3 })
  ],
  async (req, res) => {
      const errors = validationResult(req);

      // If there are validation errors, respond with them
      if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
      }

      try {
          const { title, description, tag } = req.body;

          // Create a new note associated with the user
          const note = new Note({
              title,
              description,
              tag,
              user: req.user.id  // Associating the note with the authenticated user
          });

          // Save the note to the database
          const savedNote = await note.save();

          res.json({message: "Note added successfully", savedNote });
      } 
      
      catch (error) {
          console.error(error.message);
          res.status(500).send("Internal Server Error");
      }
  }
);



// Route: PUT "/api/notes/updatenote/:id" - Update an existing note
router.put('/updatenote/:id', fetchUser, async (req, res) => {
  const { title, description, tag } = req.body;

  // Step 1: Create an object with the new values
  const updatedFields = {};
  if (title) updatedFields.title = title;
  if (description) updatedFields.description = description;
  if (tag) updatedFields.tag = tag;

  try {
    // Step 2: Find the note by ID and check ownership
    const note = await Note.findById(req.params.id);

    // If note not found
    if (!note) return res.status(404).json({ error: "Note not found" });

    // If the note doesn't belong to the logged-in user
    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({ error: "Not authorized" });
    }

    // Step 3: Update the note with new fields and return the updated note
    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: updatedFields },
      { new: true }
    );

    res.json({ message: 'Note updated successfully', note: updatedNote });
  } 
  
  catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});



// Route: DELETE "/api/notes/deletenote/:id" - Delete an existing note
router.delete('/deletenote/:id', fetchUser, async (req, res) => {
  try {
    // Step 1: Find the note to delete by ID
    const note = await Note.findById(req.params.id);

    // Step 2: Check if the note exists
    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    // Step 3: Check if the note belongs to the logged-in user
    if (note.user.toString() !== req.user.id) {
      return res.status(401).json({ error: "Not authorized" });
    }

    // Step 4: Delete the note
    await Note.findByIdAndDelete(req.params.id);

    res.json({ message: 'Note deleted successfully' });
  } 
  
  catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
});



module.exports = router;