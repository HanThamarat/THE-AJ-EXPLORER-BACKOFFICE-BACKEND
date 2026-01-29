import { packageReviewSearchType, packageReviwResponseType, reviewDTOType, reviewEntityType, reviewResponseType } from "../entity/review";
import { ReviewRepositoryPort } from "../ports/reviewRepositoryPort";

export class ReviewService {
    constructor(private reviewRepositoryPort: ReviewRepositoryPort) {}

    createNewReview(userId: string, reviewDTO: reviewDTOType): Promise<reviewEntityType> {
        return this.reviewRepositoryPort.createNewReview(userId, reviewDTO);
    }

    findMyReviews(userId: string): Promise<reviewResponseType[]> {
        return this.reviewRepositoryPort.findMyReviews(userId);
    }

    findPackageReview(searchParams: packageReviewSearchType): Promise<packageReviwResponseType | null> {
        return this.reviewRepositoryPort.findPackageReview(searchParams);
    }
}