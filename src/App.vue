<script setup>
import AppFooter from './components/AppFooter.vue'

import { RouterLink, RouterView } from 'vue-router'
import LoginDialog from './components/dialogs/LoginDialog.vue'

import {ref, watch} from 'vue'
import router from './router/index';
import { useUserStore } from './stores/user';
import { storeToRefs } from 'pinia';

const userRole=ref();
const userStore = useUserStore();
const {email,role,username,getRole} = userStore;

const activeIndex = ref('1')

const dialogFormVisible = ref(false)

const showFormDialog = () => {
    dialogFormVisible.value = !dialogFormVisible.value
}

const handleSelect = () => {
    console.log('handleSelect')
}

const closeLoginForm = () => {
    dialogFormVisible.value = false
}


const logout = () => {
  localStorage.clear();
  userStore.email = '';
  userStore.role = 'ANON';
  userStore.username = '';
  router.push('/')
}

</script>

<template>
  <div>
      <el-container class="container">
        <el-header 
        class="header"
        >
        <el-menu 
            :default-active="activeIndex"
            mode="horizontal"
            :ellipsis="false"
            :select="handleSelect"
            default-active="1"
            active-text-color="#FF7E67"
            background-color="#07689F"
            text-color="#FAFAFA"
        >
            <el-menu-item index="0"><RouterLink to="/">LOGO</RouterLink></el-menu-item>
            <div class="flex-grow" />

            <el-menu-item >{{userStore.getRole}}</el-menu-item>
            <el-menu-item index="1" v-if="userStore.getRole == 'ADMIN'"><RouterLink to="/books/1">Book</RouterLink></el-menu-item>
            <el-menu-item index="2" v-if="userStore.getRole != 'ADMIN'"><RouterLink to="/">Books</RouterLink></el-menu-item>
            <el-menu-item index="3" v-if="userStore.getRole == 'AUTHOR' || userStore.getRole == 'READER'"><RouterLink :to="{ name: 'profile', params: { id: userStore.userId } }">My profile</RouterLink></el-menu-item>
            <el-menu-item index="4" v-if="userStore.getRole == 'ANON'"><RouterLink to="/registration">Registration</RouterLink></el-menu-item>
            <el-menu-item index="5" v-if="userStore.getRole == 'ADMIN'"><RouterLink to="/admin">Admin panel</RouterLink></el-menu-item>
      
            <el-menu-item v-if="userStore.getRole == 'ANON'" @click="showFormDialog">Login</el-menu-item>
            <el-menu-item v-if="userStore.getRole != 'ANON'" @click="logout">Log Out</el-menu-item>
        </el-menu>

        <LoginDialog 
            :loginFormVisibility = "dialogFormVisible" 
            @closeDialog="closeLoginForm" />
        </el-header>
        <el-main class="main"> 
          <RouterView />
        </el-main>
        <el-footer>
          <AppFooter />
        </el-footer>
      </el-container>
  </div>
  
</template>

<style scoped>
a{
  text-decoration: none;
}
.flex-grow {
  flex-grow: 1;
}

.container{
  padding: 0;
  margin: 0;
}

.header{
  position: sticky;
  top:0;
  z-index: 9;
  display:inline;
  margin: 0;
  padding: 0;
}

.main{
  background-color: #FAFAFA;
  padding-top: 0px;
  
}
.elmessageClass {

  z-index: 10;
}
</style>
