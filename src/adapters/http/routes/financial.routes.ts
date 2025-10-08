
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
* /api/v1/financial/balance:
*   get:
*     tags: [Financial]
*     summary: Get the financial
*     responses:
*       200:
*         description: Get the financial.
*/
router.get("/balance", financialController.balance.bind(financialController));

export default router;