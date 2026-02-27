<template>
  <NestedList :items="items"></NestedList>
</template>

<script setup lang="ts">
import NestedList, { Item } from './NestedList.vue';
import { ref, onMounted, nextTick } from 'vue';
import { onContentUpdated } from 'vuepress/client';

const items = ref([] as Item[]);

function getHeaders(): NodeListOf<HTMLHeadingElement> {
  return document.querySelectorAll('h1, h2, h3');
}

type OrganizedHeader = {
  element?: HTMLHeadingElement;
  children: OrganizedHeader[];
};
function organizeHeaders(
  headers: HTMLHeadingElement[],
  index: [number] = [0],
  level: number = 1,
): OrganizedHeader {
  const node: OrganizedHeader = { children: [] };

  while (index[0] < headers.length) {
    const header = headers[index[0]];
    const headerLevel = Number(header.tagName.slice(1)); // "H2" -> 2

    // if we hit a header above our current level, we are done here
    if (headerLevel < level) break;

    // if we hit a header deeper than expected, let the caller handle it as children
    if (headerLevel > level) break;

    // headerLevel === level: consume this header and attach its children.
    index[0]++;

    const entry: OrganizedHeader = { element: header, children: [] };

    // children are the following headers with level+1 (and their descendants)
    const childrenTree = organizeHeaders(headers, index, level + 1);
    entry.children = childrenTree.children;

    node.children.push(entry);
  }

  return node;
}

function filterHeaders(root: OrganizedHeader): OrganizedHeader {
  const wanted = [
    'Highlights and themes of this release',
    'Changes',
    'Notes for plugin developers',
    'Hall of fame',
    'Full changelog',
  ].map((section) => section.toLowerCase());

  return {
    ...root,
    children: root.children.filter((section) =>
      wanted.some((wanted) =>
        section.element!.innerText.toLowerCase().startsWith(wanted),
      ),
    ),
  };
}

function generateItem(header: OrganizedHeader): Item {
  let slug = '#' + header.element?.id;
  let content = header.element?.querySelector('span')?.innerHTML;

  const i = content?.lastIndexOf('[');
  if (i !== -1) content = content?.slice(0, i).trim();

  return {
    label: `<em><a href="${slug}">${content}</a></em>`,
    children: header.children.map(generateItem),
  };
}

async function refresh() {
  await nextTick();
  const headers = Array.from(getHeaders());
  const organized = organizeHeaders(headers);
  const filtered = filterHeaders(organized);
  const item = generateItem(filtered);
  items.value = item.children;
}

onMounted(refresh);
onContentUpdated(refresh);
</script>
