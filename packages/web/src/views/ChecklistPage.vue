<script setup lang="ts">
import { computed, ref } from 'vue'
import { useMarkdownTree } from '../composables/useMarkdownTree'
import { findSelectableNodes, ALL_PATH } from '../parser/navigation'
import { buildChecklistTitles, checklistToMarkdown } from '../parser/checklist'

const { tree: contentRoots, loading: contentLoading, error: contentError } = useMarkdownTree('/data/content.md')
const { tree: releaseRoots, loading: releasesLoading, error: releasesError } = useMarkdownTree('/data/releases.md')

const loading = computed(() => contentLoading.value || releasesLoading.value)
const error = computed(() => contentError.value ?? releasesError.value)

const selectableNodes = computed(() => findSelectableNodes(contentRoots.value))
const selectedPath = ref('')

const selected = computed(() => selectableNodes.value.find((n) => n.path === selectedPath.value))

const checklistTitles = computed(() => {
  if (!selected.value) return []
  return buildChecklistTitles(contentRoots.value, releaseRoots.value, selected.value.titlePaths)
})

const markdown = computed(() => {
  if (!selected.value) return ''
  return checklistToMarkdown(selected.value.label, checklistTitles.value)
})

function download() {
  if (!selected.value) return
  const blob = new Blob([markdown.value], { type: 'text/markdown' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  const filename = selected.value.path === ALL_PATH ? 'all-final-fantasy' : selected.value.path.replace(/\./g, '-')
  a.download = `${filename}-checklist.md`
  a.click()
  URL.revokeObjectURL(url)
}
</script>

<template>
  <section>
    <h1>Checklist Creator</h1>

    <p v-if="loading">Loading…</p>
    <p v-else-if="error" class="error">{{ error }}</p>

    <template v-else>
      <p class="hint">Pick a title or collection.</p>
      <select v-model="selectedPath" class="picker">
        <option value="" disabled>Select a title or universe…</option>
        <option v-for="node in selectableNodes" :key="node.path" :value="node.path">
          {{ node.breadcrumb.join(' / ') }}{{ node.titlePaths.length > 1 && node.path !== ALL_PATH ? ' (all)' : '' }}
        </option>
      </select>

      <template v-if="selected">
        <div class="toolbar">
          <button type="button" @click="download">Download .md</button>
        </div>
        <pre class="preview">{{ markdown }}</pre>
      </template>
    </template>
  </section>
</template>

<style scoped>
.hint {
  font-size: 0.9em;
  color: #666;
}
.picker {
  display: block;
  width: 100%;
  max-width: 32rem;
  padding: 0.4rem;
  margin: 0.5rem 0 1rem;
}
.toolbar {
  margin-bottom: 0.75rem;
}
.toolbar button {
  padding: 0.4rem 0.9rem;
  cursor: pointer;
}
.preview {
  white-space: pre-wrap;
  background: #f7f7f7;
  border: 1px solid #ddd;
  border-radius: 6px;
  padding: 1rem;
  max-height: 60vh;
  overflow: auto;
}
.error {
  color: #c00;
}
</style>
