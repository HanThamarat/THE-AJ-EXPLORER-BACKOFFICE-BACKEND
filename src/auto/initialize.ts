import RoleInitial from "./entity/role";

export default async function AutoinitializeData() {
    try {
        await RoleInitial();
    } catch (err) {
        return console.log('Initialize failed: ', err);
        
    }
};