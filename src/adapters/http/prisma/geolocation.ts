import { GEOLOCATION } from "../../../types/geolocat";
import { districtByProidEntity, provinceRelational } from "../../../core/entity/geolocation";
import { GeolocatRepositoryPort } from "../../../core/ports/geolocatRepository";
import { prisma } from "../../database/data-source";
import { CacheHelper } from "../../helpers/redisCache";

export class GeolocatPrismaORM implements GeolocatRepositoryPort {
    async findAllProvince(): Promise<provinceRelational[]> {

        const geolocatCache = await CacheHelper.getCache(GEOLOCATION.CACHE_NAME);

        if (geolocatCache !== null) {
            const prasePkgCache = JSON.parse(geolocatCache);
            return prasePkgCache as provinceRelational[];
        }
        
        const result = await prisma.province.findMany({
            select: {
                id: true,
                code: true,
                nameEn: true,
                nameTh: true,
            }
        });

        const convertArr = await JSON.stringify(result);
        await CacheHelper.setCache(GEOLOCATION.CACHE_NAME, convertArr); 

        return result;
    }

    async findDistrictByProId(id: string): Promise<districtByProidEntity[]> {
        const result = await prisma.district.findMany({
            where: {
                provinceId: Number(id)
            },
            select: {
                id: true,
                code: true,
                nameEn: true,
                nameTh: true,
                subdistricts: {
                    select: {
                        id: true,
                        code: true,
                        nameEn: true,
                        nameTh: true,
                    }
                }
            }
        });

        return result;
    }
}