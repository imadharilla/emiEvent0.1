const express = require("express");
const router = express.Router();

const CheckAuth = require("../middleware/check-auth");

const attendeeController = require("../controllers/attendee");



router.get("", CheckAuth, attendeeController.getAttendeeList)

router.post("", CheckAuth, attendeeController.createAttendee);

router.put("", CheckAuth, attendeeController.editAttendee)

router.delete('/:id', CheckAuth, attendeeController.deleteAttendee)


module.exports = router;
