import AppError from '../utils/AppError';
import HTTP_STATUS from '../constants/httpStatus';
import CartRepository from '../repositories/cart.repository';
import ProductRepository from '../repositories/product.repository';
import InventoryRepository from '../repositories/inventory.repository';
import CustomerRepository from '../repositories/customer.repository';
import {
  ApplyCouponDto,
  CheckoutDto,
  CreateCartItemDto,
  RestoreCartDto,
  SaveCartDto,
  UpdateCartItemDto
} from '../interfaces/cart.dto';

function calculateItemTotal(unitPrice: number, quantity: number, discount = 0, tax = 0) {
  return unitPrice * quantity - discount + tax;
}

function roundValue(value: number) {
  return Math.round(value * 100) / 100;
}

export default class CartService {
  constructor(
    private repository: CartRepository,
    private productRepository: ProductRepository,
    private inventoryRepository: InventoryRepository,
    private customerRepository: CustomerRepository
  ) {}

  async getCart(customerId?: number, sessionId?: string) {
    let cart = undefined;
    if (customerId) {
      cart = await this.repository.findActiveCartByCustomer(customerId);
    }

    if (!cart && sessionId) {
      cart = await this.repository.findCartBySession(sessionId);
    }

    if (!cart) {
      return {
        items: [],
        subtotal: 0,
        discountAmount: 0,
        couponDiscount: 0,
        shippingCharge: 0,
        taxAmount: 0,
        totalAmount: 0,
        status: 'ACTIVE'
      };
    }

    return cart;
  }

  async addItem(dto: CreateCartItemDto, customerId?: number, sessionId?: string, createdBy?: number) {
    if (!customerId && !sessionId) {
      throw new AppError('Customer id or session id is required', HTTP_STATUS.BAD_REQUEST, 'MISSING_CART_CONTEXT');
    }

    const product = await this.productRepository.findById(dto.productId);
    if (!product) {
      throw new AppError('Product not found', HTTP_STATUS.NOT_FOUND, 'PRODUCT_NOT_FOUND');
    }

    const variant = dto.variantId ? await this.productRepository.findVariantById(dto.variantId) : null;
    if (dto.variantId && !variant) {
      throw new AppError('Product variant not found', HTTP_STATUS.NOT_FOUND, 'VARIANT_NOT_FOUND');
    }

    const cart = customerId
      ? await this.repository.findActiveCartByCustomer(customerId)
      : await this.repository.findCartBySession(sessionId as string);

    const activeCart = cart || (await this.repository.createCart({ customerId, sessionId, status: 'ACTIVE', createdBy, updatedBy: createdBy }));

    const existingItem = await this.repository.findCartItemByProductVariant(activeCart.id, dto.productId, dto.variantId);
    const unitPrice = Number(variant?.sellingPrice ?? product.sellingPrice ?? 0);
    const discount = 0;
    const tax = 0;

    if (existingItem) {
      const quantity = existingItem.quantity + dto.quantity;
      const total = calculateItemTotal(unitPrice, quantity, discount, tax);
      await this.repository.updateCartItem(existingItem.id, { quantity, unitPrice, discount, tax, total });
    } else {
      const total = calculateItemTotal(unitPrice, dto.quantity, discount, tax);
      await this.repository.createCartItem({ cartId: activeCart.id, productId: dto.productId, variantId: dto.variantId ?? null, quantity: dto.quantity, unitPrice, discount, tax, total });
    }

    return this.recalculateCartTotals(activeCart.id);
  }

  async updateItem(itemId: number, dto: UpdateCartItemDto) {
    const item = await this.repository.findCartItemById(itemId);
    if (!item) {
      throw new AppError('Cart item not found', HTTP_STATUS.NOT_FOUND, 'CART_ITEM_NOT_FOUND');
    }

    const unitPrice = Number(item.unitPrice);
    const total = calculateItemTotal(unitPrice, dto.quantity, Number(item.discount ?? 0), Number(item.tax ?? 0));
    await this.repository.updateCartItem(itemId, { quantity: dto.quantity, total });
    return this.recalculateCartTotals(item.cartId);
  }

  async removeItem(itemId: number) {
    const item = await this.repository.findCartItemById(itemId);
    if (!item) {
      throw new AppError('Cart item not found', HTTP_STATUS.NOT_FOUND, 'CART_ITEM_NOT_FOUND');
    }

    await this.repository.deleteCartItem(itemId);
    return this.recalculateCartTotals(item.cartId);
  }

  async saveCart(customerId: number | undefined, dto: SaveCartDto) {
    if (!customerId) {
      throw new AppError('Customer authentication required to save cart', HTTP_STATUS.UNAUTHORIZED, 'AUTH_REQUIRED');
    }

    const cart = await this.repository.findActiveCartByCustomer(customerId);
    if (!cart || !cart.items || cart.items.length === 0) {
      throw new AppError('No active cart available to save', HTTP_STATUS.BAD_REQUEST, 'NO_ACTIVE_CART');
    }

    if (cart.savedCart) {
      const savedCart = await this.repository.updateSavedCart(cart.savedCart.id, { name: dto.name, status: 'ACTIVE' });
      await this.repository.updateCart(cart.id, { status: 'SAVED' });
      return savedCart;
    }

    const savedCart = await this.repository.createSavedCart({ customerId, cartId: cart.id, name: dto.name, status: 'ACTIVE' });
    await this.repository.updateCart(cart.id, { status: 'SAVED' });
    return savedCart;
  }

  async restoreCart(customerId: number | undefined, dto: RestoreCartDto) {
    if (!customerId) {
      throw new AppError('Customer authentication required to restore cart', HTTP_STATUS.UNAUTHORIZED, 'AUTH_REQUIRED');
    }

    const savedCart = await this.repository.findSavedCartById(dto.savedCartId);
    if (!savedCart || savedCart.customerId !== customerId) {
      throw new AppError('Saved cart not found', HTTP_STATUS.NOT_FOUND, 'SAVED_CART_NOT_FOUND');
    }

    const activeCart = await this.repository.findActiveCartByCustomer(customerId);
    if (activeCart && activeCart.id !== savedCart.cartId) {
      await this.repository.updateCart(activeCart.id, { status: 'ABANDONED' });
    }

    await this.repository.updateCart(savedCart.cartId, { status: 'ACTIVE' });
    await this.repository.updateSavedCart(savedCart.id, { status: 'ACTIVE' });
    return this.repository.findCartById(savedCart.cartId);
  }

  async applyCoupon(customerId: number | undefined, sessionId: string | undefined, dto: ApplyCouponDto) {
    const cart = await this.getCart(customerId, sessionId);
    if (!cart || !cart.id) {
      throw new AppError('Cart not found', HTTP_STATUS.NOT_FOUND, 'CART_NOT_FOUND');
    }

    const coupon = await this.repository.findCouponByCode(dto.couponCode);
    if (!coupon) {
      throw new AppError('Coupon not found', HTTP_STATUS.NOT_FOUND, 'COUPON_NOT_FOUND');
    }

    const now = new Date();
    if (coupon.status !== 'ACTIVE' || coupon.startDate > now || coupon.endDate < now) {
      throw new AppError('Coupon is not active', HTTP_STATUS.BAD_REQUEST, 'INVALID_COUPON');
    }

    const subtotal = Number(cart.items?.reduce((sum: number, item: any) => sum + Number(item.total), 0) ?? 0);
    if (coupon.minimumOrderAmount && subtotal < Number(coupon.minimumOrderAmount)) {
      throw new AppError('Coupon minimum order amount not reached', HTTP_STATUS.BAD_REQUEST, 'COUPON_MINIMUM_NOT_MET');
    }

    const couponUsageCount = await this.repository.countCouponUsages(coupon.id);
    if (coupon.usageLimit && couponUsageCount >= coupon.usageLimit) {
      throw new AppError('Coupon usage limit exceeded', HTTP_STATUS.BAD_REQUEST, 'COUPON_LIMIT_EXCEEDED');
    }

    if (customerId && coupon.usagePerCustomer) {
      const customerUsageCount = await this.repository.countCustomerCouponUsages(customerId, coupon.id);
      if (customerUsageCount >= coupon.usagePerCustomer) {
        throw new AppError('Coupon usage limit exceeded for customer', HTTP_STATUS.BAD_REQUEST, 'COUPON_CUSTOMER_LIMIT_EXCEEDED');
      }
    }

    await this.repository.updateCart(cart.id, { couponId: coupon.id });
    return this.recalculateCartTotals(cart.id);
  }

  async removeCoupon(customerId: number | undefined, sessionId?: string) {
    const cart = await this.getCart(customerId, sessionId);
    if (!cart || !cart.id) {
      throw new AppError('Cart not found', HTTP_STATUS.NOT_FOUND, 'CART_NOT_FOUND');
    }

    await this.repository.updateCart(cart.id, { couponId: null, couponDiscount: 0 });
    return this.recalculateCartTotals(cart.id);
  }

  async checkout(customerId: number | undefined, sessionId: string | undefined, dto: CheckoutDto) {
    const cart = await this.getCart(customerId, sessionId);
    if (!cart || !cart.id || !cart.items || cart.items.length === 0) {
      throw new AppError('Cart is empty', HTTP_STATUS.BAD_REQUEST, 'CART_EMPTY');
    }

    for (const item of cart.items) {
      const variant = item.variant;
      if (variant && item.quantity > variant.stock) {
        throw new AppError('Product variant out of stock', HTTP_STATUS.BAD_REQUEST, 'OUT_OF_STOCK');
      }
      if (!variant && item.quantity > item.product?.stock) {
        throw new AppError('Product out of stock', HTTP_STATUS.BAD_REQUEST, 'OUT_OF_STOCK');
      }
    }

    if (cart.couponId && dto.couponCode && cart.coupon?.couponCode !== dto.couponCode) {
      await this.applyCoupon(customerId, sessionId, { couponCode: dto.couponCode });
    }

    if (cart.couponId && customerId) {
      await this.repository.createCouponUsage({ customerId, couponId: cart.couponId, orderId: null, discountAmount: cart.couponDiscount ?? 0 });
    }

    for (const item of cart.items) {
      const inventory = item.variant
        ? await this.inventoryRepository.findInventoryByProductVariant(item.productId, item.variantId ?? null)
        : undefined;
      if (inventory) {
        await this.inventoryRepository.reserveInventory(inventory.id, item.quantity, 'RESERVE');
      }
    }

    await this.repository.updateCart(cart.id, {
      status: 'COMPLETED',
      updatedBy: customerId
    });

    return {
      cartId: cart.id,
      customerId,
      paymentMethod: dto.paymentMethod,
      totalAmount: cart.totalAmount,
      shippingCharge: cart.shippingCharge,
      taxAmount: cart.taxAmount,
      couponDiscount: cart.couponDiscount,
      message: 'Checkout completed successfully'
    };
  }

  async recalculateCartTotals(cartId: number) {
    const cart = await this.repository.findCartById(cartId);
    if (!cart) {
      throw new AppError('Cart not found for recalculation', HTTP_STATUS.NOT_FOUND, 'CART_NOT_FOUND');
    }

    const subtotal = Number(cart.items?.reduce((sum: number, item: any) => sum + Number(item.total), 0) ?? 0);
    const taxAmount = Number(cart.items?.reduce((sum: number, item: any) => sum + Number(item.tax ?? 0), 0) ?? 0);
    const discountAmount = Number(cart.discountAmount ?? 0);
    const shippingCharge = Number(cart.shippingCharge ?? 0);
    const couponDiscount = this.calculateCouponDiscount(cart.coupon, subtotal, shippingCharge);
    const totalAmount = roundValue(subtotal - discountAmount - couponDiscount + shippingCharge + taxAmount);

    const updated = await this.repository.updateCart(cart.id, {
      subtotal,
      taxAmount,
      discountAmount,
      couponDiscount,
      totalAmount
    });

    return this.repository.findCartById(updated.id);
  }

  private calculateCouponDiscount(coupon: any, subtotal: number, shippingCharge: number) {
    if (!coupon) return 0;

    switch (coupon.couponType) {
      case 'PERCENTAGE': {
        const percentage = Number(coupon.percentage ?? 0);
        const discount = roundValue((subtotal * percentage) / 100);
        if (coupon.maximumDiscount) {
          return Math.min(discount, Number(coupon.maximumDiscount));
        }
        return discount;
      }
      case 'FLAT':
        return Number(coupon.flatAmount ?? 0);
      case 'FREE_SHIPPING':
        return Math.min(Number(coupon.flatAmount ?? shippingCharge), shippingCharge);
      default:
        return 0;
    }
  }
}
