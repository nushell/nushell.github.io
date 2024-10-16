import type { SidebarConfig } from '@vuepress/theme-default';
import { commandCategories } from './command_categories';

export const sidebarFr: SidebarConfig = {
  '/fr/book/': [
    {
      text: 'Introduction',
      link: '/fr/book/README.md',
      collapsible: false,
    },
    {
      text: 'Installation',
      link: '/fr/book/installation.md',
      collapsible: false,
      children: ['/fr/book/default_shell.md'],
    },
    {
      text: 'Prise en main',
      link: '/fr/book/getting_started.md',
      collapsible: false,
      children: [
        '/fr/book/quick_tour.md',
        '/fr/book/moving_around.md',
        '/fr/book/thinking_in_nu.md',
        '/fr/book/cheat_sheet.md',
      ],
    },
  ],
};
