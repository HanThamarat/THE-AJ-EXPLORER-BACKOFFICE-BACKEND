import { bankEntityType } from "../entity/clientBank";
import { ClientBankRepositoryPort } from "../ports/clientBankRepositoryPort";

export class ClientBankService {
    constructor(private clientBankRepositoryPort: ClientBankRepositoryPort) {}

    findBankOption(): Promise<bankEntityType[]> {
        return this.clientBankRepositoryPort.findBankOption();
    }
}