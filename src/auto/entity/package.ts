import { prisma } from "../../adapters/database/data-source";

// export const packageTypeInitial = async () => {
//     try {
//         const reCheckPackageTpye = await prisma.packageType.count({});

//         if (reCheckPackageTpye !== 0) return  console.log('Package Type Initialize successfully');

//         const result = await prisma.packageType.createMany({
//             data: [
//                 {
//                     name: 'Normal',
//                     status: true,
//                 },
//                 {
//                     name: 'Group',
//                     status: true,
//                 }
//             ]
//         });

//         return console.log('🚀Package Type Initialize successfully: ', result);
//     } catch (error) {
//         return console.log('Package Type Initialize failed: ', error);
//     }
// };

export const packageOptionTypeInitial = async () => {
    try {
        const reCheckPackageOpTpye = await prisma.packageOptionType.count({});

        if (reCheckPackageOpTpye !== 0) return  console.log('🚀 Package Option Type Initialize successfully');

        const result = await prisma.packageOptionType.createMany({
            data: [
                {
                    name: 'Normal',
                    status: true,
                },
                {
                    name: 'Group',
                    status: true,
                }
            ]
        });

        return console.log('🚀 Package Option Initialize successfully: ', result);
    } catch (error) {
        return console.log('Package Option Initialize failed: ', error);
    }
};