<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <div class="wrapper">
       <nav>
        <RouterLink to="/">home</RouterLink>
        <RouterLink to="/login">登入</RouterLink>
        <RouterLink to="/register">註冊</RouterLink>
      </nav> 
    </div>
  </header>

  <RouterView />
</template>

<style scoped></style>
