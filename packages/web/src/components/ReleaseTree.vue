<script setup lang="ts">
import { computed } from 'vue'
import type { TreeNode } from '../models/tree'
import { resolveRef, isContentRef, type ResolvedRef } from '../parser/resolveRef'

const props = defineProps<{ nodes: TreeNode[]; contentRoots: TreeNode[] }>()

interface DecoratedNode {
  node: TreeNode
  isRef: boolean
  resolved?: ResolvedRef
}

const decorated = computed<DecoratedNode[]>(() =>
  props.nodes.map((node) => {
    const isRef = isContentRef(node.code)
    return {
      node,
      isRef,
      resolved: isRef ? resolveRef(props.contentRoots, node.code) : undefined,
    }
  }),
)
</script>

<template>
  <ul class="tree">
    <li v-for="(entry, i) in decorated" :key="entry.node.code ?? entry.node.label + i">
      <span class="label">{{ entry.node.label }}</span>

      <template v-if="entry.isRef">
        <span v-if="entry.resolved" class="resolved">
          → {{ entry.resolved.trail.map((t) => t.label).join(' / ') }}
        </span>
        <span v-else class="unresolved">⚠ unresolved ref: {{ entry.node.code }}</span>
      </template>

      <template v-else>
        <code v-if="entry.node.code" class="code">{{ entry.node.code }}</code>
        <ReleaseTree
          v-if="entry.node.children.length"
          :nodes="entry.node.children"
          :content-roots="props.contentRoots"
        />
      </template>
    </li>
  </ul>
</template>

<style scoped>
.tree {
  list-style: none;
  padding-left: 1.25rem;
  margin: 0.15rem 0;
}
.label {
  font-weight: 500;
}
.code {
  margin-left: 0.5rem;
  font-size: 0.8em;
  color: #666;
  background: rgba(128, 128, 128, 0.15);
  padding: 0.05rem 0.4rem;
  border-radius: 3px;
}
.resolved {
  margin-left: 0.5rem;
  font-size: 0.85em;
  color: #2a7a2a;
}
.unresolved {
  margin-left: 0.5rem;
  font-size: 0.85em;
  color: #c00;
}
</style>
