<template>
  <div ref="playerElement"></div>
</template>

<!-- for opts see https://docs.asciinema.org/manual/player/options/ -->

<script setup>
import { ref, onMounted } from 'vue';
import { ClientOnly } from 'vuepress/client';

const props = defineProps({
  castUrl: {
    type: String,
    required: true,
  },
  opts: {
    type: Object,
    required: false,
  },
});

const playerElement = ref(null);

onMounted(async () => {
  const { create } = await import('asciinema-player');
  create(props.castUrl, playerElement.value, { theme: 'tango', ...props.opts });
});
</script>
