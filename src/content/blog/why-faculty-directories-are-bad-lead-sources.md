---
title: "Why Faculty Directories Are Bad Lead Sources"
description: "Scraping university faculty directories feels like an obvious way to build an academic prospect list. It's also one of the worst. Here's why directories fail and what to use instead."
date: "2026-05-20"
author: "Sci-Buy Team"
tags: ["faculty directories", "lead sourcing", "research intelligence"]
---

When people start building academic prospect lists, the first instinct is almost always the same: scrape university faculty directories. Every department has a "People" or "Faculty" page. It lists names, titles, sometimes emails. It looks like a ready-made lead source.

It isn't. Faculty directories are one of the worst ways to build an academic prospecting list, and leaning on them quietly wrecks campaigns. Here's why — and what to do instead.

## Problem 1: They're stale

University web pages are notoriously out of date. Faculty pages get updated when someone gets hired and, if you're lucky, when they leave. In between, they rot. A directory routinely contains:

- Researchers who left for another institution a year ago
- Emeritus faculty who haven't been active in years
- Dead emails from old address schemes
- Missing recent hires who haven't been added yet

You're building a pipeline on a snapshot that may be years out of date. The freshest signal in academia — what someone is working on *right now* — is exactly what a static directory page can't give you.

## Problem 2: They have no prioritization signal

A faculty directory is a flat, unranked list. Every professor looks the same: a name and a title. There's no way to tell from a directory:

- Who's influential versus who's coasting
- Who's actively publishing versus who's stepped back
- Who has commercial interests versus who's purely academic
- Who just won a grant versus who's unfunded

So you either email everyone equally (wasting effort on bad fits and burning your best targets with the same generic message) or you do the prioritization research separately — at which point the directory contributed almost nothing.

## Problem 3: Title doesn't map to relevance

Corporate prospecting leans on titles because titles encode role and seniority. Academic titles don't work that way. "Professor of Chemistry" tells you almost nothing about what someone actually researches. Two professors with identical titles might work on quantum computing and on 19th-century reaction mechanisms — utterly different relevance for whatever you're selling.

In academia, the unit of relevance is the *research topic*, not the title. And research topics live in publications, not directories.

## Problem 4: They miss the people you most want

The most receptive academic targets — senior PhD students and postdocs — are frequently absent or barely listed in faculty directories, which center on permanent faculty. Yet early-career researchers are often the highest-converting segment for both recruiting and many sales motions. Build from the directory and you systematically miss them.

## Problem 5: Coverage is wildly inconsistent

Every university structures its directories differently. Some have rich profiles; some list a name and nothing else. Some are one clean page; some scatter faculty across dozens of sub-department pages. Some block scrapers. Building and maintaining scrapers for hundreds of institutions, each with its own broken layout, is a maintenance nightmare that delivers low-quality data anyway.

## What to use instead

The fix is to source from data built *around the researcher's actual activity*, not around a static org page. The good sources:

**Publication databases (OpenAlex, PubMed, Semantic Scholar).** A recent paper proves the researcher is active, tells you their exact current topic, often includes a corresponding-author email, and carries citation data for prioritization. This is the single best academic lead source — it's recent, relevant, and ranked all at once.

**ORCID.** Self-maintained, structured, and reliable for *current* institutional affiliation — the thing directories get wrong. Best used as a join key to link a researcher across other sources.

**Grant databases (NIH Reporter, NSF Award Search).** Active grants confirm current affiliation, reveal funding (and budget), and signal buying intent. Far fresher than a web page.

**Patent and startup records.** Industry bridge signals that directories never capture — exactly what tells you whether a researcher is open to a commercial conversation.

The pattern: source from activity records, which are inherently fresh and carry built-in prioritization signal, instead of from static pages that are stale and flat.

## The right mental model

Don't think of academic prospecting as "find the directory and scrape it." Think of it as "assemble a profile of an active researcher from their footprint." A researcher's real, current identity lives in what they publish, what they're funded for, what they patent, and where they present — all of which are timestamped and signal-rich. The faculty page is just the lobby; the researcher actually lives in the literature.

## Automating it

Building researcher profiles from publication, ORCID, grant, and patent data — and keeping them current — is exactly what Sci-Buy does. Instead of scraping brittle directories, it sources from activity records, so every contact is active, relevant, and pre-ranked by influence and intent.

```bash
sci-buy search "machine learning for genomics" --institution "Stanford"
sci-buy export --fields name,recent-paper,h-index,funding,email
```

Faculty directories feel like the obvious starting point. The activity record is the right one — fresher, ranked, and pointed at the researchers you actually want to reach.

```bash
npx sci-buy@latest
```
