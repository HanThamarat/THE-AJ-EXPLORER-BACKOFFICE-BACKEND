import { prisma } from "../../adapters/database/data-source";

export default async function RoleInitial() {
    try {
        const recheckRole = await prisma.role.count({});

        if (recheckRole !== 0) return console.log('🚀 Role Initialize successfully');
        
        const result = await prisma.role.createMany({
            data: [
                {
                    name: 'administrator',
                    description: 'administrator'
                }
            ]
        });

        return console.log('🚀 Role Initialize successfully: ', result);
    } catch (error) {
        return console.log('role Initialize failed: ', error);
    }
}