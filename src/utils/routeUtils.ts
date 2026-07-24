import { Router } from 'express';

export interface RouteInfo {
  path: string;
  methods: string[];
}

function normalizeLayerPath(regexpSource: string): string {
  let path = regexpSource
    .replace(/^(\^)+/, '')
    .replace(/\$+$/, '')
    .replace(/\\\//g, '/')
    .replace(/\/?\(\?=[^)]+\)/g, '')
    .replace(/\(\?=[^)]+\)/g, '')
    .replace(/\/?\?/g, '')
    .replace(/\(\?:\(\[\^\\\/\]\+\)\)\?/g, ':param')
    .replace(/\(\?:\(\[\^\\\/\]\+\)\)/g, ':param')
    .replace(/\(\?:\[\^\\\/\]\+\)/g, ':param')
    .replace(/[\^$]/g, '');

  if (path === '') {
    return '';
  }

  if (!path.startsWith('/')) {
    path = `/${path}`;
  }

  return path;
}

function normalizePath(parentPath: string, childPath: string): string {
  if (!parentPath) {
    return childPath;
  }

  if (!childPath) {
    return parentPath;
  }

  const normalizedParent = parentPath.endsWith('/') ? parentPath.slice(0, -1) : parentPath;
  const normalizedChild = childPath.startsWith('/') ? childPath : `/${childPath}`;
  return `${normalizedParent}${normalizedChild}`;
}

export function collectRoutes(router: Router, parentPath = ''): RouteInfo[] {
  const routes: RouteInfo[] = [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const stack = (router as any).stack || [];

  stack.forEach((layer: any) => {
    if (layer.route && layer.route.path) {
      const routePath = Array.isArray(layer.route.path)
        ? layer.route.path[0]
        : layer.route.path;
      const fullPath = normalizePath(parentPath, routePath);
      const methods = Object.keys(layer.route.methods || {}).map((method) => method.toUpperCase());
      routes.push({ path: fullPath, methods });
    } else if (layer.name === 'router' && layer.handle) {
      const layerPath = normalizeLayerPath(layer.regexp?.source || '');
      const nestedParent = normalizePath(parentPath, layerPath);
      routes.push(...collectRoutes(layer.handle, nestedParent));
    }
  });

  return routes;
}
