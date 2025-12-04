---
title: 'All of Us Has Cohort Builders. I Chose SQL Chaos Instead.'
excerpt: 'How to Load Phenotype Data in All of Us'
publishDate: 'Dec 4 2025'
tags:
  - biobank
  - all-of-us
  - omop
  - athena
  - ehr-data
  - phenotype-data
draft: true
seo:
  image:
    src: '/blog_images/biobank1/source_to_standard_omop.png'
    alt: 'Flowchart showing the process of transforming hospital EHR data into OMOP format.'
---

<figure>
<img src="/blog_images/biobank1/source_to_standard_omop.png" alt="Flowchart showing the process of transforming hospital EHR data into OMOP format." class="block dark:hidden">
<img src="/blog_images/biobank1/source_to_standard_omop_dark.png" alt="Flowchart showing the process of transforming hospital EHR data into OMOP format." class="hidden dark:block">
<figcaption class="text-center text-sm opacity-80 mt-2">
   <strong>Image 4:</strong> <em>EHR to OMOP Flowchart. Raw hospital data with inconsistent coding is extracted, transformed into standardized concepts through the OMOP vocabulary, and loaded into relational tables for research use.</em>
 </figcaption>
</figure>

All of Us recommends starting with their [Cohort and Dataset Builders](https://www.researchallofus.org/data-tools/workbench/), point-and-click tools designed to help researchers navigate the data. But as a bioinformatician, I was more comfortable diving into the code iteself. I skipped the builders and went straight to querying the [SQL tables](https://support.researchallofus.org/hc/en-us/articles/30125602539284-Introduction-to-All-of-Us-Electronic-Health-Record-EHR-Collection-and-Data-Transformation-Methods) directly. From there, I was greeted with the familiar face of messy phenotype data. Let me introduce you.

Data collected by All of Us originates from multiple sources including self-reported surveys, program enrollment visits, and electronic health records (EHRs). EHRs are either collected from the participant ro from their affiliated health care organization. From these different extraction points the data is transformed and loaded into the [OMOP common data model structure](https://support.researchallofus.org/hc/en-us/articles/360039585391-Understanding-OMOP-Basics).
