<script setup lang="ts"></script>

<template>
  <section>
    <h1>Final Fantasy: Taxonomic Compendium</h1>
    <p class="tagline">A taxonomic reference of Final Fantasy content, games, releases, and media.</p>

    <p>
      Check out <RouterLink to="/checklist">Checklist</RouterLink> to generate a list of content for a game you are interested
      in or just make the whole list of everything!

      <RouterLink to="/titles">Titles</RouterLink> and <RouterLink to="/releases">Releases</RouterLink> are very much WIP for now.
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
