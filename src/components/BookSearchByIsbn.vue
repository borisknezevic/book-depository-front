<script setup>
import {ElMessageBox} from 'element-plus';
import axios from 'axios';
import {ref} from 'vue';


const isbn = ref('');

const getBook = () => {
    axios
        .get('http://localhost:8080/api/v1/books/isbn',{params:{isbn:isbn.value}})
        .then(function (response){
            console.log(response);
        })
        .catch(function (error){
            if(error.response){
                ElMessageBox.alert(error.response.data.message);
                console.log(error.response.data);
                console.log(error.response.status);
            }
        })
}

</script>
<template>
    <div>
        <el-form>
            <el-form-item label="ISBN" prop="isbn">
                <el-input v-model="isbn" autocomplete="off"/>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="getBook()">Search by isbn</el-button>
            </el-form-item>
        </el-form>
    </div>
    <el-divider />
</template>
<style scoped>


</style>