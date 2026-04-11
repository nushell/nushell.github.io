<template>
  <div class="hint-container important">
    <p class="hint-container-title">Experimental option</p>
    <p>
      This feature is behind an experimental option. Run Nushell with
      <code>--experimental-option={{ option }}</code> or set before running
      Nushell the environment variable to
      <code>NU_EXPERIMENTAL_OPTIONS={{ option }}</code
      >.
    </p>
  </div>
</template>

<style scoped>
code {
  white-space: nowrap;
}
</style>

<script setup lang="ts">
const { option } = defineProps({
  option: {
    type: String,
    required: true,
  },
});
</script>
