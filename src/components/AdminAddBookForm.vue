<script lang="ts" setup>
import {reactive,ref,onMounted} from 'vue';
import { ElNotification, type FormInstance, type FormRules } from 'element-plus';
import axios from 'axios';
import router from '../router';

interface Author {
    id: number,
    firstName: string,
    lastName: string
}

interface Genre {
    id: number,
    name: string
}


const authors = reactive<Array<Author>>([]);
const genres = reactive<Array<Genre>>([]);

onMounted(()=> {
    getGenres();
    getAuthors();
})

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

const getAuthors = () => {
    axios  
        .get('http://localhost:8080/api/v1/admins/unauthorized_authors')
        .then((response) => {
            console.log(response);
            Object.assign(authors,response.data);
        })
        .catch(function(error) {
            if(error.response)
                console.log(error.response.data);
        })
}

const addBook = () => {
    console.log(form)

    axios
        .post('http://localhost:8080/api/v1/admins/books',form,{withCredentials:true})
        .then((response) => {
            console.log(response);
            ElNotification({
                type:'success',
                title: 'Book added',
                message: "New book successfully added."
            });
            router.back();
        })
        .catch(function (error){
            if(error.response)
                console.log(error.response.data);
        })
}

const checkIsbn = (rule:any, value:any, callback:any) => {
    axios
        .get('http://localhost:8080/api/v1/books/checkisbn',{params: {isbn: form.isbn}})
        .then((response) => {
            console.log("CHECK ISBN");
            console.log(response.data);
            if(response.data == true) {
                    console.log("ISBN is already taken!")
                    callback(new Error('ISBN is already taken!'))
                } else {
                    callback()
                }
        })
        .catch(function(error){
            if(error.response)
                console.log(error.response.data);
        })
}

const ruleFormRef = ref<FormInstance>();
const form = reactive({
    title:'',
    authorId:'',
    isbn:'',
    publicationDate:'',
    numberOfPages:'',
    genre:'',
    description:''
});

const rules = reactive<FormRules>({
    title: [
        {required: true, message: 'Please input first title', trigger: 'blur'}
    ],
    authorId: [
        {required: true, message: 'Please select author', trigger: 'change'}
    ],
    isbn: [
        {required: true, message: 'Please insert isbn', trigger: 'blur'},
        {min:11,max:13,message: 'Length must be 11 numbers' , trigger: 'blur'},
        {required: true, validator: checkIsbn, trigger: 'blur'}
    ],
    publicationDate: [
        {type: 'date',required: true, message: 'Please pick a publication date', trigger: 'change'}
    ],
    numberOfPages: [
        {required: true, message: "Please insert number of pages"},
        {type: 'number', message: "Must be number"}
    ],
    genre: [
        {required: true, message: 'Please select genre', trigger: 'change'}
    ],
    description: [
        {required: true, message: 'Please input description', trigger: 'blur'}
    ],
})

const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('submit!');
      addBook();
    } else {
      console.log('error submit!', fields)
    }
  })
}

const resetForm = (formEl: FormInstance | undefined) => {
  if (!formEl) return
  formEl.resetFields()
}



</script>
<template>
    <div>
        <h3>Add new book:</h3>
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
            <el-form-item label="Author" prop="authorId">
                <el-select v-model="form.authorId" filterable placeholder="Select">
                    <el-option
                    v-for="author in authors"
                    :key="author.id"
                    :label= "`${author.firstName} ${author.lastName}`"
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
                <el-button type="primary" @click="submitForm(ruleFormRef)" >Confirm</el-button>
                <el-button  @click="resetForm(ruleFormRef)" >Reset</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>