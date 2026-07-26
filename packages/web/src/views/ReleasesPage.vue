<script setup lang="ts">
import { computed } from 'vue'
import { useMarkdownTree } from '../composables/useMarkdownTree'
import ReleaseTree from '../components/ReleaseTree.vue'

const { tree: contentRoots, loading: contentLoading, error: contentError } = useMarkdownTree('/data/content.md')
const { tree: releaseRoots, loading: releasesLoading, error: releasesError } = useMarkdownTree('/data/releases.md')

const loading = computed(() => contentLoading.value || releasesLoading.value)
const error = computed(() => contentError.value ?? releasesError.value)
</script>

<template>
  <section>
    <h1>Releases</h1>
    <p v-if="loading">Loading releases…</p>
    <p v-else-if="error" class="error">{{ error }}</p>
    <ReleaseTree v-else :nodes="releaseRoots" :content-roots="contentRoots" />
  </section>
</template>

<style scoped>
.error {
  color: #c00;
}
</style>
