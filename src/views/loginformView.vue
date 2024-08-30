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

    // 保存 token 到 cookie 中
    document.cookie = `customTodoToken=${res.data.token}; path=/; secure; samesite=strict`;
  } catch (error) {
    console.error('登入失敗:', error);
  }
};

// 驗證登入
const user = ref({
  nickname: '',
  uid: ''
});
onMounted(async () => {
  const token = document.cookie.replace(/(?:(?:^|.*;\s*)customTodoToken\s*\=\s*([^;]*).*$)|^.*$/, '$1');
  try {
    const res = await axios.get(`${api}/users/checkout`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log(res);
    user.value = res.data;
  } catch (error) {
    console.error('用戶驗證失敗:', error);
  }
});
</script>


<template>
<!-- 登入表單 -->
<div id="loginPage" class="bg-yellow">
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


<style>
@import url("https://fonts.googleapis.com/css2?family=Noto+Sans+TC&display=swap");
html, body, div, span, applet, object, iframe,
h1, h2, h3, h4, h5, h6, p, blockquote, pre,
a, abbr, acronym, address, big, cite, code,
del, dfn, em, img, ins, kbd, q, s, samp,
small, strike, strong, sub, sup, tt, var,
b, u, i, center,
dl, dt, dd, ol, ul, li,
fieldset, form, label, legend,
table, caption, tbody, tfoot, thead, tr, th, td,
article, aside, canvas, details, embed,
figure, figcaption, footer, header, hgroup,
menu, nav, output, ruby, section, summary,
time, mark, audio, video {
  margin: 0;
  padding: 0;
  border: 0;
  font-size: 100%;
  font: inherit;
  vertical-align: baseline;
}

/* HTML5 display-role reset for older browsers */
article, aside, details, figcaption, figure,
footer, header, hgroup, menu, nav, section {
  display: block;
}

body {
  line-height: 1;
}

ol, ul {
  list-style: none;
}

blockquote, q {
  quotes: none;
}

blockquote:before, blockquote:after,
q:before, q:after {
  content: '';
  content: none;
}

table {
  border-collapse: collapse;
  border-spacing: 0;
}

* {
  box-sizing: border-box;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
}

*, *::before, *::after {
  -webkit-box-sizing: border-box;
          box-sizing: border-box;
}

.selector-for-some-widget {
  -webkit-box-sizing: content-box;
          box-sizing: content-box;
}

html {
  height: 100%;
}

body {
  font-family: "Noto Sans TC";
  margin: 0 auto;
  overflow: hidden;
}

img {
  width: 100%;
  vertical-align: middle;
}

.logoImg {
  margin-bottom: 16px;
}

.vhContainer {
  height: 100vh;
}

.bg-yellow {
  background-color: #FFD370;
}

.bg-half {
  background-image: linear-gradient(175deg, #FFD370 60%, #fff 40%);
}

.container {
  margin: 0 auto;
  padding: 87px 32px;
}

@media (max-width: 576px) {
  .container {
    padding: 18px 32px;
  }
}

.side {
  width: 386px;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
      -ms-flex-direction: column;
          flex-direction: column;
  -webkit-box-pack: center;
      -ms-flex-pack: center;
          justify-content: center;
  -webkit-box-align: center;
      -ms-flex-align: center;
          align-items: center;
}

@media (max-width: 576px) {
  .side {
    width: 100%;
  }
}

nav {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
      -ms-flex-pack: justify;
          justify-content: space-between;
  padding: 24px 32px 0 32px;
}

@media (max-width: 576px) {
  nav {
    margin-bottom: 16px;
  }
}

nav h1 a {
  width: 243px;
  height: 39px;
  background: url(https://upload.cc/i1/2022/03/23/8vTzYG.png) no-repeat;
  display: block;
  text-indent: 101%;
  overflow: hidden;
  white-space: nowrap;
}

nav ul {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  font-size: 1rem;
}

@media (max-width: 576px) {
  nav ul li {
    margin-top: 11px;
  }
}

nav ul a {
  text-decoration: none;
  color: #333333;
  margin-left: 24px;
}

@media (max-width: 576px) {
  nav ul a {
    margin-left: 0;
  }
}

nav ul a:hover {
  color: #d87355;
}

nav ul a span {
  font-weight: bold;
}

@media (max-width: 576px) {
  nav ul .todo_sm {
    display: none;
  }
}

@media (max-width: 576px) {
  .d-m-n {
    display: none;
  }
}

.formControls {
  margin-left: 100px;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-orient: vertical;
  -webkit-box-direction: normal;
      -ms-flex-direction: column;
          flex-direction: column;
}

@media (max-width: 576px) {
  .formControls {
    margin-left: 0;
  }
}

.formControls .formControls_txt {
  font-size: 1.5rem;
  font-weight: bold;
  margin-bottom: 24px;
}

@media (max-width: 576px) {
  .formControls .formControls_txt {
    font-size: 1.25rem;
    text-align: center;
  }
}

.formControls .formControls_label {
  font-size: 0.875rem;
  font-weight: bold;
  margin: 16px 0 4px 0;
}

.formControls .formControls_input {
  font-weight: normal;
  border: none;
  border-radius: 10px;
  width: 304px;
  padding: 12px 16px;
  margin: 4px 0;
}

.formControls .formControls_input:focus {
  outline: 3px solid #fff;
}

.formControls .formControls_input::-webkit-input-placeholder {
  color: #9F9A91;
}

.formControls .formControls_input:-ms-input-placeholder {
  color: #9F9A91;
}

.formControls .formControls_input::-ms-input-placeholder {
  color: #9F9A91;
}

.formControls .formControls_input::placeholder {
  color: #9F9A91;
}

.formControls .formControls_btnSubmit {
  width: 128px;
  height: 48px;
  border: none;
  border-radius: 10px;
  background: #333333;
  color: #fff;
  -ms-flex-item-align: center;
      -ms-grid-row-align: center;
      align-self: center;
  margin: 24px 0;
  font-weight: bold;
  cursor: pointer;
  text-align: center;
  font-size: 1rem;
}

.formControls a {
  text-decoration: none;
}

.formControls span {
  margin: 4px 0 16px 0;
  color: #d87355;
  font-size: 0.875rem;
}

.formControls .formControls_btnLink {
  display: block;
  color: #333333;
  font-weight: bold;
  text-decoration: none;
  text-align: center;
}

.loginPage {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
      -ms-flex-pack: justify;
          justify-content: space-between;
  -webkit-box-align: center;
      -ms-flex-align: center;
          align-items: center;
  width: 800px;
}

@media (max-width: 576px) {
  .loginPage {
    width: 100%;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
        -ms-flex-direction: column;
            flex-direction: column;
    margin: 0 auto;
    padding: 48px 31px;
    -webkit-box-pack: start;
        -ms-flex-pack: start;
            justify-content: start;
  }
}

.signUpPage {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
      -ms-flex-pack: justify;
          justify-content: space-between;
  -webkit-box-align: center;
      -ms-flex-align: center;
          align-items: center;
  width: 800px;
}

@media (max-width: 576px) {
  .signUpPage {
    width: 100%;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
        -ms-flex-direction: column;
            flex-direction: column;
    margin: 48px auto 0 auto;
    padding: 48px 31px;
  }
}

.todoListPage {
  padding: 16px 32px;
}

@media (max-width: 576px) {
  .todoListPage {
    background-image: linear-gradient(175deg, #FFD370 100%, #fff 0%);
  }
}

.todoList_Content {
  width: 500px;
  margin: 0 auto;
}

@media (max-width: 576px) {
  .todoList_Content {
    width: 100%;
  }
}

.inputBox {
  width: 100%;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  position: relative;
  margin-bottom: 16px;
  -webkit-box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.15);
          box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.15);
}

.inputBox input {
  background: #fff;
  border: none;
  border-radius: 10px;
  position: relative;
  width: 100%;
  height: 47px;
  font-size: 1rem;
  padding-left: 16px;
}

.inputBox a {
  display: block;
  width: 40px;
  height: 39px;
  position: absolute;
  background: #333333;
  color: white;
  font-size: 20px;
  text-decoration: none;
  text-align: center;
  border-radius: 10px;
  top: 4px;
  right: 4px;
  padding: 10px;
}

.todoList_list {
  background: #fff;
  border-radius: 10px;
  -webkit-box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.15);
          box-shadow: 0 0 15px 0 rgba(0, 0, 0, 0.15);
}

.todoList_list .todoList_tab {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: space-evenly;
      -ms-flex-pack: space-evenly;
          justify-content: space-evenly;
}

.todoList_list .todoList_tab li {
  width: 100%;
}

.todoList_list .todoList_tab a {
  display: block;
  color: #9F9A91;
  text-decoration: none;
  line-height: 20px;
  font-weight: bold;
  text-align: center;
  padding: 16px;
  border-bottom: 2px solid #efefef;
}

.todoList_list .todoList_tab .active {
  color: #333333;
  border-bottom: 2px solid #333333;
}

.todoList_list .todoList_items {
  padding-top: 23px;
  padding-left: 24px;
  padding-right: 17px;
  padding-bottom: 32px;
}

.todoList_list .todoList_items .todoList_item {
  margin-bottom: 8px;
}

.todoList_list .todoList_items .todoList_label {
  width: 100%;
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
      -ms-flex-align: center;
          align-items: center;
  border-bottom: 1px solid #e5e5e5;
  padding-bottom: 15px;
  color: #333333;
  line-height: 20.27px;
}

.todoList_list .todoList_items .todoList_input {
  width: 20px;
  height: 20px;
  border: 1px solid #9F9A91;
  border-radius: 5px;
  margin-right: 16px;
}

.todoList_list .todoList_items .todoList_input:checked ~ span {
  color: #9F9A91;
  text-decoration: line-through;
  -webkit-transition: all 0.4s ease-in-out;
  transition: all 0.4s ease-in-out;
}

.todoList_list .todoList_items li {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-align: center;
      -ms-flex-align: center;
          align-items: center;
  margin-bottom: 17px;
}

.todoList_list .todoList_items li a {
  margin-left: 17px;
  display: block;
  font-size: 14px;
  color: #333333;
  opacity: 0;
}

.todoList_list .todoList_items li:hover a {
  opacity: 1;
}

.todoList_list .todoList_statistics {
  display: -webkit-box;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-pack: justify;
      -ms-flex-pack: justify;
          justify-content: space-between;
}

.todoList_list .todoList_statistics p {
  color: #333333;
  font-size: 0.875rem;
}

.todoList_list .todoList_statistics a {
  color: #9F9A91;
  font-size: 0.875rem;
  text-decoration: none;
}
/*# sourceMappingURL=all.css.map */
</style>
