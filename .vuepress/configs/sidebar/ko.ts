import type { SidebarConfig } from '@vuepress/theme-default';
import type { commandCategories } from './command_categories';

export const sidebarKo: SidebarConfig = {
  '/ko/book/': [
    {
      text: '소개',
      link: '/ko/book/README.md',
      collapsible: false,
    },
    {
      text: '시작하기',
      link: '/ko/book/getting_started.md',
      collapsible: false,
      children: [
        '/ko/book/installation',
        '/ko/book/moving_around',
        '/ko/book/thinking_in_nushell',
      ],
    },
    {
      text: 'Nu 기본',
      link: '/ko/book/nu_fundamentals.md',
      collapsible: false,
      children: [
        '/ko/book/types_of_data',
        '/ko/book/loading_data',
        '/ko/book/pipeline.md',
        '/ko/book/working_with_strings',
        '/ko/book/working_with_lists',
        '/ko/book/working_with_tables',
      ],
    },
    {
      text: 'Nu에서 프로그래밍하기',
      link: '/ko/book/programming_in_nu.md',
      collapsible: false,
      children: [
        '/ko/book/custom_commands',
        '/ko/book/aliases',
        '/ko/book/operators',
        '/ko/book/variables_and_subexpressions.md',
        '/ko/book/scripts',
        '/ko/book/overlays',
        '/ko/book/command_signature',
      ],
    },
    {
      text: '셸로서의 Nu',
      link: '/ko/book/nu_as_a_shell.md',
      collapsible: false,
      children: [
        '/ko/book/configuration',
        '/ko/book/environment',
        '/ko/book/escaping',
        '/ko/book/3rdpartyprompts',
        '/ko/book/custom_completions',
        '/ko/book/coloring_and_theming',
        '/ko/book/hooks',
        '/ko/book/background_jobs.md',
      ],
    },
    {
      text: 'Nu로 전환하기',
      link: '/ko/book/coming_to_nu.md',
      collapsible: false,
      children: ['/ko/book/coming_from_bash', '/ko/book/command_reference'],
    },
    {
      text: '(단지) 고급 사용자를 위한 것은 아닙니다',
      link: '/ko/book/advanced.md',
      collapsible: false,
      children: ['/ko/book/plugins', '/ko/book/metadata.md'],
    },
  ],
};
