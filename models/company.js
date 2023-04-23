const mongoose = require('mongoose');




const companySchema = new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    count:{
        type:Number,
        default: 0
    },
    confirm:{
        type:Boolean,
        default:false
    }
})

module.exports=mongoose.model('Company',companySchema);