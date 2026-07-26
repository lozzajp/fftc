<script setup lang="ts">
import { useMarkdownTree } from '../composables/useMarkdownTree'
import TreeView from '../components/TreeView.vue'

const { tree, loading, error } = useMarkdownTree('/data/content.md')
</script>

<template>
  <section>
    <h1>Content</h1>
    <p v-if="loading">Loading content tree…</p>
    <p v-else-if="error" class="error">{{ error }}</p>
    <TreeView v-else :nodes="tree" />
  </section>
</template>

<style scoped>
.error {
  color: #c00;
}
</style>
