import express from "express";
import { CancelDataSource } from "../prisma/cancel";
import { CancelService } from "../../../core/services/cancelService";
import { CancelController } from "../controllers/cancelController";

const router = express.Router();
const cancelRepositoryPort = new CancelDataSource();
const cancelService = new CancelService(cancelRepositoryPort);
const cancelController = new CancelController(cancelService);

/**
 * @swagger
 * tags:
 *   name: Cancel
 *   description: Cancel Service
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateCancelBooking:
 *       type: object
 *       properties:
 *         cancelStatus:
 *           type: string
 *           example: "confirmed"
 *       required:
 *         - cancelStatus
 */

/**
* @swagger
*  /api/v1/cancel_service/cancel:
*   get:
*     tags: [Cancel]
*     summary: Finding all cancel
*     responses:
*       200:
*         description: Finding all cancel successfully.
*/
router.get('/cancel', cancelController.findAllCancel.bind(cancelController));

/**
* @swagger
* /api/v1/cancel_service/cancel/{bookingId}:
*   get:
*     tags: [Cancel]
*     summary: Find cancel booking by bookingID
*     description: Find cancel booking in the system.
*     parameters:
*       - in: path
*         name: bookingId
*         required: true
*         description: The ID of the updated cancel booking.
*         schema:
*           type: string
*     responses:
*       200:
*         description: Find cancel booking in the system successfully
*/
router.get('/cancel/:bookingId', cancelController.findCancelDetail.bind(cancelController));

/**
* @swagger
* /api/v1/cancel_service/cancel/{bookingId}:
*   put:
*     tags: [Cancel]
*     summary: Update cancel booking by bookingID
*     description: Update cancel booking status in the system.
*     parameters:
*       - in: path
*         name: bookingId
*         required: true
*         description: The ID of the updated cancel booking.
*         schema:
*           type: string
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/UpdateCancelBooking'
*     responses:
*       200:
*         description: Update cancel booking status in the system successfully
*/
router.put('/cancel/:bookingId', cancelController.updateCancelStatus.bind(cancelController));

export default router;