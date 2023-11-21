import type { SidebarConfig } from '@vuepress/theme-default';

export const sidebarPtBR: SidebarConfig = {
  '/pt-BR/book/': [
    {
      text: 'Nu Livro',
      collapsible: false,
      children: [
        'instalacao',
        'introducao',
        'explorando',
        'tipos_de_dados',
        'carregando_dados',
        'trabalhando_com_tabelas',
        'pipeline',
        'metadados',
        'shells_em_shells',
        'escapando',
        'plugins',
        '/book/command_reference.md',
      ],
    },
  ],
};
