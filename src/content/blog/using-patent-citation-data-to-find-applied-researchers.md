---
title: "Using Patent-Citation Data to Find Applied Researchers"
description: "When a patent cites an academic paper, it points at a researcher whose work has real-world applications — and often at the researcher themselves. Here's how to mine patent citations for high-intent leads."
date: "2026-05-20"
author: "Sci-Buy Team"
tags: ["patent citations", "applied research", "industry bridge signals"]
---

Most academic prospecting signals tell you whether a researcher is influential. Patent-citation data tells you something rarer and more valuable: whether their work has commercial relevance, and whether they're personally engaged with the applied side of their field.

It's an underused source, partly because patent data is gnarly to work with. But for anyone selling to — or recruiting — researchers whose science actually translates into products, it's one of the sharpest signals available.

## Two kinds of patent signal

There are two distinct ways patents connect to a researcher, and they mean different things.

**The researcher holds a patent.** They've invented something, worked with a tech-transfer office, and gone through the commercialization process. This is the classic industry bridge signal — direct evidence the person thinks about applications.

**The researcher's papers are cited by patents.** This is the subtler, more interesting one. When a company files a patent, the patent cites prior art — including academic papers. If a researcher's paper is cited in a patent, it means their fundamental research is being built upon by someone trying to make a product. Their science has demonstrated commercial pull, whether or not they personally pursued it.

Both matter. The second is the focus here, because it surfaces researchers whose work is commercially relevant even if they've never filed a patent themselves.

## What "cited by a patent" actually tells you

When a patent cites an academic paper as prior art, you can infer several useful things:

- **The research has applied relevance.** Someone with skin in the game (a company paying patent fees) considers this work foundational to a product.
- **There's a commercial domain attached.** The patent's classification and assignee tell you *which* industry finds the work relevant — pointing at the natural buyers or employers for that researcher.
- **There may be a real relationship.** Sometimes the patent's inventors and the cited paper's authors overlap or are connected. Sometimes the company that filed the patent is exactly the kind of organization that would want to work with the researcher.

A researcher whose papers are repeatedly cited across patents in, say, battery technology is demonstrably doing work that the battery industry cares about. That's a precise, evidence-based targeting signal — for sales, for recruiting, or for partnerships.

## Reading the patent assignee

The most actionable field in a patent is the assignee — the company that owns it. When a researcher's work is cited in patents assigned to specific companies, you learn which companies are already building on their science.

This points two directions:

- **For selling to the researcher:** the assignees tell you which industry their work serves, so you can position accordingly.
- **For selling to or partnering with companies:** the companies citing a researcher's work are demonstrably interested in that research area — a warm signal for a different kind of pitch.

A pattern of multiple patents from multiple companies citing one researcher is a strong indicator that they're a hub of commercially relevant work.

## Where the data lives

Patent data is public but fragmented across jurisdictions:

- **USPTO** — full-text US patents and applications, with citations and assignees, via the PatentsView API.
- **Google Patents** — broad coverage with good citation linking across jurisdictions.
- **EPO (Espacenet / OPS)** — European patents.
- **Lens.org** — aggregates patents *and* links them to scholarly works, which is exactly the paper-to-patent bridge you want.

The hard part is linking patent citations back to a specific researcher. Patents cite papers, and you have to resolve those papers to authors — ideally via DOI and then to an ORCID — to attribute the citation to a person rather than a paper.

## Building the prospect list

The workflow:

1. **Define the technology domain** — by patent classification or by the research topics you care about.
2. **Find patents in that domain** and extract their non-patent (academic) citations.
3. **Resolve cited papers to authors** via DOI and ORCID, so the signal lands on a person.
4. **Rank by citation pull** — how many patents, from how many distinct companies, cite each researcher's work.
5. **Layer in influence and contact data** — H-index for academic standing, verified email for reach.

What comes out is a list of researchers whose work has proven commercial relevance, ranked by how much the applied world is building on it — and you know which companies care, which sharpens your message.

## Why this beats generic targeting

Searching by topic alone gives you everyone in a field — including pure theorists whose work will never touch a product and who have no interest in a commercial conversation. Patent-citation filtering surfaces the subset whose science the market is already paying attention to. That's a fundamentally higher-intent population.

It also gives you a credible, specific hook: "Your work on X has been cited in several patents in the Y space — we're working on exactly that translation problem." That's a far stronger opener than generic topic flattery.

## Automating it

Linking patents to papers to authors to contact info is a multi-database join across patent and scholarly sources, and it's brittle to do by hand. Sci-Buy runs this as part of its industry-bridge-signal enrichment — surfacing researchers whose work is cited in patents, attributing citations to people, and showing which companies are building on them.

```bash
sci-buy search "solid-state electrolytes" --signal patent-cited
sci-buy export --fields name,patent-citations,citing-assignees,h-index,email
```

A patent citation is the market voting that a researcher's work matters commercially. Follow those votes and you find the applied researchers worth reaching.

```bash
npx sci-buy@latest
```
