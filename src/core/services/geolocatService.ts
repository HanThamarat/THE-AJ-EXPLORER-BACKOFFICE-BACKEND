import { districtByProidEntity, provinceRelational } from "../entity/geolocation";
import { GeolocatRepositoryPort } from "../ports/geolocatRepository";

export class GeolocatService {
    constructor(private readonly geolocatRepositoryPort: GeolocatRepositoryPort) {}

    findAllProvince(): Promise<provinceRelational[]> {
        return this.geolocatRepositoryPort.findAllProvince();
    }

    findDistrictByProId(id: string): Promise<districtByProidEntity[]> {
        return this.geolocatRepositoryPort.findDistrictByProId(id);
    }
}