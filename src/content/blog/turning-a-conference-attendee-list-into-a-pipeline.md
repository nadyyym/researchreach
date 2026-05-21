---
title: "Turning a Conference Attendee List Into a Pipeline"
description: "A conference program is a pre-qualified list of researchers who self-selected into your exact topic. Here's how to turn presenters, posters, and sessions into a ranked, contactable pipeline."
date: "2026-05-20"
author: "Sci-Buy Team"
tags: ["conferences", "pipeline building", "academic gtm"]
---

A scientific conference is, from a GTM perspective, a miracle of free segmentation. Thousands of researchers have voluntarily told you their exact area of focus, their seniority, and their current work — by submitting an abstract, giving a talk, or presenting a poster. The program is a pre-qualified prospect list, and most of it is public.

The problem is that almost everyone wastes it. They badge-scan at the booth, collect a pile of cards, and never systematically work the program. Here's how to actually turn a conference into pipeline.

## Why conference data is so good

Three reasons a conference attendee list beats almost any cold list you could buy.

**Self-selection.** Researchers attend conferences relevant to their work. A presenter at a single-cell genomics symposium is, by definition, working on single-cell genomics. You don't have to infer relevance — they declared it.

**Recency.** Conference presentations reflect what someone is working on *right now*, often before it's published. This is the freshest possible signal of a researcher's current focus.

**Seniority signals built in.** The program structure tells you who's who. Keynotes and invited talks are senior, influential people. Contributed talks are established researchers. Posters skew toward students and postdocs — your early-career talent pipeline. The program is pre-tiered.

## What to extract from the program

The conference program and abstract book are your raw material. From them you can pull:

- **Presenter names and affiliations** — your core list
- **Talk and poster titles** — exact current topics
- **Abstracts** — detailed descriptions of current work, methods, and sometimes needs
- **Session structure** — who's keynote vs. contributed vs. poster (seniority)
- **Session topics** — natural clustering of related researchers
- **Co-authors** — entire labs and collaboration networks, not just the presenter

Most conferences publish all of this online — program PDFs, abstract databases, session schedules. It's public; it's just not in a usable format.

## Turning the program into a ranked list

Raw names aren't a pipeline. Structure and prioritize:

### Step 1: Extract and clean

Pull every presenter into a structured list with name, affiliation, presentation type, title, and abstract. This is the tedious parsing step — programs come as PDFs, HTML schedules, or clunky session databases.

### Step 2: Tier by seniority

Use presentation type as a first-pass seniority signal. Keynote and invited speakers are your KOL tier. Contributed-talk presenters are established mid-tier. Poster presenters are early-career — recruit-track, not necessarily sell-track.

### Step 3: Enrich for influence and intent

Cross-reference each presenter against citation data (H-index for influence) and industry bridge signals (patents, startup roles, industry co-authorship for intent). A keynote speaker who also holds patents and advises a startup is your top target.

### Step 4: Resolve contact info

Conference programs don't include emails. Resolve them from recent publication metadata and current affiliation, verified against the affiliation listed in the program.

## Pre-conference, at-conference, post-conference

Timing changes the play.

**Before:** This is the highest-leverage and least-used window. Mine the program in advance, identify your top targets, and reach out to schedule a meeting *at* the conference. "I saw you're presenting on X at [conference] — I'll be there, would a 15-minute coffee be useful?" is a strong, specific ask with a natural deadline. You walk in with meetings already booked.

**During:** Attend your top targets' talks and posters. Reference their presentation when you introduce yourself — "your point about Y in the session this morning" — and it's a warm conversation, not a cold one.

**After:** Follow up referencing their specific presentation. "Your talk on X stuck with me — particularly the bit about Z." This is the cleanest possible warm follow-up: a shared, recent, specific context. Run it in the days right after, while memory is fresh.

## The mistake everyone makes

The default conference motion is reactive: stand at a booth, wait for people to come to you, scan badges, dump them into a CRM, and blast a generic follow-up to everyone. That treats a precisely segmented, self-declared list like an undifferentiated lead dump.

The proactive motion — mine the program, pick targets, book meetings before you arrive, follow up with specificity — converts vastly better and uses data that's sitting in public view.

## Automating the grunt work

The bottleneck is parsing programs and enriching presenters at scale. Doing it by hand for a 2,000-person conference is a week of work, by which point the event is over.

Sci-Buy ingests conference programs, structures the presenter list, tiers by seniority, enriches with influence and intent signals, and resolves verified contacts — turning a PDF program into a ranked, contactable pipeline before the conference starts.

```bash
sci-buy conference "Keystone Symposia — Single Cell Biology 2026"
sci-buy rank --by influence,intent --tier-by presentation-type
sci-buy export --fields name,affiliation,talk-title,h-index,email
```

The list is already qualified and already segmented. The only question is whether you work it or let it walk past your booth.

```bash
npx sci-buy@latest
```
