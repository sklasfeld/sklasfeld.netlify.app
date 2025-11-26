---
title: 'The Biobank Iceberg: Understanding Hidden Data Complexities'
excerpt: The Genomics Diversity Crisis
publishDate: 'Sep 1 2025'
tags:
  - diversity-equity-inclusion
  - dei-in-science
  - inclusive-research
  - genetics
  - equity-in-science
  - diversity-in-stem
  - genomics-equity
seo:
  image:
    src: '/biobank_iceberg.png'
    alt: 'Iceberg diagram illustrating hidden complexities in biobank data: visible raw data above the waterline, and three categories of hidden challenges below: batch effects, population stratification, and inaccurate phenotype data.'
---

<figure>
<img src="/biobank_iceberg.png" alt="Iceberg diagram illustrating hidden complexities in biobank data: visible raw data above the waterline, and three categories of hidden challenges below: batch effects, population stratification, and inaccurate phenotype data." class="block dark:hidden">
<img src="/biobank_iceberg_dark.png" alt="Iceberg diagram illustrating hidden complexities in biobank data: visible raw data above the waterline, and three categories of hidden challenges below: batch effects, population stratification, and inaccurate phenotype data." class="hidden dark:block">
<figcaption class="text-center text-sm opacity-80 mt-2">
    <strong>Image 1:</strong> <em>The Biobank Iceberg. Everyone knows there's more beneath the surface of Biobank data. The challenge is understanding the scale of these complexities.</em>
  </figcaption>
</figure>

If I learned anything working with the UK Biobank Research Analysis Platform and All of Us Workbench, it's this: don't fear the iceberg. As researchers, we're trained to be skeptical. Every dataset comes with biases and baggage. The temptation is to dive straight in—find the clinical phenotypes, grab the genomic data, and start analyzing. But that approach ignores the complexity lurking beneath the surface.

The good news: this complexity isn't insurmountable. It just requires understanding the data first. With this post, I hope to demystify UK Biobank and All of Us so you can navigate them confidently, armed with knowledge of what to watch for.

## Phenotype Data

### UK Biobank

The UK Biobank Showcase is your essential resource for navigating phenotype data on the Research Analysis Platform (UKB-RAP). It maps every data field to a searchable interface, so you can find exactly what you need without guessing at variable names.

For example, to locate baseline characteristics, you navigate: **Browse** > **Population characteristics** > **Baseline characteristics** > **Data Fields**. This instantly gives you the Field IDs you'll use in your queries: Age at recruitment (21022), Date of birth (33), Month of birth (52), Year of birth (34), Sex (31), and Townsend deprivation index at recruitment (22189).

Instead of hunting through documentation or trial-and-error SQL queries, the Showcase lets you explore the data structure interactively and copy the exact Field IDs you need.

### All of Us

All of Us recommends starting with their [Cohort and Dataset Builders](https://www.researchallofus.org/data-tools/workbench/), point-and-click tools designed to help researchers navigate the data. But as a bioinformatician, I was more comfortable diving into the code iteself. I skipped the builders and went straight to querying the [SQL tables](https://support.researchallofus.org/hc/en-us/articles/30125602539284-Introduction-to-All-of-Us-Electronic-Health-Record-EHR-Collection-and-Data-Transformation-Methods) directly. From there, I was greeted with the familiar face of messy phenotype data. Let me introduce you.

<figure>
<img src="/source_to_standard_omop.png" alt="Flowchart showing the process of transforming hospital EHR data into OMOP format." class="block dark:hidden">
<img src="/source_to_standard_omop_dark.png" alt="Flowchart showing the process of transforming hospital EHR data into OMOP format." class="hidden dark:block">
<figcaption class="text-center text-sm opacity-80 mt-2">
    <strong>Image 2:</strong> <em>EHR to OMOP Flowchart. Raw hospital data with inconsistent coding is extracted, transformed into standardized concepts through the OMOP vocabulary, and loaded into relational tables for research use.</em>
  </figcaption>
</figure>

Data collected by All of Us originates from multiple sources including self-reported surveys, program enrollment visits, and electronic health records (EHRs). EHRs are either collected from the participant ro from their affiliated health care organization. From these different extraction points the data is transformed and loaded into the [OMOP common data model structure](https://support.researchallofus.org/hc/en-us/articles/360039585391-Understanding-OMOP-Basics).
