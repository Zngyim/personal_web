export interface ProjectItem {
  slug: string;
  title: string;
  description: string;
  thumbnail: string;
}

export const projects: ProjectItem[] = [
  {
    slug: 'control-system-animation',
    title: '自动控制原理框图',
    description: '描述了自动控制过程中的信息流动。',
    thumbnail: '/projects/control-system-animation-thumb.svg',
  },
];
