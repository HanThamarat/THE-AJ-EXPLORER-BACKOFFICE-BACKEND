import { Request, Response } from "express";
import { ReviewService } from "../../../core/services/reviewService";
import { setErrResponse, setResponse } from "../../../hooks/response";
import { reviewDTOType } from "../../../core/entity/review";
import { Ecrypt } from "../../helpers/encrypt";

export class ReviewController {
    constructor(private reviewService: ReviewService) {}

    async createNewReview(req: Request, res: Response) {
        try {
            const { bookingId, cleanliness, staff, location, title, samary } = req.body as reviewDTOType;
            const userInfo = await Ecrypt.JWTClientDecrypt(req);
            const userId: string = userInfo?.id as string;

            const dataDTO: reviewDTOType = {
                bookingId,
                cleanliness,
                staff,
                location,
                title,
                samary
            };

            const response = await this.reviewService.createNewReview(userId, dataDTO);
            
            return setResponse({
                res: res,
                statusCode: 201,
                message: "Create new review successfully.",
                body: response
            });
        } catch (error) {
            return setErrResponse({
                res: res,
                statusCode: 500,
                message: "Create new review failed.",
                error: error instanceof Error ? error.message : 'Create new review failed.'
            });
        }
    };

    async findMyReviews(req: Request, res: Response) {
        try {
            const userInfo = await Ecrypt.JWTClientDecrypt(req);
            const userId: string = userInfo?.id as string;

            const response = await this.reviewService.findMyReviews(userId);

            return setResponse({
                res: res,
                statusCode: 201,
                message: "Find my reviews successfully.",
                body: response
            });
        } catch (error) {
            return setErrResponse({
                res: res,
                statusCode: 500,
                message: "Find my reviews failed.",
                error: error instanceof Error ? error.message : 'Create new review failed.'
            });
        }
    }
}