import type { TreeNode } from '../models/tree'
import { resolveRef, normalizeCode } from './resolveRef'
import { buildContentToReleasesIndex, type ReleaseRef } from './reverseIndex'
import type { TimelineSpan } from './facts'

export interface ChecklistItem {
  label: string
  code: string
  releases: ReleaseRef[]
  timeline?: TimelineSpan
}

export interface ChecklistCategory {
  label: string
  items: ChecklistItem[]
}

export interface ChecklistTitle {
  path: string
  label: string
  categories: ChecklistCategory[]
}

export function buildChecklistTitles(
  contentRoots: TreeNode[],
  releaseRoots: TreeNode[],
  titlePaths: string[],
  timelineIndex?: Map<string, TimelineSpan>,
): ChecklistTitle[] {
  const reverseIndex = buildContentToReleasesIndex(releaseRoots)

  return titlePaths.flatMap((titlePath): ChecklistTitle[] => {
    const resolved = resolveRef(contentRoots, titlePath)
    if (!resolved) return []

    const categories: ChecklistCategory[] = resolved.node.children.map((category) => {
      const categoryCode = normalizeCode(category.code)
      return {
        label: category.label,
        items: category.children.map((item) => {
          const itemCode = normalizeCode(item.code)
          const fullPath = [titlePath, categoryCode, itemCode].filter(Boolean).join('.')
          return {
            label: item.label,
            code: fullPath,
            releases: reverseIndex.get(fullPath) ?? [],
            timeline: timelineIndex?.get(fullPath),
          }
        }),
      }
    })

    return [{ path: titlePath, label: resolved.node.label, categories }]
  })
}

interface TimelineEntry {
  item: ChecklistItem
  span: TimelineSpan
}

interface TimelineNode extends TimelineEntry {
  children: TimelineNode[]
}

function spanContains(parent: TimelineSpan, child: TimelineSpan): boolean {
  const sameRange = parent.start === child.start && parent.end === child.end
  return parent.start <= child.start && child.end <= parent.end && !sameRange
}

function buildTimelineTree(entries: TimelineEntry[]): TimelineNode[] {
  const sorted = entries
    .map((entry, index) => ({ ...entry, index }))
    .sort((a, b) => {
      if (a.span.start !== b.span.start) return a.span.start - b.span.start
      const lengthA = a.span.end - a.span.start
      const lengthB = b.span.end - b.span.start
      if (lengthA !== lengthB) return lengthB - lengthA
      return a.index - b.index
    })

  const roots: TimelineNode[] = []
  const stack: TimelineNode[] = []

  for (const entry of sorted) {
    const node: TimelineNode = { item: entry.item, span: entry.span, children: [] }
    while (stack.length) {
      const top = stack[stack.length - 1]
      if (top && spanContains(top.span, entry.span)) break
      stack.pop()
    }
    const parent = stack[stack.length - 1]
    if (parent) parent.children.push(node)
    else roots.push(node)
    stack.push(node)
  }

  return roots
}

function formatSpan(span: TimelineSpan): string {
  return span.start === span.end ? `${span.start}` : `${span.start}–${span.end}`
}

function renderTimelineNodes(nodes: TimelineNode[], depth: number): string[] {
  const lines: string[] = []
  const indent = '  '.repeat(depth)
  for (const node of nodes) {
    lines.push(`${indent}- ${node.item.label} (Timeline ${formatSpan(node.span)}) - [ ]`)
    lines.push(...renderTimelineNodes(node.children, depth + 1))
  }
  return lines
}

export interface ChecklistOptions {
  includeHeadingCheckboxes?: boolean
  orderByTimeline?: boolean
}

export function checklistToMarkdown(
  heading: string,
  titles: ChecklistTitle[],
  options: ChecklistOptions = {},
): string {
  const { includeHeadingCheckboxes = true, orderByTimeline = false } = options
  const multiTitle = titles.length > 1
  const box = includeHeadingCheckboxes ? ' - [ ]' : ''
  const lines: string[] = [`# ${heading} - Checklist${box}`, '']

  for (const title of titles) {
    if (multiTitle) lines.push(`## ${title.label}${box}`, '')

    if (orderByTimeline) {
      const positioned: TimelineEntry[] = []
      const unpositioned: ChecklistItem[] = []

      for (const category of title.categories) {
        for (const item of category.items) {
          if (item.timeline) positioned.push({ item, span: item.timeline })
          else unpositioned.push(item)
        }
      }

      if (positioned.length) {
        lines.push(multiTitle ? `### Timeline Order${box}` : `## Timeline Order${box}`, '')
        lines.push(...renderTimelineNodes(buildTimelineTree(positioned), 0))
        lines.push('')
      }

      if (unpositioned.length) {
        lines.push(multiTitle ? `### Unpositioned${box}` : `## Unpositioned${box}`, '')
        for (const item of unpositioned) {
          lines.push(`- ${item.label} - [ ]`)
        }
        lines.push('')
      }

      continue
    }

    for (const category of title.categories) {
      if (!category.items.length) continue

      lines.push(multiTitle ? `### ${category.label}${box}` : `## ${category.label}${box}`, '')
      for (const item of category.items) {
        lines.push(`- ${item.label} - [ ]`)
      }
      lines.push('')
    }
  }

  return lines.join('\n').trimEnd() + '\n'
}
