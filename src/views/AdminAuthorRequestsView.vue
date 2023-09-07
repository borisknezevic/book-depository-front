<script setup>

import {ref, onMounted} from 'vue';
import router from '../router';
import axios from 'axios';

onMounted(() => fillTable())

const tableData = ref([]);

const fillTable = () => {
    axios
        .get('http://localhost:8080/api/v1/admins/author_requests',{withCredentials:true})
        .then((response) => {
            console.log(response.data)
            tableData.value = response.data
        })
        .catch(function(error){
            if(error.response){
                console.log(error.response.data)
                console.log(error.response.status)
                console.log(error.response.headers)
            }
        })
}

const handleTagType = (status) => {
    console.log(status);
    if(status == 'APPROVED') return 'success';
    if(status == 'PENDING') return 'warning';
    if(status == 'DECLINED') return 'danger';
    return 'info';
}

const handleResolve = (index,proxyRequest) => {

    const request = {...proxyRequest};
    console.log(request);

    router.push('/admin/requests/' + request.requestId);
}

</script>
<template>
    <el-table :data="tableData" style="widows: 100%;">
        <el-table-column prop="requestId" label="Id" width="100" />
        <el-table-column prop="date" label="Date" width="150" />
        <el-table-column prop="email" label="Email" width="250" />
        <el-table-column prop="phoneNumber" label="Phone number" width="150" />
        <el-table-column prop="requestStatus" label="Status" width="150">
            <template #default="scope">
                <el-tag
                    :type="handleTagType(scope.row.requestStatus)"
                    effect='dark'
                >  
                    {{scope.row.requestStatus}}
                </el-tag>
            </template>

        </el-table-column>
        <el-table-column label="Operation" width="150">
            <template #default="scope">
                <div>
                    <el-button v-if="scope.row.requestStatus === 'PENDING'"
                        type="info" 
                        size="small"
                        @click="handleResolve(scope.$index, scope.row)"
                    >
                    Resovle
                    </el-button>
                    <el-button v-else
                        type="primary"
                        size="small"
                        @click="handleResolve(scope.$index, scope.row)"
                    >INFO</el-button>
                </div>
            </template>
        </el-table-column>
    </el-table>
</template>