var express = require('express');
var router = express.Router();
var user = require('../controllers/users');
var plan = require('../controllers/plan');
var firm = require('../controllers/firm');

router.post('/user/signup', user.signup);
router.post('/user/login', user.login);
router.post('/user/mobile', user.setMobile);

router.post('/user/verify/mobile', user.verifyMobile);
router.get('/user/verify/email/:id', user.verifyEmail);
router.post('/user/verify/email', user.sendVerMail);

router.get('/plans', plan.getPlans);
router.post('/user/plan', user.setPlan);

router.post('/user/state', user.setState);
router.get('/user/state', user.getState);

router.post('/user/co_user', user.createCoUser);
router.get('/user/co_user', user.getCoUsers);

router.post('/user/admins', user.createAdmins);
router.get('/user/admins', user.getAdmins);

router.post('/user/role' , user.setRole);
router.get('/user/role/:id', user.getRoles);

router.post('/user/image', user.profileImage);

router.post('/user/sign', user.signature);
router.get('/user/profile', user.getUserProfile);
router.post('/user/profile', user.setUserProfile);
router.get('/firm/profile', user.getFirmProfile);
router.post('/firm/profile', user.setFirmProfile);

router.post('/firm/signature', firm.signature);
router.post('/firm/logo', firm.logoImage);

router.post('/user/deleteusers', user.deleteUser);

module.exports = router;
