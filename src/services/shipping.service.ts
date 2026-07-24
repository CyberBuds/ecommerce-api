import CartRepository from '../repositories/cart.repository';
import { ShippingMethodListQuery, DeliverySlotListQuery, ShippingEstimateQuery } from '../interfaces/cart.dto';

export default class ShippingService {
  constructor(private repository: CartRepository) {}

  async listMethods(query: ShippingMethodListQuery = {}) {
    return this.repository.listShippingMethods(query);
  }

  async listDeliverySlots(query: DeliverySlotListQuery = {}) {
    return this.repository.listDeliverySlots(query);
  }

  async estimateShipping(query: ShippingEstimateQuery) {
    const zone = await this.repository.findShippingZoneByAddress(query);
    if (!zone) {
      return { charge: 0, currency: 'USD', note: 'Default shipping zone not found' };
    }

    const methodId = query.shippingMethodId;
    if (!methodId) {
      return { charge: 0, currency: 'USD', note: 'Shipping method id is required for estimate' };
    }

    const charge = await this.repository.findShippingCharge(methodId, zone.id, query.weight);
    return {
      charge: Number(charge?.charge ?? 0),
      zone,
      methodId
    };
  }
}
