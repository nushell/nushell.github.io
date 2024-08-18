import type { NavbarConfig } from '@vuepress/theme-default';

export const navbarEn: NavbarConfig = [
  {
    text: 'Documentation',
    children: [
      { text: 'Nushell Book', link: '/book/' },
      { text: 'Command Reference', link: '/commands/' },
      { text: 'Cookbook', link: '/cookbook/' },
      { text: 'Language Reference Guide', link: '/lang-guide/' },
    ],
  },
  { text: 'Contributing', link: '/contributor-book/' },
  { text: 'Blog', link: '/blog/' },
];
