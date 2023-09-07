<script lang="ts" setup>
import {reactive,ref} from 'vue';
import axios from 'axios';
import type { FormInstance, FormRules } from 'element-plus';

const props = defineProps(['registrationFormVisibility'])
const emits = defineEmits(['closeDialog','showMessage'])

const closeDialog = () => {
  emits('closeDialog')
}
const showMessage = () => {
  emits('showMessage')
}

const validatePass = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('Please input the password'))
  } else {
    if (form.passwordConfimation !== '') {
      if (!ruleFormRef.value) return
      ruleFormRef.value.validateField('checkPass', () => null)
    }
    callback()
  }
}

const validatePass2 = (rule: any, value: any, callback: any) => {
  if (value === '') {
    callback(new Error('Please input the password again'))
  } else if (value !== form.password) {
    callback(new Error("Two inputs don't match!"))
  } else {
    callback()
  }
}

const formLabelWidth = '120px'
const ruleFormRef = ref<FormInstance>();
const form = reactive({
  firstName:'',
  lastName:'',
  email:'',
  username: '',
  password: '',
  passwordConfimation:''
})

const formSize = ref('default');

const rules = reactive<FormRules>({
  firstName: [
    { required: true, message: 'Please input first name', trigger: 'blur' },
    // { min: 3, message: 'Length should be at least 3 characters', trigger: 'blur' },
  ],
  lastName: [
    { required: true, message: 'Please input last name', trigger: 'blur' },
    // { min: 3, message: 'Length should be at least 3 characters', trigger: 'blur' },
  ],
  email: [
    {
      required: true,
      message: 'Please input email address',
      trigger: 'blur',
    },
    {
      type: 'email',
      message: 'Please input correct email address',
      trigger: ['blur', 'change'],
    },
  ],
  username: [
    { required: true, message: 'Please input username', trigger: 'blur' },
    // { min: 3, message: 'Length should be at least 3 characters', trigger: 'blur' },
  ],
  password: [{required:true, validator: validatePass, trigger: 'blur' }],
  passwordConfimation: [{ validator: validatePass2, trigger: 'blur' }],
})



const submit = () =>{
  axios
    .post('http://localhost:8080/api/v1/registrations/readers',form)
    .then((response) => {
      console.log(response.data);
      if(response.status == 201){
        showMessage();
        closeDialog();
      }
      // router.push('/profile')
    })
    .catch((error) => {
          console.error("Error:", error);
        })
}

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!')
    } else {
      console.log('error submit!', fields)
    }
  })
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields();
  closeDialog();
}

</script>
<template>
     <el-dialog v-model="props.registrationFormVisibility" 
        title="Registration" width="30%" 
        :show-close="false" 
        :close-on-press-escape="false" 
        :close-on-click-modal="false"
        :center="true" >
    <el-form 
      ref="ruleFormRef"
      :model="form"
      :rules="rules"
      :size="formSize"
      >
      <el-form-item label="First Name" :label-width="formLabelWidth" prop="firstName" >
        <el-input v-model="form.firstName" autocomplete="off" />
      </el-form-item>
      <el-form-item label="Last Name" :label-width="formLabelWidth" prop="lastName">
        <el-input v-model="form.lastName" autocomplete="off" />
      </el-form-item>

    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="resetForm(ruleFormRef)">Cancel</el-button>
        <el-button type="primary" @click="submitForm(ruleFormRef)">
          Confirm
        </el-button>
      </span>
    </template>
  </el-dialog>
</template>