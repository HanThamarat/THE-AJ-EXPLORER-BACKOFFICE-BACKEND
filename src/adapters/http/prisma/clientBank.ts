import { bankEntityType } from "../../../core/entity/clientBank";
import { ClientBankRepositoryPort } from "../../../core/ports/clientBankRepositoryPort";
import { prisma } from "../../database/data-source";
import { Convertion } from "../../helpers/convertion";
import dotenv from "dotenv";

dotenv.config();

const devMode = process.env.DEV || false;

export class ClientBankDataSource implements ClientBankRepositoryPort {
    async findBankOption(): Promise<bankEntityType[]> {
        const result = await prisma.banking.findMany({});

        const mapResultFormat: bankEntityType[] = await Promise.all(result.map(async (item) => {
            
            const pathSplit = (item.bankPicture as string).split('./');
            const path = devMode ? item.bankPicture : `./dist/${pathSplit[2] as string}`

            const base64 = await Convertion.FileToBase64WithPath(path as string);

            return {
                id: item.id,
                bankNameEn: item.bankNameEn,
                bankNameTh: item.bankNameTh,
                bankCode: item.bankCode,
                bankPicture: base64
            }
        }));

        return mapResultFormat;
    }
}