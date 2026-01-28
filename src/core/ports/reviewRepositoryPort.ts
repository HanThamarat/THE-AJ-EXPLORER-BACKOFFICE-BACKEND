import { reviewDTOType, reviewEntityType, reviewResponseType } from "../entity/review";

export interface ReviewRepositoryPort {
    createNewReview(userId: string, reviewDTO: reviewDTOType): Promise<reviewEntityType>;
    findMyReviews(userId: string): Promise<reviewResponseType[]>;
}