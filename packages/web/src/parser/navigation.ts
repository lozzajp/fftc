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

export interface SelectableNode {
  path: string
  label: string
  breadcrumb: string[]
  titlePaths: string[]
}

export function findSelectableNodes(contentRoots: TreeNode[]): SelectableNode[] {
  const titleNodes = findTitleNodes(contentRoots)
  const rootCode = normalizeCode(contentRoots[0]?.code)

  const universeGroups = new Map<string, { label: string; breadcrumb: string[]; titlePaths: string[] }>()
  const standalone: SelectableNode[] = []

  for (const title of titleNodes) {
    const segments = title.path.split('.')
    const parentPath = segments.slice(0, -1).join('.')

    standalone.push({ path: title.path, label: title.label, breadcrumb: title.breadcrumb, titlePaths: [title.path] })

    if (rootCode !== undefined && parentPath !== rootCode) {
      const existing = universeGroups.get(parentPath)
      if (existing) {
        existing.titlePaths.push(title.path)
      } else {
        universeGroups.set(parentPath, {
          label: title.breadcrumb[title.breadcrumb.length - 2] ?? parentPath,
          breadcrumb: title.breadcrumb.slice(0, -1),
          titlePaths: [title.path],
        })
      }
    }
  }

  const universeEntries: SelectableNode[] = [...universeGroups.entries()].map(([path, g]) => ({
    path,
    label: g.label,
    breadcrumb: g.breadcrumb,
    titlePaths: g.titlePaths,
  }))

  const sorted = [...universeEntries, ...standalone].sort((a, b) => a.path.localeCompare(b.path))

  const allEntry: SelectableNode = {
    path: ALL_PATH,
    label: 'All Final Fantasy',
    breadcrumb: ['All Final Fantasy'],
    titlePaths: titleNodes.map((t) => t.path),
  }

  return [allEntry, ...sorted]
}

export const ALL_PATH = '__all__'
