const mongoose = require('mongoose');


const requestSchema = new mongoose.Schema({
    name: {
        type: String,
       
    },
    email: {
        type: String,
        
    },
    company: {
        type: String,
    },
    senior:{
        type:String,
    },
    link:{
        type:String,
    },
    note:{
        type:String,
    }
})

module.exports = mongoose.model('Request', requestSchema);