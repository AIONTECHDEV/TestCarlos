import admin from '../firebase'
import to from 'await-to-js';

const roleRanks = {
    superAdmin: 1,
    admin: 2,
    user: 3
};

class AuthJWT {
    static async decodeFirebaseIdToken(req: any, res: any, next: any) {
        let idToken: string = ''
        if (req.query.idToken) {
            idToken = req.query.idToken;
        } else if (req.headers.authorization) {
            idToken = req.headers.authorization.split(' ')[1];
        } else {
            return AuthJWT.responseError(res, 400, 'You did not specify any idToken for this request')
        }
        const [error, userPayload] = await <any>to(admin.auth().verifyIdToken(idToken))
        if (error) return AuthJWT.responseError(res, 500, error.toString())
        req.user = userPayload
        return next()
    };

    // Checks if a user is authenticated from firebase admin
    static async isAuthorized(req: any, res: any, next: any) {
        return req.user ? next() : AuthJWT.responseError(res, 401, 'You are not allowed to access this resource. SignUp/Login to continue')
    };

    // Checks if a user has the required permission from token claims stored in firebase admin for the user
    static async hasAdminRole(req: any, res: any, next: any) {
        try {
            const roleRequest = await admin.firebase.database().ref('roles').once('value');
            const rolesPayload = roleRequest.val();
            const role = rolesPayload.find((userRole: any) => userRole.id === roleRanks.admin)

            if (req.user.roleId <= role.id) {
                return next();
            } else {
                return res.status(403).json({
                    error: {
                        message: 'You are not allowed to access this resource'
                    }
                });
            }
        } catch (error) {
            return res.status(500).json({
                error: {
                    message: 'An error occurred while getting user access. Please try again'
                }
            });
        }
    };

    private static responseError(res: any, status: number, message: any) {
        return res.status(status).json({
            error: {
                message: message
            }
        })
    }
}

export default AuthJWT;