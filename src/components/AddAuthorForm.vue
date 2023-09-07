<script setup>
import {reactive , ref} from 'vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import axios from 'axios';
import router from '../router';

const form =  reactive({
    firstName: '',
    lastName: '',
    birthDate: ''
})

const addNewAuthor = () => {
    axios
        .post('http://localhost:8080/api/v1/authors', form,{withCredentials:true})
        .then((response) => {
            console.log(response)
            if(response.status >= 200){
                ElMessage({
                type: 'success',
                message: 'Author successfuly added!',
                });
            }
            router.back();
        })
        .catch(function (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
                ElMessage.error(error.response.data.message);
            } 
        })
}


</script>
<template>
    <div>
        <h3>Add new author</h3>
    </div>
    <div>
        <el-form>
            <el-form-item label="First Name:">
                <el-input v-model="form.firstName" ></el-input>
            </el-form-item>
            <el-form-item label="Last Name:">
                <el-input v-model="form.lastName"></el-input>
            </el-form-item>
            <el-form-item label="Birth Date:">
                <el-date-picker v-model="form.birthDate"></el-date-picker>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="addNewAuthor()">Confirm</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>