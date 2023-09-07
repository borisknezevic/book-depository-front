<script setup>
import { ElNotification } from 'element-plus';
import {ref,reactive, onMounted} from 'vue';
import axios from 'axios';
import router from '../router';

onMounted(() => {
    getBook();
    getGenres();
    getAuthors();
})

const genres = reactive([])
const form = reactive({
    id:'',
    title: '',
    isbn: '',
    authorId: '',
    publicationDate: '',
    numberOfPages: '',
    genre: '',
    description: ''
})

const authors = reactive([])

const getBook = () => {
    axios
        .get('http://localhost:8080/api/v1/books/' + router.currentRoute.value.params.id)
        .then((response) => {
            console.log(response.data)
            form.id = response.data.id;
            form.title = response.data.title;
            form.isbn = response.data.isbn;
            form.authorId = response.data.authorDTO.id;
            form.publicationDate = response.data.publicationDate;
            form.numberOfPages = response.data.numberOfPages;
            form.genre = response.data.genre.name;
            form.description = response.data.description;
        })
        .catch(function(error) {
            if(error.response){
                console.log(error.response)
            }
        })
}


const getAuthors = () => {
    axios  
        .get('http://localhost:8080/api/v1/authors')
        .then((response) => {
            console.log(response);
            Object.assign(authors,response.data);
        })
        .catch(function(error) {
            if(error.response)
                console.log(error.response.data);
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
    console.log('UPDATE BOOK');
    console.log('FORM:')
    console.log({...form})
    axios
        .put('http://localhost:8080/api/v1/admins/books',form,{withCredentials:true})
        .then((response) => {
            console.log(response.data);
            ElNotification({
                type: 'success',
                title: 'Success',
                message: 'Book successfully updated'
            });
            router.push('/books/' + form.id)
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
    <h4>Update book:</h4>
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
            <el-form-item label="Author:" prop="author">
                <el-select v-model="form.authorId" filterable placeholder="Select">
                    <el-option
                    v-for="author in authors"
                    :key="author.id"
                    :label="`${author.firstName} ${author.lastName}`"
                    :value="author.id"
                    />
                </el-select>
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
                <el-select v-model="form.genre" filterable placeholder="Select">
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