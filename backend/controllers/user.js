const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


const gmailService = require('../services/gmailAPI');

const User = require("../models/user");
const Invitation = require('../models/invitation');
exports.createUser =  (req, res, next) => {
  let user;
  bcrypt.hash(req.body.authData.password, 9)
    .then(hash => {
       user = new User({
         nom : req.body.nom,
         prenom : req.body.prenom,
        email: req.body.authData.email,
        password: hash,
      })
      user.save()
      .then(result => {
        let message = "<p>Bonjour " + user.prenom + ", <br><br>Merci de vous être inscrit sur EMIEvent!<br>Bienvenue sur notre plateforme de gestion d'événements<br>Visitez notre site : https://inchaalah.com/ pour en savoir plus sur nos fonctionnalités.<br>Si vous avez des questions,mettez les en réponse à cet email—nous sommes là pour vous aider.<br><br>Cordialement,<br>L'Equipe EMIEvent.</p>"
        let subject = "Votre compte EMIEvent a ete cree!"
        console.log(result)
         gmailService.sendEmail([user.email], [subject], [message]);
        res.status(201).json({
          message: 'User created successfully! ',
          result: result,
        });
      })
      .catch(err => {
        res.status(500).json({
          message :"This email is already taken!"
        });
      });
    });
}


exports.userLogin =  (req, res, next)=>{
  let fetchedUser;
  User.findOne({email: req.body.email})
    .then(user => {
      if(!user){
        return res.status(401).json({
          message: "Invalid authentication credentials!"
        });
      }else {
        fetchedUser = user;
        console.log("hehehe"+ fetchedUser)
        return bcrypt.compare(req.body.password, user.password);
      }

    }).then(result => {
      if(!result){
        return res.status(401).json({
          message: "Invalid authentication credentials!"
        });
      }

      const token = jwt.sign({email: fetchedUser.email, userId: fetchedUser._id},
         'secret_aimad_bajbsayasuygsaygxhvxygaihas',
          {expiresIn:'1h',});
      res.status(200).json({
        token: token,
        expiresIn : 3600,
      });

    }).catch(err=>{
      console.log(err);
      return res.status(401).json({
        message: "Invalid authentication credentials!"
      });
    });
}
