const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
    name:{
        type:String,
        required: true
    },
    email:{
        type:String,
        required: true
        //unique: true //unique: true mana email every user ar unique hoi means alada tai akahna ata likhlam
    },
    password:{
        type:String,
        required: true
    },
    timestamp:{
        type:Date,
        default: Date.now
    },

  });
  
  module.exports = mongoose.model('user', UserSchema);