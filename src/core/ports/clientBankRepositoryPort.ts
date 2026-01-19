import { bankEntityType } from "../entity/clientBank";

export interface ClientBankRepositoryPort {
    findBankOption(): Promise<bankEntityType[]>;
}