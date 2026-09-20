import { resolveOrderPaymentMethod } from '../../services/order.service';

describe('resolveOrderPaymentMethod', () => {
  it('prefers the latest payment method from the payment record', () => {
    const order = {
      paymentMethod: 'COD',
      payments: [{ paymentMethod: 'CASH_ON_DELIVERY' }, { paymentMethod: 'UPI' }]
    };

    expect(resolveOrderPaymentMethod(order)).toBe('CASH_ON_DELIVERY');
  });

  it('normalizes legacy COD values to the enum value', () => {
    const order = { paymentMethod: 'COD' };

    expect(resolveOrderPaymentMethod(order)).toBe('CASH_ON_DELIVERY');
  });

  it('returns undefined when no payment data exists', () => {
    expect(resolveOrderPaymentMethod({})).toBeUndefined();
  });
});
