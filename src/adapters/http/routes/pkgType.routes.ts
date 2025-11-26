import * as express from 'express';
import { PkgTypePrismaORM } from '../prisma/pkgType';
import { PkgTypeService } from '../../../core/services/pkgTypeService';
import { PkgTypeController } from '../controllers/pkgTypeController';
import { validateRequest } from '../middleware/validateRequest';
import { packageTypeBodySchema, packageTypeIdParamSchema } from '../../../core/entity/packageType';

const router = express.Router();
const pkgTypeRepository = new PkgTypePrismaORM();
const pkgTypeService = new PkgTypeService(pkgTypeRepository);
const pkgTypeController = new PkgTypeController(pkgTypeService);

/**
 * @swagger
 * tags:
 *   name: Package_Type
 *   description: Package Type management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     CreatePkgTypeDTO:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: "Sea Trip"
 *         status:
 *           type: boolean
 *           example: true
 *       required:
 *         - name
 *         - status
 * 
 */

/**
* @swagger
* /api/v1/pkgtypemanagement/pkgtype:
*   post:
*     tags: [Package_Type]
*     summary: Create a new package type
*     description: Create a new package type in the system.
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/CreatePkgTypeDTO'
*     responses:
*       201:
*         description: package type created
*/
router.post(
  '/pkgtype',
  validateRequest({ body: packageTypeBodySchema }),
  pkgTypeController.createPkgType.bind(pkgTypeController)
);

/**
* @swagger
* /api/v1/pkgtypemanagement/pkgtype:
*   get:
*     tags: [Package_Type]
*     summary: Get all package type
*     responses:
*       200:
*         description: Fetch a list of all package tpye from the system.
*/
router.get('/pkgtype' , pkgTypeController.findAllPkgType.bind(pkgTypeController));

/**
* @swagger
* /api/v1/pkgtypemanagement/pkgtype/{id}:
*   get:
*     tags: [Package_Type]
*     summary: Get package type info by package type id
*     parameters:
*       - in: path
*         name: id
*         required: true
*         description: The ID of the get package type info by package type id.
*         schema:
*           type: string
*     requestBody:
*     responses:
*       200:
*         description: Fetch a list of package type info usinng package type id from the system.
*/
router.get(
  '/pkgtype/:id',
  validateRequest({ params: packageTypeIdParamSchema }),
  pkgTypeController.findPkgTypeById.bind(pkgTypeController)
);

/**
* @swagger
* /api/v1/pkgtypemanagement/pkgtype/{id}:
*   put:
*     tags: [Package_Type]
*     summary: Update a package type by ID
*     description: Update package type in the system.
*     parameters:
*       - in: path
*         name: id
*         required: true
*         description: The ID of the updated package type.
*         schema:
*           type: string
*     requestBody:
*       required: true
*       content:
*         application/json:
*           schema:
*             $ref: '#/components/schemas/CreatePkgTypeDTO'
*     responses:
*       200:
*         description: update package type by package type id successfully
*/
router.put(
  '/pkgtype/:id',
  validateRequest({ params: packageTypeIdParamSchema, body: packageTypeBodySchema }),
  pkgTypeController.updatePkgType.bind(pkgTypeController)
);

/**
 * @swagger
 * /api/v1/pkgtypemanagement/pkgtype/{id}:
 *   delete:
 *     tags: [Package_Type]
 *     summary: Delete a package type by ID
 *     description: Delete a package type from the system based on their unique ID.
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: ID of the package type to delete
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: deleting package type by id successfully
 */
router.delete(
  '/pkgtype/:id',
  validateRequest({ params: packageTypeIdParamSchema }),
  pkgTypeController.deletePkgType.bind(pkgTypeController)
);

export default router;