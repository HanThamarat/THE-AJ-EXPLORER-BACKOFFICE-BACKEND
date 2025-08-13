import RoleInitial from "./entity/role";
import UserInitial from "./entity/user";
import { geographyInitial } from "./entity/geography";

export default async function AutoinitializeData() {
    try {
        await RoleInitial();
        await UserInitial();
        await geographyInitial();
    } catch (err) {
        return console.log('Initialize failed: ', err);
    }
};