<script setup>
import {ref,reactive, watch,onUpdated} from 'vue';
import axios from 'axios';
import router from '../../router';
import { useUserStore } from '../../stores/user';
import { ElNotification } from 'element-plus'

const userStore = useUserStore();

const props = defineProps(['dialogVisibility','authorInfo'])
const emits = defineEmits(['closeDialog'])

const author = reactive({
  id: '',
  firstName: '',
  lastName: ''
})
const formLabelWidth = '130px'

const form = ref({
  authorId: '',
  email: '',
  phoneNumber: '',
  message: ''
})

onUpdated(()=>{Object.assign(author,props.authorInfo)})


const showErrorNorification = (errorMessage) => {
  ElNotification({
    title: 'Error',
    message: errorMessage,
    type: 'error'
  })
}


const closeDialog = () => {
  emits('closeDialog')
}

const submit = () => {
  console.log("ZAHTEV ZA REG")
  console.log(props.authorInfo)
  form.value.authorId = author.id
  console.log(form.value)

  axios.post('http://localhost:8080/api/v1/authors/requests',form.value)
        .then(response => {
            ElNotification({
              type: 'success',
              title: 'Success',
              message: "The request is successfully submitted"
            });
            closeDialog();
          
        })
        .catch(function(error) {
          // Handle errors
          console.log(error.response.data)
          console.log(error.response.status)
          showErrorNorification(error.response.data.message)
          closeDialog();
        });
  
}

</script>

<template>
    <el-dialog v-model="props.dialogVisibility" 
        :title="`Author verification request: ${author.firstName} ${author.lastName}`" width="30%" 
        :show-close="false" 
        :close-on-press-escape="false" 
        :close-on-click-modal="false"
        :center="true" >
    <el-form :model="form">
      <el-form-item label="Email:" :label-width="formLabelWidth">
        <el-input v-model="form.email" autocomplete="off" />
      </el-form-item>
      <el-form-item label="Phone number:" :label-width="formLabelWidth">
        <el-input v-model="form.phoneNumber" autocomplete="off" />
      </el-form-item>
      <el-form-item label="Messsage:" :label-width="formLabelWidth">
        <el-input v-model="form.message" type="textarea" :rows="10" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog">Cancel</el-button>
        <el-button type="primary" @click="submit">
          Confirm
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>