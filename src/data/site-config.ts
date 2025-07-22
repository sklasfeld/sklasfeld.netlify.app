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
    subtitle?: string;
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
    subtitle: "Postdoctoral Research Fellow, Internal Medicine Research Unit at Pfizer",
    description: 'Samantha Klasfeld\'s Site',
    image: {
        src: '/favicon.png',
        alt: 'Samantha Klasfeld Professional Photo'
    },
    headerNavLinks: [
        {
            text: 'Home',
            href: '/'
        },
        {
            text: 'Experiences',
            href: '/projects'
        },
        {
            text: 'Contact',
            href: '/contact'
        }
        /*,
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
            text: 'Contact',
            href: '/contact'
        },/*
        {
            text: 'Terms',
            href: '/terms'
        }*/
        {
            text: 'Download theme',
            href: 'https://github.com/JustGoodUI/dante-astro-theme'
        }
    ],
    socialLinks: [
        {
            text: 'GitHub',
            href: 'https://github.com/sklasfeld'
        },
        {
            text: 'Kaggle',
            href: 'https://www.kaggle.com/sklasfeld'
        },
        {
            text: 'LinkedIn',
            href: 'https://www.linkedin.com/in/samantha-klasfeld/'
        },
        {
            text: 'BlueSky',
            href: 'https://bsky.app/profile/sklasfeld.bsky.social'
        }
    ],
    hero: {
        title: 'About Me',
        text: "A computational biologist with expertise in statistical genetics \
        and genomics analysis, I am committed to solving complex questions through \
        data analysis, statistical inference, collaboration, and creativity.<br><br>\
        I completed my postdoctoral research fellowship at Pfizer in the Integrative Biology Group \
        within the Internal Medicine Research Unit. \
        <div class='underline'> \
        [Check out my postdoc project in Human Genetics and Genomics Advances](https://www.cell.com/hgg-advances/fulltext/S2666-2477(25)00063-6)! \
        </div>",
        image: {
            src: '/sklasfeld_cartoon.jpg',
            alt: 'Professional Photo of Samantha Klasfeld'
        },
        actions: [
            {
                text: 'Download Resume',
                href: 'Samantha_Klasfeld_CV.pdf',
                download: 'Samantha_Klasfeld_CV.pdf'
            }
        ]
    },
    /*subscribe: {
        title: 'Subscribe to Dante Newsletter',
        text: 'One update per week. All the latest posts directly in your inbox.',
        formUrl: '#'
    },*/
    postsPerPage: 8,
    projectsPerPage: 8
};

export default siteConfig;
