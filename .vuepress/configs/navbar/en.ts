import type { NavbarConfig } from '@vuepress/theme-default';

export const navbarEn: NavbarConfig = [
  { text: 'Get Nu!', link: '/book/installation' },
  { text: 'Getting Started', link: '/book/getting_started' },
  {
    text: 'Documentation',
    children: [
      { text: 'The Nushell Book', link: '/book/' },
      { text: 'Command Reference', link: '/commands/' },
      { text: 'Cookbook', link: '/cookbook/' },
      { text: 'Language Reference Guide', link: '/lang-guide/' },
      { text: 'Contributing Guide', link: '/contributor-book/' },
    ],
  },
  { text: 'Blog', link: '/blog/' },
];
