---
title: 'Biobank Intro Series: All of Us Observational Data (Part I)'
excerpt: 'How to navigate OMOP and find what observational data in All of Us'
publishDate: 'Dec 5 2025'
tags:
  - biobank
  - all-of-us
  - omop
  - athena
  - ehr-data
  - observational-data
draft: false
seo:
  image:
    src: '/blog_images/biobank1/source_to_standard_omop.png'
    alt: 'Flowchart showing hospital data being extracted, transformed via OHDSI vocabularies, and loaded into OMOP relational tables.'
---

Coming from UK Biobank's straightforward system (search, grab field ID, query), All of Us requires a different approach. Data from surveys, enrollment visits, and EHRs gets transformed using Observational Health Data Sciences and Informatics (OHDSI) standardized vocabularies and loaded into the [Observational Medical Outcomes Partnership (OMOP) Common Data Model (CDM) structure](https://ohdsi.github.io/CommonDataModel/cdm53.html). Instead of intuitive field names, you're navigating concept IDs, vocabulary mappings, and relational tables.

<figure class="my-8 !max-w-none">
<img src="/blog_images/biobank1/source_to_standard_omop.png" alt="Flowchart showing the process of transforming hospital EHR data into OMOP format." class="block dark:hidden !max-w-none mx-auto w-full" >
<img src="/blog_images/biobank1/source_to_standard_omop_dark.png" alt="Flowchart showing the process of transforming hospital EHR data into OMOP format." class="hidden dark:block !max-w-none mx-auto w-full">
<figcaption class="text-center text-sm opacity-80 mt-2">
   <strong>Figure 1:</strong> <em>Raw hospital data is transformed into standardized OHDSI vocabularies and loaded into OMOP relational tables.</em>
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

## Your OMOP Workflow

**Start with Data Browser** → Check availability and find concept IDs quickly

**Move to Athena** → Explore hierarchies and vocabulary mappings

**Write SQL** → Custom analyses and complex joins

The Cohort Builder is useful for exploration, but most serious analyses need custom SQL. Use it to learn the structure, then write your own queries.

**Coming next:** Practical examples of querying OMOP tables - extracting measurements, linking observations across time, and handling messy EHR data.

OMOP's complexity exists to standardize messy clinical data from hundreds of hospitals. Once you learn the patterns, the system becomes predictable. Start simple and build incrementally.
