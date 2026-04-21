<template>
  <div id="app">
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/nodes">Nodes</RouterLink>
      <RouterLink to="/mqtt">MQTT Viewer</RouterLink>
    </nav>
    <RouterView/>
  </div>
</template>
<script>
  import { RouterLink, RouterView } from 'vue-router';
</script>
<style>
/* Import theme variables */
@import './styles/mqtt-utils.css';

/* Light reset */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: var(--font-family);
}

html {
  scroll-behavior: smooth;
}

body {
  background: var(--color-bg-primary);
  color: var(--color-text-primary);
}

/* Top navigation bar */
nav {
  display: flex;
  gap: var(--spacing-md);
  padding: var(--spacing-md) var(--spacing-lg);
  background: #202325;
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: var(--z-nav);
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

/* Navigation links */
nav a {
  color: var(--color-text-secondary);
  text-decoration: none;
  padding: var(--spacing-xs) var(--spacing-md);
  border-radius: var(--radius-md);
  transition: var(--transition);
  font-weight: 500;
  white-space: nowrap;
  font-size: var(--font-base);
}

/* Hover effect */
nav a:hover {
  background: var(--color-bg-hover);
  color: var(--color-success);
}

/* Active route styling */
nav a.router-link-active {
  background: var(--color-success);
  color: var(--color-bg-primary) !important;
  font-weight: 600;
}

/* Main content container */
#app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: var(--color-bg-primary);
}

nav {
  flex-shrink: 0;
}

#app > div {
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

/* Responsive navigation */
@media (max-width: 768px) {
  nav {
    padding: var(--spacing-sm) var(--spacing-md);
    gap: var(--spacing-sm);
  }

  nav a {
    padding: var(--spacing-xs) var(--spacing-sm);
    font-size: var(--font-sm);
  }
}

@media (max-width: 480px) {
  nav {
    padding: var(--spacing-xs) var(--spacing-sm);
    gap: var(--spacing-xs);
  }

  nav a {
    padding: 0.4rem 0.6rem;
    font-size: var(--font-sm);
  }
}
</style>