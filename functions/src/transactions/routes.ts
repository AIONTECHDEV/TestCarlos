export { };
const express = require("express");
const router = express.Router();
import TransactionController from './controller';
import TransactionRequest from "./request";
import Auth from './../utils/AuthJWT';

router.get('/received', [Auth.decodeFirebaseIdToken, Auth.isAuthorized], TransactionController.getReceivedTransactions);
router.get('/sent', [Auth.decodeFirebaseIdToken, Auth.isAuthorized], TransactionController.getSentTransactions);
router.post('/', [Auth.decodeFirebaseIdToken, Auth.isAuthorized, TransactionRequest.validateStore], TransactionController.makeTransfer);

module.exports = router;
