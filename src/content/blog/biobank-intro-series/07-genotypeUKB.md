---
title: 'Biobank Intro Series: UK Biobank Genetic Data'
excerpt: 'Traversing genetic data on the UK Biobank RAP (Research Analysis Platform) environment'
publishDate: 'Apr 07 2026'
tags:
  - biobank
  - uk-biobank
  - genotype-data
  - variant-calls
  - variant-annotation
draft: false
series:
  name: 'Biobank Intro Series'
  order: 7
seo:
  image:
    src: '/blog_images/biobank1/ukb_genetic_timeline.png'
    alt: 'A tree ring visualization where each ring is a relevant UKB release'
---

<figure class="my-8 !max-w-none">
<img src="/blog_images/biobank1/ukb_genetic_timeline.png" alt="A tree ring visualization where each ring is a relevant UKB release" class="!max-w-none mx-auto w-full">
<figcaption class="text-center text-sm opacity-80 mt-2">
   <em>UK Biobank's genetic data has grown over time, from microarray genotyping to whole genome sequencing.</em>
</figcaption>
</figure>

Finally, the blog post where I get to the juicy genetic data — and I barely know where to begin. Coming from my Ph.D. in plant epigenetics, I was used to raw sequencing data from one replicate at a time. The UK Biobank (UKB) has around 500,000 participants, so the genetic data is massive. But here's the thing I eventually figured out: I never needed all of it. In my work, I've only focused on a single region or a handful of variants. I never needed to download any genetic data, and neither should you. Not to your workspace (it will cost you time and money; see [my previous blog on UKB hardware](../02-hardwareOnUKBandAoU)) and not to your local computer (that's a [crime](https://community.ukbiobank.ac.uk/hc/en-gb/articles/31972311370013-Guidance-on-Data-Downloads-and-Exemptions)). Instead, I was able to stream and filter directly on the RAP using DNAnexus. The first step, though, is knowing what genetic data UKB actually has and where to find it.

## The Showcase Knows About Genetics Too

In my previous post about the [UKB Showcase](../03-ukb-showcase), I focused on observational fields, but the Showcase also catalogs [genetic data resources](https://biobank.ctsu.ox.ac.uk/crystal/label.cgi?id=100314), including:

- **Microarray genotyping data** — directly measured variants at selected positions across the genome
- **Imputed genotypes** — variants inferred by combining array data with full-genome reference panels
- **Exome sequencing data** — sequenced protein-coding regions (~2% of the genome)
- **Whole genome sequencing** — full genome coverage
- **Phased haplotypes** — estimates of which alleles sit on the same chromosome (i.e., are inherited together)

Depending on the research question, you may need multiple data types. For example, phased haplotype data provides haplotype structure but excludes rare variants, so you might pair it with whole genome sequencing calls to get both. These data types were generated using different tools and released at
different times, and I find it helpful to know that context to not only
pick the right data, but also to understand the publications that
used UKB genetic data before me. UKB provides a [comprehensive timeline](https://community.ukbiobank.ac.uk/hc/en-gb/articles/26655145866269-Past-data-releases) of their data releases, but coming from a sequencing background, the terminology didn't sit well with me. For example, "genotyping data" actually means microarray data — not sequencing. Here are the current releases you'll most likely use:

| Year | Data Type                | Participants | Notes                             |
| ---- | ------------------------ | ------------ | --------------------------------- |
| 2017 | Microarray + imputation  | 488,377      | ~800K measured; ~96M imputed [^1] |
| 2022 | Exome sequencing (final) | ~470,000     |                                   |
| 2022 | Imputation (new panels)  | 488,377      | GEL and TOPMed; now in GRCh38     |
| 2023 | Whole genome sequencing  | ~500,000     | DRAGEN (recommended) [^6]         |
| 2025 | WGS (updated)            | ~500,000     | ML corrections; phased VCFs       |

And here are the earlier releases you may encounter in older publications:

| Year | Data Type                      | Participants | Notes                            |
| ---- | ------------------------------ | ------------ | -------------------------------- |
| 2019 | Exome sequencing               | 50,000       | Alignment errors identified [^2] |
| 2020 | Exome sequencing (reprocessed) | 200,000      | New OQFE pipeline [^3]           |
| 2021 | Exome sequencing               | ~454,000     | [^4]                             |
| 2021 | Whole genome sequencing        | 200,000      | [^5]                             |

## Where Are the Files? (The Practical Part)

<figure class="my-8 !max-w-none">
<img src="/blog_images/biobank1/ukb_workspace.png" alt="Diagram of the two UKB RAP storage spaces: a temporary working directory for running scripts, connected by DNAnexus upload/download commands to the persistent project workspace containing saved files and Bulk Data." style="max-height: 600px; width: auto;" />
<figcaption class="text-center text-sm opacity-80 mt-2">
   <em> The two storage spaces on the UKB Research Analysis Platform. The working directory (top) is a temporary Linux environment where you run scripts and produce results. The project workspace (bottom) is persistent storage that holds your saved files and the read-only Bulk Data provided by UK Biobank. Use <code>dx upload</code> and <code>dx download</code> to move files between the two spaces.</em>
 </figcaption>
</figure>

When you launch a Jupyter notebook environment on UKB RAP, the left-side menu has two sections. At the top is a file icon — this is your **working directory**, a temporary space where you run scripts and produce results. Anything here is deleted when your session ends. Below that is a "DNAnexus" label — click this to access your **project workspace**, which persists between sessions. This is where you'll find a directory called "Bulk" containing all the genetic data (and more).

The file structure inside Bulk can be confusing, but here's the trick: filenames contain field ID numbers, so you can cross-reference them with the UK Biobank Showcase. For example, to find all files for field ID 24311, run `dx find data --name "ukb24311*"`. You can move files between your working directory and project workspace using `dx upload` and `dx download`, but remember — it's better to stream data from Bulk than to fully copy it.

## Now What?

If you've made it this far, you know more about UKB genetic data than I did
for an embarrassingly long time. Here's the short version: there are five
types of genetic data, the whole genome sequencing is the most comprehensive,
and it all lives in the Bulk directory of your project workspace. You don't
need to memorize the timeline — just know that earlier releases sometimes had
issues that later ones fixed, and when in doubt, use the most recent data
available.

In the next post, I'll walk through how All of Us handles its genetic data. Spoiler: the documentation isn't better.

## References

[^1]: Bycroft, C., Freeman, C., Petkova, D. et al. (2018). The UK Biobank resource with deep phenotyping and genomic data. _Nature_ 562, 203–209 https://doi.org/10.1038/s41586-018-0579-z

[^2]: Van Hout, C. V., Tachmazidou, I., Backman, J. D., Hoffman, J. X., Ye, B., Pandey, A. K., et al. (2019). Whole exome sequencing and characterization of coding variation in 49,960 individuals in the UK Biobank. _BioRxiv_, 572347, https://doi.org/10.1101/572347

[^3]: Szustakowski, J. D., Balasubramanian, S., Kvikstad, E., Khalid, S., Bronson, P. G., Sasson, A., ... & Reid, J. G. (2021). Advancing human genetics research and drug discovery through exome sequencing of the UK Biobank. Nature genetics, 53(7), 942-948.

[^4]: Backman, J.D., Li, A.H., Marcketta, A. et al. (2021). Exome sequencing and analysis of 454,787 UK Biobank participants. Nature 599, 628–634, https://doi.org/10.1038/s41586-021-04103-z

[^5]: Halldorsson, B.V., Eggertsson, H.P., Moore, K.H.S. et al. (2022). The sequences of 150,119 genomes in the UK Biobank. Nature 607, 732–740, https://doi.org/10.1038/s41586-022-04965-x

[^6]: The UK Biobank Whole-Genome Sequencing Consortium. (2025).Whole-genome sequencing of 490,640 UK Biobank participants. Nature 645, 692–701 https://doi.org/10.1038/s41586-025-09272-9
