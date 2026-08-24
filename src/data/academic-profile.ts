export interface ProfileLink {
  label: string;
  icon: string;
  href?: string;
}

export interface NewsItem {
  date: string;
  text: string;
  href?: string;
  linkLabel?: string;
}

export interface PublicationLink {
  label: string;
  href: string;
}

export interface PublicationItem {
  title: string;
  authors: string;
  venue: string;
  year: string;
  description?: string;
  image?: string;
  highlighted?: boolean;
  links?: PublicationLink[];
}

export interface TimelineItem {
  period: string;
  title: string;
  organization?: string;
  description?: string;
}

/**
 * Academic profile content.
 *
 * Empty fields are intentionally omitted from the rendered page. Fill these
 * values as your academic profile develops; no layout changes are required.
 */
export const profile = {
  name: 'Yiming Zeng',
  nativeName: '「曾一鸣」',
  role: '',
  affiliation: '',
  location: '',
  portrait: '/images/profile.jpg',
  portraitAlt: 'Portrait of Yiming Zeng',
  introduction: [
    'This is my academic homepage for research, projects, and notes. A short biography and current affiliation will be added here.',
  ],
  researchStatement:
    'My research interests, current questions, and ongoing work will be added here. The page is ready for publications, preprints, and project updates.',
  interests: [] as string[],
  links: [
    { label: 'Email', icon: 'tabler:mail' },
    { label: 'WeChat', icon: 'tabler:brand-wechat' },
    { label: 'LinkedIn', icon: 'tabler:brand-linkedin' },
    { label: 'Google Scholar', icon: 'tabler:school' },
  ] as ProfileLink[],
};

export const news: NewsItem[] = [];

export const publications: PublicationItem[] = [];

export const appointments: TimelineItem[] = [];

export const education: TimelineItem[] = [];
