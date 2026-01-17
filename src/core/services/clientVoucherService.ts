import { couponEntityType, couponInventoryDTOType, couponSearchParamsType, couponsResponseType } from "../entity/clientVoucher";
import { ClientVoucherRepositoryPort } from "../ports/clientVoucherRepositoryPort";

export class ClientVoucherService {
    constructor(private clientVoucherRepositoryPort: ClientVoucherRepositoryPort) {}

    findAllCoupon(params: couponSearchParamsType): Promise<couponsResponseType> {
        return this.clientVoucherRepositoryPort.findAllCoupon(params);
    }

    addCouponInventory(couponInventoryDTO: couponInventoryDTOType): Promise<couponEntityType> {
        return this.clientVoucherRepositoryPort.addCouponInventory(couponInventoryDTO);
    }
}