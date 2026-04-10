/**
 * Client app enhancement file.
 *
 * https://v2.vuepress.vuejs.org/advanced/cookbook/usage-of-client-config.html
 */

import { defineClientConfig } from 'vuepress/client';
import AsciinemaPlayer from './components/AsciinemaPlayer.vue';
import BlogPosts from './components/BlogPosts.vue';
import ExperimentalOption from './components/ExperimentalOption.vue';
import JumpToc from './components/JumpToc.vue';
import PrBy from './components/PrBy.vue';
import ReleaseToc from './components/ReleaseToc.vue';

export default defineClientConfig({
  enhance({ app }) {
    app.component('AsciinemaPlayer', AsciinemaPlayer);
    app.component('BlogPosts', BlogPosts);
    app.component('ExperimentalOption', ExperimentalOption);
    app.component('JumpToc', JumpToc);
    app.component('PrBy', PrBy);
    app.component('ReleaseToc', ReleaseToc);
  },
});
