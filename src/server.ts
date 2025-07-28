import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { setResponse, setErrResponse } from './hooks/response';

dotenv.config();

const app = express();
const port : any = process.env.PORT;

app.use('/', (req: Request, res: Response) => {
    try {
        return setResponse({
            res: res,
            statusCode: 200,
            message: "Server is runing",
            body: []
        });
    } catch (err) {
        return setErrResponse({
            res: res, 
            statusCode: 500, 
            message: "Server Error", 
            error: "Server Error"
        }); 
    }
})

app.listen(port, () => {
    try {
        console.log('Server is runing on port :', port);
    } catch (error) {
        return console.log('Server is not runing : ', error);
    }
});