import { prisma } from "../../adapters/database/data-source";
import provinces from '../json/provinces.json';
import districts from '../json/districts.json';
import subdistricts from '../json/subdistricts.json';

export const geographyInitial = async () => {
    try {
        const reheckInitail = await prisma.province.count({});

        if (reheckInitail !== 0) return console.log('🚀 Geography Initialized.');

        await prisma.$transaction(async (tx) => {
            for (const p of provinces) {
                await tx.province.create({
                data: {
                    code: p.provinceCode,
                    nameTh: p.provinceNameTh,
                    nameEn: p.provinceNameEn
                }
                });
            }
    
            for (const d of districts) {
                await tx.district.create({
                data: {
                    code: d.districtCode,
                    nameTh: d.districtNameTh,
                    nameEn: d.districtNameEn,
                    province: { connect: { code: d.provinceCode } }
                }
                });
            }
    
            for (const s of subdistricts) {
                await tx.subdistrict.create({
                data: {
                    code: s.subdistrictCode,
                    nameTh: s.subdistrictNameTh,
                    nameEn: s.subdistrictNameEn,
                    postalCode: `${s.postalCode}`,
                    district: { connect: { code: s.districtCode } }
                }
                });
            }
        });

        console.log('🚀 Geography Initialize successfully.');
    } catch (error) {
        return console.log(`geographyInitial failed: `, error);
    }
}