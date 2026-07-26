<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useMarkdownTree } from '../composables/useMarkdownTree'
import { resolveRef } from '../parser/resolveRef'
import ReleaseTree from '../components/ReleaseTree.vue'

const route = useRoute()
const releasePath = computed(() => String(route.params.path))

const { tree: contentRoots, loading: contentLoading, error: contentError } = useMarkdownTree('/data/content.md')
const { tree: releaseRoots, loading: releasesLoading, error: releasesError } = useMarkdownTree('/data/releases.md')

const loading = computed(() => contentLoading.value || releasesLoading.value)
const error = computed(() => contentError.value ?? releasesError.value)

const resolvedRelease = computed(() => resolveRef(releaseRoots.value, releasePath.value))
</script>

<template>
  <section>
    <p><RouterLink to="/">← Home</RouterLink></p>

    <p v-if="loading">Loading…</p>
    <p v-else-if="error" class="error">{{ error }}</p>

    <template v-else-if="resolvedRelease">
      <h1>{{ resolvedRelease.node.label }}</h1>
      <code class="code">{{ releasePath }}</code>
      <ReleaseTree :nodes="resolvedRelease.node.children" :content-roots="contentRoots" />
    </template>

    <p v-else class="error">Unknown release: {{ releasePath }}</p>
  </section>
</template>

<style scoped>
.code {
  font-size: 0.8em;
  color: #666;
  background: rgba(128, 128, 128, 0.15);
  padding: 0.1rem 0.5rem;
  border-radius: 3px;
}
.error {
  color: #c00;
}
</style>
