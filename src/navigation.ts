import { getPermalink, getBlogPermalink } from './utils/permalinks';

export const headerData = {
  links: [
    {
      text: 'Home',
      href: getPermalink('/'),
    },
    {
      text: 'Blog',
      href: getBlogPermalink(),
    },
    {
      text: 'Research',
      href: getPermalink('/research'),
    },
    {
      text: 'Project',
      href: getPermalink('/projects'),
    },
  ],
  actions: [],
};

export const footerData = {
  links: [
    {
      title: 'Site',
      links: [
        { text: 'Home', href: getPermalink('/') },
        { text: 'Blog', href: getBlogPermalink() },
        { text: 'Research', href: getPermalink('/research') },
        { text: 'Project', href: getPermalink('/projects') },
      ],
    },
    {
      title: '专栏',
      links: [
        { text: '研究笔记', href: getPermalink('yan-jiu-bi-ji', 'category') },
        { text: '理论学习', href: getPermalink('li-lun-xue-xi', 'category') },
        { text: '思考随笔', href: getPermalink('si-kao-sui-bi', 'category') },
      ],
    },
    {
      title: '说明',
      links: [
        { text: '文章按时间与类别归档', href: getBlogPermalink() },
        { text: '研究方向与计划见 Research 页面', href: getPermalink('/research') },
        { text: '项目页面见 Project', href: getPermalink('/projects') },
      ],
    },
  ],
  footNote: `
    用于记录研究、学习与写作过程。
  `,
};
