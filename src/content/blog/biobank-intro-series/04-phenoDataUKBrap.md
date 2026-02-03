---
title: 'Biobank Intro Series: UK Biobank Observational Data (Part II)'
excerpt: 'Loading phenotype data in the UK Biobank RAP (Research Analysis Platform) environment'
publishDate: 'Dec 4 2025'
tags:
  - biobank
  - sql
  - ukb-rap
  - ehr-data
  - phenotype-data
draft: true
seo:
  image:
    src: '/blog_images/biobank1/notebook_v_commandline.png'
    alt: "Cat staring in delight at two plates of kibble: one labeled 'Jupyter Notebook' and the other labeled 'Command Line'."
---

![Cat peering over a table in delight at two plates of kibble: one labeled 'Jupyter Notebook' and the other labeled 'Command Line'.](/blog_images/biobank1/notebook_v_commandline.png)

Once you've been browsing phenotype Field IDs on the [UK Biobank Showcase](/blog/02-ukb-showcase), you're ready to pull the data into a workspace for analysis. When you get approved for a UK Biobank project you are gifted a VIP pass to a secure data wonderland called the UK Biobank Research Analysis Platform (UKB RAP). The UKB-RAP is a cloud-based venue (built on DNAnexus infrastructure) where you can spin up coding environments (JupyterLab, RStudio, take your pick) and analyze data without the nightmare of downloading 500,000+ participant records to your poor laptop.

Setting up your first environment in UKB RAP is its own special adventure involving worker configurations and instance types that we'll tackle in a future post. For now, let's assume you've already battled through that process and you've got JupyterLab humming along. Now you're ready to get your hands on some of that sweet, sweet phenotype data.

## Two Paths to the Same Data

The UKB RAP documentation will steer you toward extracting dictionary files (`*.dataset.data_dictionary.csv `), structured tables that map entities to their description, field IDs to field names, data code types to code definitions. It's the "proper" approach, and for good reason: it's reproducible, documentable, and plays nicely with notebooks.

But here's what I actually do most of the time: I use `dx` commands directly in the terminal.

Why? Because when I'm in "just get it working" mode (which, let's be honest, is most of research), the command-line approach is genuinely faster for quick lookups. I've got a list of Field IDs from the Showcase. I need to know their exact field names to extract them. The fastest path is:

```bash
dx extract_dataset <project_id>:<dispensed_dataset_id>  --entities participant --list-fields | grep "22420"
```

Boom. Field names. No ceremony.

To extract the actual data, I just add the `--fields` flag with the relevant field names:

```bash
dx extract_dataset <project_id>:<dispensed_dataset_id> \
  --fields participant.eid,participant.p22420_i2,participant.p22420_i3 \
  --delimiter "," \
  --output lvef_pheno.csv
```

The dictionary approach requires more setup - extracting CSVs, loading them into pandas, writing filter logic. When you're exploring or need a quick answer, I recommend the quick and dirty command-line approach.

## When I Actually Use the Dictionaries

That said, there are times when the dictionaries are nice to have. They make your code easier to comprehend and also are useful for making sense of these data tables after extraction.

**Example: Filtering cardiomyopathy diagnoses from ICD10 codes**

Working on a project to understand the genetic architecture of cardiomyopathy, I needed to identify participants with cardiomyopathy diagnoses. The Showcase told me International Classification of Disease version 10 (ICD-10) diagnosis codes were Field ID 41270, and I could extract the field names easily enough with `dx` commands.

But here's the problem: once you have the ICD10 codes extracted, you need to know which ones actually represent cardiomyopathy. encoded with data coding 19. The raw data gives you codes like "I42" or "I420" - but what do those _mean_?

You could go back to the UKB Showcase and manually download the data coding table for ICD-10 diagnosis codes, coding 19. Then do it again for coding 87 (ICD9). Then again for whatever other codings you need. Or you could extract all the coding dictionaries once and have them ready as searchable dataframes:

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

## My Actual Workflow

Here's what this looks like in practice:

**Setup (once per project):**

```python
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

**For quick field lookups:**

Jump to terminal, use `dx extract_dataset <dataset> --entities participant --list-fields | grep <field_id>`

**For systematic analysis:**

Extract and load dictionaries in a notebook, then filter programmatically.

**For actual data extraction:**

`dx extract_dataset` with `--fields` flag and your field names

## The Gotchas Nobody Tells You

**Authentication weirdness:** Sometimes `dx` commands work fine in terminal but throw mysterious errors when called through `subprocess` in Jupyter. I've never figured out exactly why (token refresh issues?), but when you hit this, just run the command in terminal instead.

**Spark is not optional for big extractions:** If you're pulling more than ~30 fields, you'll need a Spark cluster. The [UKB RAP documentation](https://dnanexus.gitbook.io/uk-biobank-rap/working-on-the-research-analysis-platform/accessing-data/accessing-phenotypic-data) covers this, but fair warning: Spark uses lazy evaluation, which means errors can show up way downstream from where they actually originated. Fun times.

## The Real Lesson

There isn't one right way to access phenotype data. The right approach depends on whether you're exploring, prototyping, or building something reproducible.

Use terminal commands when you need speed. Use dictionaries when you need structure. Use both, because that's what actually works.
