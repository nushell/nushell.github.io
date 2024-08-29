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
  {
    text: 'News',
    children: [
      { text: 'Blog', link: '/blog/' },
      {
        text: 'This Week in Nu!',
        link: 'https://github.com/nushell/this_week_in_nu/blob/main/This%20week%20in%20Nu%20261.md',
      },
    ],
  },
];
