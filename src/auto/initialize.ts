import RoleInitial from "./entity/role";
import UserInitial from "./entity/user";
import { geographyInitial } from "./entity/geography";
import { packageOptionTypeInitial } from "./entity/package";

export default async function AutoinitializeData() {
    try {
        await RoleInitial();
        await UserInitial();
        await geographyInitial();
        await packageOptionTypeInitial();
    } catch (err) {
        return console.log('Initialize failed: ', err);
    }
};