<script setup lang="ts">
import { computed } from 'vue'
import { useMarkdownTree } from '../composables/useMarkdownTree'
import { findTitleNodes } from '../parser/navigation'

const { tree: contentRoots, loading, error } = useMarkdownTree('/data/content.md')
const titles = computed(() => findTitleNodes(contentRoots.value))

function displayBreadcrumb(breadcrumb: string[]): string {
  return breadcrumb.slice(1).join(' / ')
}
</script>

<template>
  <section>
    <p><RouterLink to="/">← Home</RouterLink></p>
    <h1>Titles</h1>
    <p class="hint">See every piece of content for an entire title's collection.</p>

    <p v-if="loading">Loading…</p>
    <p v-else-if="error" class="error">{{ error }}</p>
    <ul v-else class="picker">
      <li v-for="title in titles" :key="title.path">
        <RouterLink :to="`/title/${title.path}`">{{ displayBreadcrumb(title.breadcrumb) }}</RouterLink>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.hint {
  font-size: 0.85em;
  color: #666;
  margin-top: -0.5rem;
}
.picker {
  list-style: none;
  padding: 0;
  margin: 0;
}
.picker li {
  margin: 0.4rem 0;
}
.error {
  color: #c00;
}
</style>
