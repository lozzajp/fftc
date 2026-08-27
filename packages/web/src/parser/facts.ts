import type { TreeNode } from '../models/tree'
import { normalizeCode } from './resolveRef'

export interface TimelineSpan {
  start: number
  end: number
}

const TIMELINE_LABEL = /^Timeline Position:\s*(\d+)(?:\s*[-–]\s*(\d+))?\s*$/i

export function buildTimelinePositionIndex(factRoots: TreeNode[]): Map<string, TimelineSpan> {
  const index = new Map<string, TimelineSpan>()

  function walk(nodes: TreeNode[]) {
    for (const node of nodes) {
      const code = normalizeCode(node.code)
      if (code?.startsWith('FFC.')) {
        for (const child of node.children) {
          if (normalizeCode(child.code) !== 'FFF.TIMELINE_POS') continue
          const match = child.label.match(TIMELINE_LABEL)
          if (!match) continue
          const start = Number(match[1])
          const end = match[2] ? Number(match[2]) : start
          index.set(code, { start, end })
        }
      }
      walk(node.children)
    }
  }

  walk(factRoots)
  return index
}
