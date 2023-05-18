const express = require('express');
const router = express.Router();
const sendMail = require('../controllers/sendMail');
const dotenv = require('dotenv').config();
const User = require("../models/user");
const nodemailer = require('nodemailer')
const Request  = require('../models/request')

router.get('/', (req, res) => {

    res.render('request/index');
})


router.post('/', async (req, res) => {

    console.log(req.body);
    let request = await Request.create({ name : req.body.name, email :req.body.email, company:req.body.company,senior:req.body.senior,link:req.body.link, note:req.body.note });
    //console.log(request);
    let data = await User.find({}, { email: 1, _id: 0 });
    var admin_emails = data.map(function (obj) {
        return obj.email;
    });

    let transporter = await nodemailer.createTransport({
        service: 'gmail',
        host: "smtp.gmail.com",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    let info = await transporter.sendMail({
        from: '"Abhishek Deokar" <techtitans1520@gmail.com>', // sender address
        to: admin_emails, // list of receivers
        subject: "Hello Admin,  new article request ", // Subject line
        text: "Request for article", // plain text body
        html: `<b>Hello admin, there is a pending request for article on your interview website</b><br><p>Request for article by ${req.body.name}  { ${req.body.email}   } for company ${req.body.company}  company candidate - ${req.body.senior}    ${req.body.link}</p> `, // html body
    });
    
    res.redirect('/');

})



module.exports = router;
