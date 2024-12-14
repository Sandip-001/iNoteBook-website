const mongoose = require('mongoose');
const { Schema } = mongoose;

const NoteSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    tag: {
        type: String,
        default: "General"
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    user: {  // this associates the note with a user
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        required: true
    }
});

module.exports = mongoose.model('note', NoteSchema);
