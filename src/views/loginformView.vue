<script setup>
import axios from 'axios';
import { onMounted, ref } from 'vue';

const api = 'https://todolist-api.hexschool.io';

// 定義用來註冊的 ref 變數
const signupField = ref({
  email: '',
  password: '',
  nickname: '',
  passwordConfirm: '' // 確認密碼
});
const signupRes = ref('');

// 註冊方法
const signup = async () => {
  // 檢查密碼和確認密碼是否一致
  if (signupField.value.password !== signupField.value.passwordConfirm) {
    console.error('密碼和確認密碼不一致');
    return;
  }

  try {
    const res = await axios.post(`${api}/users/sign_up`, signupField.value);
    console.log(res);
    signupRes.value = res.data.uid;
    
    // 註冊成功後，直接取得 token 並保存到 cookie 中
    const tokenRes = await axios.post(`${api}/users/sign_in`, {
      email: signupField.value.email,
      password: signupField.value.password
    });
    document.cookie = `customTodoToken=${tokenRes.data.token}; path=/; secure; samesite=strict`;
  } catch (error) {
    console.error('註冊失敗:', error.response ? error.response.data : error.message);
  }
};



// 定義用來登入的 ref 變數
const signInField = ref({
  email: '',
  password: ''
});
const signInRes = ref('');


// 登入方法
const signIn = async () => {
  try {
    const res = await axios.post(`${api}/users/sign_in`, signInField.value);
    console.log(res);
    signInRes.value = res.data.token;
    window.location.href = '/todolist';

    // 保存 token 到 cookie 中
    document.cookie = `customTodoToken=${res.data.token}; path=/; secure; samesite=strict`;
  } catch (error) {
    console.error('登入失敗:', error);
  }
};

// // 驗證登入
// const user = ref({
//   nickname: '',
//   uid: ''
// });
// onMounted(async () => {
//   const token = document.cookie.replace(/(?:(?:^|.*;\s*)customTodoToken\s*\=\s*([^;]*).*$)|^.*$/, '$1');
//   try {
//     const res = await axios.get(`${api}/users/checkout`, {
//       headers: {
//          Authorization: `${token}`
//          }
//     });
//     console.log(res);
//     user.value = res.data;
//   } catch (error) {
//     console.error('用戶驗證失敗:', error);
//   }
// });
</script>


<template>
<!-- 登入表單 -->
<div id="loginPage" class="bg-yellow">
  <div class="container  loginPage vhContainer">
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
        <span>此欄位不可留空</span>
        <label class="formControls_label" for="pwd">密碼</label>
        <input class="formControls_input" type="password" id="pwd" name="pwd" placeholder="請輸入密碼" required v-model="signInField.password"/>
        <input class="formControls_btnSubmit" type="submit" value="登入"/>
        <a class="formControls_btnLink" href="#signUpPage">註冊帳號</a>
      </form>
    </div>
  </div>
</div>

<!-- 註冊表單-->
<div id="signUpPage" class="bg-yellow">
  <div class="container signUpPage vhContainer">
    <div class="side">
      <a href="#"><img class="logoImg" src="https://raw.githubusercontent.com/hexschool/2022-web-layout-training/main/todolist/logo.png" alt=""/></a>
      <img class="d-m-n" src="https://raw.githubusercontent.com/hexschool/2022-web-layout-training/main/todolist/img.png" alt="workImg"/>
    </div>
    <div>
      <form class="formControls" @submit.prevent="signup">
        <h2 class="formControls_txt">註冊帳號</h2>
        <label class="formControls_label" for="email">Email</label>
        <input class="formControls_input" type="text" id="email" name="email" placeholder="請輸入 email" required v-model="signupField.email"/>
        <label class="formControls_label" for="name">您的暱稱</label>
        <input class="formControls_input" type="text" id="name" name="nickname" placeholder="請輸入您的暱稱" v-model="signupField.nickname" />
        <label class="formControls_label" for="password">密碼</label>
        <input class="formControls_input" type="password" id="password" name="password" placeholder="請輸入密碼" required v-model="signupField.password"/>
        <label class="formControls_label" for="passwordConfirm">再次輸入密碼</label>
        <input class="formControls_input" type="password" id="passwordConfirm" name="passwordConfirm" placeholder="請再次輸入密碼" required v-model="signupField.passwordConfirm"/>
        <input class="formControls_btnSubmit" type="submit" value="註冊帳號"/>
        <a class="formControls_btnLink" href="#loginPage">登入</a>
      </form>
    </div>
  </div>
</div>

<!-- 代辦事項頁面 -->
<div id="todoListPage" class="bg-half">
  <nav>
    <h1><a href="#">ONLINE TODO LIST</a></h1>
    <ul>
      <li class="todo_sm">
        <a href="#"><span>王小明的代辦</span></a>
      </li>
      <li><a href="#loginPage" @click="logout">登出</a></li>
    </ul>
  </nav>
  <div class="container todoListPage vhContainer">
    <div class="todoList_Content">
      <div class="inputBox">
        <input type="text" placeholder="請輸入待辦事項" />
        <a href="#">
          <i class="fa fa-plus"></i>
        </a>
      </div>
      <div class="todoList_list">
        <ul class="todoList_tab">
          <li><a href="#" class="active">全部</a></li>
          <li><a href="#">待完成</a></li>
          <li><a href="#">已完成</a></li>
        </ul>
        <div class="todoList_items">
          <ul class="todoList_item">
            <!-- 待辦事項列表 -->
          </ul>
          <div class="todoList_statistics">
            <p>5 個已完成項目</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

</template>
