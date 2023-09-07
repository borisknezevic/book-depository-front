<script setup>
import {ref, onMounted} from 'vue';
import router from '../router'
import axios from 'axios';
import { ElLoading ,ElMessage} from 'element-plus'


const request = ref({});
const message = ref('TEST');

onMounted(()=>{getRequest();})

const getRequest = () => {

    axios
        .get('http://localhost:8080/api/v1/admins/author_requests/' + router.currentRoute.value.params.id, {withCredentials:true})
        .then((response) => {
            console.log(response.data)
            request.value = response.data;
        })
        .catch(function (error) {
            if(error.response){
                console.log(error.response.data);
                console.log(error.reponse.status);
            }
        })
}

const handleResolve = (status) => {

    const loading = ElLoading.service({
        lock: true,
        text: 'Loading',
        background: 'rgba(0, 0, 0, 0.7)',
    })

    const response = 
    {
        authorRequestId:  request.value.requestId,
        approvedStatus: status,
        message: message.value
    }

    axios
        .put('http://localhost:8080/api/v1/admins/author_requests',response,{withCredentials:true})
        .then((response) => {
            console.log(response);
            loading.close();
            router.back();
            ElMessage({
                    type: 'success',
                    message: 'Completed',
                });
        })
        .catch(function (error) {
            loading.close();
            if(error.response){
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
                ElMessage.error(error.response.data.message)
            }
        })
} 

</script>
<template>
    <div>
        <h3>Author:</h3>
        <div class="flex_row">
            <p>Request ID: </p>
            <p>{{ request.requestId }}</p>
        </div>
        <div class="flex_row">
            <p>Author ID:</p>
            <p>{{ request.authorId }}</p>
        </div>
        <div class="flex_row">
            <p>First name:</p>
            <p>{{ request.firstName }}</p>
        </div>
        <div class="flex_row">
            <p>Last name:</p>
            <p>{{ request.lastName }}</p>
        </div>
        <div class="flex_row">
            <p>Phone number:</p>
            <p>{{request.phoneNumber}}</p>
        </div>
        <div class="flex_row">
            <p>Email:</p>
            <p>{{request.email}}</p>
        </div>
        <div class="flex_row">
            <p>Request date:    </p>
            <p>{{request.date}}</p>
        </div>
        <div class="flex_row">
            <p>Message:</p>
            <p>{{ request.message }}</p>
        </div>
        <div v-if="request.requestStatus === 'PENDING'" class="flex_row">
            <el-button type="success" @click="handleResolve(true)">Accept</el-button>
            <el-button type="danger" @click="handleResolve(false)" >Reject</el-button>
        </div>
    </div>
</template>
<style scoped>
.flex_row{
    display: flex;
}
</style>