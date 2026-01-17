import express from "express";
import { ClientVoucherDataSource } from "../prisma/clientVoucher";
import { ClientVoucherService } from "../../../core/services/clientVoucherService";
import { ClientVoucherController } from "../controllers/clientVoucherController";
import { validateRequest } from "../middleware/validateRequest";
import { couponInventoryDTOSchema } from "../../../core/entity/clientVoucher";

const router = express.Router();
const clientVoucherRepositoryPort = new ClientVoucherDataSource();
const clientVoucherService = new ClientVoucherService(clientVoucherRepositoryPort);
const clientVoucherController = new ClientVoucherController(clientVoucherService);

/**
 * @swagger
 * tags:
 *   name: ClientVoucher
 *   description: Client Voucher for use system
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     AddNewCoupon:
 *       type: object
 *       properties:
 *         couponId:
 *           type: integer
 *           example: 1
 *       required:
 *         - couponId
 */

/**
* @swagger
* /api/v1/client/voucher_service/coupon_inventory:
*   post:
*     tags: [ClientVoucher]
*     summary: Add new coupon to inventory
*     description: Add new coupon to inventory in the system.
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/AddNewCoupon'
*     responses:
*       201:
*         description: Add new coupon to inventory in the system successfully.
*/
router.post('/coupon_inventory',
    validateRequest({ body: couponInventoryDTOSchema }),
    clientVoucherController.addCouponInventory.bind(clientVoucherController)
);

/**
* @swagger
* /api/v1/client/voucher_service/coupon_list:
*   get:
*     tags: [ClientVoucher]
*     summary: Get all coupon
*     parameters:
*       - in: query
*         name: page
*         schema:
*           type: integer
*         description: Page number
*       - in: query
*         name: limit
*         schema:
*           type: integer
*         description: Items per page
*     responses:
*       200:
*         description:  Get all coupon successfully.
*/
router.get('/coupon_list', clientVoucherController.findCoupons.bind(clientVoucherController));

export default router;