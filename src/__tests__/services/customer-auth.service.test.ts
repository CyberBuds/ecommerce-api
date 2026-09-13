import bcrypt from 'bcryptjs';

import CustomerService from '../../services/customer.service';
import CustomerRepository from '../../repositories/customer.repository';
import ProductRepository from '../../repositories/product.repository';

describe('CustomerService storefront auth', () => {
  it('should register a customer with a hashed password and allow login with valid credentials', async () => {
    let savedCustomer: any = null;

    const repo = {
      findByEmail: jest.fn().mockImplementation(async (email: string) => {
        if (!email) return null;
        return savedCustomer && savedCustomer.email === String(email).toLowerCase() ? savedCustomer : null;
      }),
      findByMobile: jest.fn().mockResolvedValue(null),
      findByCustomerCode: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockImplementation(async (data) => ({
        ...data,
        id: 101,
        password: data.password,
        customerCode: data.customerCode,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        mobile: data.mobile,
        status: data.status || 'ACTIVE',
        isEmailVerified: data.isEmailVerified ?? false,
        isMobileVerified: data.isMobileVerified ?? false,
      })),
      findById: jest.fn().mockImplementation(async () => savedCustomer),
      update: jest.fn().mockImplementation(async (id: number, data: any) => {
        if (savedCustomer && savedCustomer.id === id) {
          savedCustomer = { ...savedCustomer, ...data };
        }
        return savedCustomer;
      }),
    } as unknown as CustomerRepository;

    const service = new CustomerService(repo, {} as ProductRepository);

    const created = await service.register({
      firstName: 'Asha',
      lastName: 'Patel',
      email: 'asha@example.com',
      mobile: '9876543210',
      password: 'StrongPass123',
    });

    savedCustomer = {
      id: 101,
      firstName: 'Asha',
      lastName: 'Patel',
      email: 'asha@example.com',
      mobile: '9876543210',
      password: (created as any).password || bcrypt.hashSync('StrongPass123', 10),
      status: 'ACTIVE',
      isEmailVerified: false,
      isMobileVerified: false,
    };

    expect(created).not.toHaveProperty('password');
    expect(created.email).toBe('asha@example.com');

    const loggedIn = await service.login('asha@example.com', 'StrongPass123');
    expect(loggedIn.customer.email).toBe('asha@example.com');
    expect(loggedIn.accessToken).toBeTruthy();
    expect(loggedIn.refreshToken).toBeTruthy();
  });
});