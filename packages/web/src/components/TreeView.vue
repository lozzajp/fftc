<script setup lang="ts">
import type { TreeNode } from '../models/tree'

defineProps<{ nodes: TreeNode[] }>()
</script>

<template>
  <ul class="tree">
    <li v-for="(node, i) in nodes" :key="node.code ?? node.label + i">
      <span class="label">{{ node.label }}</span>
      <code v-if="node.code" class="code">{{ node.code }}</code>
      <TreeView v-if="node.children.length" :nodes="node.children" />
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
</style>
