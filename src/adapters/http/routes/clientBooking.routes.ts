import express from 'express';
import { BookingDataSource } from '../prisma/clientBooking';
import { BookingService } from '../../../core/services/clientBookingService';
import { BookingContorller } from '../controllers/clientBookingController';
import { prisma as db } from '../../database/data-source';
import { validateRequest } from '../middleware/validateRequest';
import { cancelBookingDTO, clientBookingCreateSchema } from '../../../core/entity/clientBooking';

const router = express.Router();
const bookingRepository = new BookingDataSource(db);
const bookingService = new BookingService(bookingRepository);
const bookingController = new BookingContorller(bookingService);

/**
 * @swagger
 * tags:
 *   name: ClientBooking
 *   description: Client Booking Service
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CreateBooking:
 *       type: object
 *       properties:
 *         contractBooking:
 *           type: object
 *           properties:
 *            userId:
 *             type: string
 *             example: "cmi0escrq0000s7vu1ymxfb80"
 *            firstName:
 *             type: string
 *             example: "Thamarat"
 *            lastName:
 *             type: string
 *             example: "Laosen"
 *            email:
 *             type: string
 *             example: "hanthamarat@gmail.com"
 *            country:
 *             type: string
 *             example: "TH"
 *            phoneNumber:
 *             type: string
 *             example: "0917128484"
 *         packageId:
 *           type: integer
 *           example: 1
 *         childPrice:
 *           type: integer
 *           example: 700
 *         childQty:
 *           type: integer
 *           example: 2
 *         adultPrice:
 *           type: integer
 *           example: 1500
 *         adultQty:
 *           type: integer
 *           example: 3
 *         groupPrice:
 *           type: integer
 *           example: 0
 *         groupQty:
 *           type: integer
 *           example: 0
 *         amount:
 *           type: integer
 *           example: 5900
 *         additionalDetail:
 *           type: string
 *           example: "A 3-day adventure in Phuket"
 *         pickupLocation:
 *           type: string
 *           example: "Panon hotel"
 *         locationId:
 *           type: integer
 *           example: 0
 *         pickup_lat:
 *           type: float
 *           example: 13.9312082
 *         pickup_lgn:
 *           type: float
 *           example: 100.6307107
 *         trip_at:
 *           type: string
 *           example: "2025-12-15"
 *         policyAccept:
 *           type: boolean
 *           example: true
 *       required:
 *         - amount
 *         - pickup_lat
 *         - pickup_lgn
 *         - trip_at
 *         - policyAccept
 * 
 *     CreateCanCalBooking:
 *       type: object
 *       properties:
 *         bookingId:
 *           type: string
 *           example: "Booking Id"
 *         reason:
 *           type: string
 *           example: "reason for cancel"
 *         bankAccount:
 *           type: object
 *           properties:
 *            bankId:
 *             type: integer
 *             example: 1
 *            accountFirstName:
 *             type: string
 *             example: "Thamarat"
 *            accountLastName:
 *             type: string
 *             example: "Laosen"
 *            accountNumber:
 *             type: string
 *             example: "10-131314-1414-14"
 *       required:
 *         - bookingId
 *         - bankAccount
 */

/**
* @swagger
* /api/v1/client/booking_service/booking:
*   post:
*     tags: [ClientBooking]
*     summary: Create a new booking
*     description: Create a new booking in the system.
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/CreateBooking'
*     responses:
*       201:
*         description: booking created
*/
router.post(
  '/booking',
  validateRequest({ body: clientBookingCreateSchema }),
  bookingController.createBooking.bind(bookingController)
);

/**
* @swagger
* /api/v1/client/booking_service/my_trip:
*   get:
*     tags: [ClientBooking]
*     summary: Get the packages
*     parameters:
*       - in: query
*         name: page
*         schema:
*           type: string
*         description: Page type
*     responses:
*       200:
*         description:  Get the packages.
*/
router.get("/my_trip", bookingController.findmytrip.bind(bookingController));

/**
* @swagger
* /api/v1/client/booking_service/booking_detail/{bookingId}:
*   get:
*     tags: [ClientBooking]
*     summary: Get booking info by booking id
*     parameters:
*       - in: path
*         name: bookingId
*         required: true
*         description: The ID of the get booking detail.
*         schema:
*           type: string
*     requestBody:
*     responses:
*       200:
*         description: Fetch booking detail from system.
*/
router.get("/booking_detail/:bookingId", bookingController.findBookingDetail.bind(bookingController));

/**
* @swagger
* /api/v1/client/booking_service/get_booking_confirmation/{bookingId}:
*   get:
*     tags: [ClientBooking]
*     summary: Sending booking info to email
*     parameters:
*       - in: path
*         name: bookingId
*         required: true
*         description: The ID of the get booking detail.
*         schema:
*           type: string
*     requestBody:
*     responses:
*       200:
*         description: Sending booking info to email detail from system.
*/
router.get("/get_booking_confirmation/:bookingId", bookingController.getBookConfirmation.bind(bookingController));


/**
* @swagger
* /api/v1/client/booking_service/create_cancel_booking:
*   post:
*     tags: [ClientBooking]
*     summary: Create a new cancel booking
*     description: Create a new cancel booking in the system.
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/CreateCanCalBooking'
*     responses:
*       201:
*         description: cancel booking created
*/
router.post("/create_cancel_booking", 
  validateRequest({ body: cancelBookingDTO }),
  bookingController.cancelBooking.bind(bookingController)
);

export default router;