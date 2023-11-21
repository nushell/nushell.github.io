import type { SidebarConfig } from '@vuepress/theme-default';

export const sidebarEs: SidebarConfig = {
  '/es/book/': [
    {
      text: 'Nu Libro',
      collapsible: false,
      children: [
        'README.md',
        'instalacion',
        'explorando',
        'tipos_de_datos',
        'cargando_datos', // "trabajando_con_listas"
        'trabajando_con_tablas',
        'pipeline',
        'configuracion', // "custom_commands"
        'aliases', // "operadores"
        'matematicas', // "variables_y_subexpresiones"
        'entorno', // "scripts"
        'metadatos',
        'shells_en_shells',
        'escapando',
        'plugins', // "dataframes"
        'llegando_de_bash',
        'mapa_nushell',
        'mapa_imperativo_nushell',
        'mapa_funcional_nushell',
        'mapa_operador_nushell',
        '/book/command_reference.md',
      ],
    },
  ],
};
