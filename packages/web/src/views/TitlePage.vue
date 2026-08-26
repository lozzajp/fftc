<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useMarkdownTree } from '../composables/useMarkdownTree'
import { resolveRef, normalizeCode } from '../parser/resolveRef'
import { buildContentToReleasesIndex, type ReleaseRef } from '../parser/reverseIndex'

const route = useRoute()
const titlePath = computed(() => String(route.params.path))

const { tree: contentRoots, loading: contentLoading, error: contentError } = useMarkdownTree('/data/content.md')
const { tree: releaseRoots, loading: releasesLoading, error: releasesError } = useMarkdownTree('/data/releases.md')

const loading = computed(() => contentLoading.value || releasesLoading.value)
const error = computed(() => contentError.value ?? releasesError.value)

const resolvedTitle = computed(() => resolveRef(contentRoots.value, titlePath.value))
const reverseIndex = computed(() => buildContentToReleasesIndex(releaseRoots.value))

const breadcrumb = computed(() => resolvedTitle.value?.trail.slice(1).map((n) => n.label) ?? [])

interface DisplayItem {
  label: string
  code: string
  releases: ReleaseRef[]
}
interface DisplayCategory {
  label: string
  items: DisplayItem[]
}

const categories = computed<DisplayCategory[]>(() => {
  const title = resolvedTitle.value
  if (!title) return []

  return title.node.children.map((category) => {
    const categoryCode = normalizeCode(category.code)
    return {
      label: category.label,
      items: category.children.map((item) => {
        const itemCode = normalizeCode(item.code)
        const fullPath = [titlePath.value, categoryCode, itemCode].filter(Boolean).join('.')
        return {
          label: item.label,
          code: fullPath,
          releases: reverseIndex.value.get(fullPath) ?? [],
        }
      }),
    }
  })
})
</script>

<template>
  <section>
    <p v-if="loading">Loading…</p>
    <p v-else-if="error" class="error">{{ error }}</p>

    <template v-else-if="resolvedTitle">
      <h1>{{ breadcrumb.join(' / ') }}</h1>

      <div v-for="category in categories" :key="category.label" class="category">
        <h2>{{ category.label }}</h2>
        <p v-if="!category.items.length" class="hint">Nothing catalogued yet.</p>
        <ul v-else class="items">
          <li v-for="item in category.items" :key="item.code">
            <span class="label">{{ item.label }}</span>
            <span v-if="item.releases.length" class="releases">
              <RouterLink
                v-for="release in item.releases"
                :key="release.path"
                :to="`/release/${release.path}`"
                class="release-badge"
              >
                {{ release.label }}
              </RouterLink>
            </span>
            <span v-else class="no-release">no known release</span>
          </li>
        </ul>
      </div>
    </template>

    <p v-else class="error">Unknown title: {{ titlePath }}</p>
  </section>
</template>

<style scoped>
.category {
  margin-top: 1.5rem;
}
.category h2 {
  font-size: 1.05rem;
  border-bottom: 1px solid #eee;
  padding-bottom: 0.25rem;
}
.items {
  list-style: none;
  padding: 0;
  margin: 0;
}
.items li {
  margin: 0.4rem 0;
  display: flex;
  align-items: baseline;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.label {
  font-weight: 500;
}
.releases {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
}
.release-badge {
  font-size: 0.8em;
  background: rgba(42, 122, 42, 0.12);
  color: #2a5a2a;
  padding: 0.1rem 0.5rem;
  border-radius: 999px;
  text-decoration: none;
}
.release-badge:hover {
  background: rgba(42, 122, 42, 0.22);
}
.no-release {
  font-size: 0.8em;
  color: #999;
  font-style: italic;
}
.hint {
  font-size: 0.85em;
  color: #666;
}
.error {
  color: #c00;
}
</style>
