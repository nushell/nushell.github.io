<template>
  (<a :href="prLink" target="_blank">#{{ pr }}</a
  >)
</template>

<script setup lang="ts">
const props = defineProps({
  pr: {
    type: Number,
    required: true,
  },
});

const prLink = 'https://github.com/nushell/nushell/pull/' + props.pr;
</script>
