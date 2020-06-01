const express = require("express");
const router = express.Router();

const CheckAuth = require("../middleware/check-auth");
const extractImage = require('../middleware/image')
const invitationController = require('../controllers/invitation');


router.post('/confirm', extractImage, invitationController.confirmInvitation);

router.get('/:eventId', invitationController.getInvitations);

module.exports = router;  