import { ClientVoucherService } from "../../../core/services/clientVoucherService";
import { Request, Response } from "express";
import { setErrResponse, setResponse } from "../../../hooks/response";
import { couponInventoryDTOType, couponSearchParamsType } from "../../../core/entity/clientVoucher";
import { Ecrypt } from "../../helpers/encrypt";

export class ClientVoucherController {
    constructor(private clientVoucherService: ClientVoucherService) {}

    async findCoupons(req: Request, res: Response) {
        try {
            const { page, limit } = req.query;
            let userId;

            if (req.headers['authorization']) {
                const userInfo = await Ecrypt.JWTClientDecrypt(req);
                userId = userInfo?.id;
            }

            const dataFormat: couponSearchParamsType = {
                page: page ? Number(page) : 1,
                limit: limit ? Number(limit) : 10,
                userId: userId
            };

            const response = await this.clientVoucherService.findAllCoupon(dataFormat);

            return setResponse({
                res: res,
                statusCode: 200,
                message: "Finding the all coupon successfully",
                body: response
            });
        } catch (error) {
            return setErrResponse({
                res: res,
                statusCode: 500,
                message: "Finding the all coupon failed.",
                error: error instanceof Error ? error.message : "Finding the all coupon failed.",
            });
        }
    }

    async addCouponInventory(req: Request, res: Response) {
        try {
            const { couponId } = req.body;
            const userInfo = await Ecrypt.JWTClientDecrypt(req);
            const userId = userInfo?.id;

            const dataFormat: couponInventoryDTOType = {
                couponId: Number(couponId),
                userId: userId as string
            };

            const response = await this.clientVoucherService.addCouponInventory(dataFormat);

            return setResponse({
                res: res,
                statusCode: 201,
                message: "Add new coupon to inventory successfully",
                body: response
            });
        } catch (error) {
            return setErrResponse({
                res: res,
                statusCode: 500,
                message: "Add new coupon to inventory failed.",
                error: error instanceof Error ? error.message : "Add new coupon to inventory failed.",
            });
        }
    }
}