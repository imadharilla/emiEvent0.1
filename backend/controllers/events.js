const Event = require('../models/event');
const Attendee = require('../models/attendee');
const Invitation = require('../models/invitation');
const gmailService = require('../services/gmailAPI');




function inviteAttendee(invitationList, eventId ,url) {
  let subject = [];
    let to = [];
    let message = [];
  requests = invitationList.map(invitation=>{
    Attendee.findById(invitation.attendeeId).then(attendee=>{ 
      if(attendee) {
        let inviteUrl = url + '/confirm/'  + eventId + '/' + attendee._id;
        let subject1 = "You have been invited !"
        let message1 = "Bonjour"+ attendee.prenom + " ,<br><br>Vous êtes invité à un événement sur EMIEvent.!<br>Afin de confirmer ou cette invitation veuillez visitez ce lien: " + inviteUrl +  ".<br>Si vous avez des questions,mettez les en réponse à cet email, nous sommes là pour vous aider.<br><br>Cordialement,<br>L'Equipe EMIEvent."
        subject.push(subject1);
        to.push(attendee.email);
        message.push(message1);
      }

    })
  })
  Promise.all(requests).then(()=>{
    gmailService.sendEmail(to, subject, message);
  })

}


exports.createEvent = (req, res, next) => {
  let eventJs = req.body.jsonEvent;
  eventJs = JSON.parse(eventJs);
  const url = req.protocol + '://' + req.get("host");
  const event = new Event(
    {
      title : eventJs.title,
      imagePath: url + "/images/" + req.file.filename,
      description : eventJs.description,
      startDate : eventJs.startDate,
      endDate : eventJs.endDate,
      location : eventJs.location,
      creator: req.userData.userId,
      attendeeList : eventJs.attendeelist,
    }
  );
  try {
    event.save().then((result)=>{
      //inviteAttendee(event)
      res.status(201).json({
        message : "Post Added Successfully",
        eventId: result._id,
        url : result.imagePath,
      });
    });
  } catch (error) {
    console.log("unable to save event to database : " + error);
  }
}


exports.updateEvent = (req, res, next) => {

  let event;
  if( req.file ){


    let eventData = JSON.parse( req.body.jsonEvent);
    event = new Event({
      _id : eventData.id,
      title : eventData.title,
      imagePath : req.protocol + '://' + req.get("host") + "/images/" + req.file.filename,
      description : eventData.description,
      startDate : eventData.startDate,
      endDate : eventData.endDate,
      location : eventData.location,
      creator: req.userData.userId,
      attendeeList : eventData.attendeelist,
    })
  }else{
    event = new Event({
      _id : req.params.id,
      title : req.body.title,
      imagePath : req.body.imagePath,
      description : req.body.description,
      startDate : req.body.startDate,
      endDate : req.body.endDate,
      location : req.body.location,
      creator: req.userData.userId,
      attendeeList : req.body.attendeelist,

    })
  }
  Event.updateOne({_id: req.params.id}, event)
  .then((result) => {

      res.status(200).json({message: "update Successful", imagePath: event.imagePath});

    });
}


exports.getEvents = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const eventQuery = Event.find({creator: req.userData.userId});

  let fetchedEvents;
  if (pageSize !==null && currentPage  !==null) {
    eventQuery
      .skip(pageSize * (currentPage))
      .limit(pageSize);
  }

  eventQuery.then((documents) => {
    fetchedEvents = documents;
    return eventQuery.countDocuments();

  }).then(count => {
    res.status(200).json({
      message: 'Events fetched succesfully lol !',
      events :  fetchedEvents,
      maxEvents: count
    });
  }).catch(error => {
    res.status(500).json({
      message : "Unable to fetch Events!"
    })
  });
}

exports.getOneEvent = (req, res, next) => {
  Event.findById(req.params.id).then(event => {
    if(event) {
      res.status(200).json(event);
    }
    else {
      res.status(404).json({message: 'Event Not Found'});
    }
  });
}


exports.deleteEvent = (req, res, next) => {
  Event.deleteOne({_id : req.params.id})
    .then(result => {

      res.status(200).json({ message: "Event deleted !"});

    })
}




exports.sendInvitations = (req, res, next) => {
  let invitationList = [];
  let invitationListId = [];
  if(req.body.event.invitations) {
    invitationList = req.body.event.invitations;
  }
 request1 = req.body.attendeeList.map(attendeeId => {
    let invitation = new Invitation({
      attendeeId: attendeeId,
      eventId: req.params.id,
      status:'pending'
    })
    request2 = invitation.save()
      .then(invitation => {
         invitationListId.push(invitation._id);
         invitationList.push(invitation) })
  });
  Promise.all([request1, request2]).then(() => {
    let event = new Event({
      _id : req.params.id,
      title : req.body.event.title,
      imagePath : req.body.event.imagePath,
      description : req.body.event.description,
      startDate : req.body.event.startDate,
      endDate : req.body.event.endDate,
      location : req.body.event.location,
      creator: req.userData.userId,
      attendeeList : req.body.event.attendeelist ,
      invitations : invitationListId
    });

    Event.updateOne({_id: req.params.id}, event)
    .then((result) => {
  
      let url =  req.protocol + '://' + req.body.hostUrl ;
      inviteAttendee(invitationList, event._id ,url);
        res.status(200).json({message: "update Successful", imagePath: event.imagePath});
  
      })

  })
  

}
