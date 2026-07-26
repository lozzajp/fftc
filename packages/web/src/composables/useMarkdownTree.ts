import { ref, type Ref } from 'vue'
import { parseIndentedTree } from '../parser/parseTree'
import type { TreeNode } from '../models/tree'

export function useMarkdownTree(path: string) {
  const tree: Ref<TreeNode[]> = ref([])
  const loading = ref(true)
  const error = ref<string | null>(null)

  const resolvedPath = `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`

  fetch(resolvedPath)
    .then((res) => {
      if (!res.ok)
        throw new Error(`Failed to fetch ${resolvedPath}: ${res.status} ${res.statusText}`)
      return res.text()
    })
    .then((text) => {
      tree.value = parseIndentedTree(text)
    })
    .catch((err: unknown) => {
      error.value = err instanceof Error ? err.message : String(err)
    })
    .finally(() => {
      loading.value = false
    })

  return { tree, loading, error }
}
