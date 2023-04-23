const jwt = require('jsonwebtoken');
const User = require('../models/user');
const dotenv = require('dotenv').config();

const requireAuth = (req,res,next)=>{
    const token = req.cookies.jwt;

    if(token)
    {
        jwt.verify(token,process.env.JWT_KEY,(err,decodedToken)=>{
            if(err)
            {
                console.log(err.message);
                res.redirect('/user/login');
            }
            else
            {
                // console.log('bhosdsad');
                console.log(decodedToken);
                next();
            }
        })
    }
    else
    {
        res.redirect('/user/login');
    }

}


// check current user
const checkUser  = (req,res,next)=>{
    const token = req.cookies.jwt;
    // console.log("In checkUser");
    if(token){
        jwt.verify(token,process.env.JWT_KEY,async(err,decodedToken)=>{
            if(err)
            {
                console.log(err.message);
                res.locals.user=null;
                next();
            }
            else
            {
                console.log(decodedToken);
                let user = await User.findById(decodedToken.id);
                res.locals.user =user;
                next();
            }
        })
    }else{
        res.locals.user=null;
        next();
    }
}

module.exports = {requireAuth,checkUser};