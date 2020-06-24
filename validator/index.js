exports.userSignupValidator = (req,res, next)=>{
    req.check('name', 'Name is required').notEmpty()
    req.check('phone','Phone number must be 10 Digits')
    .matches(/^\d{10}$/)
    .withMessage('Phone no. shoud have 10 digits')
    .isLength({
        min:10,
        max:10
    });
    req.check('password', 'Password is required').notEmpty()
    req.check('password')
    .isLength({min:6})
    .withMessage('Password must contain at least 6 characters')
    .matches(/\d/)
    .withMessage("password must contain a number")
    const errors = req.validationErrors();
    if(errors){
        const firstError = errors.map(error => error.msg)[0];
        return res.status(400).json({ error: firstError });
    }
    next();
};