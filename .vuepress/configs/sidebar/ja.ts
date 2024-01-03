import type { SidebarConfig } from '@vuepress/theme-default';

export const sidebarJa: SidebarConfig = {
  '/ja/book/': [
    {
      text: 'Nu Book',
      collapsible: false,
      children: [
        'installation',
        'introduction',
        'moving_around',
        'types_of_data',
        'loading_data',
        'working_with_tables',
        'pipeline',
        'configuration',
        'metadata',
        'shells_in_shells',
        'escaping',
        'plugins',
        '/book/command_reference.md',
      ],
    },
  ],
};
