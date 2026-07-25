import swaggerJsdoc, { Options } from 'swagger-jsdoc';

const swaggerOptions: Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Saree eCommerce API',
      version: '1.0.0',
      description: 'Enterprise Saree eCommerce Platform API Documentation',
      contact: {
        name: 'API Support',
        email: 'support@saree-ecommerce.com',
      },
      license: {
        name: 'MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:4000',
        description: 'Development Server',
      },
      {
        url: 'https://ecommerce-api-p93q.onrender.com',
        description: 'Production Server',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Enter JWT token',
        },
      },
      schemas: {
        ApiResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Whether the request was successful',
            },
            data: {
              type: 'object',
              nullable: true,
              description: 'Response data',
            },
            meta: {
              type: 'object',
              nullable: true,
              description: 'Pagination and metadata',
            },
            message: {
              type: 'string',
              description: 'Response message',
            },
            errors: {
              type: 'object',
              nullable: true,
              description: 'Error details',
            },
          },
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false,
            },
            data: {
              type: 'null',
            },
            meta: {
              type: 'null',
            },
            message: {
              type: 'string',
              description: 'Error message',
            },
            errors: {
              type: 'object',
              nullable: true,
            },
          },
        },
        Pagination: {
          type: 'object',
          properties: {
            page: {
              type: 'integer',
              description: 'Current page number',
            },
            pageSize: {
              type: 'integer',
              description: 'Items per page',
            },
            total: {
              type: 'integer',
              description: 'Total number of items',
            },
            totalPages: {
              type: 'integer',
              description: 'Total number of pages',
            },
          },
        },
        AuthLoginRequest: {
          type: 'object',
          properties: {
            email: { type: 'string', format: 'email' },
            password: { type: 'string' },
          },
          required: ['email', 'password'],
        },
        AuthTokenResponse: {
          type: 'object',
          properties: {
            accessToken: { type: 'string' },
            refreshToken: { type: 'string' },
            expiresIn: { type: 'string' },
          },
        },
        ProductCreateRequest: {
          type: 'object',
          properties: {
            name: { type: 'string' },
            sku: { type: 'string' },
            price: { type: 'number' },
            status: { type: 'string' },
          },
          required: ['name', 'sku', 'price'],
        },
        CartItemRequest: {
          type: 'object',
          properties: {
            productId: { type: 'integer' },
            quantity: { type: 'integer' },
          },
          required: ['productId', 'quantity'],
        },
        CheckoutRequest: {
          type: 'object',
          properties: {
            paymentMethod: { type: 'string' },
            shippingAddressId: { type: 'integer' },
          },
          required: ['paymentMethod', 'shippingAddressId'],
        },
        InventoryReserveRequest: {
          type: 'object',
          properties: {
            quantity: { type: 'integer' },
          },
          required: ['quantity'],
        },
      },
    },
    paths: {
      '/api/v1/auth/login': {
        post: {
          tags: ['Authentication'],
          summary: 'Log in and receive access and refresh tokens',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/AuthLoginRequest' },
              },
            },
          },
          responses: {
            '200': {
              description: 'Successful login',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ApiResponse' },
                },
              },
            },
          },
        },
      },
      '/api/v1/auth/refresh': {
        post: {
          tags: ['Authentication'],
          summary: 'Refresh the access token using a refresh token',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    refreshToken: { type: 'string' },
                  },
                  required: ['refreshToken'],
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Token refreshed successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ApiResponse' },
                },
              },
            },
          },
        },
      },
      '/api/v1/auth/logout': {
        post: {
          tags: ['Authentication'],
          summary: 'Log out the current user and invalidate the refresh token',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    refreshToken: { type: 'string' },
                  },
                  required: ['refreshToken'],
                },
              },
            },
          },
          responses: {
            '200': {
              description: 'Logout successful',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ApiResponse' },
                },
              },
            },
          },
        },
      },
      '/api/v1/products': {
        get: {
          tags: ['Products'],
          summary: 'List products with filtering and pagination',
          responses: {
            '200': {
              description: 'Products returned successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ApiResponse' },
                },
              },
            },
          },
        },
        post: {
          tags: ['Products'],
          summary: 'Create a new product',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ProductCreateRequest' },
              },
            },
          },
          responses: {
            '201': {
              description: 'Product created successfully',
              content: {
                'application/json': {
                  schema: { $ref: '#/components/schemas/ApiResponse' },
                },
              },
            },
          },
        },
      },
      '/api/v1/products/{id}': {
        parameters: [{
          name: 'id', in: 'path', required: true, schema: { type: 'integer' }, description: 'Product identifier',
        }],
        get: {
          tags: ['Products'],
          summary: 'Get a product by ID',
          responses: {
            '200': {
              description: 'Product returned successfully',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } },
            },
          },
        },
        put: {
          tags: ['Products'],
          summary: 'Update a product by ID',
          requestBody: {
            required: true,
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/ProductCreateRequest' },
              },
            },
          },
          responses: {
            '200': {
              description: 'Product updated successfully',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } },
            },
          },
        },
        delete: {
          tags: ['Products'],
          summary: 'Delete a product by ID',
          responses: {
            '200': {
              description: 'Product deleted successfully',
              content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } },
            },
          },
        },
      },
      '/api/v1/cart': {
        get: {
          tags: ['Cart'],
          summary: 'Get current cart details',
          responses: {
            '200': { description: 'Cart returned successfully', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } },
          },
        },
        post: {
          tags: ['Cart'],
          summary: 'Add item to cart',
          requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CartItemRequest' } } } },
          responses: {
            '200': { description: 'Product added to cart', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } },
          },
        },
      },
      '/api/v1/cart/items/{id}': {
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' }, description: 'Cart item identifier' }],
        put: {
          tags: ['Cart'],
          summary: 'Update cart item quantity',
          requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CartItemRequest' } } } },
          responses: {
            '200': { description: 'Cart item updated', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } },
          },
        },
        delete: {
          tags: ['Cart'],
          summary: 'Remove an item from cart',
          responses: {
            '200': { description: 'Cart item removed', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } },
          },
        },
      },
      '/api/v1/cart/checkout': {
        post: {
          tags: ['Cart'],
          summary: 'Checkout the current cart',
          requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/CheckoutRequest' } } } },
          responses: {
            '200': { description: 'Checkout initiated', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } },
          },
        },
      },
      '/api/v1/inventory': {
        get: {
          tags: ['Inventory'],
          summary: 'List inventory records',
        
          responses: { '200': { description: 'Inventory list returned', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } } },
        },
      },
      '/api/v1/inventory/{id}': {
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' }, description: 'Inventory item identifier' }],
        get: {
          tags: ['Inventory'],
          summary: 'Get inventory item by ID',
          responses: { '200': { description: 'Inventory detail returned', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } } },
        },
      },
      '/api/v1/inventory/{id}/reserve': {
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' }, description: 'Inventory item identifier' }],
        patch: {
          tags: ['Inventory'],
          summary: 'Reserve inventory for an order',
          requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/InventoryReserveRequest' } } } },
          responses: { '200': { description: 'Inventory reserved', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } } },
        },
      },
      '/api/v1/orders': {
        get: {
          tags: ['Orders'],
          summary: 'List orders',
          responses: { '200': { description: 'Order list returned', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } } },
        },
        post: {
          tags: ['Orders'],
          summary: 'Create a new order',
          requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { cartId: { type: 'integer' }, paymentMethod: { type: 'string' } }, required: ['cartId', 'paymentMethod'] } } } },
          responses: { '201': { description: 'Order created', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } } },
        },
      },
      '/api/v1/orders/{id}': {
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'integer' }, description: 'Order identifier' }],
        get: {
          tags: ['Orders'],
          summary: 'Get order details',
          responses: { '200': { description: 'Order returned', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } } },
        },
      },
      '/api/v1/customers': {
        get: {
          tags: ['Customers'],
          summary: 'List customers',
          responses: { '200': { description: 'Customer list returned', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } } },
        },
      },
      '/api/v1/cms/pages': {
        get: {
          tags: ['CMS'],
          summary: 'List CMS pages',
          responses: { '200': { description: 'CMS pages returned', content: { 'application/json': { schema: { $ref: '#/components/schemas/ApiResponse' } } } } },
        },
      },
    },
    tags: [
      {
        name: 'Health',
        description: 'Health check endpoints',
      },
      {
        name: 'Authentication',
        description: 'Authentication and authorization endpoints',
      },
      {
        name: 'Users',
        description: 'User management endpoints',
      },
      {
        name: 'Products',
        description: 'Product management endpoints',
      },
      {
        name: 'Orders',
        description: 'Order management endpoints',
      },
      {
        name: 'Cart',
        description: 'Shopping cart endpoints',
      },
      {
        name: 'CMS',
        description: 'Content Management System endpoints',
      },
      {
        name: 'Inventory',
        description: 'Inventory management endpoints',
      },
      {
        name: 'Cart',
        description: 'Shopping cart endpoints',
      },
      {
        name: 'Orders',
        description: 'Order management endpoints',
      },
      {
        name: 'Payments',
        description: 'Payment and billing endpoints',
      },
      {
        name: 'Customers',
        description: 'Customer management endpoints',
      },
      {
        name: 'Reports',
        description: 'Analytics and reports endpoints',
      },
      {
        name: 'Admin',
        description: 'System administration endpoints',
      },
    ],
  },
  apis: [
    './src/routes/*.ts',
    './src/controllers/*.ts',
  ],
};

export const swaggerSpec = swaggerJsdoc(swaggerOptions);
