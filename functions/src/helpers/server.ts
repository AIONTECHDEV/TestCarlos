export { };
const express = require('express');
const cors = require('cors');

//APP
class Server {
    static create(routes: any) {
        const app = express();
        //Middlewares
        app.use(cors());
        //Next error middleware
        app.use((error: any, req: any, res: any, next: any) => {
            if (error) {
                console.error(`${error}`);
                return res.status(500).json({responseError: error.message});
            }
            return error
        });
        app.use('/', routes);
        return app
    }
}

module.exports = Server;