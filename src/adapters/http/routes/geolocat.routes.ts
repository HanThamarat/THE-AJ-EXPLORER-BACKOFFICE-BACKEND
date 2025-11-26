
import express from "express";
import { GeolocatPrismaORM } from "../prisma/geolocation";
import { GeolocatService } from "../../../core/services/geolocatService";
import { GeolocatController } from "../controllers/geolocatController";
import { validateRequest } from "../middleware/validateRequest";
import { geolocationIdParamSchema } from "../../../core/entity/geolocation";

const router = express.Router();

const geolocationRepositoryPort = new GeolocatPrismaORM();
const geolocationService = new GeolocatService(geolocationRepositoryPort);
const geolocationController = new GeolocatController(geolocationService);

/**
 * @swagger
 * tags:
 *   name: Geolocation
 *   description: Geolocation management
 */

/**
* @swagger
* /api/v1/geolocation/provinces:
*   get:
*     tags: [Geolocation]
*     summary: Get all provinces
*     responses:
*       200:
*         description: Fetch a list of all provinces from the system.
*/
router.get("/provinces", geolocationController.finnAllprovince.bind(geolocationController));

/**
* @swagger
* /api/v1/geolocation/district/{id}:
*   get:
*     tags: [Geolocation]
*     summary: Get all district by province
*     parameters:
*       - in: path
*         name: id
*         required: true
*         description:  Get all district by province id.
*         schema:
*           type: string
*     requestBody:
*     responses:
*       200:
*         description:  Get all district by province successfully.
*/
router.get(
  "/district/:id",
  validateRequest({ params: geolocationIdParamSchema }),
  geolocationController.findDistrictByProId.bind(geolocationController)
);

export default router;