import roleGuard from '../../middlewares/roleGuard';
import prisma from '../../helpers/prisma';

jest.mock('../../helpers/prisma', () => ({
  __esModule: true,
  default: {
    role: {
      findUnique: jest.fn(),
    },
  },
}));

describe('roleGuard', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('allows a user when the roleId resolves to an allowed role name', async () => {
    const req = { user: { sub: 1, roleId: 9 } } as any;
    const res = {} as any;
    const next = jest.fn();

    (prisma.role.findUnique as jest.Mock).mockResolvedValue({ name: 'Super Admin' });

    await roleGuard(['Super Admin', 'Admin'])(req, res, next);

    expect(prisma.role.findUnique).toHaveBeenCalledWith({ where: { id: 9 } });
    expect(next).toHaveBeenCalledTimes(1);
  });

  it('allows a user when roleName is already present on the token payload', async () => {
    const req = { user: { sub: 1, roleName: 'Admin' } } as any;
    const res = {} as any;
    const next = jest.fn();

    await roleGuard(['Super Admin', 'Admin'])(req, res, next);

    expect(prisma.role.findUnique).not.toHaveBeenCalled();
    expect(next).toHaveBeenCalledTimes(1);
  });
});
