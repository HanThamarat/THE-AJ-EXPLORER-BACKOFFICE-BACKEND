import { prisma } from "../../adapters/database/data-source";
import { Ecrypt } from "../../adapters/helpers/encrypt";

export default async function UserInitial() {
    try {
        const recheckUser = await prisma.user.count({});

        if (recheckUser !== 0) return console.log('🚀User Initialize successfully');

        const passportHashing = await Ecrypt.passwordEncrypt('123456');
         
        const result = await prisma.user.create({
            data: {
                firstName: 'Administrator',
                lastName: 'AJ',
                username: 'administrator',
                email: 'administrator@theajexplorer.com',
                password: passportHashing,
                roleId: 1
            }
        });

         return console.log('🚀User Initialize successfully: ', result);
    } catch (error) {
        return console.log('User Initialize failed: ', error);
    }
}