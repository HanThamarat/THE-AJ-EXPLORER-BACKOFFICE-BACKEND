import { bookingAvgDataType } from "../entity/booking";
import { overviewEntityType, popularProviceType, qtyEntityType } from "../entity/kpi";
import { KPIRepositoryPort } from "../ports/kpiRepositoryPort";

export class KPIService {
    constructor(private kpiRepositoryPort: KPIRepositoryPort) {}

    findPopularProvince(): Promise<popularProviceType[]> {
        return this.kpiRepositoryPort.findPopularProvince();
    }

    findTotalBooking(): Promise<qtyEntityType> {
        return this.kpiRepositoryPort.findTotalBooking();
    }

    findTotalPackage(): Promise<qtyEntityType> {
        return this.kpiRepositoryPort.findTotalPackage();
    }

    findOverview(): Promise<overviewEntityType[]> {
        return this.kpiRepositoryPort.findOverview();
    }

    findTotalIncome(): Promise<bookingAvgDataType[]> {
        return this.kpiRepositoryPort.findTotalIncome();   
    }
}