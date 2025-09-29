import { provinceRelational, districtByProidEntity } from "../entity/geolocation";

export interface GeolocatRepositoryPort {
    findAllProvince(): Promise<provinceRelational[]>;
    findDistrictByProId(id: string): Promise<districtByProidEntity[]>; 
}