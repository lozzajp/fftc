<script setup lang="ts">
import { useMarkdownTree } from './composables/useMarkdownTree'
import TreeView from './components/TreeView.vue'

const { tree, loading, error } = useMarkdownTree('/data/content.md')
</script>

<template>
  <main>
    <h1>Final Fantasy: Taxonomic Compendium</h1>
    <p v-if="loading">Loading content tree…</p>
    <p v-else-if="error" class="error">{{ error }}</p>
    <TreeView v-else :nodes="tree" />
  </main>
</template>

<style scoped>
main {
  max-width: 720px;
  margin: 2rem auto;
  padding: 0 1rem;
  font-family: system-ui, sans-serif;
}
.error {
  color: #c00;
}
</style>
