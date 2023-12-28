import type { SidebarConfig } from '@vuepress/theme-default';
import type { commandCategories } from './command_categories';

export const sidebarDe: SidebarConfig = {
  '/de/book/': [
    {
      text: 'Einleitung',
      link: '/de/book/README.md',
      collapsible: false,
    },
    {
      text: 'Erste Schritte',
      link: '/de/book/getting_started.md',
      collapsible: false,
      children: [
        '/de/book/installation',
        '/de/book/moving_around',
        '/de/book/thinking_in_nushell',
      ],
    },
    {
      text: 'Nu Grundlagen',
      link: '/de/book/nu_fundamentals.md',
      collapsible: false,
      children: [
        '/de/book/types_of_data',
        '/de/book/loading_data',
        '/de/book/pipeline.md',
        '/de/book/working_with_strings',
        '/de/book/working_with_lists',
        '/de/book/working_with_tables',
      ],
    },
    {
      text: 'Programmieren in Nu',
      link: '/de/book/programming_in_nu.md',
      collapsible: false,
      children: [
        '/de/book/custom_commands',
        '/de/book/aliases',
        '/de/book/operators',
        '/de/book/variables_and_subexpressions.md',
        '/de/book/scripts',
        '/de/book/overlays',
        '/de/book/command_signature',
      ],
    },
    {
      text: 'Nu als Shell',
      link: '/de/book/nu_as_a_shell.md',
      collapsible: false,
      children: [
        '/de/book/configuration',
        '/de/book/environment',
        '/de/book/escaping',
        '/de/book/3rdpartyprompts',
        '/de/book/custom_completions',
        '/de/book/coloring_and_theming',
        '/de/book/hooks',
        '/de/book/background_task.md',
      ],
    },
    {
      text: 'Wechsel zu Nu',
      link: '/de/book/coming_to_nu.md',
      collapsible: false,
      children: ['/de/book/coming_from_bash', '/de/book/command_reference'],
    },
    {
      text: '(Nicht nur für) Fortgeschrittene',
      link: '/de/book/advanced.md',
      collapsible: false,
      children: ['/de/book/plugins', '/de/book/metadata.md'],
    },
  ],
};
