<script setup>
import axios from 'axios';
import { useRoute } from 'vue-router'; 
import {ref,onMounted} from 'vue';

import { ElMessage, ElMessageBox } from 'element-plus';
import router from '../router';
const route = useRoute();

onMounted(()=> {getAuthor();})

const author = ref({
    id: '',
    firstName: '',
    lastName: '',
    accountActive: false,
    email: '',
    phoneNumber: '',
    birthDate: '',
    username: ''
})

var authorTemp = {}

const getAuthor = () => {
    console.log('Auhtor id: ' + route.params.id);
    axios
        .get('http://localhost:8080/api/v1/authors/' + route.params.id)
        .then((response) => {
            console.log(response)
            author.value = response.data;
        })
}

const updateMode = ref(false);


const startUpdate = () => {
    updateMode.value = !updateMode.value;
    authorTemp = { ...(author.value)};
}

const cancelUpdate = () => {
    updateMode.value = !updateMode.value;
    author.value = {...authorTemp};
}

const saveChanges = () => {
    axios
        .put('http://localhost:8080/api/v1/authors',author.value, {withCredentials:true} )
        .then((response) => {
            console.log(response.data);
            if(response.status >= 200) 
            {
                author.value = response.data;
                ElMessage({
                type: 'success',
                message: 'Author successfuly updated!',
                })
            }
            updateMode.value = false;
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

const deleteAuthor = () => {
    console.log('DELETING')
    axios
        .delete('http://localhost:8080/api/v1/authors/' + route.params.id, {withCredentials:true})
        .then((response) => {
            console.log(response)
            if(response.status >= 200) 
            {
                author.value = response.data;
                ElMessage({
                type: 'success',
                message: 'Author successfuly deleted!',
                })
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
    <p v-if="author.accountActive">Status: <el-tag effect="dark" type="success">VERIFIED</el-tag></p>
    <p v-else >Status: <el-tag effect="dark" type="warning">UNVERIFIED</el-tag></p>
    
    <div>
        <el-form
        :label-position="left"
        label-width="150px"
        >
            <el-form-item label="Author ID: ">
                <el-input v-if="updateMode" v-model="author.id"/>
                <p v-else class="form_item" >{{ author.id }}</p>
            </el-form-item>
            <el-form-item label="First Name: ">
                <el-input v-if="updateMode" v-model="author.firstName"/>
                <p v-else class="form_item" >{{ author.firstName }}</p>
            </el-form-item>
            <el-form-item label="Last Name: ">
                <el-input v-if="updateMode" v-model="author.lastName"/>
                <p v-else class="form_item" >{{ author.lastName }}</p>
            </el-form-item>
            <el-form-item label="Birth Date: ">
                <el-date-picker v-if="updateMode" v-model="author.birthDate"/>
                <p v-else class="form_item" >{{ author.birthDate }}</p>
            </el-form-item>
            <div v-if="author.accountActive">
                <el-form-item label="Email: ">
                    <el-input v-if="updateMode" v-model="author.email"/>
                    <p v-else class="form_item" >{{ author.email }}</p>
                </el-form-item>
                <el-form-item label="Phone number: ">
                    <el-input v-if="updateMode" v-model="author.phoneNumber"/>
                    <p v-else class="form_item" >{{ author.phoneNumber }}</p>
                </el-form-item>
                <el-form-item label="Username: ">
                    <el-input v-if="updateMode" v-model="author.username"/>
                    <p v-else class="form_item" >{{ author.username }}</p>
                </el-form-item>
            </div>
        </el-form>
        <div>
            <div v-if="updateMode">
                <el-button type="danger" @click="cancelUpdate()">Cancel</el-button>
                <el-button type="primary" @click="saveChanges()">Save changes</el-button>
            </div>
            <div v-else>
                <el-button v-if="!author.accountActive" type="primary" @click="startUpdate()">Update</el-button>
                <el-button v-if="!author.accountActive" type="danger" @click="deleteAuthor()">Delete</el-button>
            </div>
        </div>    
    </div>

</template>

<style scoped>
.form_item {
    margin:0;
}
.form_item_p {
    margin-top: 0;
}
</style>