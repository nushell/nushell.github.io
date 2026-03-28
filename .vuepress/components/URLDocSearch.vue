<template>
  <DocSearch :options="docsearchOptions" />
</template>

<script setup lang="ts">
import { DocSearch, DocSearchOptions } from '@vuepress/plugin-docsearch/client';
import { useDebounceFn, useEventListener } from '@vueuse/core';
import { onMounted, Ref, ref } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const SEARCH_KEY = 'search';
const docsearchOptions: Ref<DocSearchOptions> = ref({});
const router = useRouter();
const route = useRoute();

// Handle initial search query, if one is set
onMounted(() => {
  const query = new URL(window.location.href).searchParams.get(SEARCH_KEY);
  if (query) {
    docsearchOptions.value.initialQuery = query;
    (document.querySelector('.DocSearch-Button') as HTMLButtonElement).click();
  }
});

// There's some debounce builtin to docsearch, this mimics that and should
// help prevent browser history from getting filled with partial queries.
const inputHandler = useDebounceFn(handleSearchInput, 500);
useEventListener('input', (event) => inputHandler(event as InputEvent));

// Update the URL bar when the search input changes.
function handleSearchInput(event: InputEvent) {
  const target = event.target as HTMLInputElement | undefined;
  const searchQuery = target?.value;
  if (target?.id !== 'docsearch-input' || !searchQuery) {
    return;
  }

  // If we had already started a search, replace it instead of appending
  const { path, query: routeQuery } = route;
  const replace = routeQuery?.hasOwnProperty(SEARCH_KEY);
  const query = { ...routeQuery }; // NOTE: must copy the query object
  query[SEARCH_KEY] = searchQuery;

  router.push({ path, query: { ...query }, replace });
}
</script>
