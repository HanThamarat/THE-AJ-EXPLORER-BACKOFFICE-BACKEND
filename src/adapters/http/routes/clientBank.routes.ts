import express from "express";
import { ClientBankDataSource } from "../prisma/clientBank";
import { ClientBankService } from "../../../core/services/clientBankService";
import { ClientBankController } from "../controllers/clientBankController";

const router = express.Router();
const clientBankRepositoryPort = new ClientBankDataSource();
const clientBankService = new ClientBankService(clientBankRepositoryPort);
const clientBankController = new ClientBankController(clientBankService);

/**
 * @swagger
 * tags:
 *   name: ClientBank
 *   description: Client Bank Service
 */

/**
* @swagger
*  /api/v1/client/bank_service/bank_list:
*   get:
*     tags: [ClientBank]
*     summary: Get the list of bank
*     responses:
*       200:
*         description: Get the list of bank successfully.
*/
router.get("/bank_list", clientBankController.findBankOption.bind(clientBankController));

export default router;