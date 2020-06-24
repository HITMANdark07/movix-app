const express = require("express");
const router = express.Router();

const { requireSignin, isAuth, isAdmin } = require("../controllers/auth");
const { userById, adminById }  = require('../controllers/user');
const { create, list, requestById, read, update, remove }  = require('../controllers/request');

router.post('/request/create',create);
router.get('/request/list', list);
router.get('/request/:requestId', read);
router.put('/request/:requestId/:userId', requireSignin, isAuth, isAdmin, update);
router.delete('/request/:requestId/:userId', requireSignin, isAuth, isAdmin, remove);

router.param('adminId', adminById);
router.param('userId', userById);
router.param('requestId', requestById);

module.exports = router;