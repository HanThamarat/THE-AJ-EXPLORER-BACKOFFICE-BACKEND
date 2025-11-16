import { Promotion, promotionDay, PromotionDTO } from "../entity/promotion";

export interface PromoRepositoryPort {
    create(promoDto: PromotionDTO): Promise<Promotion>;
    findAll(): Promise<Promotion[]>;
    findById(id: string): Promise<Promotion>;
    update(id: string, promoDto: PromotionDTO): Promise<Promotion>;
    delete(id: string): Promise<Promotion>;
    findPromoDay(): Promise<promotionDay[]>;
}