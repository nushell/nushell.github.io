import type { NavbarConfig } from '@vuepress/theme-default';

export const navbarEn: NavbarConfig = [
  {
    text: 'Book',
    children: [
      { text: 'latest', link: '/book/' },
      { text: 'v0.68.x', link: '/book/v0.68.x/' },
    ],
  },
  // { text: "Contributor Book", link: "/contributor-book/" },
  { text: 'Cookbook', link: '/cookbook/' },
  { text: 'Blog', link: '/blog/' },
];
