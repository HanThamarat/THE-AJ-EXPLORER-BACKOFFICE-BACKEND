import { PromoService } from "../../../core/services/promoService";
import { setResponse, setErrResponse } from "../../../hooks/response";
import { Request, Response } from "express";
import { Ecrypt } from "../../helpers/encrypt";
import { PromotionDTO, PromotionLinkDTO } from "../../../core/entity/promotion";

export class PromoController {
    constructor(private promoService: PromoService) {}

    async createPromo(req: Request, res: Response) {
        try {
            const { promoName, startDate, endDate, status, PromoLink, type, couponCode, description } = req.body;
            const userInfo = await Ecrypt.JWTDecrypt(req);
            const userId = await userInfo?.id;
            const PromoLinkArr: PromotionLinkDTO[] = PromoLink.map((data: PromotionLinkDTO) => ({
                percentage: data.percentage,
                packageLink: data.packageLink,
            }));
            
            const promoData: PromotionDTO = {
                type: type,
                couponCode: couponCode,
                description: description,
                promoName: promoName,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                status: status,
                created_by: Number(userId),
                updated_by: Number(userId),
                packagePromoLink: PromoLinkArr
            };

            const response = await this.promoService.createPromo(promoData);

            return setResponse({
                res: res,
                message: "Creating a promotion successfully.",
                body: response,
                statusCode: 201,
            });
        } catch (err) {
            return setErrResponse({
                res: res,
                message: "Creating a promotion failed.",
                error: err instanceof Error ? err.message : 'Creating a package failed.',
                statusCode: 500
            });
        }
    }

    async findAllPromo(req: Request, res: Response) {
        try {
            const response = await this.promoService.findAll();

            return setResponse({
                res: res,
                message: "Finding all promotion successfully.",
                body: response,
                statusCode: 200,
            });
        } catch (err) {
            return setErrResponse({
                res: res,
                message: "Finding all promotion failed.",
                error: err instanceof Error ? err.message : 'Finding all promotion failed.',
                statusCode: 500
            });
        }
    }

    async findPromoById(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const response = await this.promoService.findById(id);

            return setResponse({
                res: res,
                message: "Finding promotion by id successfully.",
                body: response,
                statusCode: 200,
            });
        } catch (err) {
            return setErrResponse({
                res: res,
                message: "Finding promotion by id failed.",
                error: err instanceof Error ? err.message : 'Finding promotion by id failed.',
                statusCode: 500
            });
        }
    }

    async updatePromo(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { promoName, startDate, endDate, status, PromoLink, type, couponCode, description } = req.body;
            const userInfo = await Ecrypt.JWTDecrypt(req);
            const userId = await userInfo?.id;
            const PromoLinkArr: PromotionLinkDTO[] = PromoLink.map((data: PromotionLinkDTO) => ({
                id: data.id,
                percentage: data.percentage,
                packageLink: data.packageLink,
            }));
            
            const promoData: PromotionDTO = {
                promoName: promoName,
                type: type,
                couponCode: couponCode,
                description: description,
                startDate: new Date(startDate),
                endDate: new Date(endDate),
                status: status,
                updated_by: Number(userId),
                created_by: Number(userId),
                packagePromoLink: PromoLinkArr
            };

            const response = await this.promoService.update(id, promoData);

            return setResponse({
                res: res,
                message: "Updating promotion by id successfully.",
                body: response,
                statusCode: 200,
            });
        } catch(err) {
            return setErrResponse({
                res: res,
                message: "Updating promotion by id failed.",
                error: err instanceof Error ? err.message : 'Updating promotion by id failed.',
                statusCode: 500
            });
        }
    }

    async deletePromo(req: Request, res: Response) {
        try {
            const { id } = req.params;

            const response = await this.promoService.delete(id);

            return setResponse({
                res: res,
                message: "Deleting promotion by id successfully.",
                body: response,
                statusCode: 200,
            });
        } catch (err) {
            return setErrResponse({
                res: res,
                message: "Deleting promotion by id failed.",
                error: err instanceof Error ? err.message : 'Deleting promotion by id failed.',
                statusCode: 500
            });
        }
    }

    async findPromoDay(req: Request, res: Response) {
        try {
            const response = await this.promoService.findPromoDay();

            return setResponse({
                res: res,
                message: "Finding the promotion day successfully.",
                body: response,
                statusCode: 200
            });
        } catch (err) {
            return setErrResponse({
                res: res,
                message: "Finding the promotion day failed.",
                error: err instanceof Error ? err.message : 'Finding the promotion day failed.',
                statusCode: 500
            });
        }
    }
}