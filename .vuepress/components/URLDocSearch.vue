<template>
  <DocSearch :options="docsearchOptions" />
</template>

<script setup lang="ts">
import { DocSearch, DocSearchOptions } from '@vuepress/plugin-docsearch/client';
import {
  useDebounceFn,
  useElementVisibility,
  useEventListener,
} from '@vueuse/core';
import { onMounted, ref, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';

const SEARCH_KEY = 'search';
const SEARCH_INPUT_ID = 'docsearch-input';

const router = useRouter();
const route = useRoute();

const docsearchOptions = ref<DocSearchOptions>({});
const inputElement = ref<HTMLInputElement>();
const isNavigating = ref(false);

// Handle initial search query, if one is set
onMounted(async () => {
  const query = new URL(window.location.href).searchParams.get(SEARCH_KEY);
  if (query) {
    (document.querySelector('.DocSearch-Button') as HTMLButtonElement).click();
    // Set value in the input element once it appears
    performInitialQuery(query);
  }
});

function performInitialQuery(query: string) {
  const found = document.getElementById(SEARCH_INPUT_ID);
  if (found) {
    inputElement.value = found as HTMLInputElement;
    inputElement.value.value = query;
    inputElement.value.dispatchEvent(new Event('input'));
  } else {
    setTimeout(() => performInitialQuery(query), 50);
  }
}

// There's some debounce builtin to docsearch, this mimics that and should
// help prevent browser history from getting filled with partial queries.
const setURLQueryDebounced = useDebounceFn(setURLQuery, 500);

// When the user types a search query, update URL query param accordingly
useEventListener('input', (event) => {
  const target = event.target as HTMLInputElement | undefined;
  const searchQuery = target?.value;
  if (target?.id !== SEARCH_INPUT_ID) {
    return;
  }
  inputElement.value = target;
  setURLQueryDebounced(searchQuery);
});

// Clear the URL query param when search input is reset (i.e. "Clear" button).
useEventListener('reset', (event) => {
  const target = event.target as HTMLFormElement | undefined;
  if (target?.classList.contains('DocSearch-Form')) {
    setURLQuery();
  }
});

// Clear the URL query param when the search modal is dismissed.
// NOTE: newer versions of @docsearch/js also provide a callback option for this.
const inputIsVisible = useElementVisibility(inputElement);
watch(inputIsVisible, (isVisible, wasVisible) => {
  if (wasVisible && !isVisible && !isNavigating.value) {
    setURLQuery();
  }
});

// When a search result is selected, the modal is dismissed and its route is pushed, without `?search=`.
// Track this to avoid running visibility watch logic to clear the URL in this case.
router.beforeEach((route) => {
  if (!route.query[SEARCH_KEY]) {
    isNavigating.value = true;
  }
});
router.afterEach(() => {
  isNavigating.value = false;
});

// Set `?search=` query param; if passed empty string or undefined, clear the param instead.
function setURLQuery(newSearch?: string) {
  const { path, query: oldQuery, hash } = route;
  const { [SEARCH_KEY]: oldSearch, ...query } = oldQuery;

  // Replace the history entry if the only the search query changed, to avoid
  // polluting the user's browser history with partial/incomplete search queries.
  const replace = oldSearch !== undefined || newSearch === undefined;

  if (newSearch) {
    query[SEARCH_KEY] = newSearch;
  }

  router.push({ path, query, hash, replace });
}
</script>
