const mongoose = require('mongoose');

const attendeeSchema = mongoose.Schema({

  email: {type: String, required:true},
  nom: {type:String, required: true },
  prenom : {type:String, required: false},
  occupation : {type: String, required:true},
  ownerId : {type:String, required:true},
  imagePath : {type:String, required:false},
  invitations : [{type: mongoose.Schema.Types.ObjectId, ref: "Invitation" , required:true}]
});


// ownerId is the id of the user/event manager who created this attendee

module.exports = mongoose.model('Attendee', attendeeSchema);

