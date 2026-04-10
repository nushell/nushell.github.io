<template>
  <p style="font-size: 0.8rem">
    PR <a :href="prLink" target="_blank">#{{ pr }}</a> by
    <a :href="userLink" target="_blank">@{{ user }}</a>
  </p>
</template>

<style scoped>
p {
  font-size: 0.8rem;
  margin: 0;
}
</style>

<script setup lang="ts">
const props = defineProps({
  pr: {
    type: Number,
    required: true,
  },
  user: {
    type: String,
    required: true,
  },
});

const prLink = 'https://github.com/nushell/nushell/pull/' + props.pr;
const userLink = 'https://github.com/' + props.user;
</script>
