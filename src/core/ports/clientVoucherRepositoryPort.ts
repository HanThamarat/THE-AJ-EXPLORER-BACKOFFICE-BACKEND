import { couponEntityType, couponInventoryDTOType, couponSearchParamsType, couponsResponseType } from "../entity/clientVoucher";


export interface ClientVoucherRepositoryPort {
    findAllCoupon(params: couponSearchParamsType): Promise<couponsResponseType>;
    addCouponInventory(couponInventoryDTO: couponInventoryDTOType): Promise<couponEntityType>;
}