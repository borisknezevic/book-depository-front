<script lang="ts" setup>
import {reactive,ref} from 'vue';
import axios from 'axios';
import type { FormInstance, FormRules } from 'element-plus';
import { ElNotification } from 'element-plus'
import router from '../router';
import AuthorRegistrationDialog from '../components/dialogs/AuthorRegistrationDialog.vue';

const successfulRegistrationNotification = () => {
  ElNotification({
    title: 'Successful registration',
    message: 'Registration was successful',
    type: 'success'
  })
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

const checkUsername = (rule:any, value:any, callback: any) => {
    if (value !== '') {
        axios.get('http://localhost:8080/api/v1/users/username', { params: {username: form.username}})
            .then(response => {
                // Handle response
                console.log(response.data);
                if(response.data == true) {
                    console.log("Username alrady exist!")
                    callback(new Error('Username already exists.'))
                } else {
                    callback()
                }
            })
            .catch(err => {
                // Handle errors
                console.error(err);
            });
    }
}
const checkEmail = (rule:any, value:any, callback:any) => {
    if (value !== '') {
        axios.get('http://localhost:8080/api/v1/users/email', { params: {email: form.email}})
            .then(response => {
                // Handle response
                console.log(response.data);
                if(response.data == true) {
                    console.log("Email is already taken!")
                    callback(new Error('Email is already taken!'))
                } else {
                    callback()
                }
            })
            .catch(err => {
                // Handle errors
                console.error(err);
            });
    }
}

const checkIfFirstCharIsNumber = (rule:any,value:any,callback:any) => {
  if(!isNaN(value.charAt(0))){
    console.log(value.charAt(0));
    callback(new Error('First char can not be number'));
  }
  callback();
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
      trigger: 'blur',
    },
    {
        required: true,
        validator: checkEmail,
        trigger: 'blur'
    }
  ],
  username: [
    { required: true, message: 'Please input username', trigger: 'blur' },
    { required: true, validator: checkUsername, trigger: 'blur' },
    { required: true, validator: checkIfFirstCharIsNumber, trigger: 'blur'}
    // { min: 3, message: 'Length should be at least 3 characters', trigger: 'blur' },
  ],
  password: [{required:true, validator: validatePass, trigger: 'blur' }],
  passwordConfimation: [{ validator: validatePass2, trigger: 'blur' }],
})

const submit = async() => {
  axios
    .post('http://localhost:8080/api/v1/registrations/readers',form)
    .then((response) => {
      console.log(response.data);
      console.log("Korisnik uspesno registrovan!")
      successfulRegistrationNotification();
      router.push('/');
    })
    .catch(function (error){
      console.log(error.response.data)
      console.log(error.response.status)
      console.log(error.response.data.message)
    })
}

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!')
      submit();
    } else {
      console.log('error submit!', fields)
    }
  })
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields();
}

</script>
<template>
    <el-row class="row-bg" justify="space-between">
        <el-col :xs="1" :sm="2" :md="3" :lg="4" :xl="4"></el-col>
        <el-col :span="12" class="container">
            <h3>Registration form:</h3>
            <el-form 
                ref="ruleFormRef"
                :model="form"
                :rules="rules"
                :size="formSize"
                status-icon
                >
                <el-form-item label="First Name" :label-width="formLabelWidth" prop="firstName" >
                    <el-input v-model="form.firstName" autocomplete="off" />
                </el-form-item>
                <el-form-item label="Last Name" :label-width="formLabelWidth" prop="lastName">
                    <el-input v-model="form.lastName" autocomplete="off" />
                </el-form-item>
                <el-form-item label="Username" :label-width="formLabelWidth" prop="username">
                    <el-input v-model="form.username" autocomplete="off" />
                </el-form-item>
                <el-form-item label="Email" :label-width="formLabelWidth" prop="email">
                    <el-input v-model="form.email" autocomplete="off" />
                </el-form-item>
                <el-form-item label="Password" :label-width="formLabelWidth" prop="password">
                    <el-input v-model="form.password" type="password" autocomplete="off" />
                </el-form-item>
                <el-form-item label="Password" :label-width="formLabelWidth"  prop="passwordConfimation">
                    <el-input v-model="form.passwordConfimation" type="password" autocomplete="off" />
                </el-form-item>
            </el-form>
            <div>
                <span class="dialog-footer">
                    <el-button @click="resetForm(ruleFormRef)">Reset form</el-button>
                    <el-button type="primary" @click="submitForm(ruleFormRef)">
                    Registration
                    </el-button>
                </span>
            </div>
        </el-col>
        <el-col :xs="1" :sm="2" :md="3" :lg="4" :xl="4"></el-col>
    </el-row>
    <AuthorRegistrationDialog />
</template>

<style scoped>
.container{
  min-width: 400px;
}
</style>