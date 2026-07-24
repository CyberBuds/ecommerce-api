import { Router, Request, Response } from 'express';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  const host = req.get('host') || 'localhost:4000';
  const protocol = req.protocol;
  const swaggerUrl = `${protocol}://${host}/api/swagger.json`;

  res.send(`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Saree eCommerce API Documentation</title>
  <script src="https://cdn.jsdelivr.net/npm/redoc@next/bundles/redoc.standalone.js"></script>
  <style>
    :root {
      color-scheme: light;
      font-family: Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: #f8fafc;
      color: #111827;
    }
    * { box-sizing: border-box; }
    body { margin: 0; min-height: 100vh; background: #f8fafc; }
    a { color: #2563eb; text-decoration: none; }
    a:hover { text-decoration: underline; }
    .layout { display: grid; grid-template-columns: 300px 1fr; min-height: 100vh; }
    .sidebar { position: sticky; top: 0; align-self: start; min-height: 100vh; padding: 32px 24px; background: #ffffff; border-right: 1px solid #e5e7eb; }
    .sidebar .brand { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 2rem; }
    .brand-dot { width: 12px; height: 12px; border-radius: 50%; background: #2563eb; }
    .brand-title { margin: 0; font-size: 1rem; font-weight: 700; color: #111827; }
    .brand-subtitle { margin: 0; font-size: 0.85rem; color: #475569; }
    .sidebar nav { display: grid; gap: 0.5rem; }
    .sidebar nav a { display: block; padding: 0.85rem 1rem; border-radius: 14px; border: 1px solid transparent; background: #f8fafc; color: #334155; font-size: 0.95rem; }
    .sidebar nav a:hover { background: #eff6ff; border-color: #bfdbfe; }
    .sidebar .section-title { margin: 2rem 0 0.8rem; color: #1e293b; text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.16em; }
    .main { padding: 32px 40px; display: grid; gap: 24px; }
    .topbar { display: flex; justify-content: space-between; align-items: center; gap: 1rem; background: #ffffff; padding: 20px 24px; border-radius: 24px; border: 1px solid #e5e7eb; box-shadow: 0 1px 2px rgba(15, 23, 42, 0.06); }
    .topbar-title { margin: 0; font-size: 1.1rem; color: #0f172a; }
    .topbar-links { display: flex; flex-wrap: wrap; gap: 0.75rem; }
    .topbar-links a { background: #2563eb; color: #ffffff; padding: 0.75rem 1rem; border-radius: 999px; font-weight: 600; font-size: 0.95rem; }
    .hero { background: #ffffff; border: 1px solid #e5e7eb; border-radius: 24px; padding: 32px; display: grid; gap: 18px; box-shadow: 0 1px 2px rgba(15, 23, 42, 0.06); }
    .hero small { display: inline-block; text-transform: uppercase; letter-spacing: 0.2em; font-weight: 700; color: #2563eb; }
    .hero h1 { margin: 0; font-size: clamp(2rem, 2.5vw, 3.2rem); line-height: 1.05; color: #0f172a; }
    .hero p { margin: 0; color: #475569; line-height: 1.8; max-width: 800px; }
    .badges { display: flex; flex-wrap: wrap; gap: 0.75rem; }
    .badge { padding: 0.75rem 1rem; border-radius: 999px; background: #f8fafc; border: 1px solid #e2e8f0; color: #334155; font-size: 0.92rem; }
    .panel { background: #ffffff; border: 1px solid #e5e7eb; border-radius: 24px; padding: 28px; box-shadow: 0 1px 2px rgba(15, 23, 42, 0.06); }
    .panel h2 { margin-top: 0; font-size: 1.15rem; color: #0f172a; }
    .panel p { color: #475569; line-height: 1.8; }
    .codebox { background: #f1f5f9; border: 1px solid #e2e8f0; border-radius: 16px; padding: 18px; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace; color: #0f172a; white-space: pre-wrap; overflow-x: auto; }
    .section-heading { display: flex; gap: 0.75rem; align-items: center; margin-bottom: 1rem; }
    .section-heading span { width: 32px; height: 32px; border-radius: 50%; background: #e0f2fe; color: #0369a1; display: inline-flex; align-items: center; justify-content: center; font-weight: 700; }
    .section-heading h3 { margin: 0; font-size: 1rem; color: #0f172a; }
    .list { list-style: none; margin: 0; padding: 0; display: grid; gap: 0.75rem; }
    .list li { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 16px; padding: 16px 18px; color: #334155; }
    .endpoint-card { display: grid; gap: 0.5rem; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 18px; padding: 16px 18px; }
    .endpoint-card strong { color: #0f172a; }
    .endpoint-card p { margin: 0; color: #475569; font-size: 0.95rem; }
    .endpoint-list { display: grid; gap: 14px; }
    .endpoint-preview { display: flex; gap: 0.75rem; flex-wrap: wrap; align-items: center; }
    .method-badge { display: inline-flex; align-items: center; justify-content: center; min-width: 64px; padding: 0.35rem 0.75rem; border-radius: 999px; font-size: 0.82rem; font-weight: 700; color: #ffffff; }
    .method-get { background: #22c55e; }
    .method-post { background: #2563eb; }
    .method-put { background: #f97316; }
    .method-delete { background: #ef4444; }
    .method-patch { background: #8b5cf6; }
    .note { color: #475569; font-size: 0.95rem; margin-bottom: 1rem; }
    .redoc-container { min-height: 80vh; border-radius: 24px; overflow: hidden; border: 1px solid #e5e7eb; background: #ffffff; box-shadow: 0 1px 2px rgba(15, 23, 42, 0.06); }
    @media (max-width: 1024px) {
      .layout { grid-template-columns: 1fr; }
      .sidebar { position: relative; min-height: auto; border-right: none; border-bottom: 1px solid #e5e7eb; }
    }
  </style>
</head>
<body>
  <div class="layout">
    <aside class="sidebar">
      <div class="brand">
        <span class="brand-dot"></span>
        <div>
          <p class="brand-title">Saree eCommerce API</p>
          <p class="brand-subtitle">Integration Docs</p>
        </div>
      </div>
      <nav>
        <a href="#overview">Overview</a>
        <a href="#getting-started">Getting Started</a>
        <a href="#authentication">Authentication</a>
        <a href="#response-format">Response Format</a>
        <a href="#endpoint-groups">Endpoint Groups</a>
        <a href="#key-endpoints">Key Endpoints</a>
        <a href="#inventory-endpoints">Inventory Endpoints</a>
        <a href="#endpoint-catalog">Endpoint Catalog</a>
        <a href="#integration-checklist">Integration Checklist</a>
        <a href="#api-contract">API Contract</a>
      </nav>
      <div class="section-title">Quick Links</div>
      <nav>
        <a href="/api/v1/health">Health Check</a>
        <a href="/api-docs">Swagger Explorer</a>
        <a href="${swaggerUrl}" target="_blank" rel="noreferrer">OpenAPI JSON</a>
      </nav>
    </aside>

    <main class="main">
      <section class="topbar">
        <p class="topbar-title">Saree eCommerce API Documentation</p>
        <div class="topbar-links">
          <a href="/api-docs" target="_blank" rel="noreferrer">OpenAPI Playground</a>
          <a href="${swaggerUrl}" target="_blank" rel="noreferrer">Download Spec</a>
        </div>
      </section>

      <section class="hero" id="overview">
        <small>API reference</small>
        <h1>Light mode documentation with fixed sidebar navigation</h1>
        <p>Use the page to discover API endpoints, payloads, responses, and authentication requirements for the Saree eCommerce platform.</p>
        <div class="badges">
          <span class="badge">OpenAPI 3.0.0</span>
          <span class="badge">Bearer JWT</span>
          <span class="badge">Version 1.0</span>
          <span class="badge">Base URL: ${swaggerUrl.replace('/swagger.json', '')}</span>
        </div>
      </section>

      <section class="panel" id="getting-started">
        <div class="section-heading"><span>1</span><h3>Getting Started</h3></div>
        <p>All API calls are under the versioned root path. Use the health route to confirm that the service is available before proceeding.</p>
        <div class="codebox">curl -X GET "${swaggerUrl.replace('/swagger.json', '')}/health" -H "Accept: application/json"</div>
      </section>

      <section class="panel" id="authentication">
        <div class="section-heading"><span>2</span><h3>Authentication</h3></div>
        <p>This API uses Bearer JWT authentication for protected resources. Sign in once and include the token on every protected request.</p>
        <div class="list">
          <li><strong>Header:</strong> <code>Authorization: Bearer &lt;token&gt;</code></li>
          <li><strong>Auth endpoints:</strong> <code>/api/v1/auth/login</code>, <code>/api/v1/auth/refresh</code>, <code>/api/v1/auth/logout</code></li>
          <li><strong>Public endpoint:</strong> <code>/api/v1/health</code></li>
        </div>
      </section>

      <section class="panel" id="response-format">
        <div class="section-heading"><span>3</span><h3>Response Format</h3></div>
        <p>Every response follows a standard envelope so integrations can parse success, errors, and meta consistently.</p>
        <div class="codebox">{
  "success": true,
  "data": { /* result payload */ },
  "meta": null,
  "message": "Operation successful",
  "errors": null
}</div>
      </section>

      <section class="panel" id="endpoint-groups">
        <div class="section-heading"><span>4</span><h3>Endpoint Groups</h3></div>
        <div class="list">
          <li><strong>Core:</strong> Health, Authentication, Users, Master Data</li>
          <li><strong>Commerce:</strong> Products, Inventory, Orders, Payments, Cart</li>
          <li><strong>Content:</strong> CMS, Reports, System Administration, Marketing, Customers</li>
        </div>
      </section>

      <section class="panel" id="key-endpoints">
        <div class="section-heading"><span>5</span><h3>Sample Endpoint Coverage</h3></div>
        <p class="note">This page shows all major integration areas and their key endpoints, including product, cart, inventory, and order APIs.</p>
        <div class="list">
          <li><strong>Products:</strong> <code>/api/v1/products</code>, <code>/api/v1/products/:id</code>, <code>/api/v1/products/:id/variants</code></li>
          <li><strong>Cart:</strong> <code>/api/v1/cart</code>, <code>/api/v1/cart/items</code>, <code>/api/v1/cart/checkout</code></li>
          <li><strong>Inventory:</strong> <code>/api/v1/inventory</code>, <code>/api/v1/inventory/:id</code>, <code>/api/v1/inventory/:id/reserve</code></li>
          <li><strong>Orders:</strong> <code>/api/v1/orders</code>, <code>/api/v1/orders/:id</code>, <code>/api/v1/orders/:id/status</code></li>
          <li><strong>Customers:</strong> <code>/api/v1/customers</code>, <code>/api/v1/customers/:id</code></li>
          <li><strong>CMS:</strong> <code>/api/v1/cms/pages</code>, <code>/api/v1/cms/blocks</code></li>
          <li><strong>Payments:</strong> <code>/api/v1/payments/create</code>, <code>/api/v1/payments/verify</code></li>
        </div>
      </section>

      <section class="panel" id="inventory-endpoints">
        <div class="section-heading"><span>6</span><h3>Inventory Endpoints</h3></div>
        <p class="note">Inventory endpoints are protected and require authentication. These are the key routes for inventory management.</p>
        <div class="list">
          <li><strong>List inventory</strong> � <code>GET /api/v1/inventory</code></li>
          <li><strong>Inventory detail</strong> � <code>GET /api/v1/inventory/:id</code></li>
          <li><strong>Reserve stock</strong> � <code>PATCH /api/v1/inventory/:id/reserve</code></li>
          <li><strong>Warehouse management</strong> � <code>POST /api/v1/warehouses</code>, <code>GET /api/v1/warehouses</code></li>
          <li><strong>Supplier management</strong> � <code>POST /api/v1/suppliers</code>, <code>GET /api/v1/suppliers</code></li>
          <li><strong>Inventory reports</strong> � <code>GET /api/v1/reports/inventory</code></li>
        </div>
      </section>

      <section class="panel" id="endpoint-catalog">
        <div class="section-heading"><span>5</span><h3>Endpoint Catalog</h3></div>
        <p class="note">The list below is built from the API's OpenAPI spec. It includes endpoint paths, methods, and available description summaries.</p>
        <div id="endpoint-list" class="endpoint-list">
          <div class="endpoint-card">Loading endpoint catalog...</div>
        </div>
      </section>

      <section class="panel" id="integration-checklist">
        <div class="section-heading"><span>6</span><h3>Integration Checklist</h3></div>
        <ul class="list">
          <li>Use the versioned root <code>${swaggerUrl.replace('/swagger.json', '')}</code> for all requests.</li>
          <li>Authenticate once and include the bearer token for protected routes.</li>
          <li>Review request and response schemas before sending payloads.</li>
          <li>Use the API playground for interactive tests.</li>
        </ul>
      </section>

      <section class="panel" id="api-contract">
        <div class="section-heading"><span>7</span><h3>API Contract</h3></div>
        <p class="note">The contract below is generated from the OpenAPI JSON spec and includes every registered path, request body, response schema, and parameter detail.</p>
        <div class="redoc-container">
          <redoc spec-url="${swaggerUrl}" scroll-y-offset="80"></redoc>
        </div>
      </section>
    </main>
  </div>

  <script>
    function normalizeMethod(method) {
      return method.toUpperCase();
    }

    function methodClass(method) {
      switch (method.toLowerCase()) {
        case 'get': return 'method-get';
        case 'post': return 'method-post';
        case 'put': return 'method-put';
        case 'delete': return 'method-delete';
        case 'patch': return 'method-patch';
        default: return 'method-get';
      }
    }

    function createEndpointCard(path, method, summary, description) {
      const card = document.createElement('div');
      card.className = 'endpoint-card';

      const header = document.createElement('div');
      header.className = 'endpoint-preview';
      const badge = document.createElement('span');
      badge.className = 'method-badge ' + methodClass(method);
      badge.textContent = method.toUpperCase();
      header.appendChild(badge);

      const pathText = document.createElement('strong');
      pathText.textContent = path;
      header.appendChild(pathText);
      card.appendChild(header);

      if (summary) {
        const summaryEl = document.createElement('p');
        summaryEl.textContent = summary;
        card.appendChild(summaryEl);
      }
      if (description) {
        const descriptionEl = document.createElement('p');
        descriptionEl.textContent = description;
        card.appendChild(descriptionEl);
      }

      return card;
    }

    function findSchema(openApi, path, method) {
      const pathObject = openApi.paths?.[path];
      if (!pathObject) {
        return null;
      }
      const operation = pathObject[method.toLowerCase()];
      if (!operation) {
        return null;
      }
      return operation;
    }

    Promise.all([
      fetch('/api/v1/docs/endpoints').then((r) => r.json()),
      fetch('${swaggerUrl}').then((r) => r.json()).catch(() => null),
    ])
      .then(([routeCatalog, openApi]) => {
        const container = document.getElementById('endpoint-list');
        container.innerHTML = '';
        const routes = routeCatalog?.data || [];

        if (!routes.length) {
          container.innerHTML = '<div class="endpoint-card">No endpoints found in the route catalog.</div>';
          return;
        }

        routes.sort((a, b) => a.path.localeCompare(b.path) || a.methods.join(',').localeCompare(b.methods.join(',')));
        routes.forEach((route) => {
          route.methods.forEach((method) => {
            const operation = openApi ? findSchema(openApi, route.path, method) : null;
            const summary = operation?.summary || '';
            const description = operation?.description || '';
            container.appendChild(createEndpointCard(route.path, method, summary, description));
          });
        });
      })
      .catch(() => {
        const container = document.getElementById('endpoint-list');
        container.innerHTML = '<div class="endpoint-card">Unable to load endpoint catalog. Please try again later.</div>';
      });
  </script>
</body>
</html>
`);
});

export default router;


