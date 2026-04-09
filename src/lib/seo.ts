const SITE = 'https://selltoscientists.com';
const ORG_NAME = 'Sci-Buy';

export function organizationSchema() {
  return {
    '@type': 'Organization',
    '@id': `${SITE}/#organization`,
    name: ORG_NAME,
    url: SITE,
    description: 'Research intelligence CLI for those who sell to scientists.',
  };
}

export function websiteSchema() {
  return {
    '@type': 'WebSite',
    '@id': `${SITE}/#website`,
    url: SITE,
    name: ORG_NAME,
    publisher: { '@id': `${SITE}/#organization` },
  };
}

export function webpageSchema(url: string, title: string, description: string) {
  return {
    '@type': 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name: title,
    description,
    isPartOf: { '@id': `${SITE}/#website` },
    inLanguage: 'en-US',
  };
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${SITE}${item.url}`,
    })),
  };
}

export function faqSchema(questions: { q: string; a: string }[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: questions.map(({ q, a }) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: { '@type': 'Answer', text: a },
    })),
  };
}

export function softwareSchema() {
  return {
    '@type': 'SoftwareApplication',
    name: 'Sci-Buy CLI',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'macOS, Linux, Windows',
    description: 'CLI tool for searching and exporting academic researcher contact intelligence.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      description: 'Free tier available',
    },
  };
}

export function buildJsonLd(...schemas: Record<string, unknown>[]) {
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': schemas });
}
