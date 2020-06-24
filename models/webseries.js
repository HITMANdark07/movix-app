const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;

const WebSeriesSchema = new mongoose.Schema({
    name:{
        type:String,
        trim: true,
        required:true,
        maxlength:32
    },
    description:{
        type:String,
        required:true,
        maxlength:2000
    },
    rating:{
        type:Number,
        trim:true,
        required:true,
        maxlength:5
    },
    category:{
        type:ObjectId,
        ref:'Category',
        required:true
    },
    tag:{
        type:String,
        trim: true,
        maxlength:15,
        required:true
    },
    photo:{
        data: Buffer,
        contentType:String
    },
    trailer:{
        type:String,
        trim:true,
        required:true
    },
    link:{
        type:String,
        trim:true,
        required:true
    },
    zip:{
        type:String,
        trim:true,
        required:true
    },
    episodes:{
        type:Number,
        trim:true,
        maxlength:20,
        required:true
    }
},
{timestamps:true}
);


module.exports = mongoose.model('WebSeries', WebSeriesSchema);