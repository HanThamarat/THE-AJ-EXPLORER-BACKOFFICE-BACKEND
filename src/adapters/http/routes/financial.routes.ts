
import express from "express";
import { FinancialORM } from "../prisma/financial";
import { FinancialService } from "../../../core/services/financialService";
import { FinancialController } from "../controllers/financialController";

const router = express.Router();

const financialRepositoryPort = new FinancialORM();
const financialService = new FinancialService(financialRepositoryPort);
const financialController = new FinancialController(financialService);

/**
 * @swagger
 * tags:
 *   name: Financial
 *   description: Financial management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CreatePaymentPromptpay:
 *       type: object
 *       properties:
 *         bookingId:
 *           type: string
 *           example: "BK-1414141414141"
 *         amount:
 *           type: integer
 *           example: 10000
 *       required:
 *         - bookingId
 *         - amount
 * 
 *     CreateRefund:
 *       type: object
 *       properties:
 *         chargesId:
 *           type: string
 *           example: "chargesId"
 *         booking_id:
 *           type: string
 *           example: "booking_id"
 *         amount:
 *           type: integer
 *           example: 10000
 *       required:
 *         - chargesId
 *         - amount
 *         - booking_id
 */

/**
* @swagger
* /api/v1/financial/balance:
*   get:
*     tags: [Financial]
*     summary: Get the financial
*     responses:
*       200:
*         description: Get the financial.
*/
router.get("/balance", financialController.balance.bind(financialController));

/**
* @swagger
* /api/v1/financial/pay/promptpay:
*   post:
*     tags: [Financial]
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
router.post("/pay/promptpay", financialController.generateQr.bind(financialController));

/**
* @swagger
* /api/v1/financial/charges/{id}:
*   get:
*     tags: [Financial]
*     summary: Get charges info by charge id
*     parameters:
*       - in: path
*         name: id
*         required: true
*         description: Get charges info by charge id
*         schema:
*           type: string
*     requestBody:
*     responses:
*       200:
*         description: Get charges info by charge id successfully.
*/
router.get("/charges/:id", financialController.findChargesById.bind(financialController));

/**
* @swagger
* /api/v1/financial/refund:
*   post:
*     tags: [Financial]
*     summary: Create a new refund by charges id.
*     description: Create a new refund by charges id.
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/CreateRefund'
*     responses:
*       201:
*         description: Creating a new refund by charge id successfully. 
*/
router.post('/refund', financialController.createRefund.bind(financialController));

export default router;