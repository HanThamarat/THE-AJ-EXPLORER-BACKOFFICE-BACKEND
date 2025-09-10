import * as express from 'express';
import { PackagePrismaORM } from '../prisma/package';
import { PackageService } from '../../../core/services/packageService';
import { PackageController } from '../controllers/packageController';

const router = express.Router();
const packageRepository = new PackagePrismaORM();
const packageService = new PackageService(packageRepository);
const packageController = new PackageController(packageService);

/**
 * @swagger
 * tags:
 *   name: Package
 *   description: Package management
 */


/**
 * @swagger
 * components:
 *   schemas:
 *     PackageOptionDTO:
 *       type: object
 *       properties:
 *         packageId:
 *           type: integer
 *           example: 1
 *         pkgOptionTypeId:
 *           type: integer
 *           example: 2
 *         name:
 *           type: string
 *           example: "Deluxe Tour Option"
 *         description:
 *           type: string
 *           example: "A special package for VIP customers."
 *         adultPrice:
 *           type: number
 *           format: float
 *           example: 1500.50
 *         childPrice:
 *           type: number
 *           format: float
 *           example: 750.25
 *         groupPrice:
 *           type: number
 *           format: float
 *           example: 5000.00
 *       required:
 *         - pkgOptionTypeId
 *         - name
 * 
 *     PackageImageDTO:
 *       type: object
 *       properties:
 *         base64:
 *           type: string
 *           example: base64
 *         fileName:
 *           type: string
 *           example: fileName
 *         mainFile:
 *           type: boolean
 *           example: true
 *       required:
 *         - base64
 *         - fileName
 *         - mainFile
 *
 *     CreatePackageDTO:
 *       type: object
 *       properties:
 *         packageName:
 *           type: string
 *           example: "Phuket Adventure"
 *         packageTypeId:
 *           type: integer
 *           example: 1
 *         description:
 *           type: string
 *           example: "A 3-day adventure in Phuket"
 *         provinceId:
 *           type: integer
 *           example: 1
 *         districtId:
 *           type: integer
 *           example: 1
 *         subDistrictId:
 *           type: integer
 *           example: 1
 *         lon:
 *           type: string
 *           example: "98.3923"
 *         lat:
 *           type: string
 *           example: "7.8804"
 *         status:
 *           type: boolean
 *           example: true
 *         packageImage:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PackageImageDTO'
 *         packageOption:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/PackageOptionDTO'
 *       required:
 *         - packageName
 *         - packageTypeId
 *         - provinceId
 *         - districtId
 *         - subDistrictId
 *         - lon
 *         - lat
 *         - status
 *         - packageOption
 */

/**
* @swagger
* /api/v1/packagemanagement/package:
*   post:
*     tags: [Package]
*     summary: Create a new package
*     description: Create a new package in the system.
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/CreatePackageDTO'
*     responses:
*       201:
*         description: package created
*/
router.post('/package', packageController.createPackage.bind(packageController));

/**
* @swagger
* /api/v1/packagemanagement/package:
*   get:
*     tags: [Package]
*     summary: Get all package
*     responses:
*       200:
*         description: Fetch a list of all package from the system.
*/
router.get('/package', packageController.findPackages.bind(packageController));

/**
* @swagger
* /api/v1/packagemanagement/package/{id}:
*   get:
*     tags: [Package]
*     summary: Get package info by package id
*     parameters:
*       - in: path
*         name: id
*         required: true
*         description: The ID of the get package info by package id.
*         schema:
*           type: string
*     requestBody:
*     responses:
*       200:
*         description: Fetch a list of package info usinng package id from the system.
*/
router.get('/package/:id', packageController.findPackageByid.bind(packageController));

/**
* @swagger
* /api/v1/packagemanagement/package/{id}:
*   put:
*     tags: [Package]
*     summary: Update a package by ID
*     description: Update package in the system.
*     parameters:
*       - in: path
*         name: id
*         required: true
*         description: The ID of the updated package.
*         schema:
*           type: string
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/CreatePackageDTO'
*     responses:
*       200:
*         description: update package by package id successfully
*/
router.put('/package/:id', packageController.updatePackage.bind(packageController));

/**
 * @swagger
 * /api/v1/packagemanagement/package/{id}:
 *   delete:
 *     tags: [Package]
 *     summary: Delete a package by ID
 *     description: Delete a package from the system based on their unique ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the package to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: deleting package by id successfully
 */
router.delete('/package/:id', packageController.deletePacakge.bind(packageController));

export default router;