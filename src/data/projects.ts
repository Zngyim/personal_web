export interface ProjectItem {
  slug: string;
  title: string;
  description: string;
}

export const projects: ProjectItem[] = [
  {
    slug: 'control-system-animation',
    title: '自动控制原理框图',
    description: '描述了自动控制过程中的信息流动。',
  },
  {
    slug: 'lorenz-visualization',
    title: 'Lorenz 吸引子可视化',
    description: '一个用于观察 Lorenz 系统轨迹演化和混沌行为的交互式可视化页面。',
  },
];
