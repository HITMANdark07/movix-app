const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;


const CarousalSchema = new mongoose.Schema({
    name:{
        type:String,
        trim: true,
        required:true,
        maxlength:32
    },
    photo:{
        data: Buffer,
        contentType:String
    },
    category:{
        type:ObjectId,
        ref:'Category',
        required:true
    }
},
{timestamps:true}
);


module.exports = mongoose.model('Carousal', CarousalSchema);