import type { TreeNode } from '../models/tree'
import { normalizeCode } from './resolveRef'

export interface GroupNode {
  path: string
  label: string
  breadcrumb: string[]
}

export function findGroupNodes(roots: TreeNode[], isGroup: (node: TreeNode) => boolean): GroupNode[] {
  const results: GroupNode[] = []

  function walk(nodes: TreeNode[], pathSegments: string[], labelTrail: string[]) {
    for (const node of nodes) {
      const segment = normalizeCode(node.code)
      const nextPath = segment ? [...pathSegments, segment] : pathSegments
      const nextLabelTrail = [...labelTrail, node.label]

      if (isGroup(node)) {
        results.push({ path: nextPath.join('.'), label: node.label, breadcrumb: nextLabelTrail })
      } else {
        walk(node.children, nextPath, nextLabelTrail)
      }
    }
  }

  walk(roots, [], [])
  return results
}
