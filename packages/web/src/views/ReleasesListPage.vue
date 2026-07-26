<script setup lang="ts">
import { computed } from 'vue'
import { useMarkdownTree } from '../composables/useMarkdownTree'
import { findReleaseNodes } from '../parser/navigation'

const { tree: releaseRoots, loading, error } = useMarkdownTree('/data/releases.md')
const releases = computed(() => findReleaseNodes(releaseRoots.value))

// Drop the root node's own label ("Final Fantasy Releases") — same for every entry, adds noise.
function displayBreadcrumb(breadcrumb: string[]): string {
  return breadcrumb.slice(1).join(' / ')
}
</script>

<template>
  <section>
    <p><RouterLink to="/">← Home</RouterLink></p>
    <h1>Releases</h1>
    <p class="hint">Look up what a specific release/bundle contains.</p>

    <p v-if="loading">Loading…</p>
    <p v-else-if="error" class="error">{{ error }}</p>
    <ul v-else class="picker">
      <li v-for="release in releases" :key="release.path">
        <RouterLink :to="`/release/${release.path}`">{{ displayBreadcrumb(release.breadcrumb) }}</RouterLink>
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
