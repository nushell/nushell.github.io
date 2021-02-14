<template>
  <ParentLayout> </ParentLayout>
</template>

<script>
import ParentLayout from "@parent-theme/layouts/Layout.vue";

export default {
  name: "Layout",
  components: {
    ParentLayout,
  },
};
</script>

<style lang="stylus">
@import url('https://adobe-fonts.github.io/source-code-pro/source-code-pro.css');

code {
  font-family: -apple-system, 'Source Code Pro', sans-serif;
  font-size: 16px;
}
</style>