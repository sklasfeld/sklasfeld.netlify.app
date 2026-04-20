---
title: 'Biobank Intro Series: You Have What You Need'
excerpt: 'A wrap-up of the series and a checklist before you start your analysis'
publishDate: 'Apr 19 2026'
tags:
  - biobank
  - research-strategy
  - ukb
  - all-of-us
draft: false
series:
  name: 'Biobank Intro Series'
  order: 9
seo:
  image:
    src: '/blog_images/biobank1/full_blogseries_graphic.png'
    alt: 'Subway-map style illustration of the Biobank Intro Series showing the journey through UK Biobank and All of Us topics.'
---

<figure class="my-8 mx-auto">
<img src="/blog_images/biobank1/full_blogseries_graphic.png" alt="Subway-map style illustration of the Biobank Intro Series showing the journey through UK Biobank and All of Us topics." class="mx-auto w-full" >
</figure>

If you've made it here, you've covered a lot of ground in UK biobank and All of Us:

- The research enviroments
- The observational data
- The genetic data

This series was never meant to be exhaustive, but I hope it compressed your learning curve.

## Before You Start Analysis

Use this as a gut check. If you can answer yes to everything here, you're ready.

**Platform**

- [ ] You understand the compute model you're working in (DNAnexus vs. Google Cloud)
- [ ] You have a plan for saving outputs that won't disappear when your session ends

**Phenotypes and Covariates**

- [ ] You've identified the right fields or concepts for your phenotypes of interest and covariates
- [ ] You've checked for data quality warnings and understand what they mean for your analysis
- [ ] You know which timepoints or visits have data and which one you're using (instances on UKB, enrollment/EHR timing on AoU)
- [ ] You've checked the sample size and confirmed it's sufficient for your question

**Genetic Data**

- [ ] You've located the genotype data format you need (unphased Whole Genome Sequencing (WGS), phased WGS, or exome sequencing)
- [ ] You've confirmed your files are indexed (.tbi or .csi) before running any region queries
- [ ] You've subset to your region or variant list
- [ ] You've confirmed sample overlap between your phenotype and genotype data

## What Comes Next

These posts will update if I find mistakes. If something looks off, feel free to reach out to me.

This series ends here, but, as the cliché goes, the journey is only beginning. Depending on your question, you might be headed toward GWAS, PheWAS, rare variant burden testing, or cross-biobank comparisons. Topics that may appear ub a future series.

For now: you have the data, you know where it lives, and you know enough to not be too surprised by what you find. That's further than a lot of people get before they start. Good luck!

## Reflections

None of these posts would have happened without a few people.

Thank you to Sneha Grandhi who helped me recognize my strengths in this field. The biobank work I did at Genscience with her is what this series is built on.

Almost a year ago, Lina Faller's dedication to sharing her data management work on the Boston Women in Bioinformatics website was the push I needed to finally write something of my own.

Thank you to Mitibketa Ilboudo and Sharvari Narendra for editing. Taking time to give feedback on a stranger's blog posts is not a small thing, and it's the reason I could post these with confidence.

Thank you to Lance and my family for the blind support. They may never understand what it is that I do, but I still love them.
