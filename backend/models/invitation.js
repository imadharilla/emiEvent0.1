const mongoose = require('mongoose');

const invitationSchema = mongoose.Schema({

    attendeeId : {type:String, required:true},
    eventId : {type:String, required:true},
    status : {type:String, required:true},
})

// status is : pending/confirmed/checkedIn

module.exports = mongoose.model('Invitation', invitationSchema);