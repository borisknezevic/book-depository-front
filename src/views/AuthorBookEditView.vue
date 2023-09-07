<script setup>
import { ElNotification } from 'element-plus';
import {ref,reactive, onMounted} from 'vue';
import axios from 'axios';
import router from '../router';

onMounted(() => {
    getBook();
    getGenres();
})

const genres = reactive([])
const form = reactive({
    id:'',
    title: '',
    isbn: '',
    publicationDate: '',
    numberOfPages: '',
    genre: {
        name: ''
    },
    description: ''
})

const getBook = () => {
    axios
        .get('http://localhost:8080/api/v1/books/' + router.currentRoute.value.params.bookId)
        .then((response) => {
            console.log(response.data)
            form.id = response.data.id
            form.title = response.data.title;
            form.isbn = response.data.isbn;
            form.publicationDate = response.data.publicationDate;
            form.numberOfPages = response.data.numberOfPages;
            form.genre = response.data.genre;
            form.description = response.data.description;
        })
        .catch(function(error) {
            if(error.response){
                console.log(error.response)
            }
        })
}


const getGenres = () => {
    axios
        .get('http://localhost:8080/api/v1/genres')
        .then((response) => {
            console.log(response);
            Object.assign(genres,response.data);
        })
        .catch(function(error) {
            if (error.response) {
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            } 
        })
}

const updateBook = () => {
    console.log('UPDATE BOOK')
    axios
        .put('http://localhost:8080/api/v1/books',form,{withCredentials:true})
        .then((response) => {
            console.log(response.data)
        })
        .catch(function(error) {
            if(error){
                console.log(error.response.data)
                console.log(error.response)
            }
        })
}

</script>
<template>
    <el-form
            :model="form"
            ref="ruleFormRef"
            :rules="rules"
            label-width="150px"
            status-icon
        >
            <el-form-item label="Title:" prop="title">
                <el-input v-model="form.title" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="ISBN:" prop="isbn">
                <el-input v-model="form.isbn" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="Publication date:" prop="publicationDate">
                <el-date-picker
                    v-model="form.publicationDate"
                    type="date"
                    placeholder="Pick a date"
                    style="width: 100%"
                />
            </el-form-item>
            <el-form-item label="Number of pages:" prop="numberOfPages">
                <el-input v-model.number="form.numberOfPages" type="text" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item label="Genre:" prop="genre">
                <el-select v-model="form.genre.name" filterable placeholder="Select">
                    <el-option
                    v-for="item in genres"
                    :key="item.id"
                    :label="item.name"
                    :value="item.name"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="Description:" prop="description">
                <el-input v-model="form.description" autocomplete="off" type="textarea" ></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="updateBook" >Update book</el-button>
            </el-form-item>
        </el-form>
</template>