const mongoose = require('mongoose');
const {isEmail} = require('validator');  
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: [true,'Please enter an email address'],
        unique: true,
        lowercase: true,
        validate: [isEmail ,'Please enter an valid email']
    },
    password:{
        type: String,
        required: [true,'Please enter an password'],
        minlength : [6,'Minimum password length is 6 ']
    }
});


userSchema.pre('save',async function(next){ 
    // console.log('User about to be created & saved',this); 
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password,salt); 
    next();   
})

// Static method to login user
userSchema.statics.login = async function(email,password){
    const user = await this.findOne({email});
    if(user){
        const auth = await bcrypt.compare(password,user.password);
        if(auth)
        {
            
            return user;
        }
        throw Error('incorrect password')
    }
    throw Error('incorrect email');
}

module.exports=mongoose.model('User',userSchema);