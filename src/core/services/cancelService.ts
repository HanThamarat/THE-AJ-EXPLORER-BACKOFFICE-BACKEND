import { cancelDetailEntityType, cancelDTOType, cancelEntityType } from "../entity/cancel";
import { CancelRepositoryPort } from "../ports/cancelRepositoryPort";

export class CancelService {
    constructor(private cancelRepositoryPort: CancelRepositoryPort) {}

    findAllCancel(): Promise<cancelEntityType[]> {
        return this.cancelRepositoryPort.findAllCancel();
    }

    updateCancel(bookingId: string, cancelDTO: cancelDTOType): Promise<cancelEntityType> {
        return this.cancelRepositoryPort.updateCancel(bookingId, cancelDTO);
    }

    findCancelDetail(bookingId: string): Promise<cancelDetailEntityType> {
        return this.cancelRepositoryPort.findCancelDetail(bookingId);
    }
}