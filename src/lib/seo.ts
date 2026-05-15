const SITE = 'https://selltoscientists.com';
const ORG_NAME = 'Sci-Buy';
const ORG_DESCRIPTION =
  'Research intelligence CLI for those who sell to scientists.';
const OG_IMAGE = `${SITE}/og-image.png`;

// Strip trailing slash for stable @id roots so graph cross-refs resolve
// consistently regardless of how callers format the URL.
function idRoot(url: string): string {
  return url.replace(/\/$/, '');
}

export function organizationSchema() {
  return {
    '@type': 'Organization',
    '@id': `${SITE}/#organization`,
    name: ORG_NAME,
    url: SITE,
    logo: OG_IMAGE,
    image: OG_IMAGE,
    description: ORG_DESCRIPTION,
    sameAs: [
      'https://github.com/sci-buy',
      'https://x.com/scibuycli',
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      url: `${SITE}/contact/`,
      contactType: 'sales',
    },
  };
}

export function websiteSchema() {
  return {
    '@type': 'WebSite',
    '@id': `${SITE}/#website`,
    url: SITE,
    name: ORG_NAME,
    description: ORG_DESCRIPTION,
    publisher: { '@id': `${SITE}/#organization` },
  };
}

export function imageObjectSchema() {
  return {
    '@type': 'ImageObject',
    '@id': `${SITE}/#primaryimage`,
    url: OG_IMAGE,
    contentUrl: OG_IMAGE,
    width: 1200,
    height: 630,
  };
}

export function webpageSchema(
  url: string,
  title: string,
  description: string,
  speakableSelectors?: string[],
) {
  const root = idRoot(url);
  return {
    '@type': 'WebPage',
    '@id': `${root}/#webpage`,
    url,
    name: title,
    description,
    isPartOf: { '@id': `${SITE}/#website` },
    publisher: { '@id': `${SITE}/#organization` },
    primaryImageOfPage: { '@id': `${SITE}/#primaryimage` },
    inLanguage: 'en-US',
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: speakableSelectors && speakableSelectors.length > 0
        ? speakableSelectors
        : ['h1', 'main p:first-of-type'],
    },
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
    '@id': `${SITE}/#software`,
    name: 'Sci-Buy CLI',
    applicationCategory: 'DeveloperApplication',
    operatingSystem: 'macOS, Linux, Windows',
    description: 'CLI tool for searching and exporting academic researcher contact intelligence.',
    url: SITE,
    publisher: { '@id': `${SITE}/#organization` },
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      description: 'Free tier available',
    },
  };
}

export function itemListSchema(
  name: string,
  items: { name: string; url: string; description?: string }[],
) {
  return {
    '@type': 'ItemList',
    name,
    numberOfItems: items.length,
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      url: it.url.startsWith('http') ? it.url : `${SITE}${it.url}`,
      ...(it.description && { description: it.description }),
    })),
  };
}

// Each content collection that bundles real research data (universities,
// fields, researchers, etc.) is structurally a Dataset. Google Dataset
// Search has near-zero competition for this kind of content.
export function datasetSchema(args: {
  name: string;
  description: string;
  url: string;
  keywords?: string[];
  variableMeasured?: string[];
  numberOfItems?: number;
}) {
  return {
    '@type': 'Dataset',
    name: args.name,
    description: args.description,
    url: args.url.startsWith('http') ? args.url : `${SITE}${args.url}`,
    creator: {
      '@type': 'Organization',
      name: ORG_NAME,
      url: SITE,
    },
    isAccessibleForFree: true,
    license: 'https://selltoscientists.com/terms/',
    ...(args.keywords && { keywords: args.keywords }),
    ...(args.variableMeasured && { variableMeasured: args.variableMeasured }),
    ...(args.numberOfItems !== undefined && {
      includedInDataCatalog: {
        '@type': 'DataCatalog',
        name: 'Sci-Buy Research Intelligence',
        url: SITE,
      },
    }),
  };
}

// ProfilePage wraps a Person — for individual researcher / phd pages.
// Distinguishes the page as a profile of a real person, which is the
// schema Google explicitly looks for to surface People Cards.
export function profilePageSchema(args: {
  url: string;
  name: string;
  jobTitle?: string;
  affiliation?: string;
  description?: string;
  sameAs?: string[];
  expertise?: string[];
}) {
  const person: Record<string, unknown> = {
    '@type': 'Person',
    name: args.name,
    ...(args.jobTitle && { jobTitle: args.jobTitle }),
    ...(args.affiliation && {
      affiliation: { '@type': 'Organization', name: args.affiliation },
    }),
    ...(args.description && { description: args.description }),
    ...(args.sameAs && args.sameAs.length > 0 && { sameAs: args.sameAs }),
    ...(args.expertise && args.expertise.length > 0 && {
      knowsAbout: args.expertise,
    }),
  };
  const url = args.url.startsWith('http') ? args.url : `${SITE}${args.url}`;
  return {
    '@type': 'ProfilePage',
    '@id': `${idRoot(url)}/#profilepage`,
    url,
    mainEntity: person,
    isPartOf: { '@id': `${SITE}/#website` },
  };
}

export function articleSchema(args: {
  url: string;
  headline: string;
  description: string;
  author: string;
  datePublished: string;
  dateModified?: string;
  image?: string;
  keywords?: string[];
}) {
  const url = args.url.startsWith('http') ? args.url : `${SITE}${args.url}`;
  return {
    '@type': 'Article',
    headline: args.headline,
    description: args.description,
    author: { '@type': 'Person', name: args.author },
    publisher: { '@id': `${SITE}/#organization` },
    datePublished: args.datePublished,
    ...(args.dateModified && { dateModified: args.dateModified }),
    mainEntityOfPage: url,
    image: args.image
      ? (args.image.startsWith('http') ? args.image : `${SITE}${args.image}`)
      : OG_IMAGE,
    ...(args.keywords && args.keywords.length > 0 && { keywords: args.keywords.join(', ') }),
    speakable: {
      '@type': 'SpeakableSpecification',
      cssSelector: ['h1', 'article p:first-of-type'],
    },
  };
}

// Organization schema variant for non-Sci-Buy entities (universities,
// agencies, companies) so each detail page can mark up the entity it
// describes. Kept generic so the same helper covers all three.
export function entityOrgSchema(args: {
  name: string;
  url?: string;
  description?: string;
  type?: string; // e.g. 'CollegeOrUniversity', 'GovernmentOrganization', 'Corporation'
  address?: { country?: string; city?: string };
  sameAs?: string[];
}) {
  return {
    '@type': args.type || 'Organization',
    name: args.name,
    ...(args.url && { url: args.url }),
    ...(args.description && { description: args.description }),
    ...(args.address && {
      address: {
        '@type': 'PostalAddress',
        ...(args.address.country && { addressCountry: args.address.country }),
        ...(args.address.city && { addressLocality: args.address.city }),
      },
    }),
    ...(args.sameAs && args.sameAs.length > 0 && { sameAs: args.sameAs }),
  };
}

// HowTo schema for step-by-step pages (/features/ pipeline, /developers/
// API quickstart). Google still shows HowTo rich results on desktop and
// it's a high-trust signal for instructional content.
export function howToSchema(args: {
  name: string;
  description: string;
  totalTime?: string; // ISO 8601 duration, e.g. "PT5M"
  steps: { name: string; text: string; url?: string }[];
}) {
  return {
    '@type': 'HowTo',
    name: args.name,
    description: args.description,
    ...(args.totalTime && { totalTime: args.totalTime }),
    step: args.steps.map((s, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: s.name,
      text: s.text,
      ...(s.url && { url: s.url.startsWith('http') ? s.url : `${SITE}${s.url}` }),
    })),
  };
}

export function buildJsonLd(...schemas: Record<string, unknown>[]) {
  return JSON.stringify({ '@context': 'https://schema.org', '@graph': schemas });
}
