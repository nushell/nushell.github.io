import type { SidebarConfig } from '@vuepress/theme-default';
import type { commandCategories } from './command_categories';

export const sidebarDe: SidebarConfig = {
  '/de/book/': [
    {
      text: 'Einleitung',
      link: '/book/de/README.md',
      collapsible: false,
    },
    {
      text: 'Erste Schritte',
      link: '/book/de/getting_started.md',
      collapsible: false,
      children: [
        '/book/de/installation',
        '/book/de/moving_around',
        '/book/de/thinking_in_nushell',
      ],
    },
    {
      text: 'Nu Grundlagen',
      link: '/book/de/nu_fundamentals.md',
      collapsible: false,
      children: [
        '/book/de/types_of_data',
        '/book/de/loading_data',
        '/book/de/pipeline.md',
        '/book/de/working_with_strings',
        '/book/de/working_with_lists',
        '/book/de/working_with_tables',
      ],
    },
    {
      text: 'Programmieren in Nu',
      link: '/book/de/programming_in_nu.md',
      collapsible: false,
      children: [
        '/book/de/eigene_befehle',
        '/book/de/aliase',
        '/book/de/variablen_und_unterausdruecke',
        '/book/de/scripts',
        '/book/de/overlays',
        '/book/de/command_signature',
      ],
    },
    {
      text: 'Nu als Shell',
      link: '/book/de/nu_as_a_shell.md',
      collapsible: false,
      children: [
        '/book/de/konfiguration',
        '/book/de/environment',
        '/book/de/escaping',
        '/book/de/3rdpartyprompts',
        '/book/de/custom_completions',
        '/book/de/coloring_and_theming',
        '/book/de/hooks',
        '/book/de/background_task.md',
      ],
    },
    {
      text: 'Wechsel zu Nu',
      link: '/book/de/coming_to_nu.md',
      collapsible: false,
      children: [
        '/book/de/von_bash_kommend',
        '/book/de/mathematik',
        '/book/de/command_reference',
      ],
    },
    {
      text: '(Nicht nur für) Fortgeschrittene',
      link: '/book/de/advanced.md',
      collapsible: false,
      children: [
        '/book/de/plugins',
      ],
    },
  ],
};
