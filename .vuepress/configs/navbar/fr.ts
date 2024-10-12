import type { NavbarConfig } from '@vuepress/theme-default';

export const navbarFr: NavbarConfig = [
  { text: 'Installez Nu !', link: '/fr/book/installation' },
  { text: 'Prise en main', link: '/fr/book/getting_started' },
  {
    text: 'Documentation',
    children: [{ text: 'Le Livre Nushell', link: '/fr/book/' }],
  },
];
