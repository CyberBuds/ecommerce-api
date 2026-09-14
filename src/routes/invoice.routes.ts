import { Router } from 'express';
import createInvoiceController from '../controllers/invoice.controller';
import InvoiceService from '../services/invoice.service';
import authenticate from '../middlewares/authenticate';
import authorize from '../middlewares/authorize';

const router = Router();
const service = new InvoiceService();
const controller = createInvoiceController(service);

router.use(authenticate);

router.get('/', authorize({ roles: ['Super Admin', 'Admin', 'Finance Manager'] }), controller.listInvoices);
router.get('/:id', authorize({ roles: ['Super Admin', 'Admin', 'Finance Manager'] }), controller.getInvoice);
router.put('/:id/pay', authorize({ roles: ['Super Admin', 'Admin', 'Finance Manager'] }), controller.payInvoice);
router.put('/:id/void', authorize({ roles: ['Super Admin', 'Admin', 'Finance Manager'] }), controller.voidInvoice);

export default router;
