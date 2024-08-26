<template>
  <div>
    <h2>驗證登入</h2>
    <div v-if="user.uid">
      <p>UID: {{ user.uid }}</p>
      <p>Nickname: {{ user.nickname }}</p>
    </div>
    <div v-else>你還沒有登入</div>
  </div>
</template>

<script setup>
import axios from 'axios'
import { ref, onMounted } from 'vue'

const api = 'https://todolist-api.hexschool.io'

// 用戶資料
const user = ref({
  nickname: '',
  uid: ''
})

// 驗證登入
onMounted(async () => {
  const token = document.cookie.replace(
    /(?:(?:^|.*;\s*)customTodoToken\s*\=\s*([^;]*).*$)|^.*$/,
    '$1'
  )
  console.log(token)

  try {
    const res = await axios.get(`${api}/users/checkout`, {
      headers: {
        Authorization: token
      }
    })
    console.log(res)
    user.value = res.data
  } catch (error) {
    console.log(error)
  }
})
</script>
