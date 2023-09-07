<script setup>
import {ref, onMounted, reactive} from 'vue';
import axios from 'axios';
import router from '../router';
onMounted(()=> {getReviews();})

const tableData = ref();

const getReviews = () => {
    axios
        .get('http://localhost:8080/api/v1/users/' + router.currentRoute.value.params.id + '/reviews',{withCredentials:true} )
        .then((response) => {
            console.log(response.data);
            tableData.value = response.data;
        })
        .catch(function(error){
            if(error){
                console.log(error.response)
            }
        })
}

const handleEdit = (index,review) => {
    console.log("HANDLE EDIT");
    console.log(index);
    console.log(review);
    console.log(review.rating)
    router.push(router.currentRoute.value.fullPath + '/' + review.id)
}

</script>
<template>
    <el-table :data="tableData" style="width: 100%">
        <el-table-column prop="id" label="Id" width="180" />
        <el-table-column prop="bookDTO.title" label="Book title" width="180" />
        <el-table-column prop="reviewDate" label="Reveiw date" />
        <el-table-column label="Option">
            <template #default="scope">
                <el-button size="small" @click="handleEdit(scope.$index, scope.row)"
                    >Edit</el-button>
            </template>
        </el-table-column>
    </el-table>
</template>