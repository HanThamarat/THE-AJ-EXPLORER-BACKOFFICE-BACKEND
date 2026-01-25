import { cancelDetailEntityType, cancelDTOType, cancelEntityType } from "../entity/cancel";

export interface CancelRepositoryPort {
    findAllCancel(): Promise<cancelEntityType[]>;
    findCancelDetail(bookingId: string): Promise<cancelDetailEntityType>;
    updateCancel(bookingId: string, cancelDTO: cancelDTOType): Promise<cancelEntityType>;
}