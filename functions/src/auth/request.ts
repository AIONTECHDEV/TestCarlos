import { validateAll } from 'indicative/validator';
import to from 'await-to-js';

class AuthRequest {
    static async validateSignup(req: any, res: any, next: any) {
        const [error] = await to(validateAll(req.body, {
            fullName: 'required',
            email: 'required|email',
            password: 'required|min:6',
            confirmPassword: 'required|same:password',
            balance: 'required|number'
        }));
        if (error) return res.status(400).json({ errors: error, message: 'There was an error with the input' });
        return next();
    }

    static async validateLogin(req: any, res: any, next: any) {
        const [error] = await to(validateAll(req.body, {
            email: 'required|email',
            password: 'required|min:6',
        }));
        if (error) return res.status(400).json({ errors: error, message: 'There was an error with the input' });
        next();
    }

    static async validateResetPassword(req: any, res: any, next: any) {
        const [error] = await to(validateAll(req.body, {
            email: 'required|email'
        }));
        if (error) return res.status(400).json({ errors: error, message: 'There was an error with the input' });
        return next();
    }

    static async validateChangePassword(req: any, res: any, next: any) {
        const [error] = await to(validateAll(req.body, {
            password: 'required|min:6'
        }));
        if (error) return res.status(400).json({ errors: error, message: 'There was an error with the input' });
        return next();
    }
}

export default AuthRequest;