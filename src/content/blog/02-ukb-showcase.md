---
title: 'Save a clock tick with the UK Biobank Showcase'
excerpt: "How to navigate UK Biobank's field IDs"
publishDate: 'Dec 3 2025'
tags:
  - biobank
  - research-strategy
  - project-management
  - consulting
draft: true
seo:
  image:
    src: '/blog_images/biobank1/ukbShowcaseGraphic.png'
    alt: "Papers tell you WHAT was used. Showcase tells you what's AVAILABLE NOW."
---

![Papers tell you WHAT was used. Showcase tells you what's AVAILABLE NOW.](/blog_images/biobank1/ukbShowcaseGraphic.png)

When I first started working with UK Biobank, I identified relevant field IDs by hunting through publications. [The UK Biobank Showcase](https://biobank.ndph.ox.ac.uk/showcase/) saved me hours of that detective work. The showcase not only explains data from older papers but surfaces newer measurements that weren't available when those studies were published.

For example, searching "Left Ventricular Ejection Fraction" returns [three data fields](https://biobank.ndph.ox.ac.uk/showcase/search.cgi?wot=0&srch=Left+Ventricular+Ejection+Fraction&yfirst=2000&ylast=2025) (22420, 24103, and 31060). But which one should you use? This is where the Showcase becomes essential.

For example, searching "Left Ventricular Ejection Fraction" returns [multiple relevant fields](https://biobank.ndph.ox.ac.uk/showcase/search.cgi?wot=0&srch=Left+Ventricular+Ejection+Fraction&yfirst=2000&ylast=2025) and three with the exact correct description.

![UK Biobank Showcase search interface showing search results for left ventricular ejection fraction, with three data fields highlighted: 22420 (Left ventricular size and function category), 24103 (Cardiac and aortic function #1 category), and 31060 (Cardiac and aortic function #2 category)](/blog_images/biobank1/lvef_search.png)

<figcaption class="text-center text-sm opacity-80 mt-2">
   <strong>Image 2:</strong> UK Biobank Showcase search results showing three LVEF measurement fields in different categories
</figcaption>

Notice the three highlighted fields measure the same thing but belong to different categories. Clicking into each field reveals why this matters:

![Three-panel comparison showing data field headers and category descriptions for fields 22420, 24103, and 31060. Field 22420 shows 39,645 participants with a quality warning. Field 24103 shows 80,974 participants with methodology references. Field 31060 shows 4,868 participants with publication citations. Each panel includes category warnings about data quality and compatibility.](/blog_images/biobank1/lvef_fields_long.png)

<figcaption class="text-center text-sm opacity-80 mt-2">
   <strong>Image 3:</strong> Comparison of three LVEF fields showing participant counts and category quality warnings
</figcaption>

Field 22420 ([category 133](https://biobank.ndph.ox.ac.uk/showcase/label.cgi?id=133)) has 39,649 measurements but includes a warning: "Quality issues may exist in this data. Researchers may wish to consider using data available in Category 157 or Category 162 as an alternative." Field 24103 ([category 157](https://biobank.ndph.ox.ac.uk/showcase/label.cgi?id=157)) contains 80,974 measurements and references a published methodology, but warns these fields "should not be considered together" with Category 162 without quality assessment. Field 31060 ([category 162](https://biobank.ndph.ox.ac.uk/showcase/label.cgi?id=162)) has only 4,868 participants, fewer than the flagged field 22420.

For my cardiomyopathy work ([Klasfeld _et al_ 2025](<https://www.cell.com/hgg-advances/fulltext/S2666-2477(25)00063-6>)), I chose field 24103 for its sample size and data quality. However, other useful information provided by the showcase includes the date of which the data was reported (Debut) and the distribution of the data (shown in the data tab in the second section of the Field ID entry). Publications rarely include this level of field-specific detail, which is exactly why the Showcase is invaluable. I highly recommend looking at Part III of the [Showcase user guide](https://biobank.ndph.ox.ac.uk/showcase/ukb/exinfo/ShowcaseUserGuide.pdf) (page 4) for more use-cases and details about the resource.
