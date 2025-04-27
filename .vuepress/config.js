import path from 'node:path';
import { defineUserConfig } from '@vuepress/cli';
import { gitPlugin } from '@vuepress/plugin-git';
import { feedPlugin } from '@vuepress/plugin-feed';
import { viteBundler } from '@vuepress/bundler-vite';
import { shikiPlugin } from '@vuepress/plugin-shiki';
import { defaultTheme } from '@vuepress/theme-default';
import { sitemapPlugin } from '@vuepress/plugin-sitemap';
import { copyCodePlugin } from '@vuepress/plugin-copy-code';
import { docsearchPlugin } from '@vuepress/plugin-docsearch';
import { backToTopPlugin } from '@vuepress/plugin-back-to-top';
import { mediumZoomPlugin } from '@vuepress/plugin-medium-zoom';

import {
  navbarDe,
  navbarEn,
  navbarEs,
  navbarFr,
  navbarJa,
  navbarPtBR,
  navbarRU,
  navbarZhCN,
  sidebarDe,
  sidebarEn,
  sidebarFr,
  sidebarEs,
  sidebarJa,
  sidebarPtBR,
  sidebarRU,
  sidebarZhCN,
} from './configs/index.js';

const compareDate = (dateA, dateB) => {
  if (!dateA || !(dateA instanceof Date)) return 1;
  if (!dateB || !(dateB instanceof Date)) return -1;

  return dateB.getTime() - dateA.getTime();
};

// default env from the deploy GitHub action
// e.g. ciUser = nushell and ciRepo = nushell.github.io
// both default to undefined if the env is undefined
const [ciUser, ciRepo] = process.env.GITHUB_REPOSITORY?.split('/') ?? [];

export default defineUserConfig({
  // set the base URL to ciRepo dir if it's a fork
  // keep the default root if not
  base: ciRepo && ciUser !== 'nushell' ? `/${ciRepo}/` : '/',
  bundler: viteBundler(),
  locales: {
    '/': {
      lang: 'en-US',
      title: 'Nushell',
      description: 'A new type of shell.',
    },
    '/zh-CN/': {
      lang: 'zh-CN',
      title: 'Nushell',
      description: '一种新型的Shell',
    },
    '/de/': {
      lang: 'de-DE',
      title: 'Nushell',
      description: 'Eine neue Art von Shell.',
    },
    '/fr/': {
      lang: 'fr-FR',
      title: 'Nushell',
      description: 'Un nouveau type de shell.',
    },
    '/es/': {
      lang: 'es-ES',
      title: 'Nushell',
      description: 'Un nuevo tipo de shell.',
    },
    '/ja/': {
      lang: 'ja-JP',
      title: 'Nushell',
      description: '新しいタイプのシェル',
    },
    '/pt-BR/': {
      lang: 'pt-BR',
      title: 'Nushell',
      description: 'Um novo tipo de shell.',
    },
    '/ru/': {
      lang: 'ru-RU',
      title: 'Nushell',
      description: 'Новый тип оболочки.',
    },
  },
  head: [
    ["link", { rel: "preload", href: "/fonts/FiraCode-Regular.woff2", as: "font", type: "font/woff2", crossorigin: "anonymous" }]
    ['meta', { name: 'theme-color', content: '#3eaf7c' }],
    ['meta', { name: 'apple-mobile-web-app-capable', content: 'yes' }],
    [
      'meta',
      { name: 'apple-mobile-web-app-status-bar-style', content: 'black' },
    ],
    ['link', { rel: 'icon', href: '/icon.png' }],
  ],
  markdown: {
    importCode: {
      handleImportPath: (str) =>
        str.replace(/^@snippets/, path.resolve(__dirname, '../snippets')),
    },
    highlighter: 'shiki',
  },
  // without this, we attempt to prefetch the whole site 😬
  shouldPrefetch: false,
  colorMode: 'auto',
  theme: defaultTheme({
    markdown: {
      highlighter: 'shiki',
    },
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
        navbar: navbarEn,
        sidebar: sidebarEn,
      },
      '/de/': {
        selectText: 'Sprachen',
        selectLanguageName: 'Deutsch',
        editLinkText: 'Diese Seite auf GitHub bearbeiten',
        navbar: navbarDe,
        sidebar: sidebarDe,
      },
      '/es/': {
        selectText: 'Idiomas',
        selectLanguageName: 'Español',
        editLinkText: 'Edita esta página en GitHub',
        navbar: navbarEs,
        sidebar: sidebarEs,
      },
      '/fr/': {
        selectText: 'Langues',
        selectLanguageName: 'Français',
        editLinkText: 'Modifier la page sur GitHub',
        navbar: navbarFr,
        sidebar: sidebarFr,
      },
      '/ja/': {
        selectText: '言語',
        selectLanguageName: '日本語',
        editLinkText: 'GitHubでこのページを編集する',
        navbar: navbarJa,
        sidebar: sidebarJa,
      },
      '/pt-BR/': {
        selectText: 'Línguas',
        selectLanguageName: 'Português do Brasil',
        editLinkText: 'Edite esta página no GitHub',
        navbar: navbarPtBR,
        sidebar: sidebarPtBR,
      },
      '/ru/': {
        selectText: 'Языки',
        selectLanguageName: 'Русский язык',
        editLinkText: 'Отредактируйте эту страницу на GitHub',
        navbar: navbarRU,
        sidebar: sidebarRU,
      },
      '/zh-CN/': {
        selectText: '语言',
        selectLanguageName: '中文',
        editLinkText: '在GitHub上编辑此页面',
        navbar: navbarZhCN,
        sidebar: sidebarZhCN,
      },
    },
    themePlugins: {
      prismjs: false,
    },
  }),
  plugins: [
    gitPlugin(),
    backToTopPlugin(),
    mediumZoomPlugin(),
    copyCodePlugin({
      locales: {
        '/': {
          copy: 'Copy Codes from code block',
        },
      },
    }),
    shikiPlugin({
      themes: {
        light: 'dark-plus',
        dark: 'dark-plus',
        onedarkpro: 'one-dark-pro', // pre-load one-dark-pro for ansi code blocks
      },
      lineNumbers: 10,
      transformers: [
        // use one-dark-pro theme for ansi code blocks
        {
          preprocess(code, options) {
            if (options.lang == 'ansi') {
              this.options.defaultColor = 'onedarkpro';
              // this doesn't work at the top-level for some reason
              this.options.colorReplacements = {
                // make one-dark-pro background color the same as dark-plus
                '#282c34': '#1e1e1e',
                // HACK: change color of comments, since nu-highlight can't highlight them
                '#abb2bf': '#80858f',
              };
            }
            return code;
          },
        },
      ],
      langs: [
        'csv',
        'nushell',
        'rust',
        'bash',
        'shell',
        'sh',
        'csv',
        'ansi',
        'toml',
        'json',
        'javascript',
        'python',
        'cpp',
        'powershell',
      ],
    }),
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
      filter: ({ frontmatter, filePathRelative }) => {
        return (
          frontmatter.feed === true || filePathRelative?.indexOf('blog/') >= 0
        );
      },
      sorter: (a, b) => {
        const pathDateA = new Date(
          a.path.replace('/blog/', '').substring(0, 10),
        );
        const pathDateB = new Date(
          b.path.replace('/blog/', '').substring(0, 10),
        );
        const effectiveDateA =
          pathDateA != 'Invalid Date'
            ? pathDateA
            : a.frontmatter.date
              ? new Date(a.frontmatter.date)
              : new Date(a.data.git?.createdTime);

        // Determine the effective date for item B
        const effectiveDateB =
          pathDateB != 'Invalid Date'
            ? pathDateB
            : b.frontmatter.date
              ? new Date(b.frontmatter.date)
              : new Date(b.data.git?.createdTime);
        return compareDate(effectiveDateA, effectiveDateB);
      },
    }),
    sitemapPlugin({
      hostname: 'https://www.nushell.sh/',
    }),
  ],
  onPrepared: async (app) => {
    await app.writeTemp(
      'pages.js',
      `export default ${JSON.stringify(app.pages.map(({ data }) => data))}`,
    );
  },
});
