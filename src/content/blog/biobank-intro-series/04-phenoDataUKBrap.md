---
title: 'Biobank Intro Series: UK Biobank Observational Data (Part II)'
excerpt: 'Loading phenotype data in the UK Biobank RAP (Research Analysis Platform) environment'
publishDate: 'Mar 17 2025'
tags:
  - biobank
  - sql
  - ukb-rap
  - ehr-data
  - phenotype-data
draft: false
series:
  name: 'Biobank Intro Series'
  order: 4
seo:
  image:
    src: '/blog_images/biobank1/ukb_fieldid_scent.png'
    alt: 'Cat following wafts of fresh kibble onto a table. The scent trails are labeled with UK Biobank Field IDs.'
---

<figure class="my-8 !max-w-none">
<img src="/blog_images/biobank1/ukb_fieldid_scent.png" alt="Cat following wafts of fresh kibble onto a table. The scent trails are labeled with UK Biobank Field IDs." />
</figure>

Once you've been browsing phenotype Field IDs on the [UK Biobank Showcase](../03-ukb-showcase), you're ready to pull the data into a workspace for analysis. When you get approved for a UK Biobank project you are gifted a VIP pass to a secure data wonderland called the UK Biobank Research Analysis Platform (UKB RAP). The UKB-RAP is a cloud-based venue (built on DNAnexus infrastructure) where you can spin up coding environments (JupyterLab, RStudio, take your pick) and analyze data without the nightmare of downloading 500,000+ participant records to your poor laptop.

Setting up your first environment in UKB RAP is its own special adventure (covered in a [previous post](../02-hardwareonukbandaou)). For now, let's assume you've already battled through that process and you've got JupyterLab humming along. Now you're ready to get your hands on some of that sweet, sweet phenotype data.

First, you'll need your dataset identifier to eventually specify to every dx command which dataset to query. This can be set in both python and bash.

python:

```{python}
import dxpy
import subprocess
import pandas as pd
import os
import glob

# Get your dataset identifier
dispensed_dataset_id = dxpy.find_one_data_object(
    typename='Dataset',
    name='app*.dataset',
    folder='/',
    name_mode='glob'
)['id']

project_id = dxpy.find_one_project()["id"]
dataset = f"{project_id}:{dispensed_dataset_id}"
```

bash:

```{bash}
# Get project ID
project_id=$(dx env --json | jq -r '.project')

# Get dispensed dataset ID
dispensed_dataset_id=$(dx find data --name "app*.dataset" --brief)

# Combine them
dataset="${project_id}:${dispensed_dataset_id}"
```

With that in hand, let's get some data.

## Step 1: Find the field names for your data

<figure class="my-8 !max-w-none">
<img src="/blog_images/biobank1/notebook_v_commandline.png" alt="Cat peering over a table in delight at two plates of kibble: one labeled 'Jupyter Notebook' and the other labeled 'Command Line'." />
</figure>

With a list of field IDs you gathered from the UKB Showcase, your next step is to figure out their exact field names on the RAP (which aren't always identical to what the Showcase shows), and then extract the actual participant data for those fields. There are two different methods for this.

### Quick lookup via terminal

When I'm in "just get it working" mode (which, let's be honest, is most of research), I found that the command-line approach is faster for quick lookups. I simply list all the field names in the terminal and grep for the ones I need.

```bash
dx extract_dataset ${dataset}  --entities participant --list-fields | grep "22420"
```

### Dictionary approach

The UKB RAP documentation will steer you toward extracting dictionary files (`*.dataset.data_dictionary.csv `), which map field IDs to field names, describe data coding schemes, and generally serve as the Rosetta Stone for the dataset. This approach is considered more "proper", and for good reason: it's reproducible, documentable, and plays nicely with notebooks.

The dictionary approach requires more setup: extracting CSVs, loading them into pandas, and writing filter logic. When you're exploring or need a quick answer, I recommend the quick and dirty command-line approach. That said, there are times when the dictionaries are nice to have. They make your code easier to comprehend and also are useful for making sense of these data tables after extraction.

## Step 2: Extract the dataset

To extract the actual dataset values, use DNAnexus' `extract_dataset` command with the `--fields` flag set to the relevant field names:

```bash
dx extract_dataset <project_id>:<dispensed_dataset_id> \
  --fields participant.eid,participant.p22420_i2,participant.p22420_i3 \
  --delimiter "," \
  --output lvef_pheno.csv
```

## Step 3: Translate the dataset values

The data you just extracted is often coded, meaning the raw values or numbers are not immediately interpretable.. Therefore, to make human analysis easier, it is sometimes helpful to translate these code to their definition.

**Example: Filtering cardiomyopathy diagnoses from ICD10 codes**

Working on a project to understand the genetic architecture of cardiomyopathy, I needed to identify participants with cardiomyopathy diagnoses. The Showcase told me International Classification of Disease version 10 (ICD-10) diagnosis codes were Field ID 41270.

I extracted the field names easily enough with `dx` commands. However, the raw data returned value codes like "I42" or "I420", meaningless without context.

Fortunately, the UKB Showcase maintains various data coding tables for each of their coded data fields. Specifically ICD-10 diagnosis codes are given coding 19 in UKB. Similarly ICD9 codes are found in coding 87.

You could also extract all the coding dictionaries once and have them ready as searchable dataframes. For example,

```python
# Extract dictionaries once with -ddd flag
cmd = ["dx", "extract_dataset", dataset, "-ddd", "--delimiter", ","]
subprocess.check_call(cmd)

# Load the codings dictionary
codings_df = pd.read_csv(glob.glob("*.codings.csv")[0])

# Find which ICD10 codes mean "cardiomyopathy"
icd10_coding = codings_df[codings_df['coding_name'] == "data_coding_19"]
cardiomyopathy_codes = icd10_coding[
    icd10_coding['meaning'].str.contains('cardiomyopathy', case=False)
][["meaning", "code"]]
```

Now you can filter your extracted data to only participants with those specific codes, without tab-switching back to the Showcase every time you need to decode something.

## The Gotchas Nobody Tells You

**Authentication weirdness:** Sometimes `dx` commands work fine in terminal but throw mysterious errors when called through `subprocess` in Jupyter. I've never figured out exactly why (token refresh issues?), but when you hit this, just run the command in terminal instead.

**Spark is not optional for big extractions:** If you're pulling more than ~30 fields, you'll need a Spark cluster. The [UKB RAP documentation](https://dnanexus.gitbook.io/uk-biobank-rap/working-on-the-research-analysis-platform/accessing-data/accessing-phenotypic-data) covers this, but fair warning: Spark uses lazy evaluation, which means errors can show up way downstream from where they actually originated. Fun times.

## Wrapping Up

That's the full pipeline: find your field names, extract the data, and decode any coded values. Once you've done it a couple of times, the whole process takes minutes.

In the next post, we'll look at how to do the same thing on the All of Us Researcher Workbench.
