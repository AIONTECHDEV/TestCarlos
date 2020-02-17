export { };
const express = require("express");
const router = express.Router();
import AccountController from './controller';
import Auth from './../utils/AuthJWT';

router.get('/', [Auth.decodeFirebaseIdToken, Auth.isAuthorized], AccountController.getAccountbalance);
router.get('/all', [Auth.decodeFirebaseIdToken, Auth.isAuthorized], AccountController.getAllAccounts);

module.exports = router;
