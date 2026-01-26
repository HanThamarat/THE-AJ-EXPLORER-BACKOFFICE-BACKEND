import express, { NextFunction, Request, Response } from 'express';
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
import { requestLogger } from './conf/requestLogger';

// import routes  here
import authRoutes               from './adapters/http/routes/auth.routes';
import userRoutes               from './adapters/http/routes/user.routes';
import packageRoutes            from './adapters/http/routes/package.routes';
import promoRoutes              from './adapters/http/routes/promo.routes';
import pkgTypeRoutes            from './adapters/http/routes/pkgType.routes';
import geolocatRoutes           from './adapters/http/routes/geolocat.routes';
import financialRoutes          from './adapters/http/routes/financial.routes';
import blogRoutes               from './adapters/http/routes/blog.routes';
import bookingRoutes            from './adapters/http/routes/booking.routes';
import clientPackageRoutes      from "./adapters/http/routes/clientPackage.routes";
import clientbookingRoutes      from './adapters/http/routes/clientBooking.routes';
import clientPaymentRoutes      from "./adapters/http/routes/payment.routes";
import clientBlogRoutes         from "./adapters/http/routes/clientBlog.routes";
import clientVoucherRoutes      from "./adapters/http/routes/clientVoucher.routes";
import clientBankRoutes         from "./adapters/http/routes/clientBank.routes";
import kipRoutes                from "./adapters/http/routes/kpi.routes";
import cancelRoutes             from "./adapters/http/routes/cancel.routes";
import refundRoutes             from "./adapters/http/routes/refund.routes";

import { Server } from 'socket.io';
import { clientAuthMiddleware } from './conf/clientMiddleware';


dotenv.config({
    quiet: process.env.NODE_ENV === 'test'
});

const app = express();

const corsOrigins = process.env.CORS_URL?.split(",") || [];
const corsOptions = {
    origin: corsOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
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
	limit: 400, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
	standardHeaders: 'draft-8', // draft-6: `RateLimit-*` headers; draft-7 & draft-8: combined `RateLimit` header
	legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
	ipv6Subnet: 56, // Set to 60 or 64 to be less aggressive, or 52 or 48 to be more aggressive
})

app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.path === '/api/v1/client/payment_service/webhooks/omise') return next();
    bodyParser.json({ limit: 200 * 1024 * 1024 })(req, res, next);
}); // body size 200MB

app.use((req: Request, res: Response, next: NextFunction) => {
    if (req.path === '/api/v1/client/payment_service/webhooks/omise') return next();
    bodyParser.urlencoded({ limit: 200 * 1024 * 1024, extended: true })(req, res, next);
});

process.env.NODE_ENV !== 'test' && app.use(morgan('dev'));
app.use(cors(corsOptions));
app.use(limiter);
app.use(helmet(helmetOption));
app.use(requestLogger);
app.set("etag", false);
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');
  next();
});

app.set("trust proxy", 1);

// back office
app.use('/docs', sawgerserver, swaggerui);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/usermanagement', passport.authenticate('jwt', { session: false }), userRoutes);
app.use('/api/v1/packagemanagement', passport.authenticate('jwt', { session: false }), packageRoutes);
app.use('/api/v1/packagepromotion', passport.authenticate('jwt', { session: false }), promoRoutes);
app.use('/api/v1/pkgtypemanagement', passport.authenticate('jwt', { session: false }), pkgTypeRoutes);
app.use('/api/v1/geolocation', passport.authenticate('jwt', { session: false }), geolocatRoutes);
app.use('/api/v1/financial', passport.authenticate('jwt', { session: false }), financialRoutes);
app.use('/api/v1/blogmanagement', passport.authenticate('jwt', { session: false }), blogRoutes);
app.use('/api/v1/booking_management', passport.authenticate('jwt', { session: false }), bookingRoutes);
app.use('/api/v1/kpi_service', passport.authenticate('jwt', { session: false }), kipRoutes);
app.use('/api/v1/cancel_service', passport.authenticate('jwt', { session: false }), cancelRoutes);
app.use('/api/v1/refund_service', passport.authenticate('jwt', { session: false }), refundRoutes);

// client
app.use('/api/v1/client/package', clientPackageRoutes);
app.use('/api/v1/client/blog', clientBlogRoutes);
app.use('/api/v1/client/bank_service', clientAuthMiddleware, clientBankRoutes);
app.use('/api/v1/client/booking_service', clientAuthMiddleware, clientbookingRoutes);
app.use('/api/v1/client/voucher_service', (req, res, next) => {
    if (req.path === '/coupon_list' && req.method === 'GET') {
        express.json()(req, res, () => {
            next();
        });
    } else {
        express.json()(req, res, () => {
            clientAuthMiddleware(req, res, next);
        });
    }
}, clientVoucherRoutes);

// payments
app.use('/api/v1/client/payment_service', (req, res, next) => {
  // skip auth and use raw body for webhook
  if (req.path === '/webhooks/omise' && req.method === 'POST') {
    express.raw({ type: 'application/json' })(req, res, () => {
      next();
    });
  } else {
    // apply json parser and auth for other routes
    express.json()(req, res, () => {
      clientAuthMiddleware(req, res, next);
    });
  }
}, clientPaymentRoutes);

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

if (process.env.NODE_ENV !== "test") {
    const port = process.env.PORT ? Number(process.env.PORT) : 3000;
    const server = http.createServer(app);

    const io = new Server(server, {
        cors: {
            origin: "*",
            methods: ["GET", "POST"],
        },
    });


    setupSocket(io);

    server.listen(port, () => {
        try {
            AutoinitializeData();
            console.log('🚀 Server is runing on port :', port);
        } catch (error) {
            return console.log('Server is not runing : ', error);
        }
    });
}


export default app;