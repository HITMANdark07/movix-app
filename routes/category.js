const express = require("express");
const router = express.Router();

const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");
const { userById, adminById }  = require('../controllers/user');
const { create, list, categoryById, read, update, remove }  = require('../controllers/category');

router.post(
        '/category/create/:userId', 
        requireSignin, 
        isAuth, 
        isAdmin,
        create
    );

router.get('/category/list', list);
router.get('/category/:categoryId', read);
router.put('/category/:categoryId/:userId', requireSignin, isAuth, isAdmin, update);
router.delete('/category/:categoryId/:userId', requireSignin, isAuth, isAdmin, remove);

router.param('adminId', adminById);
router.param('userId', userById);
router.param('categoryId', categoryById);

module.exports = router;