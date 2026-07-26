import type { TreeNode } from '../models/tree'
import { normalizeCode, isContentRef } from './resolveRef'

export interface ReleaseRef {
  path: string
  label: string
}

export function buildContentToReleasesIndex(releaseRoots: TreeNode[]): Map<string, ReleaseRef[]> {
  const index = new Map<string, ReleaseRef[]>()

  function walk(nodes: TreeNode[], pathSegments: string[], currentRelease: ReleaseRef | undefined) {
    for (const node of nodes) {
      if (isContentRef(node.code)) {
        const contentPath = normalizeCode(node.code)
        if (contentPath && currentRelease) {
          const list = index.get(contentPath) ?? []
          list.push(currentRelease)
          index.set(contentPath, list)
        }
        continue
      }

      const segment = normalizeCode(node.code)
      const nextPath = segment ? [...pathSegments, segment] : pathSegments
      const isReleaseNode = node.children.some((c) => isContentRef(c.code))
      const nextRelease = isReleaseNode ? { path: nextPath.join('.'), label: node.label } : currentRelease

      walk(node.children, nextPath, nextRelease)
    }
  }

  walk(releaseRoots, [], undefined)
  return index
}
