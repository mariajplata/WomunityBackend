const mongoose = require('mongoose');
  
// Schema  
const User = mongoose.model('User', new mongoose.Schema({
   nick: { type: String, required: true },
   email: { type: String, required: true },
   fullUserName: { type: String, required: true },
   password: { type: String, required: true },   
   createdAt: { type: Date, required: false, default: Date.now },
}));
    
module.exports = mongoose.model('User');