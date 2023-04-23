const nodemailer = require('nodemailer');
const User = require("../models/user");
const dotenv = require('dotenv').config();



const sendMail = async (req, res) => {
    
    let data = await User.find({}, { email: 1, _id: 0 });
    // console.log(data);
    var admin_emails = data.map(function (obj) {
        return obj.email;
    });
    //  console.log(admin_emails);

    // let fake_mails = ["abhishekdeokar782@gmail.com","abhishek.deokar@walchandsangli.ac.in"]

    let transporter = await nodemailer.createTransport({
        service: 'gmail',
        host: "smtp.gmail.com",
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    let info = await transporter.sendMail({
        from: '"Abhishek Deokar" <wceit101@gmail.com>', // sender address
        to: admin_emails, // list of receivers
        subject: "Hello Admin,  new article request ", // Subject line
        text: "Request for article", // plain text body
        html: `<b>Hello admin, there is a pending request for article on your interview website</b><br><p>Request for article by ${req.name}  { ${req.email}   ${req.phone}  } for company ${req.company}  company candidate - ${req.senior}</p> `, // html body
    });

    res.redirect('/');
};

module.exports = sendMail;