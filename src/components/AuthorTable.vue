<script setup>
import {ref, onMounted} from 'vue';
import router from '../router'
import axios from 'axios';


const tableData = ref([]);

onMounted(() => {fillTable();})

const fillTable = () => {
    axios
        .get("http://localhost:8080/api/v1/authors")
        .then((response) => {
            tableData.value = response.data;
            console.log(response.data)
        })
        .catch((error) => {
            console.log(error)
        })

}


const handleTagType = (status) => {
    console.log(status);
    if(status == true) return 'success';
    if(status == false) return 'warning';
    return 'info';
}

const handleStatusText = (status) => {
    console.log(status);
    if(status == true) return 'VERIFIED';
    if(status == false) return 'UNVERIFIED';
    return 'info';
}

const handleInfo = (index,proxyAuthor) => {
    console.log("MORE INFO")
    const author = {...proxyAuthor}
    console.log(author)

    router.push('/admin/authors/' + author.id)

}

</script>
<template>
   <el-table :data="tableData" style="width: 100%" height="600">
        <el-table-column prop="id" label="Id" width="150"/>
        <el-table-column prop="firstName" label="First Name" width="150"/>
        <el-table-column prop="lastName" label="Last Name" width="150"/>
        <el-table-column prop="status" label="Status" width="150">
            <template #default="scope">
                <el-tag
                    :type="handleTagType(scope.row.accountActive)"
                    effect='dark'
                    size='default'
                >  
                    {{handleStatusText(scope.row.accountActive)}}
                </el-tag>
            </template>
        </el-table-column>
        <el-table-column prop="info" label="Info" width="150">
            <template #default="scope">
                <div>
                    <el-button 
                        type="primary" 
                        size="small"
                        @click="handleInfo(scope.$index, scope.row)"
                    >
                    MORE INFO
                    </el-button>
                </div>
            </template>
        </el-table-column>
   </el-table>
</template>