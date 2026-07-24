export interface SeoInput {
  title: string;
  description: string;
  keywords: string;
  url?: string;
  image?: string;
}

export function calculateSeoScore(input: SeoInput): number {
  let score = 0;
  if (input.title && input.title.length >= 40 && input.title.length <= 70) score += 20;
  if (input.description && input.description.length >= 120 && input.description.length <= 160) score += 20;
  if (input.keywords && input.keywords.split(',').length >= 3) score += 20;
  if (input.url) score += 20;
  if (input.image) score += 20;
  return score;
}

export function buildOpenGraph(options: { title: string; description: string; url?: string; image?: string }) {
  return {
    title: options.title,
    description: options.description,
    url: options.url || undefined,
    image: options.image || undefined,
    type: 'product'
  };
}

export function buildTwitterCard(options: { title: string; description: string; url?: string; image?: string }) {
  return {
    card: 'summary_large_image',
    title: options.title,
    description: options.description,
    url: options.url || undefined,
    image: options.image || undefined
  };
}

export function generateSchemaJsonLd(options: { name: string; description: string; sku: string; brand: string; url?: string }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: options.name,
    description: options.description,
    sku: options.sku,
    brand: {
      '@type': 'Brand',
      name: options.brand
    },
    url: options.url || undefined
  };
}
