<template>
  <!-- 代辦事項頁面 -->
  <div id="todoListPage" class="bg-half">
    <nav>
      <h1><a href="#">ONLINE TODO LIST</a></h1>
      <ul>
        <li class="todo_sm"><a href="#"><span>{{ user.nickname }}的代辦</span></a></li>
        <li><a href="#loginPage" @click.prevent="logout">登出</a></li>
      </ul>
    </nav>
    <div class="container todoListPage vhContainer">
      <div class="todoList_Content">
        <div class="inputBox">
          <input type="text" placeholder="請輸入待辦事項" v-model="newTodoContent">
          <a href="#" @click.prevent="addTodo">
            <i class="fa fa-plus"></i>
          </a>
        </div>
        <!-- 選單 -->
        <div class="todoList_list">
          <ul class="todoList_tab">
            <li><a href="#" :class="{ active: currentTab === 'all' }" @click.prevent="switchTab('all')">全部</a></li>
            <li><a href="#" :class="{ active: currentTab === 'todo' }" @click.prevent="switchTab('todo')">待完成</a></li>
            <li><a href="#" :class="{ active: currentTab === 'done' }" @click.prevent="switchTab('done')">已完成</a></li>
          </ul>
          <!-- todo內容 -->
          <div class="todoList_items">
            <ul class="todoList_item">
              <li v-for="todo in filteredTodos" :key="todo.id">
                <!-- 編輯待辦事項 -->
                <div v-if="isEditing(todo)">
                  <input class="inputBox" v-model="edittingContent" @keyup.enter="saveEdit(todo)" />
                  <button @click="saveEdit(todo)" class="formControls_btnSubmit">保存</button>
                  <button @click="cancelEdit">取消</button>
                </div>

                <template v-else>
                 <label class="todoList_label">
                  <input class="todoList_input" type="checkbox" v-model="todo.status" @change="toggleTodoStatus(todo)">
                  <span>{{ todo.content }}</span>
                 </label>
                  <a href="#" @click.prevent="editTodoStart(todo)">
                     <i class="fa-solid fa-pen-to-square fa-lg"></i>
                   </a>
                  <a href="#" @click.prevent="deleteTodo(todo)">
                    <i class="fa-solid fa-trash-can fa-lg"></i>
                  </a>
                </template>
              </li>
            </ul>
            <div class="todoList_statistics">
              <p v-if="todos.length === 0">目前尚無待辦事項</p>
              <p v-if="todos.length > 0">{{ todoCount }} 個未完成項目</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios';
import { onMounted, ref, computed } from 'vue';
import { useRouter } from 'vue-router'; // 引入 router

const api = 'https://todolist-api.hexschool.io';

// 用戶資訊
const user = ref({ nickname: '', uid: '', token: '' });

const router = useRouter(); // 使用 useRouter,一定要放在 setup 裡

// 驗證登入狀態
onMounted(async () => {
  const token = document.cookie.replace(/(?:(?:^|.*;\s*)customTodoToken\s*\=\s*([^;]*).*$)|^.*$/, '$1');
  if (token) {
    try {
      const res = await axios.get(`${api}/users/checkout`, {
        headers: { Authorization: token }
      });
      user.value = res.data;
      user.value.token = token;
      console.log('登入成功:', user.value); // 打印成功信息
      getTodos(); // 取得待辦事項
    } catch (error) {
      console.error('用戶驗證失敗:', error);
      document.cookie = 'customTodoToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      // 使用 router.push 來跳轉頁面
      router.push('/login');
    }
  } else {
    window.location.href = '/login';
  }
});

// 登出功能
async function logout() {
  try {
    // 清空用戶資訊和 token
    user.value = { nickname: '', uid: '', token: '' };
    alert('您已登出');
    // 使用 router.push 來跳轉頁面
    router.push('/login');
  } catch (error) {
    console.error('登出失敗:', error);
  }
}

// 當前待辦事項
const todos = ref([]);
const newTodoContent = ref('');
const currentTab = ref('all');
const edittingTodo = ref(null);
const edittingContent = ref('');

// 篩選待辦事項
const filteredTodos = computed(() => {
  if (currentTab.value === 'todo') {
    return todos.value.filter(todo => !todo.status);
  } else if (currentTab.value === 'done') {
    return todos.value.filter(todo => todo.status);
  } else {
    return todos.value;
  }
});

// 計算未完成的待辦事項數量
const todoCount = computed(() => {
  return todos.value.filter(todo => !todo.status).length;
});

// 切換分頁
const switchTab = (tab) => {
  currentTab.value = tab;
};

// 取得待辦事項
async function getTodos() {
  try {
    const { data } = await axios.get(`${api}/todos`, {
      headers: { Authorization: `${user.value.token}` }
    });
    todos.value = data.data;
  } catch (error) {
    console.error('取得待辦事項失敗:', error);
  }
}

// 新增待辦事項
async function addTodo() {
  try {
    const content = newTodoContent.value.trim();
    if (content.length === 0) {
      return alert('Todo內容不能為空白');
    }
    if (!user.value.token) {
      return alert('未獲得授權，請重新登入');
    }
    await axios.post(`${api}/todos`, { content }, {
      headers: { Authorization: ` ${user.value.token}` }
    });
    newTodoContent.value = ''; // 清空輸入框
    getTodos(); // 刷新列表
  } catch (error) {
    console.error('新增待辦事項失敗:', error.response?.data || error.message);
    alert('新增待辦事項失敗，請檢查輸入內容或重新登入');
  }
}

// 切換待辦事項狀態
async function toggleTodoStatus(todo) {
  try {
    await axios.patch(`${api}/todos/${todo.id}/toggle`, {}, {
      headers: { Authorization: `${user.value.token}` }
    });
    getTodos(); // 刷新列表
  } catch (error) {
    console.error('切換狀態失敗:', error);
  }
}

// 刪除待辦事項
async function deleteTodo(todo) {
  try {
    await axios.delete(`${api}/todos/${todo.id}`, {
      headers: { Authorization: `${user.value.token}` }
    });
    getTodos(); // 刷新列表
  } catch (error) {
    console.error('刪除待辦事項失敗:', error);
  }
}

function editTodoStart(todo) {
  edittingTodo.value = todo;          // 設置當前正在編輯的待辦事項
  edittingContent.value = todo.content; // 將待辦事項內容放入編輯框
}


async function saveEdit(todo) {
  try {
     // 如果內容沒有改變，退出編輯模式
    if (todo.content === edittingContent.value) {
      edittingTodo.value = null; // 清空編輯狀態
      return;
    }
    await axios.put(`${api}/todos/${todo.id}`, { content: edittingContent.value }, {
      headers: { Authorization: `${user.value.token}` }
    });
    edittingTodo.value = null; // 清空編輯狀態
    getTodos(); // 刷新列表
  } catch (error) {
    console.error('保存編輯失敗:', error);
  }
}

function isEditing(todo) {
  return edittingTodo.value && edittingTodo.value.id === todo.id;
}
</script>
