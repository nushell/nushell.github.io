import type { SidebarConfig } from '@vuepress/theme-default';

export const sidebarZhCN: SidebarConfig = {
  '/zh-CN/book/': [
    {
      text: '入门篇',
      collapsible: false,
      children: [
        'README.md',
        'installation',
        'thinking_in_nu',
        'moving_around',
      ],
    },
    {
      text: 'Nu 基础篇',
      collapsible: false,
      children: [
        'types_of_data',
        'loading_data',
        'working_with_strings',
        'working_with_lists',
        'working_with_tables',
        'pipelines',
        'command_reference',
      ],
    },
    {
      text: 'Nushell 编程',
      collapsible: false,
      children: [
        'custom_commands',
        'aliases',
        'operators',
        'variables_and_subexpressions',
        'scripts',
        'modules',
        'overlays',
      ],
    },
    {
      text: 'Nu 作为 Shell 使用',
      collapsible: false,
      children: [
        'configuration',
        'environment',
        'stdout_stderr_exit_codes',
        'escaping',
        '3rdpartyprompts',
        'shells_in_shells',
        'line_editor',
        'externs',
        'custom_completions',
        'coloring_and_theming',
        'hooks.md',
      ],
    },
    {
      text: '迁移到 Nu',
      collapsible: false,
      children: [
        'coming_from_bash',
        'nushell_map',
        'nushell_map_imperative',
        'nushell_map_functional',
        'nushell_operator_map',
      ],
    },
    {
      text: '高级篇',
      collapsible: false,
      children: [
        'dataframes',
        'metadata',
        'creating_errors',
        'parallelism',
        'plugins',
      ],
    },
  ],
};
