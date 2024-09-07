<template>
  <div id="loginPage" class="bg-yellow">
    <!-- 登入表單 -->
    <div class="container loginPage vhContainer">
      <div class="side">
        <a href="#">
          <img class="logoImg" src="https://raw.githubusercontent.com/hexschool/2022-web-layout-training/main/todolist/logo.png" alt=""/>
        </a>
        <img class="d-m-n" src="https://raw.githubusercontent.com/hexschool/2022-web-layout-training/main/todolist/img.png" alt="workImg" />
      </div>
      <div>
        <form class="formControls" @submit.prevent="signIn">
          <h2 class="formControls_txt">最實用的線上代辦事項服務</h2>
          <label class="formControls_label" for="email">Email</label>
          <input class="formControls_input" type="text" id="email" name="email" placeholder="請輸入 email" required v-model="signInField.email"/>
          <label class="formControls_label" for="pwd">密碼</label>
          <input class="formControls_input" type="password" id="pwd" name="pwd" placeholder="請輸入密碼" required v-model="signInField.password"/>
          <input class="formControls_btnSubmit" type="submit" value="登入"/>
          <router-link to="/register" class="formControls_btnLink">註冊帳號</router-link>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router'; // 引入 router


const router = useRouter(); // 使用 useRouter
const api = 'https://todolist-api.hexschool.io';
const signInField = ref({
  email: '',
  password: ''
});

const signIn = async () => {
  try {
    const res = await axios.post(`${api}/users/sign_in`, signInField.value);
    document.cookie = `customTodoToken=${res.data.token}; path=/; secure; samesite=strict`;
     // 登入成功後跳出提示
     alert('登入成功');
     // 使用 router.push 來跳轉頁面
     router.push('/todolist'); 
  } catch (error) {
    const errorMessage = error.response?.data?.message || error.message;
    alert(`登入失敗: ${errorMessage}`);
    console.error('登入失敗:', error);
  }
};
</script>
