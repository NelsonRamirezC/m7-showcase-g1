<template>
  <nav>
    <RouterLink to="/">Home</RouterLink>
    
  </nav>

  <RouterView />
</template>

<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<style scoped>

</style>
