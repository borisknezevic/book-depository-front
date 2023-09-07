<script setup>
import { ElMessage, ElMessageBox } from 'element-plus';
import {ref,onMounted} from 'vue';
import axios from 'axios';

const tableData = ref([])


onMounted(()=> {fillTable();})

//adding data to the table
const fillTable = () => {
    axios
        .get('http://localhost:8080/api/v1/genres')
        .then((response) => {
            tableData.value = response.data;
        })
}


const handleDelete = (index, proxyGenre) => {
    const genre = {...proxyGenre};
    // console.log(genre)


    // console.log('http://localhost:8080/api/v1/genres/' + genre.id);
    
    ElMessageBox.confirm(
    'Permanently delete the genre. Continue?',
    'Warning',
    {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning',
    }
    )
    .then(() => {
        axios
        .delete('http://localhost:8080/api/v1/genres/' + genre.id,{withCredentials:true})
        .then((response) => {
            console.log(response);
            if(response.status == 200){
                console.log("status: 202")
                tableData.value = tableData.value.filter(gen => gen.id != genre.id);
                ElMessage({
                    type: 'success',
                    message: 'Delete completed',
                });
            }
        })
        .catch(function (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
                ElMessage.error(error.response.data.message)
            } 
        })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: 'Delete canceled',
      })
    })
    
   
}

const handleUpdate = (index, proxyGenre) => {
    console.log(proxyGenre);
    console.log({...proxyGenre});
    const genre = {...proxyGenre}
    ElMessageBox.prompt('Please input new genre name', 'Tip', {
    confirmButtonText: 'OK',
    cancelButtonText: 'Cancel',
    inputValue: genre.name,
    inputPattern:
      /^(?=.*[a-zA-Z])/,
    inputErrorMessage: 'Invalid name',
  })
    .then(({ value }) => {
        console.log("Genre:");
        console.log(genre);
        genre.name = value;
        axios
            .put('http://localhost:8080/api/v1/genres/' + genre.id ,genre,{withCredentials:true})
            .then((response) => {
                console.log(response);
                ElMessage({
                    type: 'success',
                    message: 'Update completed',
                });
            })
            .catch(function (error) {
            if (error.response) {
                // The request was made and the server responded with a status code
                // that falls out of the range of 2xx
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
                // ElMessage.error(error.response.data.message)
            } 
        })
    //   ElMessage({
    //     type: 'success',
    //     message: `Genre name successfuly updated.\n Your new genre name is: ${value}`,
    //   })
    })
    // .catch(() => {
    //   ElMessage({
    //     type: 'info',
    //     message: 'Input canceled',
    //   })
    // })

}
</script>
<template>
    <el-table :data="tableData" style="width: 100%" height="600">
        <el-table-column prop="id" label="Id" width="150" />
        <el-table-column prop="name" label="Name" width="*" />
        <el-table-column fixed="right" label="Options" width="*">
            <template #default="scope">
                <!-- ADMIN -->
                <!-- <div v-if="userStore.getUserRole == 'ADMIN'"> -->
                <div>
                    <el-button
                    size="small"
                    type="primary"
                    @click="handleUpdate(scope.$index, scope.row)"
                    >
                    Update
                    </el-button>
                    <el-divider direction="vertical"></el-divider>
                    <el-button
                    size="small"
                    type="danger"
                    @click="handleDelete(scope.$index, scope.row)"
                    >
                    Delete
                    </el-button>
                </div>
            </template>
        </el-table-column>
    </el-table>
</template>