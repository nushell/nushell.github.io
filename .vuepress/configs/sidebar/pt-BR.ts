import type { SidebarConfig } from '@vuepress/theme-default';

export const sidebarPtBR: SidebarConfig = {
  '/pt-BR/book/': [
    {
      text: 'Nu Livro',
      collapsible: false,
      children: [
        '/pt-BR/book/instalacao',
        '/pt-BR/book/introducao',
        '/pt-BR/book/explorando',
        '/pt-BR/book/tipos_de_dados',
        '/pt-BR/book/carregando_dados',
        '/pt-BR/book/trabalhando_com_tabelas',
        '/pt-BR/book/pipeline',
        '/pt-BR/book/line_editor',
        '/pt-BR/book/metadados',
        '/pt-BR/book/shells_em_shells',
        '/pt-BR/book/escapando',
        '/pt-BR/book/plugins',
      ],
    },
  ],
  '/blog/': false,
};
