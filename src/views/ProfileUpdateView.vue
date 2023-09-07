<script setup>
import { ElNotification } from 'element-plus'
import { reactive, ref ,onMounted, onUpdated} from 'vue';
import axios from 'axios';
import router from '../router';

onMounted(() => {getUser();})

const getUser = () => {
    axios
        .get('http://localhost:8080/api/v1/users/' + router.currentRoute.value.params.id)
        .then((response) => {
            console.log(response);
            formUserInfo.firstName = response.data.firstName;
            formUserInfo.lastName = response.data.lastName;
            formUserInfo.username = response.data.username;
            formUserInfo.email = response.data.email;
            formUserInfo.birthDate = response.data.birthDate;
            formUserInfo.description = response.data.description;
        })
        .catch(function(error) {
            if(error.response){
                console.log(error.response.status);
            }
        })
}

const formLabelWidth = '150px';

const formPassword = reactive({
    oldPassword: '',
    newPassword: ''
})

const formEmail = reactive({
    email: '',
    password: ''
})

const newPasswordConfirm = ref('')

const formUserInfo = reactive({
    firstName: '',
    lastName: '',
    username: '',
    birthDate: '',
    description: ''
})

const updateUserInfo = () => {
    console.log("update user info");
    axios
        .put('http://localhost:8080/api/v1/users',formUserInfo,{withCredentials:true})
        .then((response) => {
            console.log(response.data);
            ElNotification({
                title: 'Success',
                message: 'Password successfuly changed.',
                type: 'success',
            });
            getUser();
        })
        .catch(function(error){
            console.log(error.response)
            ElNotification({
                title: "Error",
                type: 'error',
                message: error.response.data.message
            })
        })
}

const changePassword = () => {
    console.log("change password")

    if(formPassword.newPassword != newPasswordConfirm.value) {
        console.log('Password not matching');
        return;
    }
    axios
        .put('http://localhost:8080/api/v1/users/password',formPassword, {withCredentials:true})
        .then((response) => {
            console.log(response);
            formPassword.oldPassword = '';
            formPassword.newPassword = '';
            newPasswordConfirm.value = '';
            ElNotification({
                title: 'Success',
                message: 'Password successfuly changed.',
                type: 'success',
            });
        })
        .catch(function (error) {
            console.log(error.respose);
        })

}

const changeEmail = () => {
    console.log("change email")

    axios
        .put('http://localhost:8080/api/v1/users/email',formEmail,{withCredentials:true})
        .then((response) => {
            console.log(response);
            ElNotification({
                title: 'Success',
                message: 'Email successfuly changed.',
                type: 'success',
            });
            formEmail.email = '';
            formEmail.password = '';
        })
        .catch(function(error) {
            console.log(error.response)
        })
}

</script>
<template>
    <h3>User info</h3>
    <el-form
        :model="formUserInfo"

    >
        <el-form-item 
            label="First Name: "
            :label-width="formLabelWidth"
            >
                <el-input 
                    v-model="formUserInfo.firstName"
                />
        </el-form-item>
        <el-form-item 
            label="Last Name: "
            :label-width="formLabelWidth"
            >
                <el-input
                    v-model="formUserInfo.lastName"
                />
        </el-form-item>
        <el-form-item 
            label="Username: "
            :label-width="formLabelWidth"
            >
                <el-input 
                    v-model="formUserInfo.username"
                
                />
        </el-form-item>
        <el-form-item 
            label="Date of Birth: "
            :label-width="formLabelWidth"
            >
                <el-date-picker 
                    v-model="formUserInfo.birthDate"
                />
        </el-form-item>
        <el-form-item 
            label="Description: "
            :label-width="formLabelWidth"
            >
            <el-input 
                type="textarea"
                v-model="formUserInfo.description"
            />
        </el-form-item>
        <el-form-item>
            <el-button type='primary' @click="updateUserInfo">Update user info</el-button>
        </el-form-item>
    </el-form>
    <el-divider></el-divider>
    <h4>Email:</h4>
    <el-form
        v-model="formEmail"
    >
        <el-form-item 
            label="New email:"
            :label-width="formLabelWidth"
            >
                <el-input
                    placeholder="Please input new email"
                    v-model="formEmail.email"
                />
        </el-form-item>
        <el-form-item 
            label="Confirm password"
            :label-width="formLabelWidth"
            >
                <el-input 
                    type="password"
                    placeholder="Please input password"
                    v-model="formEmail.password"
                />
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="changeEmail" >Change email</el-button>
        </el-form-item>
    </el-form>
    <el-divider></el-divider>
    <h4>Password change</h4>
    <el-form
        v-model="formPassword"
    >
        <el-form-item 
            label="Old password"
            :label-width="formLabelWidth"
            >
                <el-input
                    type="password"
                    placeholder="Please input old password"
                    show-password
                    v-model="formPassword.oldPassword"
                />
        </el-form-item>
        <el-form-item 
            label="New password"
            :label-width="formLabelWidth"
            >
                <el-input 
                    type="password"
                    placeholder="Please input new password"
                    v-model="formPassword.newPassword"
                />
        </el-form-item>
        <el-form-item 
            label="Repeat password"
            :label-width="formLabelWidth"
            >
            <el-input 
                type="password"
                placeholder="Please repeat new password"
                v-model="newPasswordConfirm"
            />
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="changePassword" >Change password</el-button>
        </el-form-item>
    </el-form>
</template>