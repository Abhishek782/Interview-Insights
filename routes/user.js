const express = require('express');
const router = express.Router();
const User = require('../models/user');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { requireAuth } = require('../middleware/authMiddleware');


const handleErrors = (err)=>{
    let errors ={ email:'',password: ''}; 

    if(err.message === "incorrect email")
    {
        errors.email = "that email is not registered";
    }

    if(err.message === "incorrect password")
    {
        errors.email = "that password is incorrect";
    }

    if(err.code===11000){
        errors.email ="that email is already registered";
        return errors;
    }

    // validation errors
    if(err.message.includes('User validation failed'))
    {
        Object.values(err.errors).forEach(({properties})=>{
             errors[properties.path] = properties.message
        });
    } 

    return errors;
}

const maxAge = 3*24*60*60;
const createToken =(id) =>{
    return jwt.sign({id},process.env.JWT_KEY,{
        expiresIn:maxAge
    })
}

router.get('/',(req,res)=>{
    res.render('user/home');
})


router.get('/smoothies', requireAuth ,async(req, res) =>{
    res.render('user/smoothies');
})    

router.get('/signup',(req,res)=>{
    res.render('user/signup');
})

router.post('/signup',async(req,res)=>{
    const {email,password} = req.body;
    // console.log(email,password);
    // res.send('new signup');
    
    try{
        const user = await User.create({email,password});
        const token = createToken(user._id);
        res.cookie('jwt',token,{httpOnly: true , maxAge: maxAge*1000});
        res.status(201).json({user: user._id});
    }
    catch(err)
    {
        const errors = handleErrors(err);
        res.status(400).json({errors});
    }
})

router.get('/login',(req,res)=>{
    res.render('user/login');
})

router.post('/login',async(req,res)=>{
    const {email,password} = req.body;

    try{
        const user = await User.login(email,password);
        const token = createToken(user._id);
        res.cookie('jwt',token,{httpOnly: true , maxAge: maxAge*1000});
        res.status(200).json({user:user._id});
    }catch(err){
        const errors = handleErrors(err);
        res.status(400).json({errors});
    }
    // res.redirect('/admin/dashboard');
})

router.get('/logout',async(req,res)=>{
    res.cookie('jwt','',{maxAge: 1});
    res.redirect('/');
})

module.exports = router;
