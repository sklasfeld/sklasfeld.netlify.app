---
title: 'Biobank Intro Series: Hardware Settings'
excerpt: 'Hardware setup lessons for UK Biobank Research Analysis Platform and All of Us Workbench'
publishDate: 'Dec 2 2025'
tags:
  - biobank
  - uk-biobank
  - all-of-us
  - cloud-computing
  - bioinformatics
  - tutorial
  - best-practices
draft: true
seo:
  image:
    src: '/blog_images/biobank1/stream_not_copy.png'
    alt: 'Comparison of downloading vs streaming biobank data: wrong way (slow download) versus right way (fast streaming).'
---

![Comparison of downloading vs streaming biobank data: wrong way (slow download) versus right way (fast streaming).](/blog_images/biobank1/stream_not_copy.png)

After months of working across the UK Biobank RAP (Research Analysis Platform) and All of Us Researcher Workbench, I'm still no expert on these platforms' hardware, but I have learned some hard-won lessons about resource management. My mistakes came with relatively small price tags, yet when every cloud hour gets billed, I wish I could have skipped the futzing.

Here's what I wish I'd known from day one.

## Tip #1: Learn Your Platform's Command Line Tools

**UK Biobank RAP: The dx toolkit**

The dx command-line interface is your friend for navigating the RAP filesystem:

```bash
# List files in a directory
dx ls

# Stream file contents (don't download!)
dx cat file-xxxx | bcftools view

# Upload local files to your workspace
dx upload local_file.txt --path /file/path/in/workspace/

# Download files (only if absolutely necessary)
dx download file-xxxx --output local_file.txt
```

**All of Us: gsutil for Google Cloud Storage**

All of Us data lives in Google Cloud Storage (GCS) buckets:

```bash
# List files in a bucket
gsutil ls gs://fc-aou-datasets-controlled/

# Find your VCF files
gsutil ls gs://fc-aou-datasets-controlled/v7/wgs/short_read/snpindel/

# Stream directly (the right way)
gsutil cat gs://path/to/file.vcf.gz | bcftools view
```

**Important:** Add a `-u` flag to `gsutil` commands to attribute the operation to your project for proper billing and access control:

```bash
gsutil -u $GOOGLE_PROJECT [command]
```

Use the environment variables `$GOOGLE_PROJECT` and `$WORKSPACE_BUCKET` to avoid hardcoding paths:

```bash
# Copy local file to your workspace bucket
gsutil -u $GOOGLE_PROJECT cp local_file.txt $WORKSPACE_BUCKET/

# Download files (only if absolutely necessary)
gsutil -u $GOOGLE_PROJECT cp gs://path/to/file.txt local_file.txt
```

## Tip #2: Never Copy Biobank Data Locally—Always Stream

Now that you know how to upload and download files, I must restate that **you should not use those download commands on biobank data files**. Yes, `dx download` and `gsutil cp` exist, but they should be your last resort, not your first instinct.

**Don't do this:**

```bash
# UK Biobank: Copying a 500GB VCF locally
dx download file-xxxx

# All of Us: Same mistake, different platform
gsutil cp gs://path/to/huge.vcf.gz .
```

**Do this instead:**

```bash
# UK Biobank: Stream with dx
dx cat file-xxxx | bcftools view | your_analysis

# All of Us: Stream with gsutil
gsutil cat gs://path/to/file.vcf.gz | bcftools view | your_analysis
```

The data is already where it needs to be—in the cloud, on fast storage, ready to be streamed. Copying wastes time, burns through storage quotas, and risks running out of disk space mid-analysis. Both platforms are designed for streaming access. Use it.

## Tip #3: Avoid Hail Unless You Actually Need It

When I first started with All of Us, I used Hail simply because it was the first genetic data file I could find. The VCFs were buried in the interface or sharded and disorganized (I'll show you how to navigate to them in the [8th installment of this series](../08-genotypeallofus)).

**Why avoid Hail when possible:**

- Requires expensive Spark clusters
- Memory-intensive operations that crash your instance
- Adds complexity when simpler tools work fine

If you can use standard tools (pandas, bcftools, plink), do that instead. Save Hail for genuinely distributed computing tasks.

## Tip #4: Set Appropriate Timeout Limits

**All of Us default:** 15 minutes of inactivity = shutdown

Picture this: You start a 2-hour variant annotation job, grab lunch, and return to... nothing. Just a terminated instance.

**Before starting long jobs:**

- All of Us: Go to workspace settings → increase idle timeout to 8 hours (or your preferred duration)
- UK Biobank RAP: Check instance auto-pause settings
- You can use `nohup` or `screen`/`tmux` for critical jobs but these will crash if the instance shuts down due to an idle timeout

## The Bottom Line

The most expensive resource isn't compute time or storage—it's your time rerunning failed analyses.

**When things crash:**

- You ran out of memory
- Filter earlier in your pipeline
- Checkpoint intermediate results

**When things are slow:**

- Check if files are indexed (.tbi, .csi)
- Use region queries instead of full chromosomes
- Stream instead of copying

Set yourself up for success: learn your command-line tools, stream your data, and configure timeouts before starting anything lengthy.
