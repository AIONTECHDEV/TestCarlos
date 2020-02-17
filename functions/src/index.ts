import * as functions from 'firebase-functions';

const authService = require('./auth/index');
const accountService = require('./accounts/index');
const transactionService = require('./transactions/index');

export const auth = functions.https.onRequest(authService);
export const accounts = functions.https.onRequest(accountService);
export const transactions = functions.https.onRequest(transactionService);