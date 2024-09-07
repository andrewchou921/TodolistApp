<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header>
    <!-- <div class="wrapper">
       <nav>
        <RouterLink to="/login">登入</RouterLink>
        <RouterLink to="/register">註冊</RouterLink>
        <RouterLink to="/todolist">代辦事項頁面</RouterLink>
      </nav> 
    </div> -->
  </header>

  <RouterView />
</template>

<style scoped></style>
