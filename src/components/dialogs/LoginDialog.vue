<script setup>
import {ref,reactive, watch} from 'vue';
import axios from 'axios';
import router from '../../router';
import { useUserStore } from '../../stores/user';
import { ElNotification } from 'element-plus'

const userStore = useUserStore();

const props = defineProps(['loginFormVisibility'])
const emits = defineEmits(['closeDialog'])

const formLabelWidth = '80px'

// CSS
const display = ref('none')
const visibility = ref('hidden')
const logginError = ref('')

const hideAlert = () => {
  display.value = 'none'
  visibility.value = 'hidden'
}

const form = reactive({
  email: '',
  password: ''
})

const closeDialog = () => {
  emits('closeDialog')
}

const submit = () => {
  axios.post('http://localhost:8080/api/v1/login',form,{withCredentials:true})
        .then(response => {
          // Handle response
          console.log("login response:")
          console.log(response);
          if(response.status == 200){
            localStorage.setItem("username", response.data.username)
            localStorage.setItem("email" , response.data.email);
            localStorage.setItem("role" , response.data.role);
            localStorage.setItem("userId",response.data.id);
            console.log("role: " + response.data.role)
            userStore.setRole(response.data.role);
            userStore.setEmail(response.data.email);
            userStore.setUsername(response.data.username);
            userStore.setUserId(response.data.id);
            closeDialog();
            if(response.data.role ==  'ADMIN'){
              router.push('/admin/genres')
            } else {
              router.push('/profiles/' + response.data.id)
            }
          }
        })
        .catch(function (error) {
          // Handle errors
          display.value = 'block'
          visibility.value = 'visible'
          console.log(error.response.data)
          console.log(error.response.status)
          console.log(error.response.data.message)
          logginError.value = error.response.data.message
        });
  
}

</script>

<template>
    <el-dialog v-model="props.loginFormVisibility" 
        title="Login" width="30%" 
        :show-close="false" 
        :close-on-press-escape="false" 
        :close-on-click-modal="false"
        :center="true" >
    <el-alert title="error alert" type="error" :style="{display: display, visibility: visibility }" @close="hideAlert" :description="logginError" show-icon />
    <el-form :model="form">
      <el-form-item label="Email:" :label-width="formLabelWidth">
        <el-input v-model="form.email" autocomplete="off" />
      </el-form-item>
      <el-form-item label="Password:" :label-width="formLabelWidth">
        <el-input v-model="form.password" type="password" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog">Cancel</el-button>
        <el-button type="primary" @click="submit">
          Login
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>

<style scoped>
.el-alert {
  margin: 15px 0px
}
/* .el-alert:first-child {
  margin: 0;
} */

.hide{
  display: none;
  visibility: hidden;
}



</style>