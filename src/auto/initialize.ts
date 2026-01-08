import RoleInitial from "./entity/role";
import UserInitial from "./entity/user";
import { geographyInitial } from "./entity/geography";
import { packageOptionTypeInitial } from "./entity/package";
import { blogTypeInitial } from "./entity/blogType";
import { InitialBanking } from "./entity/bank";

export default async function AutoinitializeData() {
    try {
        await RoleInitial();
        await UserInitial();
        await geographyInitial();
        await packageOptionTypeInitial();
        await blogTypeInitial();
        await InitialBanking();
    } catch (err) {
        return console.log('Initialize failed: ', err);
    }
};