import RoleInitial from "./entity/role";
import UserInitial from "./entity/user";
import { geographyInitial } from "./entity/geography";
import { packageOptionTypeInitial } from "./entity/package";
import { blogTypeInitial } from "./entity/blogType";

export default async function AutoinitializeData() {
    try {
        await RoleInitial();
        await UserInitial();
        await geographyInitial();
        await packageOptionTypeInitial();
        await blogTypeInitial();
    } catch (err) {
        return console.log('Initialize failed: ', err);
    }
};