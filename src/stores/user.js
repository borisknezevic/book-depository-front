import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', () => {
    const username = ref('');
    const email = ref('');
    const role = ref('');
    const userId = ref(0);

    const getRole = computed(() => role.value)
    const getEmail = computed(() => email.value)
    const getUsername = computed(() => username.value)
    const getUserId = computed(() => userId.value)

    function setUsername(newUsername){
        username.value = newUsername;
    }

    function setEmail(newEmail){
        email.value = newEmail;
    }

    function setRole(newRole){
        role.value = newRole;
    }

    function setUserId(newUserId){
        userId.value = newUserId;
    }

    if(localStorage.getItem("role")){
        role.value = JSON.parse(localStorage.getItem("role"))
    }else{
        role.value = "ANON"
    }
    if(localStorage.getItem("email")){
        email.value = JSON.parse(localStorage.getItem("email"))
    }
    if(localStorage.getItem("username")){username.value = JSON.parse(localStorage.getItem("username"))}
    if(localStorage.getItem("userId")){userId.value = JSON.parse(localStorage.getItem("userId"))}

    watch(username, (usernameVal) => {localStorage.setItem("username", JSON.stringify(usernameVal))},{deep: true})
    watch(role, (roleVal) => {localStorage.setItem("role",JSON.stringify(roleVal))},{deep: true})
    watch(email, (emailVal) => {localStorage.setItem("email",JSON.stringify(emailVal))},{deep: true})
    watch(userId, (userId) => {localStorage.setItem("userId",JSON.stringify(userId))},{deep: true})

    return { username, email, role, setRole, setEmail, setUsername ,getRole, getEmail, getUsername,userId,getUserId,setUserId}
})