const User = require('../models/user');
const jwt = require('jsonwebtoken');
const expressJwt = require('express-jwt');
const { errorHandler } = require('../helpers/dbErrorHandler');

exports.signUp = (req,res) => {
    console.log('req.body',req.body);
        const user = new User(req.body);
        user.save(async(error, user)=>{
        if (error) {
           return res.status(400).json({
               error:errorHandler(error)
           });
        }
        const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET);
        res.cookie('t', token, {expire: new Date() + 9999})
        user.salt= undefined
        user.hashed_password = undefined
        const {_id, name, phone} = user;
        await res.json({
            user:{_id, name, phone},
             token
       });
    });
    };

exports.signin = (req, res) =>{
    //find user based on email
    const {phone, password}= req.body;
    User.findOne({phone},(err, user)=>{
       if(err || !user) {
           return res.status(400).json({
               err:"User with that Phone does not exist. please signup first"
           });
       }
       // if user is found make sure the email and password match
       // create authenticate method in user model
       if (!user.authenticate(password)){
           return res.status(401).json({
               err: "Incorrect password"
           })
       }

       //generate a signed token with user id and secret
       const token = jwt.sign({_id: user._id}, process.env.JWT_SECRET)
       //persist the token as 't' in cookie with expiry date
       res.cookie('t', token, {expire: new Date() + 9999})
       //return response with user and token to frontend client 
       const {_id, name, phone, role} = user;
       return res.json({
           token,
           user:{ _id, phone, name, role}
       });
    });
};

exports.signout = (req,res) => {
    res.clearCookie('t')
    res.json({message: 'Signout Success'});
};

exports.requireSignin = expressJwt({
    secret: process.env.JWT_SECRET,
    userProperty:"auth"
});

exports.isAuth = (req, res, next) => {
    let user = req.profile && req.auth && req.profile._id == req.auth._id;
    if(!user){
       return res.status(403).json({ 
           error: 'Access denied'
       });
    }
    next();
};

exports.isAdmin = (req, res, next) => {
    if(req.profile.role===0){
        return res.status(403).json({
            error: 'Admin resource! Access denied'
        });
    }
    next();
};