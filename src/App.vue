<template>
  <div id="app">
    <nav>
      <RouterLink to="/">Home</RouterLink>
      <RouterLink to="/nodes">Nodes</RouterLink>
    </nav>
    <RouterView/>
  </div>
</template>
<script>
  import { RouterLink, RouterView } from 'vue-router';
</script>