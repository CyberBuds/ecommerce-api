import { NextFunction, Request, Response } from 'express';
import apiResponse from '../utils/apiResponse';
import InvoiceService from '../services/invoice.service';

export default function createInvoiceController(service: InvoiceService) {
  return {
    listInvoices: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const query = req.query as Record<string, any>;
        const invoices = await service.list(query);
        return apiResponse.success(res, invoices, 'Invoices fetched successfully');
      } catch (error) {
        next(error);
      }
    },

    getInvoice: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = Number(req.params.id);
        const invoice = await service.getById(id);
        return apiResponse.success(res, invoice, 'Invoice fetched successfully');
      } catch (error) {
        next(error);
      }
    },

    payInvoice: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = Number(req.params.id);
        const invoice = await service.pay(id);
        return apiResponse.success(res, invoice, 'Invoice marked as paid');
      } catch (error) {
        next(error);
      }
    },

    voidInvoice: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = Number(req.params.id);
        const invoice = await service.void(id);
        return apiResponse.success(res, invoice, 'Invoice voided successfully');
      } catch (error) {
        next(error);
      }
    }
  };
}
