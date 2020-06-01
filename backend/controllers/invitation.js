
const Invitation = require('../models/invitation');
const Event = require('../models/event');

exports.getInvitations = (req, res, next) => {
    
    Invitation.find({eventId: req.params.eventId})
    .then(invitationList => {
        res.status(200).json({
            invitations: invitationList
        })
    })
}

exports.confirmInvitation = (req, res, next) => {
    let resData = JSON.parse(req.body.jsonAttendee );
    
    Invitation.findOneAndUpdate({eventId: resData.eventId, attendeeId: resData.attendeeId}, {status:'confirmed'} )
        .then(result=>
            res.status(200).json({message:"Invitation confirmed successfuly"})
        )
   
  }