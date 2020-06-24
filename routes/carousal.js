const express = require("express");
const router = express.Router();

const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");
const { userById, adminById }  = require('../controllers/user');
const { create, list, carousalById, read, update, remove, photo, listByWebseries, listByMovies }  = require('../controllers/carousal');

router.post(
        '/carousal/create/:userId', 
        requireSignin, 
        isAuth, 
        isAdmin,
        create
    );

router.get('/carousal/list', list);
router.get('/carousal/webseries', listByWebseries);
router.get('/carousal/movies', listByMovies);
router.get('/carousal/:carousalId', read);
router.put('/carousal/:carousalId/:userId', requireSignin, isAuth, isAdmin, update);
router.get("/carousal/photo/:carousalId", photo);
router.delete('/carousal/:carousalId/:userId', requireSignin, isAuth, isAdmin, remove);

router.param('adminId', adminById);
router.param('userId', userById);
router.param('carousalId', carousalById);

module.exports = router;