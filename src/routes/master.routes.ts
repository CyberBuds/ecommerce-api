import { Router } from 'express';
import authenticate from '../middlewares/authenticate';
import authorize from '../middlewares/authorize';
import validate from '../middlewares/validation.middleware';
import createMasterController from '../controllers/master.controller';
import MasterRepository from '../repositories/master.repository';
import MasterService from '../services/master.service';
import { bulkImportValidation, createMasterValidation, masterIdParam, masterListValidation, updateMasterValidation } from '../validations/master.validation';

function createMasterRouter(modelName: string) {
  const repository = new MasterRepository(modelName);
  const service = new MasterService(repository);
  const controller = createMasterController(service);
  const router = Router();

  router.post(
    '/',
    authenticate,
    authorize({ roles: ['Super Admin', 'Admin'] }),
    ...createMasterValidation(repository),
    validate,
    controller.create
  );
  router.get(
    '/',
    authenticate,
    authorize({ roles: ['Super Admin', 'Admin', 'Inventory Manager'] }),
    ...masterListValidation,
    validate,
    controller.list
  );
  router.get(
    '/export',
    authenticate,
    authorize({ roles: ['Super Admin', 'Admin', 'Inventory Manager'] }),
    controller.bulkExport
  );
  router.get(
    '/:id',
    authenticate,
    authorize({ roles: ['Super Admin', 'Admin', 'Inventory Manager'] }),
    ...masterIdParam,
    validate,
    controller.getById
  );
  router.put(
    '/:id',
    authenticate,
    authorize({ roles: ['Super Admin', 'Admin'] }),
    ...updateMasterValidation(repository),
    validate,
    controller.update
  );
  router.delete(
    '/:id',
    authenticate,
    authorize({ roles: ['Super Admin', 'Admin'] }),
    ...masterIdParam,
    validate,
    controller.delete
  );
  router.patch(
    '/:id/status',
    authenticate,
    authorize({ roles: ['Super Admin', 'Admin'] }),
    ...masterIdParam,
    validate,
    controller.setStatus
  );
  router.patch(
    '/:id/display-order',
    authenticate,
    authorize({ roles: ['Super Admin', 'Admin'] }),
    ...masterIdParam,
    validate,
    controller.setDisplayOrder
  );
  router.post(
    '/bulk-import',
    authenticate,
    authorize({ roles: ['Super Admin', 'Admin'] }),
    ...bulkImportValidation(),
    validate,
    controller.bulkImport
  );

  return router;
}

const router = Router();

router.use('/categories', createMasterRouter('category'));
router.use('/sub-categories', createMasterRouter('subCategory'));
router.use('/brands', createMasterRouter('brand'));
router.use('/fabrics', createMasterRouter('fabric'));
router.use('/colors', createMasterRouter('color'));
router.use('/sizes', createMasterRouter('size'));
router.use('/units', createMasterRouter('unit'));
router.use('/taxes', createMasterRouter('tax'));
router.use('/occasions', createMasterRouter('occasion'));
router.use('/patterns', createMasterRouter('pattern'));
router.use('/weaving-styles', createMasterRouter('weavingStyle'));
router.use('/border-types', createMasterRouter('borderType'));
router.use('/work-types', createMasterRouter('workType'));
router.use('/sleeve-types', createMasterRouter('sleeveType'));
router.use('/neck-types', createMasterRouter('neckType'));
router.use('/product-tags', createMasterRouter('productTag'));
router.use('/countries-of-origin', createMasterRouter('countryOfOrigin'));
router.use('/care-instructions', createMasterRouter('careInstruction'));

export default router;
