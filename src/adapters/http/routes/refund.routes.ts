import express from "express";
import { RefundDataSource } from "../prisma/refund";
import { RefundService } from "../../../core/services/refundService";
import { RefundController } from "../controllers/refundController";
import { validateRequest } from "../middleware/validateRequest";
import { refundDTOSchema } from "../../../core/entity/refund";

const router = express.Router();
const refundRepositoryPort = new RefundDataSource();
const refundService = new RefundService(refundRepositoryPort);
const refundController = new RefundController(refundService);

/**
 * @swagger
 * tags:
 *   name: Refund
 *   description: Refund Service
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     UpdateRefundBooking:
 *       type: object
 *       properties:
 *         refundStatus:
 *           type: string
 *           example: "confirmed"
 *       required:
 *         - cancelStatus
 */

/**
* @swagger
*  /api/v1/refund_service/refund:
*   get:
*     tags: [Refund]
*     summary: Find all refund
*     responses:
*       200:
*         description: Finding all refund.
*/
router.get('/refund', refundController.findAllRefund.bind(refundController));

/**
* @swagger
* /api/v1/refund_service/refund/{bookingId}:
*   get:
*     tags: [Refund]
*     summary: Find refund booking by bookingID
*     description: Find refund booking in the system.
*     parameters:
*       - in: path
*         name: bookingId
*         required: true
*         description: The ID of the updated refund booking.
*         schema:
*           type: string
*     responses:
*       200:
*         description: Find refund booking in the system successfully
*/
router.get('/refund/:bookingId', refundController.findRefundDetail.bind(refundController));

/**
* @swagger
* /api/v1/refund_service/refund/{bookingId}:
*   put:
*     tags: [Refund]
*     summary: Update refund booking by bookingID
*     description: Update refund booking status in the system.
*     parameters:
*       - in: path
*         name: bookingId
*         required: true
*         description: The ID of the updated refund booking.
*         schema:
*           type: string
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/UpdateRefundBooking'
*     responses:
*       200:
*         description: Update refund booking status in the system successfully
*/
router.put('/refund/:bookingId', 
    validateRequest({ body: refundDTOSchema }),
    refundController.updateRefund.bind(refundController)
);

export default router;