export type Image = {
  src: string;
  alt?: string;
  caption?: string;
};

export type Link = {
  text: string;
  href: string;
  download?: string;
};

export type Hero = {
  title?: string;
  text?: string;
  image?: Image;
  actions?: Link[];
};
/*
export type Subscribe = {
    title?: string;
    text?: string;
    formUrl: string;
};
*/

export type SiteConfig = {
  logo?: Image;
  title?: string;
  job?: string;
  company?: string;
  description?: string;
  image?: Image;
  headerNavLinks?: Link[];
  footerNavLinks?: Link[];
  socialLinks?: Link[];
  hero?: Hero;
  /*subscribe?: Subscribe;*/
  postsPerPage?: number;
  projectsPerPage?: number;
};

const siteConfig: SiteConfig = {
  title: "Samantha Klasfeld",
  job: "Postdoctoral Research Fellow",
  company: "Internal Medicine Research Unit at Pfizer",
  description: "Samantha Klasfeld's Site",
  image: {
    src: "/dante-preview.jpg",
    alt: "Samantha Klasfeld Professional Photo",
  },
  headerNavLinks: [
    {
      text: "Home",
      href: "/",
    },
    {
      text: "Experiences",
      href: "/projects",
    },
    /*,
        {
            text: 'Publications',
            href: '/blog'
        },
        {
            text: 'Tags',
            href: '/tags'
        }*/
  ],
  footerNavLinks: [
    /*{
            text: 'About',
            href: '/about'
        },*/
    {
      text: "Contact",
      href: "/contact",
    } /*
        {
            text: 'Terms',
            href: '/terms'
        }*/,
    {
      text: "Download theme",
      href: "https://github.com/JustGoodUI/dante-astro-theme",
    },
  ],
  socialLinks: [
    {
      text: "GitHub",
      href: "https://github.com/sklasfeld",
    },
    {
      text: "Kaggle",
      href: "https://www.kaggle.com/sklasfeld",
    },
    {
      text: "LinkedIn",
      href: "https://www.linkedin.com/in/samantha-klasfeld/",
    },
    {
      text: "BlueSky",
      href: "https://bsky.app/profile/sklasfeld.bsky.social",
    },
  ],
  hero: {
    title: "About Me",
    text: "A computational biologist with expertise in statistical genetics \
        and genomics analysis, I am committed to solving complex questions through \
        data analysis, statistical inference, collaboration, and creativity.<br><br>\
        I am completing my postdoctoral research fellowship at Pfizer in the Integrative Biology Group \
        within the Internal Medicine Research Unit. \
        <div class='underline'> \
        [Check out the preprint for my postdoc project at MedRx](https://www.medrxiv.org/content/10.1101/2024.12.17.24318501v1)! \
        </div>",
    image: {
      src: "/sklasfeld_cartoon.jpg",
      alt: "Professional Photo of Samantha Klasfeld",
    },
    actions: [
      {
        text: "Download Resume",
        href: "Samantha_Klasfeld_CV.pdf",
        download: "Samantha_Klasfeld_CV.pdf",
      },
    ],
  },
  /*subscribe: {
        title: 'Subscribe to Dante Newsletter',
        text: 'One update per week. All the latest posts directly in your inbox.',
        formUrl: '#'
    },*/
  postsPerPage: 8,
  projectsPerPage: 8,
};

export default siteConfig;
