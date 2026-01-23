import { bookingAvgDataType } from "../entity/booking";
import { overviewEntityType, popularProviceType, qtyEntityType } from "../entity/kpi";


export interface KPIRepositoryPort {
    findPopularProvince(): Promise<popularProviceType[]>;
    findTotalBooking(): Promise<qtyEntityType>;
    findTotalPackage(): Promise<qtyEntityType>;
    findOverview(): Promise<overviewEntityType[]>;
    findTotalIncome(): Promise<bookingAvgDataType[]>;
}