import express from "express";
import { BkDataSource } from "../prisma/booking";
import { BkService } from "../../../core/services/bookingService";
import { BkController } from "../controllers/bookingController";
import { prisma } from "../../database/data-source";

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

export default router;