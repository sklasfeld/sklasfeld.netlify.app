---
title: 'Making Your Move with Phenotype Data in UK Biobank Research Analysis Platform (UKB-RAP)'
excerpt: 'Tips and tricks to loading phenotype data in the UKB-RAP.'
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

Once you've been browsing phenotype Field IDs on the [UK Biobank Showcase](/blog/02-ukb-showcase), it's time to make your move. The UK Biobank Research Analysis Platform (UKB RAP) is your cloud-based venue (built on DNAnexus infrastructure) where you can finally get your hands on that sweet, sweet data.

When you get approved for a UK Biobank project, you're handed a project ID, your VIP pass to a secure data wonderland where you can spin up coding environments (JupyterLab, RStudio, take your pick) and analyze data without the nightmare of downloading 500,000+ participant records to your poor laptop.

Setting up your first environment in UKB RAP is its own special adventure involving worker configurations and instance types that we'll tackle in a future post. For now, let's assume you've already battled through that process and you've got JupyterLab humming along. Now you're ready to load some phenotype data.

So what's the actual workflow? I'm an avid bash and python user, so I work with a combination of terminal commands and JupyterLab notebooks. The command line makes loading data quick and straightforward, while Jupyter notebooks keep everything documented and reproducible.

To get started, you'll need your dataset name, which follows the format `{project ID}:{dispensed dataset ID}`.

**If you're working in the terminal**, you can find this with:

```bash
dx find data --name "app*.dataset" --brief
```

**If you're in a Jupyter notebook**, you can use the dxpy library to automatically grab it:

```python
import dxpy
import subprocess

# Automatically discover dispensed dataset ID and load the dataset
dispensed_dataset_id = dxpy.find_one_data_object(typename='Dataset', name='app*.dataset', folder='/', name_mode='glob')['id']

# Get project ID
project_id = dxpy.find_one_project()["id"]
dataset = (':').join([project_id, dispensed_dataset_id])
```

<figcaption class="text-center text-sm opacity-80 mt-2">
   Code from <a href="https://dnanexus.gitbook.io/uk-biobank-rap/working-on-the-research-analysis-platform/accessing-data/accessing-phenotypic-data">UKB-RAP manual</a>
</figcaption>

From this point forward, I'll show the Python/subprocess approach since it keeps everything in one reproducible notebook, but know that you can run these `dx` commands directly in the terminal if you prefer.

Tabular data in the UK Biobank database is stored in SQL entities. To see all the possible entities:

```python
cmd = ["dx", "extract_dataset", dataset, "--list-entities"]
result = subprocess.run(cmd, capture_output=True, text=True)
print("STDOUT:", result.stdout)
```

The `participant` entity is the main dataset. To see all available fields in the `participant` entity:

```python
cmd = ["dx", "extract_dataset", dataset, "--entities", "participant", "--list-fields"]
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

The above command will generate a sql file `app*.dataset.data.sql`.

Fair warning: sometimes this command works better when run directly in the terminal rather than through a Jupyter notebook. I'm not entirely sure why(authentication token weirdness or how `dx` handles being called through subprocess), but if you get mysterious errors, try copying the command and running it in your terminal instead.

If you want to extract over 30 fields, it is recommended to use a spark environment. I recommend looking over the commands in this [post](https://dnanexus.gitbook.io/uk-biobank-rap/working-on-the-research-analysis-platform/accessing-data/accessing-phenotypic-data). Remember that, unlike normal, spark commands performs lazy evaluations. In other words, errors can happen downstream of a bunch of commands because its only evaluating once a result is needed.
