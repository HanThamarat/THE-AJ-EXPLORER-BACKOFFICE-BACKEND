import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { setResponse, setErrResponse } from './hooks/response';
import morgan from 'morgan';
import cors from 'cors';

dotenv.config();

const app = express();
const port : any = process.env.PORT;


const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Authorization', 'Origin', 'X-Requested-With', 'X-API-KEY'],
    credentials: true,
};

app.use(express.json());
app.use(morgan('dev'));
app.use(cors(corsOptions));

app.get('/', (req: Request, res: Response) => {
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