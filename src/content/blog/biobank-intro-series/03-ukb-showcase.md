---
title: 'Biobank Intro Series: UK Biobank Observational Data (Part I)'
excerpt: 'Save a clock tick with the UK Biobank Showcase'
publishDate: 'Mar 09 2026'
tags:
  - biobank
  - ukb-showcase
  - phenotype-data
  - field-selection
  - data-quality
  - reproducibility
draft: false
series:
  name: 'Biobank Intro Series'
  order: 3
seo:
  image:
    src: '/blog_images/biobank1/ukbShowcaseGraphic.png'
    alt: "Papers tell you WHAT was used. Showcase tells you what's AVAILABLE NOW."
---

<figure class="my-8 !max-w-none">
<img src="/blog_images/biobank1/ukbShowcaseGraphic.png" alt="Papers tell you WHAT was used. Showcase tells you what's AVAILABLE NOW." class="!max-w-none mx-auto w-full">
<figcaption class="text-center text-sm opacity-80 mt-2">
   <em>The showcase returns at least three different field IDs for BMI. It is difficult to find this information in any publication.</em>
</figcaption>
</figure>

Consider this post a love letter to the UK Biobank Showcase.

When I first started working with UK Biobank, I fell back on what I knew from graduate school. I dug through methods sections and supplemental materials to track down the features used in the study. It worked, but it was slow. Part of the problem is that papers rarely cite [The UK Biobank Showcase](https://biobank.ndph.ox.ac.uk/showcase/) directly. It is so foundational to the field that experienced researchers treat it as assumed knowledge. Coming from a different domain, I had no idea it existed. Once my manager pointed me to the Showcase, I discovered measurements beyond what had been published and no longer had to spend hours on detective work.

To understand why the showcase is so useful, it helps to know the scale of what UK Biobank actually contains. The UK Biobank as a resource spans clinical measurements, survey data, genomics, imaging, proteomics, metabolomics, and more. For a comprehensive overview of all available data types, see [What types of data are available in UK Biobank?](https://community.ukbiobank.ac.uk/hc/en-gb/articles/23472796568861-What-types-of-data-are-available-in-UK-Biobank) on the UK Biobank Community site. The Showcase is your tool for navigating all of it.

For example, searching "Left Ventricular Ejection Fraction" returns [multiple relevant fields](https://biobank.ndph.ox.ac.uk/showcase/search.cgi?wot=0&srch=Left+Ventricular+Ejection+Fraction&yfirst=2000&ylast=2025) and three with the exact correct description (22420, 24103, and 31060). But which one should you use? This is where the Showcase becomes essential.

![UK Biobank Showcase search interface showing search results for left ventricular ejection fraction, with three data fields highlighted: 22420 (Left ventricular size and function category), 24103 (Cardiac and aortic function #1 category), and 31060 (Cardiac and aortic function #2 category)](/blog_images/biobank1/lvef_search.png)

<figcaption class="text-center text-sm opacity-80 mt-2">
   UK Biobank Showcase search results showing three LVEF measurement fields in different categories
</figcaption>

Notice the three highlighted fields measure the same thing but belong to different categories. Clicking into each field reveals why this matters:

![Three-panel comparison showing data field headers and category descriptions for fields 22420, 24103, and 31060. Field 22420 shows 39,645 participants with a quality warning. Field 24103 shows 80,974 participants with methodology references. Field 31060 shows 4,868 participants with publication citations. Each panel includes category warnings about data quality and compatibility.](/blog_images/biobank1/lvef_fields_long.png)

<figcaption class="text-center text-sm opacity-80 mt-2">
   Comparison of three LVEF fields showing participant counts and category quality warnings
</figcaption>

Field 22420 ([category 133](https://biobank.ndph.ox.ac.uk/showcase/label.cgi?id=133)) has 39,649 measurements but includes a warning: "Quality issues may exist in this data. Researchers may wish to consider using data available in Category 157 or Category 162 as an alternative." Field 24103 ([category 157](https://biobank.ndph.ox.ac.uk/showcase/label.cgi?id=157)) contains 80,974 measurements and references a published methodology, but warns these fields "should not be considered together" with Category 162 without quality assessment. Field 31060 ([category 162](https://biobank.ndph.ox.ac.uk/showcase/label.cgi?id=162)) has only 4,868 participants, fewer than the flagged field 22420.

For my cardiomyopathy work ([Klasfeld _et al_ 2025](<https://www.cell.com/hgg-advances/fulltext/S2666-2477(25)00063-6>)), I chose field 24103 for its sample size and data quality. However, other practical information provided by the showcase includes the date of which the data was reported (Debut) and the distribution of the data (shown in the data tab in the second section of the Field ID entry).

**Another critical detail:** Many UK Biobank measurements were collected at multiple timepoints (instances). The Showcase shows you not just the field ID, but which instances have data. For most phenotypes, the initial assessment (Instance 0) has the largest sample size, with subsequent visits having progressively fewer participants. For covariates, I typically use the initial visit value. If you need longitudinal data, expect much smaller sample sizes.

Additionally, some fields contain multiple measurements per participant within a single visit (arrays). For example, blood pressure taken three times. The Showcase specifies these array structures so you can plan your handling strategy.

## UK Biobank Showcase Tips

After working with the Showcase on multiple projects, I've developed a workflow that catches issues before they become problems. Here's my list:

**Before selecting a field:**

- Always check the category warnings, not just the field description
- Look at the data distribution tab: Is it normally distributed? Heavy missingness? Homogenous values? Sampling bias?
- Check the total participants to plan your sample size accordingly

**For reproducibility:**

- Note the debut date (when data became available)
- Record the version date (last import/update)
- Check stability rating (how data may change in future releases)

**To save time:**

- Use algorithmically-defined outcomes in Category [42](https://biobank.ndph.ox.ac.uk/showcase/label.cgi?id=42) instead of manually classifying from multiple sources
- Watch for "Not available" status because sometimes fields are listed before release

Publications tell you which field _was_ used, but they rarely tell you which field to use. The Showcase is how you figure out which one you should use. Spending a few minutes there before starting your analysis can save weeks of downstream headaches. For more details on features I didn't cover, see Part III of the [Showcase user guide](https://biobank.ndph.ox.ac.uk/showcase/ukb/exinfo/ShowcaseUserGuide.pdf) (page 4).

Finding the right field is half the battle. In the next post, we'll dive into actually loading this data for analysis.
