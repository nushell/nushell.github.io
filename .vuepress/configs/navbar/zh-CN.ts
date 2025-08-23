import type { NavbarConfig } from '@vuepress/theme-default';

export const navbarZhCN: NavbarConfig = [
  { text: '安装 Nu !', link: '/zh-CN/book/installation' },
  { text: '快速开始', link: '/zh-CN/book/getting_started' },
  {
    text: '文档',
    children: [
      { text: 'Nushell 之书', link: '/zh-CN/book/' },
      { text: '命令参考列表', link: '/zh-CN/commands/' },
      { text: '实战指南', link: '/zh-CN/cookbook/' },
      { text: '语言参考指南', link: '/zh-CN/lang-guide/' },
      { text: '贡献指南', link: '/zh-CN/contributor-book/' },
    ],
  },
  { text: '博客', link: '/blog/' },
];
