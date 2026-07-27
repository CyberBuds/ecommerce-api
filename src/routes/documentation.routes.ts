import crypto from 'crypto';
import { Router, Request, Response } from 'express';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  const host = req.get('host') || 'localhost:4000';
  const protocol = req.protocol;
  const baseUrl = `${protocol}://${host}`;
  const swaggerUrl = `${baseUrl}/api/swagger.json`;

  // This page needs to load the Redoc CDN bundle and run its own inline
  // script. Rather than weakening the app-wide CSP with 'unsafe-inline',
  // scope a nonce-based policy to just this response.
  const nonce = crypto.randomBytes(16).toString('base64');
  res.setHeader(
    'Content-Security-Policy',
    [
      "default-src 'self'",
      `script-src 'self' 'nonce-${nonce}' https://cdn.jsdelivr.net`,
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdn.jsdelivr.net",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data:",
      "connect-src 'self'",
      "worker-src 'self' blob:",
    ].join('; ')
  );

  res.send(`<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Saree eCommerce API Documentation</title>
  <script nonce="${nonce}" src="https://cdn.jsdelivr.net/npm/redoc@next/bundles/redoc.standalone.js"></script>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

    :root {
      color-scheme: light;
      --ink:#1B1420;
      --sidebar:#1B1420;
      --sidebar-soft:#2A2030;
      --sidebar-line:#3A2E42;
      --gold:#C9A227;
      --gold-soft:#E4C86B;
      --paper:#FAF6EF;
      --paper-raised:#FFFFFF;
      --line:#E7DCC8;
      --text:#241A29;
      --text-dim:#6E5F72;
      --maroon:#7A1F3D;
      --maroon-deep:#5C1730;
      --get:#1F7A5C;   --get-bg:#E3F3EB;
      --post:#9A6B00;  --post-bg:#FBF0D6;
      --put:#8B5E34;   --put-bg:#F5E8DA;
      --delete:#A6293F;--delete-bg:#FBE4E8;
      --patch:#6B4C9A; --patch-bg:#ECE4F7;
      --mono:'JetBrains Mono', ui-monospace, monospace;
      --display:'Fraunces', Georgia, serif;
      --sans:'Inter', -apple-system, system-ui, sans-serif;
      font-family: var(--sans);
      background: var(--paper);
      color: var(--text);
    }
    * { box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body { margin: 0; min-height: 100vh; background: var(--paper); font-size: 15px; line-height: 1.65; }
    a { color: var(--maroon); text-decoration: none; }
    a:hover { text-decoration: underline; }
    code { font-family: var(--mono); font-size: 0.85em; background: #F1EADA; padding: 1px 6px; border-radius: 5px; color: var(--maroon-deep); }

    .layout { display: grid; grid-template-columns: 288px 1fr; min-height: 100vh; }

    /* ---- Sidebar ---- */
    .sidebar { position: sticky; top: 0; align-self: start; min-height: 100vh; padding: 0 0 32px; background: var(--sidebar); border-right: 1px solid var(--sidebar-line); max-height: 100vh; overflow-y: auto; }
    .brand { display: flex; align-items: center; gap: 10px; padding: 22px 22px 18px; border-bottom: 1px solid var(--sidebar-line); position: relative; }
    .brand::after { content:""; position:absolute; left:0; right:0; bottom:-1px; height:3px; background:linear-gradient(90deg, transparent, var(--gold) 20%, var(--gold-soft) 50%, var(--gold) 80%, transparent); opacity:.9; }
    .brand-mark { width: 34px; height: 34px; border-radius: 8px; background: linear-gradient(145deg, var(--maroon), var(--maroon-deep)); display:flex; align-items:center; justify-content:center; border: 1px solid rgba(228,200,107,.4); flex-shrink:0; }
    .brand-title { margin: 0; font-family: var(--display); font-weight: 600; font-size: 16.5px; color: #F6EFE6; }
    .brand-subtitle { margin: 1px 0 0; font-size: 10.5px; color: #B9A6C4; text-transform: uppercase; letter-spacing: 1.4px; }
    .sidebar nav { display: grid; gap: 2px; padding: 14px 12px 0; }
    .sidebar .section-title { margin: 20px 10px 6px; color: #8B7896; text-transform: uppercase; font-size: 10.5px; letter-spacing: 1.4px; font-weight: 600; }
    .sidebar nav a { display: block; padding: 8px 12px; border-radius: 7px; color: #D6C9DC; font-size: 13.3px; transition: background .12s, color .12s; }
    .sidebar nav a:hover { background: var(--sidebar-soft); color: #fff; text-decoration: none; }
    .sidebar nav a.tag-link { display: flex; justify-content: space-between; gap: 8px; }
    .sidebar nav a.tag-link .count { color: #8B7896; font-family: var(--mono); font-size: 11px; }

    .main { padding: 40px 44px 100px; display: grid; gap: 22px; max-width: 1040px; }

    .topbar { display: flex; justify-content: space-between; align-items: center; gap: 1rem; background: var(--paper-raised); padding: 16px 22px; border-radius: 14px; border: 1px solid var(--line); flex-wrap: wrap; }
    .topbar-title { margin: 0; font-family: var(--display); font-weight: 600; font-size: 1.05rem; color: var(--ink); }
    .topbar-links { display: flex; flex-wrap: wrap; gap: 0.6rem; }
    .topbar-links a { background: var(--maroon); color: #fff; padding: 0.55rem 1rem; border-radius: 999px; font-weight: 600; font-size: 0.85rem; }
    .topbar-links a:hover { background: var(--maroon-deep); text-decoration: none; }

    .hero { background: var(--paper-raised); border: 1px solid var(--line); border-radius: 16px; padding: 34px; display: grid; gap: 16px; }
    .hero .eyebrow { display:flex; align-items:center; gap:8px; text-transform: uppercase; letter-spacing: 2px; font-weight: 700; font-size: 11.5px; color: var(--maroon); font-family: var(--mono); }
    .hero .eyebrow::before { content:""; width:16px; height:1.5px; background: var(--gold); display:inline-block; }
    .hero h1 { margin: 0; font-family: var(--display); font-weight: 600; font-size: clamp(1.9rem, 2.4vw, 2.7rem); line-height: 1.12; color: var(--ink); letter-spacing: -.3px; }
    .hero p { margin: 0; color: var(--text-dim); line-height: 1.8; max-width: 720px; }
    .badges { display: flex; flex-wrap: wrap; gap: 0.6rem; }
    .badge { padding: 6px 12px; border-radius: 7px; background: var(--paper); border: 1px solid var(--line); color: var(--text); font-size: 12px; font-family: var(--mono); }
    .badge b { color: var(--maroon); }

    .panel { background: var(--paper-raised); border: 1px solid var(--line); border-radius: 16px; padding: 28px 30px; }
    .panel h2 { margin-top: 0; font-size: 1.05rem; }
    .panel p { color: var(--text-dim); line-height: 1.8; }
    .codebox { background: var(--ink); border: 1px solid var(--sidebar-line); border-radius: 10px; padding: 16px 18px; font-family: var(--mono); color: #E9DFF0; white-space: pre-wrap; overflow-x: auto; font-size: 13px; line-height: 1.65; }

    .section-heading { display: flex; gap: 0.7rem; align-items: center; margin-bottom: 1rem; }
    .section-heading span { width: 30px; height: 30px; border-radius: 8px; background: var(--paper); border: 1px solid var(--line); color: var(--maroon); display: inline-flex; align-items: center; justify-content: center; font-weight: 700; font-family: var(--mono); font-size: 13px; flex-shrink: 0; }
    .section-heading h3 { margin: 0; font-family: var(--display); font-weight: 600; font-size: 1.15rem; color: var(--ink); }

    .list { list-style: none; margin: 0; padding: 0; display: grid; gap: 8px; }
    .list li { background: var(--paper); border: 1px solid var(--line); border-radius: 10px; padding: 12px 14px; color: var(--text); font-size: 13.5px; }
    .list li strong { color: var(--ink); }

    .note { color: var(--text-dim); font-size: 13.5px; margin-bottom: 1rem; }
    .redoc-container { min-height: 80vh; border-radius: 14px; overflow: hidden; border: 1px solid var(--line); background: var(--paper-raised); }

    /* ---- Endpoint catalog ---- */
    .catalog-search { position: relative; margin-bottom: 6px; }
    .catalog-search input { width: 100%; padding: 12px 16px; border-radius: 10px; border: 1px solid var(--line); background: var(--paper); font-family: var(--sans); font-size: 13.5px; color: var(--text); }
    .catalog-search input:focus { outline: 2px solid var(--gold-soft); outline-offset: 1px; }
    .catalog-empty { color: var(--text-dim); font-size: 13.5px; padding: 10px 2px; }

    .endpoint-group { margin-top: 22px; }
    .endpoint-group:first-of-type { margin-top: 4px; }
    .endpoint-group-title { margin: 0 0 10px; font-family: var(--display); font-size: 15px; font-weight: 600; color: var(--maroon-deep); display: flex; align-items: center; gap: 8px; }
    .endpoint-group-title .count { font-family: var(--mono); font-weight: 400; font-size: 11.5px; color: var(--text-dim); background: var(--paper); border: 1px solid var(--line); padding: 2px 8px; border-radius: 999px; }

    .endpoint-list { display: grid; gap: 10px; }
    .endpoint-card { display: grid; gap: 0; background: var(--paper); border: 1px solid var(--line); border-radius: 10px; overflow: hidden; }
    .endpoint-summary { display: flex; gap: 0.65rem; flex-wrap: wrap; align-items: center; padding: 12px 15px; cursor: pointer; user-select: none; }
    .endpoint-summary strong.ep-path { font-family: var(--mono); font-weight: 500; font-size: 13.5px; color: var(--ink); }
    .endpoint-summary .ep-title { color: var(--text-dim); font-size: 12.5px; margin-left: auto; padding-right: 4px; }
    .endpoint-summary .chevron { color: var(--text-dim); font-size: 11px; transition: transform .15s; flex-shrink: 0; }
    .endpoint-card.open .chevron { transform: rotate(90deg); }
    .method-badge { display: inline-flex; align-items: center; justify-content: center; min-width: 58px; padding: 3px 10px; border-radius: 6px; font-size: 11px; font-weight: 700; font-family: var(--mono); letter-spacing: .3px; flex-shrink: 0; }
    .method-get { background: var(--get-bg); color: var(--get); }
    .method-post { background: var(--post-bg); color: var(--post); }
    .method-put { background: var(--put-bg); color: var(--put); }
    .method-delete { background: var(--delete-bg); color: var(--delete); }
    .method-patch { background: var(--patch-bg); color: var(--patch); }
    .auth-lock { font-size: 12px; color: var(--gold); flex-shrink: 0; }

    .endpoint-detail { display: none; padding: 4px 15px 16px; border-top: 1px solid var(--line); background: var(--paper-raised); }
    .endpoint-card.open .endpoint-detail { display: block; }
    .endpoint-detail p.ep-desc { margin: 12px 0; color: var(--text-dim); font-size: 13px; line-height: 1.7; }
    .ep-subhead { margin: 16px 0 8px; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; font-weight: 700; color: var(--maroon); }
    .param-table { width: 100%; border-collapse: collapse; font-size: 12.5px; }
    .param-table th, .param-table td { text-align: left; padding: 6px 8px; border-bottom: 1px solid var(--line); vertical-align: top; }
    .param-table th { color: var(--text-dim); font-weight: 600; font-size: 11px; text-transform: uppercase; letter-spacing: .4px; }
    .param-table td.param-name { font-family: var(--mono); color: var(--maroon-deep); white-space: nowrap; }
    .param-required { color: var(--delete); font-size: 10px; font-weight: 700; margin-left: 4px; }
    .response-row { display: flex; gap: 10px; padding: 6px 0; border-bottom: 1px solid var(--line); font-size: 12.5px; align-items: baseline; }
    .response-row:last-child { border-bottom: none; }
    .response-code { font-family: var(--mono); font-weight: 700; min-width: 34px; }
    .response-code.c2 { color: var(--get); }
    .response-code.c4 { color: var(--patch); }
    .response-code.c5 { color: var(--delete); }
    .response-desc { color: var(--text-dim); }
    .ep-json { background: var(--ink); border-radius: 8px; padding: 12px 14px; font-family: var(--mono); font-size: 12px; color: #E9DFF0; white-space: pre-wrap; overflow-x: auto; margin: 0; }

    @media (max-width: 1024px) {
      .layout { grid-template-columns: 1fr; }
      .sidebar { position: relative; min-height: auto; max-height: none; border-right: none; border-bottom: 1px solid var(--sidebar-line); }
      .main { padding: 28px 20px 80px; }
    }
  </style>
</head>
<body>
  <div class="layout">
    <aside class="sidebar">
      <div class="brand">
        <div class="brand-mark">
          <svg viewBox="0 0 24 24" fill="none" width="18" height="18"><path d="M4 20c3-9 5-14 8-16 3 2 5 7 8 16-2-2-5-3-8-3s-6 1-8 3z" stroke="#E4C86B" stroke-width="1.4" stroke-linejoin="round"/></svg>
        </div>
        <div>
          <p class="brand-title">Saree API</p>
          <p class="brand-subtitle">Integration Docs</p>
        </div>
      </div>
      <nav>
        <a href="#overview">Overview</a>
        <a href="#getting-started">Getting Started</a>
        <a href="#authentication">Authentication</a>
        <a href="#response-format">Response Format</a>
        <a href="#endpoint-catalog">Endpoint Catalog</a>
        <a href="#integration-checklist">Integration Checklist</a>
        <a href="#api-contract">API Contract</a>
      </nav>
      <div class="section-title">Endpoint Groups</div>
      <nav id="tag-nav">
        <a href="#endpoint-catalog">Loading…</a>
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
        <span class="eyebrow">API Reference</span>
        <h1>Everything you need to integrate with the Saree eCommerce platform</h1>
        <p>Discover endpoints, payloads, responses, and authentication requirements for products, cart, inventory, orders, and content management. Every route below is generated live from the API's own OpenAPI spec, so it always matches what's deployed.</p>
        <div class="badges">
          <span class="badge">OpenAPI <b>3.0.0</b></span>
          <span class="badge">Auth: <b>Bearer JWT</b></span>
          <span class="badge">Version <b>1.0</b></span>
          <span class="badge">Base URL: <b>${baseUrl}</b></span>
        </div>
      </section>

      <section class="panel" id="getting-started">
        <div class="section-heading"><span>01</span><h3>Getting Started</h3></div>
        <p>All API calls are under the versioned root path. Use the health route to confirm that the service is available before proceeding.</p>
        <div class="codebox">curl -X GET "${baseUrl}/health" -H "Accept: application/json"</div>
      </section>

      <section class="panel" id="authentication">
        <div class="section-heading"><span>02</span><h3>Authentication</h3></div>
        <p>This API uses Bearer JWT authentication for protected resources. Sign in once and include the token on every protected request. Endpoints marked with a 🔒 lock icon in the catalog below require this header.</p>
        <div class="list">
          <li><strong>Header:</strong> <code>Authorization: Bearer &lt;token&gt;</code></li>
          <li><strong>Auth endpoints:</strong> <code>/api/v1/auth/login</code>, <code>/api/v1/auth/refresh</code>, <code>/api/v1/auth/logout</code></li>
          <li><strong>Public endpoint:</strong> <code>/api/v1/health</code></li>
        </div>
      </section>

      <section class="panel" id="response-format">
        <div class="section-heading"><span>03</span><h3>Response Format</h3></div>
        <p>Every response follows a standard envelope so integrations can parse success, errors, and meta consistently.</p>
        <div class="codebox">{
  "success": true,
  "data": { /* result payload */ },
  "meta": null,
  "message": "Operation successful",
  "errors": null
}</div>
      </section>

      <section class="panel" id="endpoint-catalog">
        <div class="section-heading"><span>04</span><h3>Endpoint Catalog</h3></div>
        <p class="note">Every registered route, grouped by feature area. Click a row to expand parameters, request body, and response codes. Search below to jump straight to what you need.</p>
        <div id="endpoint-list" class="endpoint-list">
          <div class="endpoint-card"><div class="endpoint-summary"><p>Loading endpoint catalog…</p></div></div>
        </div>
      </section>

      <section class="panel" id="integration-checklist">
        <div class="section-heading"><span>05</span><h3>Integration Checklist</h3></div>
        <ul class="list">
          <li>Use the versioned root <code>${baseUrl}</code> for all requests.</li>
          <li>Authenticate once and include the bearer token for protected routes (look for the 🔒 icon).</li>
          <li>Review request and response schemas in the catalog before sending payloads.</li>
          <li>Use the API playground or the full contract below for interactive tests.</li>
        </ul>
      </section>

      <section class="panel" id="api-contract">
        <div class="section-heading"><span>06</span><h3>Full API Contract</h3></div>
        <p class="note">The contract below is generated from the OpenAPI JSON spec and includes every registered path, request body, response schema, and parameter detail in full Redoc form.</p>
        <div class="redoc-container">
          <redoc spec-url="${swaggerUrl}" scroll-y-offset="80"></redoc>
        </div>
      </section>
    </main>
  </div>

  <script nonce="${nonce}">
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

    function responseClass(code) {
      var first = String(code).charAt(0);
      if (first === '2') return 'c2';
      if (first === '4') return 'c4';
      if (first === '5') return 'c5';
      return '';
    }

    function slugify(text) {
      return String(text).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    }

    function extractExampleFromRequestBody(operation) {
      try {
        var content = operation.requestBody && operation.requestBody.content;
        var jsonBody = content && content['application/json'];
        if (!jsonBody) return null;
        if (jsonBody.example) return jsonBody.example;
        if (jsonBody.schema && jsonBody.schema.properties) {
          var built = {};
          Object.keys(jsonBody.schema.properties).forEach(function (key) {
            var prop = jsonBody.schema.properties[key];
            built[key] = prop && Object.prototype.hasOwnProperty.call(prop, 'example') ? prop.example : (prop && prop.type ? prop.type : null);
          });
          return built;
        }
        return null;
      } catch (e) {
        return null;
      }
    }

    function buildParamTable(params, kind) {
      var filtered = (params || []).filter(function (p) { return p.in === kind; });
      if (!filtered.length) return null;
      var table = document.createElement('table');
      table.className = 'param-table';
      var thead = document.createElement('thead');
      thead.innerHTML = '<tr><th>Name</th><th>Type</th><th>Description</th></tr>';
      table.appendChild(thead);
      var tbody = document.createElement('tbody');
      filtered.forEach(function (p) {
        var tr = document.createElement('tr');
        var nameTd = document.createElement('td');
        nameTd.className = 'param-name';
        nameTd.textContent = p.name;
        if (p.required) {
          var req = document.createElement('span');
          req.className = 'param-required';
          req.textContent = 'REQUIRED';
          nameTd.appendChild(req);
        }
        var typeTd = document.createElement('td');
        typeTd.textContent = (p.schema && p.schema.type) || 'string';
        var descTd = document.createElement('td');
        descTd.textContent = p.description || '';
        tr.appendChild(nameTd);
        tr.appendChild(typeTd);
        tr.appendChild(descTd);
        tbody.appendChild(tr);
      });
      table.appendChild(tbody);
      return table;
    }

    function createEndpointCard(path, method, operation) {
      operation = operation || {};
      var card = document.createElement('div');
      card.className = 'endpoint-card';
      var searchBlob = [path, method, operation.summary || '', operation.description || '', (operation.tags || []).join(' ')].join(' ').toLowerCase();
      card.dataset.search = searchBlob;

      var summary = document.createElement('div');
      summary.className = 'endpoint-summary';

      var badge = document.createElement('span');
      badge.className = 'method-badge ' + methodClass(method);
      badge.textContent = method.toUpperCase();
      summary.appendChild(badge);

      if (operation.security && operation.security.length) {
        var lock = document.createElement('span');
        lock.className = 'auth-lock';
        lock.title = 'Requires authentication';
        lock.textContent = '\\u{1F512}';
        summary.appendChild(lock);
      }

      var pathText = document.createElement('strong');
      pathText.className = 'ep-path';
      pathText.textContent = path;
      summary.appendChild(pathText);

      if (operation.summary) {
        var titleEl = document.createElement('span');
        titleEl.className = 'ep-title';
        titleEl.textContent = operation.summary;
        summary.appendChild(titleEl);
      }

      var chevron = document.createElement('span');
      chevron.className = 'chevron';
      chevron.textContent = '\\u25B8';
      summary.appendChild(chevron);

      summary.addEventListener('click', function () {
        card.classList.toggle('open');
      });
      card.appendChild(summary);

      var detail = document.createElement('div');
      detail.className = 'endpoint-detail';

      if (operation.description) {
        var descEl = document.createElement('p');
        descEl.className = 'ep-desc';
        descEl.textContent = operation.description;
        detail.appendChild(descEl);
      }

      var pathParamsTable = buildParamTable(operation.parameters, 'path');
      if (pathParamsTable) {
        var h1 = document.createElement('div');
        h1.className = 'ep-subhead';
        h1.textContent = 'Path Parameters';
        detail.appendChild(h1);
        detail.appendChild(pathParamsTable);
      }

      var queryParamsTable = buildParamTable(operation.parameters, 'query');
      if (queryParamsTable) {
        var h2 = document.createElement('div');
        h2.className = 'ep-subhead';
        h2.textContent = 'Query Parameters';
        detail.appendChild(h2);
        detail.appendChild(queryParamsTable);
      }

      var bodyExample = extractExampleFromRequestBody(operation);
      if (bodyExample) {
        var h3 = document.createElement('div');
        h3.className = 'ep-subhead';
        h3.textContent = 'Request Body';
        detail.appendChild(h3);
        var pre = document.createElement('pre');
        pre.className = 'ep-json';
        pre.textContent = JSON.stringify(bodyExample, null, 2);
        detail.appendChild(pre);
      }

      if (operation.responses) {
        var h4 = document.createElement('div');
        h4.className = 'ep-subhead';
        h4.textContent = 'Responses';
        detail.appendChild(h4);
        Object.keys(operation.responses).forEach(function (code) {
          var row = document.createElement('div');
          row.className = 'response-row';
          var codeEl = document.createElement('span');
          codeEl.className = 'response-code ' + responseClass(code);
          codeEl.textContent = code;
          var descEl2 = document.createElement('span');
          descEl2.className = 'response-desc';
          descEl2.textContent = (operation.responses[code] && operation.responses[code].description) || '';
          row.appendChild(codeEl);
          row.appendChild(descEl2);
          detail.appendChild(row);
        });
      }

      card.appendChild(detail);
      return card;
    }

    function renderFallbackList(routes) {
      var container = document.getElementById('endpoint-list');
      container.innerHTML = '';
      if (!routes.length) {
        container.innerHTML = '<div class="catalog-empty">No endpoints found in the route catalog.</div>';
        return;
      }
      routes.sort(function (a, b) {
        return a.path.localeCompare(b.path) || a.methods.join(',').localeCompare(b.methods.join(','));
      });
      routes.forEach(function (route) {
        route.methods.forEach(function (method) {
          container.appendChild(createEndpointCard(route.path, method, null));
        });
      });
    }

    function renderGroupedCatalog(openApi) {
      var container = document.getElementById('endpoint-list');
      container.innerHTML = '';

      var searchWrap = document.createElement('div');
      searchWrap.className = 'catalog-search';
      var searchInput = document.createElement('input');
      searchInput.type = 'text';
      searchInput.id = 'endpoint-search';
      searchInput.placeholder = 'Search endpoints by path, method, summary, or tag…';
      searchWrap.appendChild(searchInput);
      container.appendChild(searchWrap);

      var groups = {};
      var methodOrder = ['get', 'post', 'put', 'patch', 'delete'];
      Object.keys(openApi.paths || {}).forEach(function (path) {
        var methods = openApi.paths[path];
        methodOrder.forEach(function (method) {
          var operation = methods[method];
          if (!operation) return;
          var tags = (operation.tags && operation.tags.length) ? operation.tags : ['Other'];
          tags.forEach(function (tag) {
            if (!groups[tag]) groups[tag] = [];
            groups[tag].push({ path: path, method: method, operation: operation });
          });
        });
      });

      var sortedTags = Object.keys(groups).sort();
      var tagNav = document.getElementById('tag-nav');
      tagNav.innerHTML = '';

      if (!sortedTags.length) {
        container.innerHTML += '<div class="catalog-empty">No endpoints found in the OpenAPI spec.</div>';
        return;
      }

      sortedTags.forEach(function (tag) {
        var anchorId = 'tag-' + slugify(tag);

        var navLink = document.createElement('a');
        navLink.className = 'tag-link';
        navLink.href = '#' + anchorId;
        var navLabel = document.createElement('span');
        navLabel.textContent = tag;
        var navCount = document.createElement('span');
        navCount.className = 'count';
        navCount.textContent = groups[tag].length;
        navLink.appendChild(navLabel);
        navLink.appendChild(navCount);
        tagNav.appendChild(navLink);

        var groupEl = document.createElement('div');
        groupEl.className = 'endpoint-group';
        groupEl.id = anchorId;
        groupEl.dataset.tag = tag.toLowerCase();

        var groupTitle = document.createElement('div');
        groupTitle.className = 'endpoint-group-title';
        var groupTitleText = document.createElement('span');
        groupTitleText.textContent = tag;
        var groupTitleCount = document.createElement('span');
        groupTitleCount.className = 'count';
        groupTitleCount.textContent = groups[tag].length + ' endpoint' + (groups[tag].length === 1 ? '' : 's');
        groupTitle.appendChild(groupTitleText);
        groupTitle.appendChild(groupTitleCount);
        groupEl.appendChild(groupTitle);

        var listEl = document.createElement('div');
        listEl.className = 'endpoint-list';
        groups[tag]
          .sort(function (a, b) { return a.path.localeCompare(b.path); })
          .forEach(function (entry) {
            listEl.appendChild(createEndpointCard(entry.path, entry.method, entry.operation));
          });
        groupEl.appendChild(listEl);

        container.appendChild(groupEl);
      });

      searchInput.addEventListener('input', function (e) {
        var q = e.target.value.toLowerCase().trim();
        var anyVisible = false;
        document.querySelectorAll('#endpoint-list .endpoint-group').forEach(function (group) {
          var visibleInGroup = 0;
          group.querySelectorAll('.endpoint-card').forEach(function (card) {
            var match = !q || (card.dataset.search || '').indexOf(q) !== -1;
            card.style.display = match ? '' : 'none';
            if (match) visibleInGroup++;
          });
          group.style.display = visibleInGroup ? '' : 'none';
          if (visibleInGroup) anyVisible = true;
        });
      });
    }

    Promise.all([
      fetch('/api/v1/docs/endpoints').then(function (r) { return r.json(); }).catch(function () { return null; }),
      fetch('${swaggerUrl}').then(function (r) { return r.json(); }).catch(function () { return null; }),
    ])
      .then(function (results) {
        var routeCatalog = results[0];
        var openApi = results[1];

        if (openApi && openApi.paths && Object.keys(openApi.paths).length) {
          renderGroupedCatalog(openApi);
        } else if (routeCatalog && routeCatalog.data && routeCatalog.data.length) {
          document.getElementById('tag-nav').innerHTML = '<a href="#endpoint-catalog">All Endpoints</a>';
          renderFallbackList(routeCatalog.data);
        } else {
          document.getElementById('endpoint-list').innerHTML = '<div class="catalog-empty">No endpoints found.</div>';
          document.getElementById('tag-nav').innerHTML = '';
        }
      })
      .catch(function () {
        document.getElementById('endpoint-list').innerHTML = '<div class="catalog-empty">Unable to load endpoint catalog. Please try again later.</div>';
        document.getElementById('tag-nav').innerHTML = '';
      });
  </script>
</body>
</html>
`);
});

export default router;