import { resolveCheckoutCart } from '../../routes/storefront.routes';

describe('resolveCheckoutCart', () => {
  it('prefers the authenticated customer cart when the session cart is stale or missing', async () => {
    const customerCart = { id: 11, status: 'ACTIVE', sessionId: null, customerId: 42 };
    const mockDb = {
      cart: {
        findFirst: jest.fn().mockResolvedValue(customerCart),
        findUnique: jest.fn().mockResolvedValue(null)
      }
    };

    const result = await resolveCheckoutCart(mockDb as any, { id: 42 }, 'stale-session');

    expect(mockDb.cart.findFirst).toHaveBeenCalledWith(expect.objectContaining({
      where: { customerId: 42, status: 'ACTIVE' }
    }));
    expect(result).toBe(customerCart);
  });
});
