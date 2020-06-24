const User = require('../models/user');

exports.userById = (req, res, next, id) => {
    User.findById(id).exec((err, user)=>{
       if(err || !user) {
         return res.status(400).json({
            error: 'User not found'
        });
     }
        req.profile= user;
        next();
    });
};
exports.adminById = (req, res, next, id) => {
    User.findById(id).exec((err, user)=>{
        if(err || !user) {
          return res.status(400).json({
             error: 'User not found'
         });
      }
      
      if(user.role===1){
         return next();
      }
       return res.status(400).json({
           error: 'Admin Access Area'
       })
     });
};


exports.deleteUser = (req, res) => {
    User.findOneAndDelete(
        {
            _id: req.profile._id
        }, (err, user) => {
            if(err) {
                return res.status(400).json({
                    error: 'You are not authorised to perform this actions'
                });
            }
            user.hashed_password = undefined;
            user.salt = undefined;
            res.json(user);
        }
    );
}


exports.list = (req, res) => {
    User.find()
    .select("-hashed_password")
    .exec((error, users) => {
        if(error || !users) {
            return res.status(400).json({
                error:'No user found'
            });
        }
        res.json(users);
    });
};

exports.read = (req, res) => {
     req.profile.hashed_password = undefined;
     req.profile.salt = undefined;
     return res.json(req.profile);
};

exports.update = (req, res) => {
    User.findOneAndUpdate(
        { _id: req.profile._id }, 
        { $set: req.body }, 
        { new:true },
        (error, user) => {
            if(error) {
                return res.status(400).json({
                    error: 'You are not authorised to perform this actions'
                });
            }
            user.hashed_password = undefined;
            user.salt = undefined;
            res.json(user);
        }
        );
    
};
