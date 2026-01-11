import express from "express";
import { BkDataSource } from "../prisma/booking";
import { BkService } from "../../../core/services/bookingService";
import { BkController } from "../controllers/bookingController";
import { prisma } from "../../database/data-source";
import { validateRequest } from "../middleware/validateRequest";
import { bookingDetailDTOSchema } from "../../../core/entity/booking";

const router = express.Router();
const bkRepositoryPort = new BkDataSource(prisma);
const bkService = new BkService(bkRepositoryPort);
const bkController = new BkController(bkService); 

/**
 * @swagger
 * tags:
 *   name: Booking
 *   description: Booking Service
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateBookingInfo:
 *       type: object
 *       properties:
 *         firstName:
 *           type: string
 *           example: "Thamarat"
 *         lastName:
 *           type: string
 *           example: "Laosen"
 *         country:
 *           type: string
 *           example: "TH"
 *         email:
 *           type: string
 *           example: "hanthamarat@gmail.com"
 *         phoneNumber:
 *           type: string
 *           example: "0917128484"
 *         trip_at:
 *           type: string
 *           example: "2026-01-29"
 *         pickupLocation:
 *           type: string
 *           example: "Panan Krabi Resort"
 *         specialRequirement:
 *           type: string
 *           example: "I want the ring"
 *       required:
 *         - firstName
 *         - lastName
 *         - country
 *         - email
 *         - phoneNumber
 *         - trip_at
 *         - pickupLocation
 *         - specialRequirement
 */


/**
* @swagger
* /api/v1/booking_management/booking:
*   get:
*     tags: [Booking]
*     summary: Finding all booking
*     description: Finding all in the system.
*     responses:
*       200:
*         description: booking created
*/
router.get("/booking", bkController.findBooking.bind(bkController));

/**
* @swagger
* /api/v1/booking_management/booking_avg/{type}:
*   get:
*     tags: [Booking]
*     summary: Finding booking the avg
*     parameters:
*       - in: path
*         name: type
*         required: true
*         description: Get type to get
*         schema:
*           type: string
*     requestBody:
*     responses:
*       200:
*         description: Finding booking the avg successfully.
*/
router.get("/booking_avg/:type", bkController.findBookingAvg.bind(bkController));

/**
* @swagger
* /api/v1/booking_management/booking_detail/{bookingId}:
*   get:
*     tags: [Booking]
*     summary: Finding booking detail
*     parameters:
*       - in: path
*         name: bookingId
*         required: true
*         description: Get booking detail
*         schema:
*           type: string
*     requestBody:
*     responses:
*       200:
*         description: Finding booking detail successfully.
*/
router.get("/booking_detail/:bookingId", bkController.findBookingDetail.bind(bkController));

/**
* @swagger
* /api/v1/booking_management/update_booking_status/{bookingId}/{bookingStatus}:
*   put:
*     tags: [Booking]
*     summary: Finding booking detail
*     parameters:
*       - in: path
*         name: bookingId
*         required: true
*         description: update booking status
*         schema:
*           type: string
*       - in: path
*         name: bookingStatus
*         required: true
*         description: panding, confirmed, failed
*         schema:
*           type: string
*     requestBody:
*     responses:
*       200:
*         description: Finding booking detail successfully.
*/
router.put("/update_booking_status/:bookingId/:bookingStatus", bkController.updateBookingStatus.bind(bkController));

/**
* @swagger
* /api/v1/booking_management/update_booking_detail/{bookingId}:
*   put:
*     tags: [Booking]
*     summary: Finding booking detail
*     parameters:
*       - in: path
*         name: bookingId
*         required: true
*         description: update booking info
*         schema:
*           type: string
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/UpdateBookingInfo'
*     responses:
*       200:
*         description: Finding booking detail successfully.
*/
router.put("/update_booking_detail/:bookingId",
    validateRequest({ body: bookingDetailDTOSchema }),
    bkController.updateBookingDetail.bind(bkController)
);

export default router;