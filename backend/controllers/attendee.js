const express = require("express");

const Attendee = require("../models/attendee");


exports.getAttendeeList = (req, res, next) => {

  Attendee.find({ownerId:req.userData.userId}).then(attendeeQuery => {
   res.status(200).json({
     message: 'attendeeList fetched successfully!',
     attendeeList : attendeeQuery
   })
  })

};


exports.createAttendee = (req, res, next) => {
  let attendeeJs = req.body;
  //attendeeJs = JSON.parse(attendeeJs);
  let attendee =  Attendee({
    email : attendeeJs.email,
    nom : attendeeJs.nom,
    prenom : attendeeJs.prenom,
    occupation : attendeeJs.occupation,
    ownerId : req.userData.userId,
  });




  attendee.save()
    .then( rslt => {
      res.status(201).json({
        attendee : rslt,
        message: "Attendee created successfully!",
      });
    }).catch(error=> {
      res.status(500).json({
        message: "Cannot create attendee"
      });
    })
};

exports.editAttendee = (req, res, next) => {
   let attendee =  Attendee({
     _id: req.body.id,
     email : req.body.email,
    nom : req.body.nom,
    prenom : req.body.prenom,
    occupation : req.body.occupation,
    ownerId : req.userData.userId,
   });

   Attendee.updateOne({_id: req.body.id}, attendee)
    .then(result=>{
      res.status(200).json({
        message : "Attendee updated with success!"
      })
    })
}

exports.deleteAttendee =  (req, res, next) => {
  Attendee.deleteOne({_id : req.params.id})
    .then(result => {
      res.status(200).json({ message: "Attendee deleted Successfully !"});

    })
}


