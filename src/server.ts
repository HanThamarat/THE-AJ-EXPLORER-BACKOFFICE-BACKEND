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
import http from 'http';
import { setupSocket } from './conf/socket';
import helmet from 'helmet';

// import routes  here
import authRoutes       from './adapters/http/routes/auth.routes';
import userRoutes       from './adapters/http/routes/user.routes';
import packageRoutes    from './adapters/http/routes/package.routes';
import promoRoutes      from './adapters/http/routes/promo.routes';
import pkgTypeRoutes    from './adapters/http/routes/pkgType.routes';
import geolocatRoutes   from './adapters/http/routes/geolocat.routes';
import financialRoutes  from './adapters/http/routes/financial.routes';
import { Server } from 'socket.io';


dotenv.config();

const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 3000;
const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
});

setupSocket(io);

const corsOrigins = process.env.CORS_URL?.split(",") || [];
const corsOptions = {
    origin: corsOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Authorization', 'Origin', 'X-Requested-With', 'X-API-KEY'],
    credentials: true,
};

const helmetOption = {
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'", "*"],
        connectSrc: ["'self'", "*"],
        imgSrc: ["'self'", "data:", "*"],
        styleSrc: ["'self'", "'unsafe-inline'", "*"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "*"],
      },
    },
    crossOriginEmbedderPolicy: false,
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
app.use(helmet(helmetOption));

app.set("trust proxy", 1);

app.use('/docs', sawgerserver, swaggerui);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/usermanagement', passport.authenticate('jwt', { session: false }), userRoutes);
app.use('/api/v1/packagemanagement', passport.authenticate('jwt', { session: false }), packageRoutes);
app.use('/api/v1/packagepromotion', passport.authenticate('jwt', { session: false }), promoRoutes);
app.use('/api/v1/pkgtypemanagement', passport.authenticate('jwt', { session: false }), pkgTypeRoutes);
app.use('/api/v1/geolocation', passport.authenticate('jwt', { session: false }), geolocatRoutes);
app.use('/api/v1/financial', passport.authenticate('jwt', { session: false }), financialRoutes);

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

server.listen(port, () => {
    try {
        AutoinitializeData();
        console.log('Server is runing on port :', port);
    } catch (error) {
        return console.log('Server is not runing : ', error);
    }
});