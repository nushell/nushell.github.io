/**
 * Client app enhancement file.
 *
 * https://v2.vuepress.vuejs.org/advanced/cookbook/usage-of-client-config.html
 */

import { defineClientConfig } from 'vuepress/client';
import BlogPosts from './components/BlogPosts.vue';
import JumpToc from './components/JumpToc.vue';
import PrBy from './components/PrBy.vue';
import ReleaseToc from './components/ReleaseToc.vue';

export default defineClientConfig({
  enhance({ app }) {
    app.component('BlogPosts', BlogPosts);
    app.component('JumpToc', JumpToc);
    app.component('PrBy', PrBy);
    app.component('ReleaseToc', ReleaseToc);
  },
});
