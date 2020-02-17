import { to } from 'await-to-js';
import admin from '../firebase';
const firestore = admin.firestore();

class Transaction {

    /**
     * Get sent transactions
     * @param accountId
     */
    static async getSentTransactions(accountId: string) {
        const [err, result] = await to<any>(firestore.collection('transactions').where('fromAccount.id', "==", accountId).get());
        if (err) return [err];
        const data = result.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
        return [null, data]
    }

    /**
     * Get reveived transactions
     * @param accountId
     */
    static async getReceivedTransactions(accountId: string) {
        const [err, result] = await to<any>(firestore.collection('transactions').where('toAccount.id', "==", accountId).get());
        if (err) return [err];
        const data = result.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
        return [null, data]
    }

}

export default Transaction;