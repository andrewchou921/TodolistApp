<template>
  <div id="signUpPage" class="bg-yellow">
    <div class="container signUpPage vhContainer">
      <div class="side">
        <a href="#"><img class="logoImg" src="https://raw.githubusercontent.com/hexschool/2022-web-layout-training/main/todolist/logo.png" alt=""/></a>
        <img class="d-m-n signUpImage" src="/bg.png" alt="workImg" />
      </div>
      <div>
        <form class="formControls" @submit.prevent="signup">
          <h2 class="formControls_txt">註冊帳號</h2>
          <label class="formControls_label" for="email">Email</label>
          <input class="formControls_input" type="text" id="email" name="email" placeholder="請輸入 email" required v-model="signupField.email"/>
          <label class="formControls_label" for="name">您的暱稱</label>
          <input class="formControls_input" type="text" id="name" name="nickname" placeholder="請輸入您的暱稱" v-model="signupField.nickname" />
          <label class="formControls_label" for="password">密碼</label>
          <!-- 密碼顯示切換 -->
          <input class="formControls_input" :type="isPasswordVisible.password ? 'text' : 'password'" id="password" name="password" placeholder="請輸入密碼" required v-model="signupField.password"/>
          <button type="button" class="password-toggle-button" @click="togglePasswordVisibility('password')">
            <i :class="isPasswordVisible.password ? 'fa fa-eye' : 'fa fa-eye-slash'"></i>
          </button>

          <label class="formControls_label" for="passwordConfirm">再次輸入密碼</label>
          <!-- 確認密碼顯示切換 -->
          <input class="formControls_input" :type="isPasswordVisible.passwordConfirm ? 'text' : 'password'" id="passwordConfirm" name="passwordConfirm" placeholder="請再次輸入密碼" required v-model="signupField.passwordConfirm"/>
          <button type="button" class="password-toggle-button" @click="togglePasswordVisibility('passwordConfirm')">
            <i :class="isPasswordVisible.passwordConfirm ? 'fa fa-eye' : 'fa fa-eye-slash'"></i>
          </button>

          <input class="formControls_btnSubmit" type="submit" value="註冊帳號"/>
          <router-link to="/login" class="formControls_btnLink">登入</router-link>
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
  const signupField = ref({
    email: '',
    password: '',
    nickname: '',
    passwordConfirm: ''
  });
  
  
  const isPasswordVisible = ref({
  password: false,
  passwordConfirm: false
  });

  const togglePasswordVisibility = (field) => {
  isPasswordVisible.value[field] = !isPasswordVisible.value[field];
 };

  const signup = async () => {
    if (signupField.value.password !== signupField.value.passwordConfirm) {
      console.error('密碼和確認密碼不一致');
      alert('密碼和確認密碼不一致');
      return;
    }
  
    try {
      await axios.post(`${api}/users/sign_up`, signupField.value);
      const tokenRes = await axios.post(`${api}/users/sign_in`, {
        email: signupField.value.email,
        password: signupField.value.password
      });
      document.cookie = `customTodoToken=${tokenRes.data.token}; path=/; secure; samesite=strict`;
      
      // 註冊成功後跳出提示
      alert('註冊成功');

      // 使用 router.push 來跳轉頁面
      router.push('/login'); 
    } catch (error) {
      const errorMessage = error.response?.data?.message || error.message;
      alert(`註冊失敗: ${errorMessage}`);
      console.error('註冊失敗:', error.response ? error.response.data : error.message);
    }
  };
  </script>