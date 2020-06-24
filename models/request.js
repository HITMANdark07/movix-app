const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;


const RequestSchema = new mongoose.Schema({
    name:{
        type:String,
        trim: true,
        required:true,
        maxlength:32
    },
    request:{
        type:String,
        trim:true,
        require:true
    },
    description:{
        type:String,
        trim:true,
        maxlength:500
    }
},
{timestamps:true}
);


module.exports = mongoose.model('Request', RequestSchema);