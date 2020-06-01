const express = require("express");
const router = express.Router();

const extractImage = require("../middleware/image");


router.post('/' , extractImage ,(req, res, next)=>{
    console.log(faceapis)
    res.status(200).json(
        {message: 'good'}
    )
})





module.exports = router;  