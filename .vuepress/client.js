/**
 * Client app enhancement file.
 *
 * https://v2.vuepress.vuejs.org/advanced/cookbook/usage-of-client-config.html
 */

import { defineClientConfig } from 'vuepress/client';
import BlogPosts from './components/BlogPosts.vue';
import TwinPosts from './components/TwinPosts.vue';

export default defineClientConfig({
  enhance({ app }) {
    app.component('BlogPosts', BlogPosts);
    app.component('TwinPosts', TwinPosts);
  },
});
