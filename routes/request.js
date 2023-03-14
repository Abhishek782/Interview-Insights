const express = require('express');
const router = express.Router();
const sendMail = require('../controllers/sendMail');

router.get('/',(req,res)=>{
    
    res.send("Ayush cha request an article page");
})

router.get('/mail',sendMail);



module.exports = router;
