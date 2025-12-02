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
    src: '/blog_images/biobank1/biobank_iceberg.png'
    alt: 'Iceberg diagram illustrating hidden complexities in biobank data: visible raw data above the waterline, and three categories of hidden challenges below: batch effects, population stratification, and inaccurate phenotype data.'
---

<figure>
<img src="/blog_images/biobank1/biobank_iceberg.png" alt="Iceberg diagram illustrating hidden complexities in biobank data: visible raw data above the waterline, and three categories of hidden challenges below: batch effects, population stratification, and inaccurate phenotype data." class="block dark:hidden">
<img src="/blog_images/biobank1/biobank_iceberg_dark.png" alt="Iceberg diagram illustrating hidden complexities in biobank data: visible raw data above the waterline, and three categories of hidden challenges below: batch effects, population stratification, and inaccurate phenotype data." class="hidden dark:block">
<figcaption class="text-center text-sm opacity-80 mt-2">
    <strong>Image 1:</strong> <em>The Biobank Iceberg. Everyone knows there's more beneath the surface of Biobank data. The challenge is understanding the scale of these complexities.</em>
  </figcaption>
</figure>

If I learned anything during my first few months as a bioinformatics contractor, it's that you need to know your question before you worry about the iceberg.

The first step to any biobank analysis is strategic rather than technical.

- What specific research question are you trying to answer?
- Who is your audience?

Are you validating a drug target for a pharmaceutical company? Investigating health disparities for a policy brief? Exploring rare disease mechanisms for a grant proposal? These answers guide your entire approach: how to shape your cohorts, handle missing data, and which biases to consider, etc.

As a contractor, I've learned that curiosity must be disciplined. My job is to hit project checkpoints and answer the client's specific question, not to chase down every interesting technical rabbit hole. The data complexity matters, but staying on track isn't just good project management; it's professional integrity.

Only after you've defined your question and audience can you identify which data complexities actually matter. Every dataset comes with biases and baggage, and I fight two competing urges: either get lost documenting every limitation, or skip past the complexity entirely and just start analyzing. Neither instinct serves the project. The discipline I've had to learn is this: acknowledge the complexity, but focus only on what affects your specific research question.

The good news is that this complexity isn't insurmountable. It just requires understanding the data first. I've already fallen into some of these rabbit holes, so hopefully you won't have to. With this post, I hope to demystify UK Biobank and All of Us so you can navigate them confidently. But let me be clear, I cannot cover every nuance of these massive resources. Your specific research question may surface complexities I haven't encountered. What I can give you are foundational issues that matter across most use cases, the patterns to watch for, and questions to ask.

## Phenotype Data

Let's start with the most fundamental aspect: finding and understanding the phenotype data itself.

### UK Biobank

#### UK Biobank Showcase

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

#### Loading Phenotype Data in UKB-RAP

Once you have collected the Field IDs of interest, the next step is to load the data into a coding environment. As an avid python user, I felt most comfortable using JupyterLab in the UK Biobank Research Analysis Platform (UKB-RAP). To get started, first you need to locate your project's dataset object.

```{python}
import dxpy
import subprocess

# Automatically discover dispensed dataset ID and load the dataset
dispensed_dataset_id = dxpy.find_one_data_object(typename='Dataset', name='app*.dataset', folder='/', name_mode='glob')['id']

# Get project ID
project_id = dxpy.find_one_project()["id"]
dataset = (':').join([project_id, dispensed_dataset_id])
```

<figcaption class="text-center text-sm opacity-80 mt-2">
    Copied and pasted code from <a href="https://dnanexus.gitbook.io/uk-biobank-rap/working-on-the-research-analysis-platform/accessing-data/accessing-phenotypic-data">UKB-RAP manual</a>
</figcaption>

Tabular data in the UK Biobank database is stored in SQL entities. To see all the possible entities, use the following python code:

```{python}
cmd = ["dx", "extract_dataset",dataset, "--list-entities"]
result = subprocess.run(cmd, capture_output=True, text=True)
print("STDOUT:", result.stdout)
```

The `participant` entity is the main dataset. Data fields in the `participant` entity can be printed using the following command:

```{python}
cmd = ["dx", "extract_dataset",dataset, "--entities","participant","--list-fields"]
result = subprocess.run(cmd, capture_output=True, text=True)
print("STDOUT:", result.stdout)
```

For example, to pull out Left-Ventricle Ejection Fraction measurements, I would use the following command:

```{python}
cmd = ['dx',
    'extract_dataset',
    dataset,
    '--fields',
    "participant.eid",
    "participant.p22420",
    '--delimiter',
    ',',
    '--output',
    <filename.csv>,
]
subprocess.check_call(cmd)
```

If you want to extract over 30 fields, it is recommended to use a spark environment. I recommend looking over the commands in this [post](https://dnanexus.gitbook.io/uk-biobank-rap/working-on-the-research-analysis-platform/accessing-data/accessing-phenotypic-data). Remember that, unlike normal, spark commands performs lazy evaluations. Therefore, errors can happen downstream of a bunch of commands because its only evaluating once a result is needed.

The above command will generate a sql file `app*.dataset.data.sql`

### All of Us

All of Us recommends starting with their [Cohort and Dataset Builders](https://www.researchallofus.org/data-tools/workbench/), point-and-click tools designed to help researchers navigate the data. But as a bioinformatician, I was more comfortable diving into the code iteself. I skipped the builders and went straight to querying the [SQL tables](https://support.researchallofus.org/hc/en-us/articles/30125602539284-Introduction-to-All-of-Us-Electronic-Health-Record-EHR-Collection-and-Data-Transformation-Methods) directly. From there, I was greeted with the familiar face of messy phenotype data. Let me introduce you.

<figure>
<img src="/blog_images/biobank1/source_to_standard_omop.png" alt="Flowchart showing the process of transforming hospital EHR data into OMOP format." class="block dark:hidden">
<img src="/blog_images/biobank1/source_to_standard_omop_dark.png" alt="Flowchart showing the process of transforming hospital EHR data into OMOP format." class="hidden dark:block">
<figcaption class="text-center text-sm opacity-80 mt-2">
    <strong>Image 4:</strong> <em>EHR to OMOP Flowchart. Raw hospital data with inconsistent coding is extracted, transformed into standardized concepts through the OMOP vocabulary, and loaded into relational tables for research use.</em>
  </figcaption>
</figure>

Data collected by All of Us originates from multiple sources including self-reported surveys, program enrollment visits, and electronic health records (EHRs). EHRs are either collected from the participant ro from their affiliated health care organization. From these different extraction points the data is transformed and loaded into the [OMOP common data model structure](https://support.researchallofus.org/hc/en-us/articles/360039585391-Understanding-OMOP-Basics).
