import { Promotion, PromotionDTO } from "../entity/promotion";
import { PromoRepositoryPort } from "../ports/promoRepositoryPort";

export class PromoService {
    constructor(private readonly promotionRepo: PromoRepositoryPort) {}

    async createPromo(promoDto: PromotionDTO): Promise<Promotion> {
        return this.promotionRepo.create(promoDto);
    }

    async findAll(): Promise<Promotion[]> {
        return this.promotionRepo.findAll();
    }

    async findById(id: string): Promise<Promotion> {
        return this.promotionRepo.findById(id);
    }

    async update(id: string, promoDto: PromotionDTO): Promise<Promotion> {
        return this.promotionRepo.update(id, promoDto);
    }

    async delete(id: string): Promise<Promotion> {
        return this.promotionRepo.delete(id);
    }
}