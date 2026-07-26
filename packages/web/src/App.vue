<script setup lang="ts"></script>

<template>
  <div class="app-shell">
    <header>
      <h1 class="title">FFTC</h1>
      <nav>
        <RouterLink to="/">Home</RouterLink>
        <RouterLink to="/titles">Titles</RouterLink>
        <RouterLink to="/releases">Releases</RouterLink>
      </nav>
    </header>
    <main>
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app-shell {
  max-width: 720px;
  margin: 2rem auto;
  padding: 0 1rem;
  font-family: system-ui, sans-serif;
}
header {
  display: flex;
  align-items: baseline;
  gap: 1.5rem;
  border-bottom: 1px solid #ddd;
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
}
.title {
  margin: 0;
  font-size: 1.25rem;
}
nav {
  display: flex;
  gap: 1rem;
}
nav a {
  text-decoration: none;
  color: #333;
}
nav a.router-link-active {
  font-weight: 600;
  color: #2a5a2a;
}
</style>
