import type { TreeNode } from '../models/tree'
import { normalizeCode, isContentRef } from './resolveRef'
import { findGroupNodes, type GroupNode } from './findGroupNodes'

const CATEGORY_CODES = new Set(['MG', 'EC', 'SG', 'EM', 'RM', 'SC'])

export function findTitleNodes(contentRoots: TreeNode[]): GroupNode[] {
  return findGroupNodes(contentRoots, (node) =>
    node.children.some((c) => {
      const code = normalizeCode(c.code)
      return code !== undefined && CATEGORY_CODES.has(code)
    }),
  )
}

export function findReleaseNodes(releaseRoots: TreeNode[]): GroupNode[] {
  return findGroupNodes(releaseRoots, (node) => node.children.some((c) => isContentRef(c.code)))
}
