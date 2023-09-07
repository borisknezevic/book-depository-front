<script setup>
import router from '../router';
import {reactive,computed} from 'vue';
import axios from 'axios';

import { ElMessage, ElMessageBox } from 'element-plus';


const form = reactive({
    name: ''
})

const enableButton = computed(() => {
    return form.name.length <= 0 ? true : false
});

const addNewGenre = () => {

    ElMessageBox.confirm(
    'Add new genre: ' + form.name +'. Continue?',
    'Warning',
        {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel',
        type: 'warning',
        }
    )
    .then(() => {
        axios
        .post('http://localhost:8080/api/v1/genres',form,{withCredentials:true})
        .then((response) => {
            console.log(response);
            ElMessage({
            type: 'success',
            message: 'Adding new genre successfuly completed!',
            })

            router.push('/admin/genres');
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
    })
}

</script>
<template>
    <div>
        <h3>Add new genre</h3>
    </div>
    <div>
        <el-form>
            <el-form-item label="Genre name">
                <el-input v-model="form.name" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button 
                    type="primary" 
                    @click="addNewGenre()"
                    :disabled="enableButton"
                    >Confirm</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>