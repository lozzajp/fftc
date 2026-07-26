import type { TreeNode } from '../models/tree'

export function normalizeCode(code: string | undefined): string | undefined {
  if (!code) return undefined
  return code.replace(/^[[(]/, '').replace(/[\])]$/, '')
}

export interface ResolvedRef {
  node: TreeNode
  trail: TreeNode[]
}

export function resolveRef(roots: TreeNode[], rawRefCode: string | undefined): ResolvedRef | undefined {
  const normalized = normalizeCode(rawRefCode)
  if (!normalized) return undefined

  const segments = normalized.split('.')
  let candidates = roots
  const trail: TreeNode[] = []

  for (const segment of segments) {
    const match = candidates.find((n) => normalizeCode(n.code) === segment)
    if (!match) return undefined
    trail.push(match)
    candidates = match.children
  }

  const node = trail[trail.length - 1]
  if (!node) return undefined

  return { node, trail }
}

export function isContentRef(code: string | undefined): boolean {
  const normalized = normalizeCode(code)
  return normalized !== undefined && normalized.startsWith('FFC.')
}
