import { NextFunction, Request, Response } from 'express';
import apiResponse from '../utils/apiResponse';
import CustomerService from '../services/customer.service';

export default function createCustomerController(service: CustomerService) {
  return {
    create: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const dto = req.body;
        const createdBy = Number((req as any).user?.sub || 0) || undefined;
        const customer = await service.create(dto, createdBy);
        return apiResponse.created(res, customer, 'Customer created');
      } catch (error) {
        next(error);
      }
    },

    update: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = Number(req.params.id);
        const dto = req.body;
        const updatedBy = Number((req as any).user?.sub || 0) || undefined;
        const customer = await service.update(id, dto, updatedBy);
        return apiResponse.success(res, customer, 'Customer updated');
      } catch (error) {
        next(error);
      }
    },

    delete: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = Number(req.params.id);
        await service.delete(id);
        return apiResponse.success(res, null, 'Customer deleted');
      } catch (error) {
        next(error);
      }
    },

    list: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const query = req.query as any;
        const result = await service.list(query);
        return apiResponse.success(res, result, 'Customers fetched');
      } catch (error) {
        next(error);
      }
    },

    getById: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = Number(req.params.id);
        const customer = await service.getById(id);
        return apiResponse.success(res, customer, 'Customer fetched');
      } catch (error) {
        next(error);
      }
    },

    getProfile: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const customerId = Number((req as any).user?.sub);
        const customer = await service.getProfile(customerId);
        return apiResponse.success(res, customer, 'Customer profile fetched');
      } catch (error) {
        next(error);
      }
    },

    updateProfile: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const customerId = Number((req as any).user?.sub);
        const dto = req.body;
        const customer = await service.updateProfile(customerId, dto);
        return apiResponse.success(res, customer, 'Customer profile updated');
      } catch (error) {
        next(error);
      }
    },

    createAddress: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const customerId = Number(req.params.id);
        const dto = req.body;
        const createdBy = Number((req as any).user?.sub || 0) || undefined;
        const address = await service.createAddress(customerId, dto, createdBy);
        return apiResponse.created(res, address, 'Customer address created');
      } catch (error) {
        next(error);
      }
    },

    updateAddress: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const addressId = Number(req.params.addressId);
        const dto = req.body;
        const updatedBy = Number((req as any).user?.sub || 0) || undefined;
        const address = await service.updateAddress(addressId, dto, updatedBy);
        return apiResponse.success(res, address, 'Customer address updated');
      } catch (error) {
        next(error);
      }
    },

    deleteAddress: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const addressId = Number(req.params.addressId);
        await service.deleteAddress(addressId);
        return apiResponse.success(res, null, 'Customer address deleted');
      } catch (error) {
        next(error);
      }
    },

    listAddresses: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const customerId = Number(req.params.id);
        const addresses = await service.listAddresses(customerId);
        return apiResponse.success(res, addresses, 'Customer addresses fetched');
      } catch (error) {
        next(error);
      }
    },

    createGroup: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const dto = req.body;
        const createdBy = Number((req as any).user?.sub || 0) || undefined;
        const group = await service.createGroup(dto, createdBy);
        return apiResponse.created(res, group, 'Customer group created');
      } catch (error) {
        next(error);
      }
    },

    updateGroup: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = Number(req.params.groupId);
        const dto = req.body;
        const updatedBy = Number((req as any).user?.sub || 0) || undefined;
        const group = await service.updateGroup(id, dto, updatedBy);
        return apiResponse.success(res, group, 'Customer group updated');
      } catch (error) {
        next(error);
      }
    },

    deleteGroup: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const id = Number(req.params.groupId);
        await service.deleteGroup(id);
        return apiResponse.success(res, null, 'Customer group deleted');
      } catch (error) {
        next(error);
      }
    },

    listGroups: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const query = req.query as any;
        const result = await service.listGroups(query);
        return apiResponse.success(res, result, 'Customer groups fetched');
      } catch (error) {
        next(error);
      }
    },

    addWishlistItem: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const customerId = Number(req.params.id);
        const dto = req.body;
        const wishlistItem = await service.addWishlistItem(customerId, dto);
        return apiResponse.created(res, wishlistItem, 'Wishlist item added');
      } catch (error) {
        next(error);
      }
    },

    removeWishlistItem: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const wishlistId = Number(req.params.wishlistId);
        await service.removeWishlistItem(wishlistId);
        return apiResponse.success(res, null, 'Wishlist item removed');
      } catch (error) {
        next(error);
      }
    },

    listWishlist: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const customerId = Number(req.params.id);
        const items = await service.listWishlist(customerId);
        return apiResponse.success(res, items, 'Wishlist items fetched');
      } catch (error) {
        next(error);
      }
    },

    createReview: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const customerId = Number(req.params.id);
        const dto = req.body;
        const review = await service.createReview(customerId, dto);
        return apiResponse.created(res, review, 'Customer review created');
      } catch (error) {
        next(error);
      }
    },

    updateReview: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const reviewId = Number(req.params.reviewId);
        const dto = req.body;
        const review = await service.updateReview(reviewId, dto);
        return apiResponse.success(res, review, 'Customer review updated');
      } catch (error) {
        next(error);
      }
    },

    deleteReview: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const reviewId = Number(req.params.reviewId);
        await service.deleteReview(reviewId);
        return apiResponse.success(res, null, 'Customer review deleted');
      } catch (error) {
        next(error);
      }
    },

    listReviews: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const query = req.query as any;
        const result = await service.listReviews(query);
        return apiResponse.success(res, result, 'Customer reviews fetched');
      } catch (error) {
        next(error);
      }
    },

    createWalletTransaction: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const customerId = Number(req.params.id);
        const dto = req.body;
        const transaction = await service.createWalletTransaction(customerId, dto);
        return apiResponse.created(res, transaction, 'Wallet transaction created');
      } catch (error) {
        next(error);
      }
    },

    listWalletTransactions: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const customerId = Number(req.params.id);
        const query = req.query as any;
        const result = await service.listWalletTransactions(customerId, query);
        return apiResponse.success(res, result, 'Wallet transactions fetched');
      } catch (error) {
        next(error);
      }
    },

    createLoyaltyTransaction: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const customerId = Number(req.params.id);
        const dto = req.body;
        const transaction = await service.createLoyaltyTransaction(customerId, dto);
        return apiResponse.created(res, transaction, 'Loyalty transaction created');
      } catch (error) {
        next(error);
      }
    },

    listLoyaltyTransactions: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const customerId = Number(req.params.id);
        const query = req.query as any;
        const result = await service.listLoyaltyTransactions(customerId, query);
        return apiResponse.success(res, result, 'Loyalty transactions fetched');
      } catch (error) {
        next(error);
      }
    },

    createNotification: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const customerId = Number(req.params.id);
        const dto = req.body;
        const notification = await service.createNotification(customerId, dto);
        return apiResponse.created(res, notification, 'Notification created');
      } catch (error) {
        next(error);
      }
    },

    listNotifications: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const customerId = Number(req.params.id);
        const query = req.query as any;
        const result = await service.listNotifications(customerId, query);
        return apiResponse.success(res, result, 'Notifications fetched');
      } catch (error) {
        next(error);
      }
    },

    createNote: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const customerId = Number(req.params.id);
        const dto = req.body;
        const createdBy = Number((req as any).user?.sub || 0) || undefined;
        const note = await service.createNote(customerId, dto, createdBy);
        return apiResponse.created(res, note, 'Customer note created');
      } catch (error) {
        next(error);
      }
    },

    updateNote: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const noteId = Number(req.params.noteId);
        const dto = req.body;
        const updatedBy = Number((req as any).user?.sub || 0) || undefined;
        const note = await service.updateNote(noteId, dto, updatedBy);
        return apiResponse.success(res, note, 'Customer note updated');
      } catch (error) {
        next(error);
      }
    },

    deleteNote: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const noteId = Number(req.params.noteId);
        await service.deleteNote(noteId);
        return apiResponse.success(res, null, 'Customer note deleted');
      } catch (error) {
        next(error);
      }
    },

    listNotes: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const customerId = Number(req.params.id);
        const notes = await service.listNotes(customerId);
        return apiResponse.success(res, notes, 'Customer notes fetched');
      } catch (error) {
        next(error);
      }
    },

    createDocument: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const customerId = Number(req.params.id);
        const dto = req.body;
        const uploadedBy = Number((req as any).user?.sub || 0) || undefined;
        const document = await service.createDocument(customerId, dto, uploadedBy);
        return apiResponse.created(res, document, 'Customer document created');
      } catch (error) {
        next(error);
      }
    },

    listDocuments: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const customerId = Number(req.params.id);
        const documents = await service.listDocuments(customerId);
        return apiResponse.success(res, documents, 'Customer documents fetched');
      } catch (error) {
        next(error);
      }
    },

    deleteDocument: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const documentId = Number(req.params.documentId);
        await service.deleteDocument(documentId);
        return apiResponse.success(res, null, 'Customer document deleted');
      } catch (error) {
        next(error);
      }
    },

    listActivityLogs: async (req: Request, res: Response, next: NextFunction) => {
      try {
        const customerId = Number(req.params.id);
        const logs = await service.listActivityLogs(customerId);
        return apiResponse.success(res, logs, 'Customer activity logs fetched');
      } catch (error) {
        next(error);
      }
    }
  };
}
