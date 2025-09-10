import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import { setResponse, setErrResponse } from './hooks/response';
import morgan from 'morgan';
import cors from 'cors';
import { swaggerui, sawgerserver } from './conf/swagger';
import AutoinitializeData from './auto/initialize';
import passport from 'passport';
import  './adapters/http/middleware/passport';
import { rateLimit } from 'express-rate-limit';
import bodyParser from 'body-parser';

// import routes  here
import authRoutes       from './adapters/http/routes/auth.routes';
import userRoutes       from './adapters/http/routes/user.routes';
import packageRoutes    from './adapters/http/routes/package.routes';
import promoRoutes      from './adapters/http/routes/promo.routes';


dotenv.config();

const app = express();
const port : any = process.env.PORT;


const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Authorization', 'Origin', 'X-Requested-With', 'X-API-KEY'],
    credentials: true,
};

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
})

app.use(bodyParser.json({ limit: 200 * 1024 * 1024 })); // 200 MB
app.use(bodyParser.urlencoded({ limit: 200 * 1024 * 1024, extended: true }));
app.use(morgan('dev'));
app.use(cors(corsOptions));
app.use(limiter);

app.set("trust proxy", 1);

app.use('/docs', sawgerserver, swaggerui);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/usermanagement', passport.authenticate('jwt', { session: false }), userRoutes);
app.use('/api/v1/packagemanagement', passport.authenticate('jwt', { session: false }), packageRoutes);
app.use('/api/v1/packagepromotion', passport.authenticate('jwt', { session: false }), promoRoutes);

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
        AutoinitializeData();
        console.log('Server is runing on port :', port);
    } catch (error) {
        return console.log('Server is not runing : ', error);
    }
});