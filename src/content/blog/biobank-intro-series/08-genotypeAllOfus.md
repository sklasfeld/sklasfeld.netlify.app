---
title: 'Biobank Intro Series: All of Us Genetic Data'
excerpt: 'Navigating All of Us genotype data for variant extraction and analysis'
publishDate: 'Apr 14 2026'
tags:
  - biobank
  - all-of-us
  - genotype-data
  - variant-calls
  - variant-annotation
draft: false
series:
  name: 'Biobank Intro Series'
  order: 8
seo:
  image:
    src: '/blog_images/biobank1/aou_genetic_data.png'
    alt: 'Woman with a flashlight searching through a dark basement packed with disorganized filing cabinets, papers, and boxes, representing the scattered data organization within All of Us.'
---

<figure class="my-8 !max-w-none">
<img src="/blog_images/biobank1/aou_genetic_data.png" alt="Woman with a flashlight searching through a dark basement packed with disorganized filing cabinets, papers, and boxes, representing the scattered data organization within All of Us." class="!max-w-none mx-auto w-full" >
<figcaption class="text-center text-sm opacity-80 mt-2">
   <em>Working with All of Us data can feel like searching a dim warehouse. Valuable datasets are everywhere, but finding the right files requires exploration.</em>
 </figcaption>
</figure>

I had approved data access, a running cluster, and a simple goal: get genotype data from All of Us. The documentation assured me the data existed. Somewhere. In some format. Accessible via... [environment variables](https://support.researchallofus.org/hc/en-us/articles/29475233432212-Controlled-CDR-Directory)?

Forty-five minutes later, I was still googling variations of "all of us wgs sequencing data" and getting increasingly creative with `gsutil ls` commands.

If this sounds familiar, let me save you some time. Here's where the genotype data actually lives and how to access it.

## Quick Overview: What's Available

All of Us provides WGS data in three main formats:

1. **Phased VCF files** - Organized by chromosome, easiest to access
2. **Unphased VCF files** - Sharded into 20,016 files, requires some work to find your region
3. **Hail MatrixTable** - For distributed computing (if you really need it)

Plus a bonus: the **Variant Annotation Table (VAT)** for gene-level annotations.

## Option 1: Phased VCF Files

The most current phased sequencing data can be downloaded directly by chromosome. These files provide estimated haplotypes based on genotyping data, phased with [Beagle](<https://www.cell.com/ajhg/fulltext/S0002-9297(21)00304-9>) (similar to UK Biobank).

```bash
gsutil -u $GOOGLE_PROJECT cp gs://fc-aou-datasets-controlled/v8/wgs/short_read/snpindel/aux/phasing/chr${CHROM}_AOU_v8.2_allsamples_phased.vcf.gz .
gsutil -u $GOOGLE_PROJECT cp gs://fc-aou-datasets-controlled/v8/wgs/short_read/snpindel/aux/phasing/chr${CHROM}_AOU_v8.2_allsamples_phased.vcf.gz.tbi .
```

**When to use phased data:**

- Imputation of untyped variants
- Detection of compound heterozygous variants
- Understanding inheritance patterns

**When NOT to use phased data:**

- Rare variant analyses (phasing algorithms rely on population-level LD patterns that may not accurately represent very rare variants)

## Option 2: Unphased VCF Files

If you need unphased genotype data, buckle up. The VCF files live at `gs://fc-aou-datasets-controlled/v8/wgs/short_read/snpindel/exome/vcf/`, but instead of straightforward chromosome-based naming, they're sharded by genomic position into files numbered 0000000000 to 0000020016.

The good news: each shard has an `.interval_list` file that tells you what genomic regions it covers.

The bad news: you need to check 20,016 files to find your region.

### Finding Your Region

The internet is full of ways to optimize this search, but if I am being honest, I just wrote a quick script to loop through each file and check if my region of interest is within the start and stop positions listed in the interval list. I eventually got impatient and skipped ahead until I found the right chromosome and eventually got close enough to my region of interest.

```python
import pandas as pd
import subprocess

# SET YOUR REGION OF INTEREST HERE
chrom = "11"
region_start = 47331406
region_end = 47352702

vcf_filelist=[]
start=False
for i in tqdm(range(0,20016)):
    file_int = str(i).zfill(10)
    interval_f = f"gs://fc-aou-datasets-controlled/v8/wgs/short_read/snpindel/exome/vcf/{file_int}.interval_list"
    cmd = f"gsutil -u $GOOGLE_PROJECT cat {interval_f} | grep '^chr'"
    p = subprocess.Popen(cmd, shell=True, stdout=subprocess.PIPE)
    range_df = pd.read_csv(p.stdout, header=None, sep="\t")
    range_df.columns = ['chrom','start','stop','strand',"score"]
    if not start:
        region_count = (
            (range_df['chrom'].str.contains(chrom)) &
            (range_df['start'] >= region_start)
        ).sum()
        if region_count>0:
            vcf_filelist.append(file_int)
            print(file_int)
            start=True
    else:
        region_count = (
            (range_df['chrom'].str.contains(chrom)) &
            (range_df['stop'] <= region_end)
        ).sum()
        vcf_filelist.append(file_int)
        if region_count>0:
            print(file_int)
            break
```

### Extracting and Merging Your Region

Once you have your file list, download the relevant shards, subset to your region, and merge:

```bash

# SET YOUR REGION OF INTEREST HERE
chrom="11"
region_start=47331406
region_end=47352702

shard1={FIRST_SHARD_NUMBER}
shard2={LAST_SHARD_NUMBER}

# 1. Subset each shard to your region
bcftools view \
    -r ${chrom}:${region_start}-${region_end} \
    -O z \
    -o regionOfinterest_AOU_v8_unphased_V${shard1}.vcf.gz \
    ${shard1}.vcf.bgz
bcftools view \
    -r ${chrom}:${region_start}-${region_end} \
    -O z \
    -o regionOfinterest_AOU_v8_unphased_V${shard2}.vcf.gz \
    ${shard2}.vcf.bgz


# 2. Index the filtered VCFs
tabix -p vcf regionOfinterest_AOU_v8_unphased_V${shard1}.vcf.gz
tabix -p vcf regionOfinterest_AOU_v8_unphased_V${shard2}.vcf.gz

# 3. Concatenate the two filtered vcf files
bcftools concat -a -O z \
  -o merged_AOU_v8_unphased.vcf.gz \
  regionOfinterest_AOU_v8_unphased_V${shard1}.vcf.gz \
  regionOfinterest_AOU_v8_unphased_V${shard2}.vcf.gz

# 4. Index the combined vcf
tabix -p vcf merged_AOU_v8_unphased.vcf.gz

# 5. save the output
gsutil -u $GOOGLE_PROJECT cp merged_AOU_v8_unphased.vcf.gz $WORKSPACE_BUCKET/data/
```

## Option 3: Hail MatrixTable (If You Must)

The Hail MatrixTable for All of Us WGS data is stored in an environment variable. You can access it like this:

```python
import hail as hl
import os

clinvar_srwgs_path = os.getenv("WGS_EXOME_MULTI_HAIL_PATH")
mt = hl.read_matrix_table(clinvar_srwgs_path)
```

**Critical lesson:** Always filter at read time using the `_intervals` parameter. With the default cluster (15 GB RAM, 4 CPUs), reading the full genome MatrixTable will crash.

```python
import hail as hl
import os

# SET YOUR REGION OF INTEREST HERE
chrom = "11"
region_start = 47331406
region_end = 47352702

clinvar_srwgs_path = os.getenv("WGS_EXOME_MULTI_HAIL_PATH")

# Filter at READ time, not after loading
your_interval = hl.eval(hl.parse_locus_interval(f'{chrom}:{region_start}-{region_end}'))
mt = hl.read_matrix_table(
    clinvar_srwgs_path,
    _intervals=[your_interval]  # Only load this region!
)
```

## Bonus: The Variant Annotation Table (VAT)

If you need variant annotations (gene names, predicted consequences, etc.), All of Us provides a massive TSV file. Rather than copying the whole thing, you can grep for your gene of interest directly with the following bash script:

```bash
#!/bin/bash

# SET YOUR GENE OF INTEREST HERE
gene="MYBPC3"

project=$GOOGLE_PROJECT
genomic_location=$WORKSPACE_CDR
bucket=$WORKSPACE_BUCKET
vat_f="gs://fc-aou-datasets-controlled/v8/wgs/short_read/snpindel/aux/vat/vat_complete.bgz.tsv.gz"

echo "Starting ${gene} extraction at $(date)"
gsutil -u $project cat $vat_f | gunzip | head -1 > ${gene}_vat_v8.tsv
echo "Header retrieved at $(date)"

echo "Extracting ${gene} variants..."
gsutil -u $project cat $vat_f | gunzip | grep $'\t'"${gene}"$'\t' >> ${gene}_vat_v8.tsv
echo "Done at $(date)"

wc -l ${gene}_vat_v8.tsv

echo "Uploading to workspace bucket..."
gsutil -u $project cp ${gene}_vat_v8.tsv ${bucket}/data/${gene}_vat_v8.tsv
echo "Upload complete at $(date)"
```

MAJOR WARNING: When running the script above, make sure you set "Automatically pause after idle for" to at least 8 hours or however long you think it will take to grep through ~150 GB of data. You are going to want to do other things while this is running, and if your instance goes to sleep halfway through, you'll have to start over.

**Pros:**

- Gene-centric annotations
- Easy to grep by gene name
- Human-readable TSV format

**Cons:**

- 100+ GB compressed
- Not indexed (can't use tabix)
- Takes 45+ minutes to download and grep

## Putting It All Together

After some trial and error (and a helpful nudge from the All of Us support team), I cobbled together these paths from [this documentation on data organization](https://support.researchallofus.org/hc/en-us/articles/29475228181908-How-the-All-of-Us-Genomic-data-are-organized#01JQ7EW4SE044N3Y9350Z299PW) and [this table of CDR paths](https://support.researchallofus.org/hc/en-us/articles/29475233432212-Controlled-CDR-Directory). You could have maybe figured this out on your own, but hopefully I've saved you 45 minutes of creative googling.

Start with phased VCFs if they work for your analysis. If you need unphased data, resign yourself to the shard hunt. And if you're reaching for Hail, make sure you actually need distributed computing—standard tools like bcftools often work just fine and cost less in compute resources.
