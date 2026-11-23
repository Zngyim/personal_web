export interface ProfileLink {
  label: string;
  icon: string;
  href?: string;
  value?: string;
}

export interface NewsItem {
  date: string;
  dateTime?: string;
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
  organizationHref?: string;
  unit?: string;
  advisor?: { name: string; href: string };
  logo?: string;
  description?: string;
}

export interface LandscapePhoto {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption?: string;
}

export interface HonorItem {
  year: string;
  title: string;
  organization?: string;
  description?: string;
}

/**
 * Academic profile content.
 *
 * Empty personal fields are omitted; empty sections show a short placeholder.
 * Keep dated lists in reverse chronological order, with the newest entry first.
 */
export const profile = {
  name: 'Yiming Zeng',
  nativeName: '「曾一鸣」',
  role: '',
  affiliation: '',
  location: '',
  portrait: '/images/profile.jpg',
  portraitAlt: 'Portrait of Yiming Zeng',
  introduction: [] as string[],
  researchStatement: '',
  interests: [] as string[],
  links: [
    { label: 'Email', icon: 'tabler:mail', href: 'mailto:zngyim@gmail.com' },
    { label: 'WeChat', icon: 'tabler:brand-wechat', value: 'zym763005' },
    {
      label: 'Google Scholar',
      icon: 'tabler:school',
      href: 'https://scholar.google.com/citations?user=7pi7-CwAAAAJ&hl=en',
    },
    { label: 'CV', icon: 'tabler:file-text', href: '/files/resume_yiming.pdf' },
  ] as ProfileLink[],
};

export const news: NewsItem[] = [];

export const publications: PublicationItem[] = [];

export const honors: HonorItem[] = [];

// Research appointments, internships, and visiting positions.
export const appointments: TimelineItem[] = [
  {
    period: '2026.03 – Present',
    title: 'Research Intern',
    organization: 'Center on Frontiers of Computing Studies (CFCS), Peking University',
    organizationHref: 'https://cfcs.pku.edu.cn/',
    unit: 'PKU-Agibot Lab',
    advisor: { name: 'Prof. Hao Dong', href: 'https://zsdonghao.github.io/' },
    logo: '/images/institutions/pku.png',
  },
];

export const education: TimelineItem[] = [
  {
    period: '2024 – 2028',
    title: 'B.Eng. in Automation',
    organization: "Xi'an Jiaotong University (XJTU)",
    organizationHref: 'https://www.xjtu.edu.cn/',
    unit: 'School of Automation Science and Engineering',
    logo: '/images/institutions/xjtu.png',
  },
];

export const outsideResearch = {
  introduction: 'I love traveling and capturing the landscapes that make me pause.',
  // Add selected travel photographs here, using each image's actual dimensions.
  photos: [] as LandscapePhoto[],
};
