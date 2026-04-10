<template>
  <ul>
    <li v-for="(item, i) in items" :key="i">
      <span v-html="item.label"></span>

      <NestedList
        v-if="item.children && item.children.length"
        :items="item.children"
      />
    </li>
  </ul>
</template>

<script setup lang="ts">
defineOptions({ name: 'NestedList' });

defineProps({
  items: {
    type: Array<Item>,
    required: true,
  },
});

export interface Item {
  label: String;
  children: Item[];
}
</script>
