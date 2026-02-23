---
title: 'Biobank Intro Series: All of Us Observational Data (Part I)'
excerpt: 'Finding concept IDs for the All of Us Researcher Workbench'
publishDate: 'Mar 23 2026'
tags:
  - biobank
  - all-of-us
  - omop
  - athena
  - ehr-data
  - observational-data
draft: false
series:
  name: 'Biobank Intro Series'
  order: 5
seo:
  image:
    src: '/blog_images/biobank1/source_to_standard_omop.png'
    alt: 'Flowchart showing hospital data being extracted, transformed via OHDSI vocabularies, and loaded into OMOP relational tables.'
---

Coming from UK Biobank's straightforward system (search, grab field ID, query), All of Us requires a different approach. Clinical and survey data from enrollment visits, EHRs, and questionnaires gets transformed using Observational Health Data Sciences and Informatics (OHDSI) standardized vocabularies and loaded into the [Observational Medical Outcomes Partnership (OMOP) Common Data Model (CDM) structure](https://ohdsi.github.io/CommonDataModel/cdm53.html). Instead of intuitive field names, you're navigating concept IDs, vocabulary mappings, and relational tables. Additionally, some pre-computed data in the Researcher Workbench lives outside of SQL tables entirely. However, understanding OMOP concepts is the foundation for working with most of what's available.

<figure class="my-8 !max-w-none">
<img src="/blog_images/biobank1/source_to_standard_omop.png" alt="Flowchart showing the process of transforming hospital EHR data into OMOP format." class="block dark:hidden !max-w-none mx-auto w-full" >
<img src="/blog_images/biobank1/source_to_standard_omop_dark.png" alt="Flowchart showing the process of transforming hospital EHR data into OMOP format." class="hidden dark:block !max-w-none mx-auto w-full">
<figcaption class="text-center text-sm opacity-80 mt-2">
   <em>Raw hospital data is transformed into standardized OHDSI vocabularies and loaded into OMOP relational tables.</em>
 </figcaption>
</figure>

## Finding Concept IDs: Three Approaches

### 1. All of Us Data Browser (fastest for quick lookups)

**[All of Us Data Browser](https://databrowser.researchallofus.org)** shows what concepts exist and how often they're used. Search "systolic blood pressure" and you'll see results under "Conditions" and "Labs & Measurements" - it can be recorded multiple ways.

Click a category to see participant counts and value distributions. For example, 225,000+ participants have concept ID 3004249 (Systolic blood pressure) with source code LOINC 8480-6.

**When to use:** Quick lookups, checking data availability, getting participant counts.

### 2. OMOP Athena Vocabulary (richer metadata)

**[OMOP Athena](https://athena.ohdsi.org/)** provides concept context such as hierarchies, standard vs. non-standard mappings, and relationships. Searching for "systolic blood pressure" returns about 78,865 items. However, if you look up OMOP concept ID 3004249 (which you found with the All of Us Data Browser), you'll see its vocabulary source (LOINC), domain (Measurement), and related concepts.

**When to use:** Detailed concept information, exploring relationships, understanding vocabulary mappings.

### 3. Direct SQL queries (most flexible)

Query the `CONCEPT` table directly to translate medical concepts into IDs:

```python
import pandas as pd
import os

# Use environmental variable for the Controlled Tier
CDR = os.environ['WORKSPACE_CDR']

# Search by name
concept_query = f'''SELECT *
    FROM `{CDR}.concept`
    WHERE LOWER(concept_name) LIKE '%systolic blood pressure%'
      '''
sbp_query = pd.io.gbq.read_gbq(concept_query, dialect='standard') # Returns 221 rows

# Or query a known concept ID directly
concept_id_query = f'''SELECT * FROM `{CDR}.concept` WHERE concept_id = 3004249
```

Use `CONCEPT_RELATIONSHIP` to explore how concepts relate - for example, which ICD-10 codes map to SNOMED concept 3004249.

**When to use:** Complex relationship queries, programmatic vocabulary exploration.

## What's Next

Finding concept IDs is the first step, but there are multiple ways to actually pull data in the All of Us Researcher Workbench — and, as mentioned in the beginning of this post, not all of them require SQL. In Part II, we'll walk through these different approaches and when each one makes sense.
