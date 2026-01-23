import express from "express";
import { KPIDataSource } from "../prisma/kpi";
import { KPIService } from "../../../core/services/kpiService";
import { KPIController } from "../controllers/kpiController";

const router = express.Router();
const kipRepositoryPort = new KPIDataSource();
const kipService = new KPIService(kipRepositoryPort);
const kpiController = new KPIController(kipService);

/**
 * @swagger
 * tags:
 *   name: KPI
 *   description: This api category use for monitor the systems
 */

/**
* @swagger
* /api/v1/kpi_service/popular_province:
*   get:
*     tags: [KPI]
*     summary: Get popular provice info by ref from booking
*     responses:
*       200:
*         description: Get popular provice successfully.
*/
router.get("/popular_province", kpiController.findPopularProvince.bind(kpiController));

/**
* @swagger
* /api/v1/kpi_service/booking_qty:
*   get:
*     tags: [KPI]
*     summary: Get booking total per mounth
*     responses:
*       200:
*         description: Get booking total per mounth successfully.
*/
router.get('/booking_qty', kpiController.findTotalBooking.bind(kpiController));

/**
* @swagger
* /api/v1/kpi_service/package_qty:
*   get:
*     tags: [KPI]
*     summary: Get package total
*     responses:
*       200:
*         description: Get package total successfully.
*/
router.get('/package_qty', kpiController.findTotalPackage.bind(kpiController));

/**
* @swagger
* /api/v1/kpi_service/booking_overview:
*   get:
*     tags: [KPI]
*     summary: Get booking overview
*     responses:
*       200:
*         description: Get booking overview successfully.
*/
router.get('/booking_overview', kpiController.findOverview.bind(kpiController));

/**
* @swagger
* /api/v1/kpi_service/total_income:
*   get:
*     tags: [KPI]
*     summary: Find booking total income
*     responses:
*       200:
*         description: Find booking total income successfully.
*/
router.get('/total_income', kpiController.findTotalIncome.bind(kpiController));

export default router;