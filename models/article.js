const mongoose = require('mongoose');
const marked = require('marked');
const slugify = require('slugify');
const { application } = require('express');

const articleSchema = new mongoose.Schema({
    title:{
        type:String,
        // required:true
    },
    description:{
        type:String,
        // required:true
    },
    name:{
        type:String,
        // required:true
    },
    email:{
        type:String,
        // default:false
    },
    company:{
        type:String,
        // required:true
    },
    confirm:{
        type:Boolean,
        default:false
    },
    currentDate:{
        type:String
    },
    slug:{
        type: String,
        required: true,
        unique: true
    }
}, {
    timestamps:true
})

articleSchema.pre('validate',function(next){
    if(this.title)
    {
        this.slug = slugify(this.title,{lower:true,strict:true})
    }
    next();
})

module.exports=mongoose.model('Article',articleSchema);
