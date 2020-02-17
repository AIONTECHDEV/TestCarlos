import { validateAll } from 'indicative/validator';
import to from 'await-to-js';

class TransactionRequest {

    static async validateStore(req: any, res: any, next: any) {
        const [error] = await to(validateAll(req.body, {
            toAccount: 'required|string',
            amount: "required|number"
        }));
        if (error) return res.status(400).json({ errors: error, message: 'There was an error with the input' });
        next();
    }
}

export default TransactionRequest;