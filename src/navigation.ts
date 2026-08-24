import { getBlogPermalink } from './utils/permalinks';

export const headerData = {
  links: [
    {
      text: 'About',
      href: '/#about',
    },
    {
      text: 'News',
      href: '/#news',
    },
    {
      text: 'Research',
      href: '/#research',
    },
    {
      text: 'Projects',
      href: '/#projects',
    },
    {
      text: 'Blog',
      href: getBlogPermalink(),
    },
  ],
  actions: [],
  isSticky: true,
};

export const footerData = {
  links: [
    {
      title: 'Site',
      links: [
        { text: 'About', href: '/#about' },
        { text: 'Research', href: '/#research' },
        { text: 'Projects', href: '/#projects' },
        { text: 'Blog', href: getBlogPermalink() },
      ],
    },
  ],
  footNote: `Research, projects, and notes.`,
};
