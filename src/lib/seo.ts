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
  mainEntityId?: string,
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
    // Link the page to the primary entity it is ABOUT, so Google can tie
    // the WebPage node to the entity node within the same @graph.
    ...(mainEntityId && {
      mainEntity: { '@id': mainEntityId },
      about: { '@id': mainEntityId },
    }),
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
  affiliationUrl?: string;
  description?: string;
  sameAs?: string[];
  expertise?: string[];
}) {
  const url = args.url.startsWith('http') ? args.url : `${SITE}${args.url}`;
  const personId = `${idRoot(url)}/#person`;
  const person: Record<string, unknown> = {
    '@type': 'Person',
    '@id': personId,
    name: args.name,
    ...(args.jobTitle && { jobTitle: args.jobTitle }),
    ...(args.affiliation && {
      affiliation: {
        '@type': 'CollegeOrUniversity',
        name: args.affiliation,
        // Link the person to their institution detail page when one exists.
        ...(args.affiliationUrl && {
          url: args.affiliationUrl.startsWith('http')
            ? args.affiliationUrl
            : `${SITE}${args.affiliationUrl}`,
        }),
      },
    }),
    ...(args.description && { description: args.description }),
    ...(args.sameAs && args.sameAs.length > 0 && { sameAs: args.sameAs }),
    ...(args.expertise && args.expertise.length > 0 && {
      knowsAbout: args.expertise,
    }),
    mainEntityOfPage: { '@id': `${idRoot(url)}/#webpage` },
  };
  return {
    '@type': 'ProfilePage',
    '@id': `${idRoot(url)}/#profilepage`,
    url,
    mainEntity: person,
    isPartOf: { '@id': `${SITE}/#website` },
  };
}

// Stable @id for the Person node a ProfilePage wraps, so the WebPage can
// reference the actual entity (the person) via mainEntity/about.
export function profilePersonId(url: string): string {
  const abs = url.startsWith('http') ? url : `${SITE}${url}`;
  return `${idRoot(abs)}/#person`;
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
  // Page this entity is described on; used to mint a stable @id and to link
  // back to the WebPage via mainEntityOfPage/subjectOf.
  pageUrl?: string;
  description?: string;
  type?: string; // e.g. 'CollegeOrUniversity', 'GovernmentOrganization', 'Corporation'
  address?: { country?: string; city?: string };
  areaServed?: string;
  sameAs?: string[];
}) {
  const pageRoot = args.pageUrl
    ? idRoot(args.pageUrl.startsWith('http') ? args.pageUrl : `${SITE}${args.pageUrl}`)
    : undefined;
  return {
    '@type': args.type || 'Organization',
    ...(pageRoot && { '@id': entityOrgId(args.pageUrl!) }),
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
    ...(args.areaServed && { areaServed: args.areaServed }),
    ...(args.sameAs && args.sameAs.length > 0 && { sameAs: args.sameAs }),
    ...(pageRoot && {
      mainEntityOfPage: { '@id': `${pageRoot}/#webpage` },
      subjectOf: { '@id': `${pageRoot}/#webpage` },
    }),
  };
}

// Stable @id for an entity Organization node, derived from its page URL.
export function entityOrgId(pageUrl: string): string {
  const abs = pageUrl.startsWith('http') ? pageUrl : `${SITE}${pageUrl}`;
  return `${idRoot(abs)}/#entity`;
}

// CollectionPage + ItemList for index-like detail pages that have no single
// natural entity type (fields, countries, industries). The page IS a curated
// collection of linked entities, so we mark it up as one. Returns both the
// CollectionPage node and a helper id so the WebPage can reference it.
export function collectionPageSchema(args: {
  pageUrl: string;
  name: string;
  description: string;
  items: { name: string; url: string; description?: string }[];
}) {
  const pageRoot = idRoot(
    args.pageUrl.startsWith('http') ? args.pageUrl : `${SITE}${args.pageUrl}`,
  );
  const id = `${pageRoot}/#collection`;
  return {
    '@type': 'CollectionPage',
    '@id': id,
    name: args.name,
    description: args.description,
    isPartOf: { '@id': `${SITE}/#website` },
    mainEntityOfPage: { '@id': `${pageRoot}/#webpage` },
    mainEntity: {
      '@type': 'ItemList',
      name: args.name,
      numberOfItems: args.items.length,
      itemListElement: args.items.map((it, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: it.name,
        url: it.url.startsWith('http') ? it.url : `${SITE}${it.url}`,
        ...(it.description && { description: it.description }),
      })),
    },
  };
}

export function collectionPageId(pageUrl: string): string {
  const abs = pageUrl.startsWith('http') ? pageUrl : `${SITE}${pageUrl}`;
  return `${idRoot(abs)}/#collection`;
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
