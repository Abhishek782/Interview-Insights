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
})

module.exports=mongoose.model('Company',companySchema);