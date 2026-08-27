import type { TreeNode } from '../models/tree'
import { resolveRef, normalizeCode } from './resolveRef'
import { buildContentToReleasesIndex, type ReleaseRef } from './reverseIndex'

export interface ChecklistItem {
  label: string
  code: string
  releases: ReleaseRef[]
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
          }
        }),
      }
    })

    return [{ path: titlePath, label: resolved.node.label, categories }]
  })
}

export function checklistToMarkdown(
  heading: string,
  titles: ChecklistTitle[],
  includeHeadingCheckboxes = true,
): string {
  const multiTitle = titles.length > 1
  const box = includeHeadingCheckboxes ? ' - [ ]' : ''
  const lines: string[] = [`# ${heading} - Checklist${box}`, '']

  for (const title of titles) {
    if (multiTitle) lines.push(`## ${title.label}${box}`, '')

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
