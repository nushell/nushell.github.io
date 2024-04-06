import type { SidebarConfig } from '@vuepress/theme-default';

export const sidebarZhCN: SidebarConfig = {
  '/zh-CN/book/': [
    {
      text: '入门篇',
      collapsible: false,
      children: [
        '/zh-CN/book/README.md',
        '/zh-CN/book/installation',
        '/zh-CN/book/thinking_in_nu',
        '/zh-CN/book/moving_around',
      ],
    },
    {
      text: 'Nu 基础篇',
      collapsible: false,
      children: [
        '/zh-CN/book/types_of_data',
        '/zh-CN/book/loading_data',
        '/zh-CN/book/working_with_strings',
        '/zh-CN/book/working_with_lists',
        '/zh-CN/book/working_with_tables',
        '/zh-CN/book/pipelines',
        '/zh-CN/book/command_reference',
      ],
    },
    {
      text: 'Nushell 编程',
      collapsible: false,
      children: [
        '/zh-CN/book/custom_commands',
        '/zh-CN/book/aliases',
        '/zh-CN/book/operators',
        '/zh-CN/book/variables_and_subexpressions',
        '/zh-CN/book/scripts',
        '/zh-CN/book/modules',
        '/zh-CN/book/overlays',
      ],
    },
    {
      text: 'Nu 作为 Shell 使用',
      collapsible: false,
      children: [
        '/zh-CN/book/configuration',
        '/zh-CN/book/environment',
        '/zh-CN/book/stdout_stderr_exit_codes',
        '/zh-CN/book/escaping',
        '/zh-CN/book/3rdpartyprompts',
        '/zh-CN/book/shells_in_shells',
        '/zh-CN/book/line_editor',
        '/zh-CN/book/externs',
        '/zh-CN/book/custom_completions',
        '/zh-CN/book/coloring_and_theming',
        '/zh-CN/book/hooks.md',
      ],
    },
    {
      text: '迁移到 Nu',
      collapsible: false,
      children: [
        '/zh-CN/book/coming_from_bash',
        '/zh-CN/book/nushell_map',
        '/zh-CN/book/nushell_map_imperative',
        '/zh-CN/book/nushell_map_functional',
        '/zh-CN/book/nushell_operator_map',
      ],
    },
    {
      text: '高级篇',
      collapsible: false,
      children: [
        '/zh-CN/book/dataframes',
        '/zh-CN/book/metadata',
        '/zh-CN/book/creating_errors',
        '/zh-CN/book/parallelism',
        '/zh-CN/book/plugins',
      ],
    },
  ],
};
