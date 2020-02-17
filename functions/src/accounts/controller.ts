import Account from "./model";

class AccountController {

    /**
     * Get Account Details
     * @param req
     * @param res
     */
    static async getAccountbalance(req: any, res: any) {
        const [err, accountData] = await Account.find(req.user.user_id);
        if (err) return res.status(500).json({ data: {}, message: err.message });
        return res.status(200).json({ data: accountData, message: 'Success' });
    }

    /**
     * Get all accounts
     * @param req 
     * @param res 
     */
    static async getAllAccounts(req: any, res: any) {
        const [err, accountData] = await Account.all();
        if (err) return res.status(500).json({ data: {}, message: err.message });
        return res.status(200).json({ data: accountData, message: 'Success' });
    }

}// class

export default AccountController;
