import type { SidebarConfig } from '@vuepress/theme-default';

export const sidebarEs: SidebarConfig = {
  '/es/book/': [
    {
      text: 'Nu Libro',
      collapsible: false,
      children: [
        '/es/book/README.md',
        '/es/book/instalacion',
        '/es/book/explorando',
        '/es/book/tipos_de_datos',
        '/es/book/cargando_datos', // "trabajando_con_listas"
        '/es/book/trabajando_con_tablas',
        '/es/book/pipeline',
        '/es/book/configuracion', // "custom_commands"
        '/es/book/aliases', // "operadores"
        '/es/book/matematicas', // "variables_y_subexpresiones"
        '/es/book/entorno', // "scripts"
        '/es/book/metadatos',
        '/es/book/shells_en_shells',
        '/es/book/escapando',
        '/es/book/plugins', // "dataframes"
        '/es/book/llegando_de_bash',
        '/es/book/mapa_nushell',
        '/es/book/mapa_imperativo_nushell',
        '/es/book/mapa_funcional_nushell',
        '/es/book/mapa_operador_nushell',
      ],
    },
  ],
  '/blog/': false,
};
