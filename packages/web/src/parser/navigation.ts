import type { TreeNode } from '../models/tree'
import { normalizeCode, isContentRef } from './resolveRef'
import { findGroupNodes, type GroupNode } from './findGroupNodes'

const CATEGORY_CODES = new Set(['MG', 'MM', 'EC', 'SG', 'EM', 'RM', 'SC'])

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

export interface SelectableNode {
  path: string
  label: string
  breadcrumb: string[]
  titlePaths: string[]
}

export function findSelectableNodes(contentRoots: TreeNode[]): SelectableNode[] {
  const titleNodes = findTitleNodes(contentRoots)
  const rootCode = normalizeCode(contentRoots[0]?.code)

  const seenUniverses = new Set<string>()
  const entries: SelectableNode[] = []

  for (const title of titleNodes) {
    const segments = title.path.split('.')
    const parentPath = segments.slice(0, -1).join('.')

    if (rootCode !== undefined && parentPath !== rootCode && !seenUniverses.has(parentPath)) {
      seenUniverses.add(parentPath)
      const universeTitlePaths = titleNodes
        .filter((t) => t.path.split('.').slice(0, -1).join('.') === parentPath)
        .map((t) => t.path)
      entries.push({
        path: parentPath,
        label: title.breadcrumb[title.breadcrumb.length - 2] ?? parentPath,
        breadcrumb: title.breadcrumb.slice(0, -1),
        titlePaths: universeTitlePaths,
      })
    }

    entries.push({ path: title.path, label: title.label, breadcrumb: title.breadcrumb, titlePaths: [title.path] })
  }

  const allEntry: SelectableNode = {
    path: ALL_PATH,
    label: 'All Final Fantasy',
    breadcrumb: ['All Final Fantasy'],
    titlePaths: titleNodes.map((t) => t.path),
  }

  return [allEntry, ...entries]
}

export const ALL_PATH = '__all__'
