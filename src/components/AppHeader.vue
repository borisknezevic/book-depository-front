<script setup>
import LoginDialog from './dialogs/LoginDialog.vue'
import RegistrationDialog from './dialogs/RegistrationDialog.vue';
import {ref} from 'vue'

const activeIndex = ref('1')

const dialogFormVisible = ref(false)
const registrationFormVisible = ref(false)

const showFormDialog = () => {
    dialogFormVisible.value = !dialogFormVisible.value
}

const showRegistrationDialog = () => {
    registrationFormVisible.value = !registrationFormVisible.value
}

const handleSelect = () => {
    console.log('handleSelect')
}

const closeLoginForm = () => {
    dialogFormVisible.value = false
}

const closeRegistrationForm = () => {
    registrationFormVisible.value = false
}

</script>
<template>
    <el-menu 
        :default-active="activeIndex"
        mode="horizontal"
        :ellipsis="false"
        :select="handleSelect"
        default-active="1"
        active-text-color="#850E35"
        background-color="#FFC4C4"
        text-color="#EE6983"
    >
        <el-menu-item index="0">LOGO</el-menu-item>
        <div class="flex-grow" />
        <el-menu-item index="1">Books</el-menu-item>
        <el-menu-item index="2">Profiles</el-menu-item>
        <el-menu-item @click="showFormDialog">Login</el-menu-item>
        <el-menu-item @click="showRegistrationDialog">Register</el-menu-item>
    </el-menu>

    <LoginDialog 
        :loginFormVisibility = "dialogFormVisible" 
        @closeDialog="closeLoginForm"/>
    <RegistrationDialog 
        :registrationFormVisibility = "registrationFormVisible"
        @closeDialog="closeRegistrationForm"
    />
</template>
<style scoped>

.flex-grow {
  flex-grow: 1;
}

</style>