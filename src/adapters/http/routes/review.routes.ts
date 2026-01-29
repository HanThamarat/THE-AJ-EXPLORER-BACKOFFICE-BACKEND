import express from "express";
import { ReviewDataSource } from "../prisma/review";
import { ReviewService } from "../../../core/services/reviewService";
import { ReviewController } from "../controllers/reviewController";
import { validateRequest } from "../middleware/validateRequest";
import { reviewDTOSchema } from "../../../core/entity/review";

const router = express.Router();
const reviewRepositoryPort = new ReviewDataSource();
const reviewService = new ReviewService(reviewRepositoryPort);
const reviewController = new ReviewController(reviewService);

/**
 * @swagger
 * tags:
 *   name: Review
 *   description: Review Service
 */

/**
* @swagger
* /api/v1/client/review_service/review:
*   post:
*     tags: [Review]
*     summary: Create a new review
*     description: Create a new review in the system.
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/reviewDTO'
*     responses:
*       200:
*         description: Create a new review successfully.
*         content:
*           application/json:
*               schema:
*                   $ref: '#/components/schemas/reviewEntity'
*/
router.post("/review", 
    validateRequest({ body: reviewDTOSchema }),
    reviewController.createNewReview.bind(reviewController)
);

/**
* @swagger
*  /api/v1/client/review_service/review:
*   get:
*     tags: [Review]
*     summary: Find all my review.
*     responses:
*       200:
*         description: Find all my review successfully.
*         content:
*           application/json:
*               schema:
*                   $ref: '#/components/schemas/myReviewResponse'
*/
router.get("/review", reviewController.findMyReviews.bind(reviewController));

/**
* @swagger
* /api/v1/client/review_service/packate_review:
*   get:
*     tags: [Review]
*     summary: Get the package review
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
*       - in: query
*         name: packageId
*         schema:
*           type: string
*         description: Search by packageId
*     responses:
*       200:
*         description: et the package review successfully.
*         content:
*           application/json:
*               schema:
*                   $ref: '#/components/schemas/packageReviewResponse'
*/
router.get("/packate_review", reviewController.findPackageReview.bind(reviewController));

export default router;