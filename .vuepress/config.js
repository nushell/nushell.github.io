import path from 'path';
import { defineUserConfig } from '@vuepress/cli';
import { gitPlugin } from '@vuepress/plugin-git';
import { feedPlugin } from 'vuepress-plugin-feed2';
import { defaultTheme } from '@vuepress/theme-default';
import { sitemapPlugin } from 'vuepress-plugin-sitemap2';
import { docsearchPlugin } from '@vuepress/plugin-docsearch';
import { backToTopPlugin } from '@vuepress/plugin-back-to-top';
import { mediumZoomPlugin } from '@vuepress/plugin-medium-zoom';

import {
  navbarDe,
  navbarEn,
  navbarEs,
  navbarJa,
  navbarPtBR,
  navbarZhCN,
  sidebarDe,
  sidebarEn,
  sidebarEs,
  sidebarJa,
  sidebarPtBR,
  sidebarZhCN,
} from './configs/index.js';

const compareDate = (dateA, dateB) => {
  if (!dateA || !(dateA instanceof Date)) return 1;
  if (!dateB || !(dateB instanceof Date)) return -1;

  return dateB.getTime() - dateA.getTime();
};

export default defineUserConfig({
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
      '/zh-CN/': {
        selectText: '语言',
        selectLanguageName: '中文',
        editLinkText: '在GitHub上编辑此页面',
        navbar: navbarZhCN,
        sidebar: sidebarZhCN,
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
});
