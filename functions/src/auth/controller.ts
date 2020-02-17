export { };
import axios from 'axios';
import to from 'await-to-js';
import admin from './../firebase'

const APIKEY: string = 'AIzaSyAwdp1QhhCJp14kJuZZPJytaqzU15dK3ag';
const REST_ENDPOINT_LOGIN: string = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${APIKEY}`;
const REST_ENDPOINT_SIGNUP: string = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${APIKEY}`;
const REST_ENDPOINT_RESET_PASSWORD: string = `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${APIKEY}`;
const REST_ENDPOINT_CHANGE_PASSWORD: string = `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${APIKEY}`;

interface SignUpRequest {
    email: string,
    password: string,
}

interface userRegisterData {
    email: string,
    name: string,
    balance: number
}

interface LoginRequest {
    email: string,
    password: string,
    returnSecureToken: boolean
}

interface resetPasswordRequest {
    requestType: string,
    email: string
}

interface changePasswordRequest {
    idToken: string,
    password: string,
    returnSecureToken: boolean
}

class AuthController {
    static async login(req: any, resp: any, next: any) {
        const loginData: LoginRequest = {
            email: req.body.email,
            password: req.body.password,
            returnSecureToken: true
        };

        const [error, responseData] = await to(axios.post(REST_ENDPOINT_LOGIN, loginData));
        if (error || responseData === undefined) return resp.status(500).send({ data: error.message, message: 'Login Error' });

        return resp.status(200).send(responseData.data);
    }

    private signUpFirebase(signUpData: SignUpRequest) {
        return axios.post(REST_ENDPOINT_SIGNUP, signUpData);
    }

    private async registerUserInFirestore(userId: string, userData: userRegisterData) {
        const [error, result] = await to(admin.firestore().collection('users').doc(userId).set(userData));
        if (error) return [error];

        return [null, result];
    }

    static async signup(req: any, resp: any, next: any) {
        const signUpData: SignUpRequest = {
            email: req.body.email,
            password: req.body.password
        };

        const [error, data] = await to((new AuthController).signUpFirebase(signUpData));
        if (error) return resp.status(500).send({ data: error, message: 'Error signing up the user to firebase' });
        if (data === undefined) return resp.status(205).send({ message: 'Success signing up the user to firebase but unknown resp' });

        //Register the user in firestore
        const userData: userRegisterData = {
            email: req.body.email,
            name: req.body.fullName,
            balance: req.body.balance
        };

        const [errorStoreUser] = await (new AuthController).registerUserInFirestore(data.data.localId, userData);
        if (errorStoreUser) return resp.status(500).send({ data: errorStoreUser.message, message: 'Error storing the user in firestore' });

        const responseData = data.data;
        responseData.name = userData.name;

        return resp.status(200).send(responseData);
    }

    static async recoveryPassword(req: any, resp: any, next: any) {
        const resetPasswordData: resetPasswordRequest = {
            requestType: "PASSWORD_RESET",
            email: req.body.email
        };

        const [error, data] = await to(axios.post(REST_ENDPOINT_RESET_PASSWORD, resetPasswordData));
        if (error || data === undefined) return resp.status(500).send({ data: error.message, message: 'Reset Password Error' });
        return resp.status(200).send(data.data);
    }

    static async changePassword(req: any, resp: any, next: any) {
        let idToken = '';
        if (req.query.idToken) {
            idToken = req.query.idToken;
        } else if (req.headers.authorization) {
            idToken = req.headers.authorization.split(' ')[1];
        }
        const changePasswordData: changePasswordRequest = {
            idToken: idToken,
            password: req.body.password,
            returnSecureToken: true
        };
        const [error, data] = await to(axios.post(REST_ENDPOINT_CHANGE_PASSWORD, changePasswordData));
        if (error || data === undefined) return resp.status(500).send({ data: error.message, message: 'Change Password Error' });
        return resp.status(200).send(data.data);
    }
}

export default AuthController;
