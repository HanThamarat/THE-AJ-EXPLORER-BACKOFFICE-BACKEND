import { prisma } from "../../adapters/database/data-source";

export const blogTypeInitial = async () => {
    try {
        const reCheckblogTpye = await prisma.blogType.count({});

        if (reCheckblogTpye !== 0) return  console.log('🚀 Blog Type Initialize successfully');

        const result = await prisma.blogType.createMany({
            data: [
                {
                    name: 'Activities',
                },
                {
                    name: 'Expreinces',
                }
            ]
        });

        return console.log('🚀 Blog Type Initialize successfully: ', result);
    } catch (error) {
        return console.log('Blog Type Initialize failed: ', error);
    }
};