import * as express from "express";
import { PromoPrismaORM } from "../prisma/promotion";
import { PromoService } from "../../../core/services/promoService";
import { PromoController } from "../controllers/promoController";
import { validateRequest } from "../middleware/validateRequest";
import { promotionCreateBodySchema, promotionIdParamSchema, promotionUpdateBodySchema } from "../../../core/entity/promotion";

const router = express.Router();
const promotionRepository = new PromoPrismaORM();
const promotionService = new PromoService(promotionRepository);
const promotionController = new PromoController(promotionService);

/**
 * @swagger
 * tags:
 *   name: Promotion
 *   description: Package Promotion management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     PrmoLinkDTO:
 *       type: object
 *       properties:
 *         percentage:
 *           type: integer
 *           example: 10
 *         packageLink:
 *           type: integer
 *           example: 2
 *       required:
 *         - percentage
 *         - packageLink
 * 
 *     PrmoLinkUpdateDTO:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           example: 1
 *         percentage:
 *           type: integer
 *           example: 10
 *         packageLink:
 *           type: integer
 *           example: 2
 *       required:
 *         - percentage
 *         - packageLink
 * 
 *
 *     CreatePromoDTO:
 *       type: object
 *       properties:
 *         promoName:
 *           type: string
 *           example: "Summer"
 *         type:
 *           type: string
 *           example: "promotion"
 *         couponCode:
 *           type: string
 *           example: "HanThamaratCode"
 *         description:
 *           type: string
 *           example: "Description"
 *         startDate:
 *           type: string
 *           example: "2023-08-15"
 *         endDate:
 *           type: string
 *           example: "2023-08-15"
 *         status:
 *           type: boolean
 *           example: true
 *         PromoLink:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PrmoLinkDTO'
 *       required:
 *         - promoName
 *         - startDate
 *         - endDate
 *         - status
 * 
 *     UpdatePromoDTO:
 *       type: object
 *       properties:
 *         promoName:
 *           type: string
 *           example: "Summer"
 *         startDate:
 *           type: string
 *           example: "2023-08-15"
 *         endDate:
 *           type: string
 *           example: "2023-08-15"
 *         status:
 *           type: boolean
 *           example: true
 *         PromoLink:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PrmoLinkUpdateDTO'
 *       required:
 *         - promoName
 *         - startDate
 *         - endDate
 *         - status
 */

/**
* @swagger
* /api/v1/packagepromotion/promotion:
*   post:
*     tags: [Promotion]
*     summary: Create a new package promotion
*     description: Create a new package promotion in the system.
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/CreatePromoDTO'
*     responses:
*       201:
*         description: package promotion created
*/
router.post(
  "/promotion",
  validateRequest({ body: promotionCreateBodySchema }),
  promotionController.createPromo.bind(promotionController)
);

/**
* @swagger
* /api/v1/packagepromotion/promotion:
*   get:
*     tags: [Promotion]
*     summary: Get all package promotion
*     responses:
*       200:
*         description: Fetch a list of all package promotion from the system.
*/
router.get("/promotion", promotionController.findAllPromo.bind(promotionController));

/**
* @swagger
* /api/v1/packagepromotion/promotion/{id}:
*   get:
*     tags: [Promotion]
*     summary: Get package promo info by promo id
*     parameters:
*       - in: path
*         name: id
*         required: true
*         description: The ID of the get package promo by promo id.
*         schema:
*           type: string
*     requestBody:
*     responses:
*       200:
*         description: Fetch a list of package promo info usinng promo id from the system.
*/
router.get(
  "/promotion/:id",
  validateRequest({ params: promotionIdParamSchema }),
  promotionController.findPromoById.bind(promotionController)
);

/**
* @swagger
* /api/v1/packagepromotion/promotion/{id}:
*   put:
*     tags: [Promotion]
*     summary: Update a package Promotion by ID
*     description: Update package Promotion in the system.
*     parameters:
*       - in: path
*         name: id
*         required: true
*         description: The ID of the updated package.
*         schema:
*           type: string
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/UpdatePromoDTO'
*     responses:
*       200:
*         description: update Promotion by Promotion id successfully
*/
router.put(
  "/promotion/:id",
  validateRequest({ params: promotionIdParamSchema, body: promotionUpdateBodySchema }),
  promotionController.updatePromo.bind(promotionController)
);

/**
 * @swagger
 * /api/v1/packagepromotion/promotion/{id}:
 *   delete:
 *     tags: [Promotion]
 *     summary: Delete a package promo by ID
 *     description: Delete a package promo from the system based on their unique ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the package promo to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: deleting package promo by id successfully
 */
router.delete(
  "/promotion/:id",
  validateRequest({ params: promotionIdParamSchema }),
  promotionController.deletePromo.bind(promotionController)
);

/**
* @swagger
* /api/v1/packagepromotion/promotion_day:
*   get:
*     tags: [Promotion]
*     summary: Get all package promotion day
*     responses:
*       200:
*         description: Fetch a list of all package promotion day from the system.
*/
router.get("/promotion_day", promotionController.findPromoDay.bind(promotionController));

export default router;