const express = require("express");
const router = express.Router();
import AuthJWT from './../utils/AuthJWT';
import authValidationRequest from './request';
import AuthController from './controller';


router.post('/login', authValidationRequest.validateLogin, AuthController.login);

router.post('/', authValidationRequest.validateSignup, AuthController.signup);

router.post('/reset', authValidationRequest.validateResetPassword, AuthController.recoveryPassword);

router.post('/change', AuthJWT.decodeFirebaseIdToken, AuthJWT.isAuthorized, authValidationRequest.validateChangePassword, AuthController.changePassword);

module.exports = router;

