import type { TreeNode } from '../models/tree'

const BULLET_LINE = /^(\s*)-\s+(.*)$/
const CODE_SUFFIX = /`([^`]+)`\s*$/

export function parseIndentedTree(markdown: string): TreeNode[] {
  const roots: TreeNode[] = []
  const stack: { node: TreeNode; depth: number }[] = []

  for (const rawLine of markdown.split(/\r?\n/)) {
    if (!rawLine.trim()) continue

    const bulletMatch = rawLine.match(BULLET_LINE)
    if (!bulletMatch) continue

    const indent = bulletMatch[1] ?? ''
    const rest = bulletMatch[2] ?? ''
    const depth = Math.floor(indent.length / 2)

    let label = rest.trim()
    let code: string | undefined

    const codeMatch = label.match(CODE_SUFFIX)
    if (codeMatch && codeMatch.index !== undefined) {
      code = codeMatch[1]
      label = label.slice(0, codeMatch.index).trim()
    }

    const node: TreeNode = { label, code, children: [] }

    let top = stack[stack.length - 1]
    while (top && top.depth >= depth) {
      stack.pop()
      top = stack[stack.length - 1]
    }

    if (top) {
      top.node.children.push(node)
    } else {
      roots.push(node)
    }

    stack.push({ node, depth })
  }

  return roots
}
