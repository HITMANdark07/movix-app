const express = require('express');
const router = express.Router();

const {
        signUp,
        signin, 
        signout
      } = require('../controllers/auth');
const { userSignupValidator } = require('../validator/index');

router.post("/signup",userSignupValidator, signUp);
router.post("/signin", signin);
router.get("/signout", signout);

router.get("/hello", (req, res) => {
    res.json('hello there');
});

module.exports = router;