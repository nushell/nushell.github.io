import type { SidebarConfig } from '@vuepress/theme-default';

export const sidebarDe: SidebarConfig = {
  '/de/book/': [
    {
      text: 'Nu Handbuch (0.59+)',
      collapsible: false,
      children: [
        'README.md',
        'installation',
        'thinking_in_nushell',
        'moving_around',
        'types_of_data',
        'loading_data',
        'working_with_strings',
        'working_with_lists',
        'working_with_tables',
        'pipeline.md',
        'konfiguration',
        'environment',
        '3rdpartyprompts',
        'eigene_befehle',
        'aliase',
        'mathematik',
        'variablen_und_unterausdruecke',
        'scripts',
        'escaping',
        'plugins',
        'von_bash_kommend',
        'command_reference',
        'custom_completions',
        'coloring_and_theming',
        'overlays',
        'command_signature',
      ],
    },
  ],
};
