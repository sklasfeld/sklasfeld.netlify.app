---
title: 'SQL Me Maybe: Loading Phenotype Data in UKB RAP'
excerpt: "How to navigate UK Biobank's field IDs"
publishDate: 'Dec 3 2025'
tags:
  - biobank
  - sql
  - ukb-rap
  - ehr-data
  - phenotype-data
draft: true
seo:
  image:
    src: '/blog_images/biobank1/ukb_dx_exporter.jpg'
    alt: "Drake meme format showing rejection of 'table exporter' in top panel and approval of 'dx extract_dataset' command in bottom panel"
---

![Drake meme format showing rejection of 'table exporter' in top panel and approval of 'dx extract_dataset' command in bottom panel](/blog_images/biobank1/ukb_dx_exporter.jpg)

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
