import express from "express";
import { ClientPackageDataSource } from "../prisma/clientPackage";
import { ClientPackageService } from "../../../core/services/clientPackage";
import { ClientPackageController } from "../controllers/clientPackageController";
import { prisma as db } from "../../database/data-source";

const router = express.Router();
const clientPackageRepository = new ClientPackageDataSource(db);
const clientPackageService = new ClientPackageService(clientPackageRepository);
const clientPackageController = new ClientPackageController(clientPackageService);

/**
 * @swagger
 * tags:
 *   name: ClientPackage
 *   description: Client Package for use system
 */

/**
* @swagger
* /api/v1/client/package/province_package:
*   get:
*     tags: [ClientPackage]
*     summary: Get the province package
*     responses:
*       200:
*         description:  Get the province package.
*/
router.get("/province_package", clientPackageController.findProvinceByPackages.bind(clientPackageController));

export default router;