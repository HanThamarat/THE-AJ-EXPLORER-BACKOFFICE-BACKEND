import express from "express";
import { PaymentDataSource } from "../prisma/payment";
import { prisma as db } from "../../database/data-source";
import { PaymentService } from "../../../core/services/paymentService";
import { PaymentController } from "../controllers/paymentController";
import { validateRequest } from "../middleware/validateRequest";
import { BookingByCardDTO, chargeDTOSchema, createMobileBankChargeSchema } from "../../../core/entity/payment";

const router = express.Router();
const paymentRepositoryPort = new PaymentDataSource(db);
const paymentService = new PaymentService(paymentRepositoryPort);
const paymentController = new PaymentController(paymentService);

/**
 * @swagger
 * tags:
 *   name: Payment
 *   description: Client Payment Service
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CreatePaymentMbBanking:
 *       type: object
 *       properties:
 *         bank:
 *           type: string
 *           example: "mobile_banking_bbl"
 *         bookingId:
 *           type: string
 *           example: "BK-1414141414141"
 *       required:
 *         - bank
 *         - bookingId
 * 
 *     CreatePaymentPromptpay:
 *       type: object
 *       properties:
 *         bookingId:
 *           type: string
 *           example: "BK-1414141414141"
 *       required:
 *         - bookingId
 * 
 *     CreateBookingByCard:
 *       type: object
 *       properties:
 *         contractBooking:
 *           type: object
 *           properties:
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
 *         card:
 *           type: object
 *           properties:
 *            card_name:
 *             type: string
 *             example: "JOHN DOE"
 *            card_number:
 *             type: string
 *             example: "4242424242424242"
 *            expiration_month:
 *             type: integer
 *             example: 02
 *            expiration_year:
 *             type: ingeger
 *             example: 27
 *            security_code:
 *             type: string
 *             example: "123"
 *            city:
 *             type: string
 *             example: "Bangkok"
 *            postal_code:
 *             type: string
 *             example: "10320"
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
 *         - contractBooking
 *         - card
 */


/**
* @swagger
* /api/v1/client/payment_service/createbook_card:
*   post:
*     tags: [Payment]
*     summary: Create a new booking and pay with card
*     description: Create a new booking and pay with card in the system.
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/CreateBookingByCard'
*     responses:
*       201:
*         description: booking created
*/
router.post("/createbook_card", 
    validateRequest({ body: BookingByCardDTO }),
    paymentController.createBookingCard.bind(paymentController)
);

/**
* @swagger
* /api/v1/client/payment_service/promptpay:
*   post:
*     tags: [Payment]
*     summary: Create a new charges for generate qr code promptpay.
*     description: Create a new charges for generate qr code promptpay.
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/CreatePaymentPromptpay'
*     responses:
*       201:
*         description: Create a new charges for generate qr code promptpay successfully.
*/
router.post(
  "/promptpay",
  validateRequest({ body: chargeDTOSchema }),
  paymentController.generateQr.bind(paymentController)
);

/**
* @swagger
* /api/v1/client/payment_service/moblie_banking:
*   post:
*     tags: [Payment]
*     summary: Create a new charges for moblie banking.
*     description: Create a new charges for moblie banking.
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/CreatePaymentMbBanking'
*     responses:
*       201:
*         description: Create a new charges for moblie banking successfully.
*/
router.post("/moblie_banking",
  validateRequest({ body: createMobileBankChargeSchema }),
  paymentController.createBookWithMbBank.bind(paymentController)
);

export default router;