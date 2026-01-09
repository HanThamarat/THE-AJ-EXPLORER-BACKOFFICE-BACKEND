import { prisma } from "../../adapters/database/data-source";

export const InitialBanking = async () => {
    try {

        const recheckInitialize = await prisma.banking.count({});

        if (recheckInitialize !== 0) return console.log("🚀 Banking list initial successfully.");

        const bankList = [
            {
              code: "BBL",
              name_th: "ธนาคารกรุงเทพ",
              name_en: "Bangkok Bank",
              logo_url: "./src/assets/svg/Bkk.svg",
              omise_method: "internet_banking_bbl"
            },
            {
              code: "KBANK",
              name_th: "ธนาคารกสิกรไทย",
              name_en: "Kasikornbank",
              logo_url: "./src/assets/svg/Kbanlk.svg",
              omise_method: "internet_banking_kbank"
            },
            {
              code: "KTB",
              name_th: "ธนาคารกรุงไทย",
              name_en: "Krung Thai Bank",
              logo_url: "./src/assets/svg/Next.svg",
              omise_method: "internet_banking_ktb"
            },
            {
              code: "SCB",
              name_th: "ธนาคารไทยพาณิชย์",
              name_en: "Siam Commercial Bank",
              logo_url: "./src/assets/svg/Scb.svg",
              omise_method: "internet_banking_scb"
            },
            {
                code: "BAY",
                name_th: "ธนาคารกรุงศรีอยุธยา",
                name_en: "Bank of Ayudhya",
                logo_url: "./src/assets/svg/KrungSri.svg",
                omise_method: "internet_banking_bay"
            }
        ];

        const createNewBanking = await prisma.banking.createMany({
            data: bankList.map((item) => ({
                bankNameEn: item.name_en,
                bankNameTh: item.name_th,
                bankCode: item.code,
                bankShortName: item.code,
                bankPicture: item.logo_url
            }))
        });

        console.log("🚀 Banking list initial successfully.");
    } catch (error) {
        console.log("Initial banking failed : ", error);
    };
}