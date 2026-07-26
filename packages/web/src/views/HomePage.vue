<script setup lang="ts"></script>

<template>
  <section>
    <h1>Final Fantasy: Taxonomic Compendium</h1>
    <p class="tagline">A taxonomic reference of Final Fantasy content, games, releases, and media.</p>

    <p>
      Browse <RouterLink to="/titles">Titles</RouterLink> to see everything for an entire title's collection, or
      <RouterLink to="/releases">Releases</RouterLink> to look up what a specific release/bundle contains.
    </p>

    <p class="advanced">
      Advanced: <RouterLink to="/raw/content">raw content tree</RouterLink> ·
      <RouterLink to="/raw/releases">raw releases tree</RouterLink>
    </p>
  </section>
</template>

<style scoped>
.tagline {
  color: #555;
  margin-top: -0.5rem;
}
.advanced {
  margin-top: 2.5rem;
  font-size: 0.85em;
  color: #888;
}
</style>
