import RoleInitial from "./entity/role";
import UserInitial from "./entity/user";

export default async function AutoinitializeData() {
    try {
        await RoleInitial();
        await UserInitial();
    } catch (err) {
        return console.log('Initialize failed: ', err);
        
    }
};