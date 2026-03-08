<template>
  <div id="app">
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/nodes">Nodes</RouterLink>
      <RouterLink to="/topics">Topics</RouterLink>
    </nav>
    <RouterView/>
  </div>
</template>
<script>
  import { RouterLink, RouterView } from 'vue-router';
</script>
<style>
/* Light reset */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: Inter, Roboto, sans-serif;
}

body {
  background: #0b0f17; /* Modrinth dark background */
  color: #e6e6e6;
}

/* Top navigation bar */
nav {
  display: flex;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: #202325; /* Slightly lighter dark tone */
  border-bottom: 1px solid #2a2d2f; /* Subtle separator */
  position: sticky; /* Sticks to top on scroll */
  top: 0;
  z-index: 10;
}

/* Navigation links */
nav a {
  color: #c9c9c9; /* Soft gray text */
  text-decoration: none;
  padding: 0.5rem 0.9rem;
  border-radius: 6px; /* Rounded corners like Modrinth */
  transition: 0.2s ease;
  font-weight: 500;
}

/* Hover effect with Modrinth green */
nav a:hover {
  background: #2f3336;
  color: #00c16a; /* Modrinth green */
}

/* Active route styling */
.router-link-active {
  background: #00c16a; /* Green highlight */
  color: #0f0f0f !important; /* Dark text for contrast */
}

/* Main content container */
#app {
  max-width: 900px; /* Centered layout */
  margin: 2rem auto;
  padding: 0 1rem;
}
</style>