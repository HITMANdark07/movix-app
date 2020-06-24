const express = require("express");
const router = express.Router();

const { create, webseriesById, read, remove, update, list, photo, listSearch } = require('../controllers/webseries');
const { requireSignin, isAuth, isAdmin } = require('../controllers/auth');
const { userById } = require("../controllers/user");


router.get("/webseries/:webseriesId", read);
router.post("/webseries/create/:userId",
             requireSignin, 
             isAuth, 
             isAdmin, 
             create 
            );
router.delete('/webseries/:webseriesId/:userId', requireSignin, isAuth, isAdmin, remove);
router.put('/webseries/:webseriesId/:userId', requireSignin, isAuth, isAdmin, update);
router.get('/webseries', list);
router.get("/webserieses/search", listSearch);

router.get("/webseries/photo/:webseriesId", photo);

router.param("userId", userById);
router.param("webseriesId",webseriesById);

module.exports =router;