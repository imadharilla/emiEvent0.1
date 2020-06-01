
const path = require("path");
const express = require('express');

const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const eventsRoutes = require('./routes/events');
const userRoutes = require('./routes/users');
const attendeeRoutes = require('./routes/attendee');
const invitationRoutes = require('./routes/invitation');
const app = express();
const checkinRoutes = require('./routes/checkin')



//app.use(express.static(path.join('public')));

/*

app.get((req, res) => {
    res.sendFile(path.join(__dirname + '/public/index.html'));
});
*/


mongoose.connect('mongodb://localhost/eventsdb',{ useNewUrlParser: true , useUnifiedTopology: true  }  )
.then(() => {
  console.log('Connected to database !');
})
.catch(() => {
  console.log('Connection failed!');
});



/*
mongoose.connect('mongodb+srv://Mata:4RruaXfcdPVZMDX@cluster0-vzdpf.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true , useUnifiedTopology: true  }  )
.then(() => {
  console.log('Connected to database !');
})
.catch(() => {
  console.log('Connection failed!');
});
*/

app.use(bodyParser.json());
//app.use("/images", express.static(path.join('public/assets/images')));
app.use("/images", express.static(path.join('backend/images')));


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', "*");
  res.setHeader("Access-Control-Allow-Headers",
  "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Methods",
  "GET, POST, PATCH, DELETE, PUT ,OPTIONS");
  next();
});


app.use("/api/events", eventsRoutes);

app.use("/api/user", userRoutes);

app.use("/api/attendee", attendeeRoutes);
app.use("/api/invitation", invitationRoutes);
app.use("/api/checkin", checkinRoutes);

module.exports = app;
