const path = require('path');
const { gitPlugin } = require('@vuepress/plugin-git');
const { feedPlugin } = require('vuepress-plugin-feed2');
const { defaultTheme } = require('@vuepress/theme-default');
const { sitemapPlugin } = require('vuepress-plugin-sitemap2');
const { docsearchPlugin } = require('@vuepress/plugin-docsearch');
const { backToTopPlugin } = require('@vuepress/plugin-back-to-top');
const { mediumZoomPlugin } = require('@vuepress/plugin-medium-zoom');

const compareDate = (dateA, dateB) => {
  if (!dateA || !(dateA instanceof Date)) return 1;
  if (!dateB || !(dateB instanceof Date)) return -1;

  return dateB.getTime() - dateA.getTime();
};

module.exports = {
  locales: {
    '/': {
      lang: 'English',
      title: 'Nushell',
      description: 'A new type of shell.',
    },
    '/zh-CN/': {
      lang: 'zh-CN',
      title: 'Nushell',
      description: '一种新型的Shell',
    },
    '/de/': {
      lang: 'Deutsch',
      title: 'Nushell',
      description: 'Eine neue Art von Shell.',
    },
    '/es/': {
      lang: 'es',
      title: 'Nushell',
      description: 'Un nuevo tipo de shell.',
    },
    '/ja/': {
      lang: 'ja',
      title: 'Nushell',
      description: '新しいタイプのシェル',
    },
    '/pt-BR/': {
      lang: 'pt-BR',
      title: 'Nushell',
      description: 'Um novo tipo de shell.',
    },
  },
  head: [
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    [
      'meta',
      { name: 'apple-mobile-web-app-status-bar-style', content: 'black' },
    ],
    ['link', { rel: 'icon', href: '/icon.png' }],
  ],
  markdown: {
    code: {
      lineNumbers: false,
    },
    importCode: {
      handleImportPath: (str) =>
        str.replace(/^@snippets/, path.resolve(__dirname, '../snippets')),
    },
  },
  theme: defaultTheme({
    repo: 'nushell/nushell',
    repoLabel: 'GitHub',
    editLinks: true,
    docsRepo: 'nushell/nushell.github.io',
    docsBranch: 'main',
    lastUpdated: false,
    locales: {
      '/': {
        selectText: 'Languages',
        selectLanguageName: 'English',
        editLinkText: 'Edit this page on GitHub',
        navbar: [
          { text: 'Book', link: '/book/' },
          // { text: "Contributor Book", link: "/contributor-book/" },
          { text: 'Cookbook', link: '/cookbook/' },
          { text: 'Blog', link: '/blog/' },
        ],
        sidebar: {
          '/book/': [
            {
              text: 'Getting Started',
              collapsable: false,
              children: [
                '/book/README.md',
                '/book/installation.md',
                '/book/thinking_in_nushell.md',
                '/book/moving_around.md',
              ],
            },
            {
              text: 'Nu Fundamentals',
              collapsable: false,
              children: [
                '/book/types_of_data.md',
                '/book/loading_data.md',
                '/book/working_with_strings.md',
                '/book/working_with_lists.md',
                '/book/working_with_tables.md',
                '/book/pipeline.md',
                '/book/command_reference.md',
              ],
            },
            {
              text: 'Programming in Nu',
              collapsable: false,
              children: [
                '/book/custom_commands.md',
                '/book/aliases.md',
                '/book/operators.md',
                '/book/variables_and_subexpressions.md',
                '/book/scripts.md',
                '/book/modules.md',
                '/book/overlays.md',
              ],
            },
            {
              text: 'Nu as a shell',
              collapsable: false,
              children: [
                '/book/configuration.md',
                '/book/environment.md',
                '/book/stdout_stderr_exit_codes.md',
                '/book/escaping.md',
                '/book/3rdpartyprompts.md',
                '/book/shells_in_shells.md',
                '/book/line_editor.md',
                '/book/externs.md',
                '/book/custom_completions.md',
                '/book/coloring_and_theming.md',
                '/book/hooks.md',
              ],
            },
            {
              text: 'Coming to Nu',
              collapsable: false,
              children: [
                '/book/coming_from_bash.md',
                '/book/nushell_map.md',
                '/book/nushell_map_imperative.md',
                '/book/nushell_map_functional.md',
                '/book/nushell_operator_map.md',
              ],
            },
            {
              text: 'Advanced',
              collapsable: false,
              children: [
                '/book/dataframes.md',
                '/book/metadata.md',
                '/book/creating_errors.md',
                '/book/parallelism.md',
                '/book/plugins.md',
              ],
            },
          ],
          // "/contributor-book/": [
          //   {
          //     text: "Contributor Book",
          //     collapsable: false,
          //     children: [
          //       "",
          //       "philosophy",
          //       "values",
          //       "commands",
          //       "streams",
          //       "metadata",
          //       "plugins",
          //       "shells",
          //     ],
          //   },
          // ],
          '/cookbook/': [
            {
              text: 'Cookbook',
              collapsable: false,
              children: [
                'README.md',
                'setup',
                'help',
                'system',
                'parsing',
                'native_shell_programs',
                'files',
                'git',
                'parsing_git_log',
                'http',
                'misc',
              ],
            },
          ],
        },
      },
      '/de/': {
        selectText: 'Sprachen',
        selectLanguageName: 'Deutsch',
        editLinkText: 'Diese Seite auf GitHub bearbeiten',
        navbar: [
          { text: 'Buch', link: '/de/book/' },
          // { text: "Contributor Book", link: "/contributor-book/" },
          { text: 'Cookbook', link: '/cookbook/' },
          { text: 'Blog', link: '/blog/' },
        ],
        sidebar: {
          '/de/book/': [
            {
              text: 'Nu Handbuch (0.59+)',
              collapsable: false,
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
                'pipelines.md',
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
              ],
            },
          ],
        },
      },
      '/es/': {
        selectText: 'Idiomas',
        selectLanguageName: 'Español',
        editLinkText: 'Edita esta página en GitHub',
        navbar: [
          { text: 'Libro', link: '/es/book/' },
          // { text: "Libro Colaborador", link: "/es/contributor-book/" },
          { text: 'Cookbook', link: '/cookbook/' },
          { text: 'Blog', link: '/blog/' },
        ],
        sidebar: {
          '/es/book/': [
            {
              text: 'Nu Libro',
              collapsable: false,
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
          // "/es/contributor-book/": [
          //   {
          //     text: "Contributor Book",
          //     collapsable: false,
          //     children: [
          //       "introduccion",
          //       "filosofia",
          //       "valores",
          //       "comandos",
          //       "metadatos",
          //     ],
          //   },
          // ],
        },
      },
      '/ja/': {
        selectText: '言語',
        selectLanguageName: '日本語',
        editLinkText: 'GitHubでこのページを編集する',
        navbar: [
          { text: '本', link: '/ja/book/' },
          // { text: "Contributor Book", link: "/contributor-book/" },
          { text: 'Cookbook', link: '/cookbook/' },
          { text: 'Blog', link: '/blog/' },
        ],
        sidebar: {
          '/ja/book/': [
            {
              text: 'Nu 本',
              collapsable: false,
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
        },
      },
      '/pt-BR/': {
        selectText: 'Línguas',
        selectLanguageName: 'Português do Brasil',
        editLinkText: 'Edite esta página no GitHub',
        navbar: [
          { text: 'Livro', link: '/pt-BR/book/' },
          // { text: "Livro de Contribuidor", link: "/pt-BR/contributor-book/" },
          { text: 'Cookbook', link: '/cookbook/' },
          { text: 'Blog', link: '/blog/' },
        ],
        sidebar: {
          '/pt-BR/book/': [
            {
              text: 'Nu Livro',
              collapsable: false,
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
          // "/pt-BR/contributor-book/": [
          //   {
          //     text: "Contributor Book",
          //     collapsable: false,
          //     children: [
          //       "introdução",
          //       "filosofia",
          //       "valores",
          //       "comandos",
          //       "streams",
          //       "metadados",
          //       "plugins",
          //       "shells",
          //     ],
          //   },
          // ],
        },
      },
      '/zh-CN/': {
        selectText: '语言',
        selectLanguageName: '中文',
        editLinkText: '在GitHub上编辑此页面',
        navbar: [
          { text: '书', link: '/zh-CN/book/' },
          // { text: "Contributor Book", link: "/contributor-book/" },
          { text: 'Cookbook', link: '/cookbook/' },
          { text: 'Blog', link: '/blog/' },
        ],
        sidebar: {
          '/zh-CN/book/': [
            {
              text: '入门篇',
              collapsable: false,
              children: [
                'README.md',
                'installation',
                'thinking_in_nushell',
                'moving_around',
              ],
            },
            {
              text: 'Nu 基础篇',
              collapsable: false,
              children: [
                'types_of_data',
                'loading_data',
                'working_with_strings',
                'working_with_lists',
                'working_with_tables',
                'pipeline',
                'command_reference',
              ],
            },
            {
              text: 'Nushell 编程',
              collapsable: false,
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
              collapsable: false,
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
              ],
            },
            {
              text: '迁移到 Nu',
              collapsable: false,
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
              collapsable: false,
              children: [
                'dataframes',
                'metadata',
                'creating_errors',
                'parallelism',
                'plugins',
              ],
            },
          ],
        },
      },
    },
  }),
  plugins: [
    gitPlugin(),
    backToTopPlugin(),
    mediumZoomPlugin(),
    docsearchPlugin({
      appId: 'GHCTOYCW6T',
      indexName: 'nushell',
      apiKey: 'dd6a8f770a42efaed5befa429d167232',
    }),
    feedPlugin({
      rss: true,
      json: true,
      atom: true,
      count: 30,
      hostname: 'https://www.nushell.sh',
      atomOutputFilename: 'feed.atom',
      filter: ({ frontmatter, filePathRelative }) => {
        return (
          frontmatter.feed === true || filePathRelative?.indexOf('blog/') >= 0
        );
      },
      sorter: (a, b) => {
        return compareDate(
          a.data.git?.createdTime
            ? new Date(a.data.git?.createdTime)
            : a.frontmatter.date,
          b.data.git?.createdTime
            ? new Date(b.data.git?.createdTime)
            : b.frontmatter.date
        );
      },
    }),
    sitemapPlugin({
      hostname: 'https://www.nushell.sh/',
    }),
  ],
  onPrepared: async (app) => {
    await app.writeTemp(
      'pages.js',
      `export default ${JSON.stringify(app.pages.map(({ data }) => data))}`
    );
  },
};
