import { to } from 'await-to-js';
import admin from '../firebase';
const firestore = admin.firestore();

class Account {

    /**
     * Get account data by id
     * @param id
     */
    static async find(id: string) {
        const [err, result] = await to<any>(firestore.collection('users').doc(id).get());
        if (err) return [err];
        if (result.data() === undefined) {
            return [new Error('Data not found')];
        }
        const account = { id: result.id, ...result.data() };
        return [null, account]
    }

    /**
     * Get all accounts
     */
    static async all() {
        const [err, result] = await to<any>(firestore.collection('users').get());
        if (err) return [err];
        const accounts = result.docs.map((doc: any) => ({ id: doc.id, ...doc.data(), balance: 'XXXX' }))
        return [null, accounts]
    }

}

export default Account;