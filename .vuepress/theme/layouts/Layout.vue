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
  font-family: 'Source Code Pro', 'Courier New';
  font-size: 16px;
}
</style>

<style>
img.hero {
  border-radius: 10px;
}
</style>
