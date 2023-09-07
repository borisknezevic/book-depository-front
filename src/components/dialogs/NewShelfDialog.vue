<script setup>
import {ref,reactive, watch} from 'vue';
import { ElNotification } from 'element-plus';
import router from './../../router'
import axios from 'axios';

const form = reactive({
    shelfName: ''
});


const props = defineProps(['dialogVisibility'])
const emits = defineEmits(['closeDialog'])


const userId = router.currentRoute.value.params.id;
const formLabelWidth = '100px'
const closeDialog = () => {
  form.shelfName = '';
  hideAlert();
  emits('closeDialog')
}
const hideAlert = () => {
  display.value = 'none'
  visibility.value = 'hidden'
}
const display = ref('none')
const visibility = ref('hidden')
const errorMessage = ref('')

const submit = () => {
    console.log("SHELFNAME: " + form.shelfName)
    axios
    .post('http://localhost:8080/api/v1/users/' + userId + '/shelves',
    form,
    {withCredentials:true})
    .then((response) => {
      console.log(response.data);
      form.shelfName = '';
      ElNotification({
        title: 'Success',
        type:'success',
        message: `Shelf: ${form.shelfName} successfully added`,

      })
      emits('closeDialog')
      //   shelves.value = response.data;
    })
    .catch(function(error) {
      if(error.response){
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.data.message);
        display.value = 'block'
        visibility.value = 'visible'
        errorMessage.value = error.response.data.message
      }
      
    })

}

</script>
<template>
    <el-dialog v-model="props.dialogVisibility" 
        title="Add new shelf" width="30%" 
        :show-close="false" 
        :close-on-press-escape="false" 
        :close-on-click-modal="false"
        :center="true" >
    <el-alert title="Unique name" type="error" :style="{display: display, visibility: visibility }" @close="hideAlert" :description="errorMessage" show-icon />
    <el-form v-model="form">
      <el-form-item label="Shelf name:" :label-width="formLabelWidth">
        <el-input v-model="form.shelfName" autocomplete="off" />
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