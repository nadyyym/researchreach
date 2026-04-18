import { defineCollection, z } from 'astro:content';

const universities = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    country: z.string(),
    city: z.string(),
    type: z.enum(['public', 'private']),
    researcherCount: z.number(),
    avgHindex: z.number(),
    grantCount: z.number(),
    departments: z.array(z.string()),
    topFields: z.array(z.string()),
    description: z.string(),
  }),
});

const fields = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    subfields: z.array(z.string()),
    keyTechnologies: z.array(z.string()),
    topInstitutions: z.array(z.string()),
    researcherCount: z.number(),
    avgFunding: z.string(),
    description: z.string(),
  }),
});

const researchers = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    institution: z.string(),
    field: z.string(),
    hindex: z.number(),
    grantCount: z.number(),
    patents: z.number(),
    publications: z.number(),
    orcid: z.string().optional(),
    industryTies: z.array(z.string()),
    description: z.string(),
  }),
});

const phd = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    institution: z.string(),
    field: z.string(),
    advisor: z.string(),
    thesis: z.string(),
    publications: z.number(),
    skills: z.array(z.string()),
    transitionSignals: z.array(z.string()),
    description: z.string(),
  }),
});

const countries = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    code: z.string(),
    topInstitutions: z.array(z.string()),
    topAgencies: z.array(z.string()),
    researchOutput: z.number(),
    topFields: z.array(z.string()),
    description: z.string(),
  }),
});

const agencies = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    country: z.string(),
    type: z.enum(['government', 'private', 'foundation']),
    budget: z.string(),
    programs: z.array(z.string()),
    description: z.string(),
  }),
});

const companies = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    industry: z.string(),
    rdSpend: z.string(),
    academicCollabs: z.number(),
    patents: z.number(),
    description: z.string(),
  }),
});

const industries = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    companies: z.array(z.string()),
    targetResearchers: z.string(),
    marketSize: z.string(),
    useCases: z.array(z.string()),
    description: z.string(),
  }),
});

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.string(),
    author: z.string().default('Sci-Buy Team'),
    tags: z.array(z.string()).default([]),
  }),
});

export const collections = {
  universities,
  fields,
  researchers,
  phd,
  countries,
  agencies,
  companies,
  industries,
  blog,
};
