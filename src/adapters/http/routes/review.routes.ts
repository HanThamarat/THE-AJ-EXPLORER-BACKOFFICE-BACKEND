import express from "express";
import { ReviewDataSource } from "../prisma/review";
import { ReviewService } from "../../../core/services/reviewService";
import { ReviewController } from "../controllers/revireController";
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

export default router;