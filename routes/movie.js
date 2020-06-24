const express = require("express");
const router = express.Router();

const { create, movieById, read, remove, update, list, photo, listSearch, listBySearch } = require('../controllers/movie');
const { requireSignin, isAuth, isAdmin } = require('../controllers/auth');
const { userById } = require("../controllers/user");


router.get("/movie/:movieId", read);
router.post("/movie/create/:userId",
             requireSignin, 
             isAuth, 
             isAdmin, 
             create 
            );
router.delete('/movie/:movieId/:userId', requireSignin, isAuth, isAdmin, remove);
router.put('/movie/:movieId/:userId', requireSignin, isAuth, isAdmin, update);
router.get('/movie', list);
router.get("/movies/search", listSearch);
router.post("/movies/by/search", listBySearch);

router.get("/movie/photo/:movieId", photo);

router.param("userId", userById);
router.param("movieId",movieById);

module.exports =router;