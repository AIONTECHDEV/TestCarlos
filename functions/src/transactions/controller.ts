import Transaction from './model';
import Account from "../accounts/model";
import admin from '../firebase';
import to from 'await-to-js';
const firestore = admin.firestore();

class TransactionController {

    /**
     * Get sent transactions from auth user
     * @param req
     * @param res
     */
    static async getSentTransactions(req: any, res: any) {
        const [err, history] = await Transaction.getSentTransactions(req.user.user_id);
        if (err) return res.status(500).json({ data: {}, message: err });
        return res.status(201).json({ data: history, message: 'Success' });
    }

    /**
     * Get sent transactions from auth user
     * @param req
     * @param res
     */
    static async getReceivedTransactions(req: any, res: any) {
        const [err, history] = await Transaction.getReceivedTransactions(req.user.user_id);
        if (err) return res.status(500).json({ data: {}, message: err });
        return res.status(201).json({ data: history, message: 'Success' });
    }

    /**
     * Transfer money to another account
     * @param req
     * @param res
     */
    static async makeTransfer(req: any, res: any) {
        const amount = Number(req.body.amount);

        const [err, fromAccount] = await Account.find(req.user.user_id);
        if (err) return res.status(500).json({ data: {}, message: err });
        if (fromAccount.balance <= amount) return res.status(400).json({ data: {}, message: 'Insufficient funds' });

        const [errTo, toAccount] = await Account.find(req.body.toAccount);
        if (errTo) return res.status(500).json({ data: {}, message: errTo });

        const batch = firestore.batch();

        const fromAccountTransaction = firestore.collection('users').doc(fromAccount.id);
        batch.set(fromAccountTransaction, { balance: fromAccount.balance - amount }, { merge: true });

        const toAccountTransaction = firestore.collection('users').doc(toAccount.id);
        batch.set(toAccountTransaction, { balance: toAccount.balance + amount }, { merge: true });

        const transactionsHistory = firestore.collection('transactions').doc();
        batch.set(transactionsHistory, { fromAccount, toAccount, amount, sentAt: admin.firestore.FieldValue.serverTimestamp() });

        const [error, response] = await to(batch.commit());
        if (error) return res.status(500).json({ data: {}, message: error });
        return res.status(201).json({ data: response, message: 'Success' });
    }
}// class

export default TransactionController;
