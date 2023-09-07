<script setup>
import { ElNotification } from 'element-plus';
import axios from 'axios';
import { ref,reactive,onMounted} from 'vue';
import router from '../router';
import { useUserStore } from '../stores/user';


onMounted(() => {
    getBooks();
    getGenres();
})

const userStore = useUserStore();

const bookList = ref();
const genres = reactive([]);
const form = reactive({
    title:'',
    authorId:'',
    isbn:'',
    publicationDate:'',
    numberOfPages:'',
    genre:'',
    description:''
});

const getBooks = () => {
    axios
        .get('http://localhost:8080/api/v1/authors/' + router.currentRoute.value.params.id + '/books' )
        .then((response) => {
            console.log(response.data)
            bookList.value = response.data;
        })
        .catch(function(error) {
            if(error){
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


const handleEdit = (index,book) => {
    console.log("EDIT BOOK BY AUTHOR")
    console.log('/authors/' + userStore.userId + '/books/' + book.id)
    router.push('/authors/' + userStore.userId + '/books/' + book.id)
}

const addBook = () => {
    console.log("ADD NEW BOOK")
    form.authorId = userStore.userId;
    axios
        .post('http://localhost:8080/api/v1/books',form,{withCredentials:true})
        .then((response) => {
            console.log(response.data)
            getBooks();
            ElNotification({
                type:'success',
                title: 'Success',
                message: "New book successfuly added."
            })
        })
        .catch(function (error) {
            if(error){
                console.log(error.response)
                console.log(error.response.data)
            }
        })
}

const resetForm = () => {
    console.log("RESET FORM")
}

</script>
<template>
    <h3>Books:</h3>
    <el-table :data="bookList" style="width: 100%">
        <el-table-column prop="id" label="Id" width="180" />
        <el-table-column prop="title" label="Book title" width="180" />
        <el-table-column prop="publicationDate" label="Publication date" />
        <el-table-column label="Options">
            <template #default="scope">
                <el-button size="small" @click="handleEdit(scope.$index, scope.row)"
                    >Edit</el-button>
            </template>
        </el-table-column>
    </el-table>
    <el-divider />
    <h2>Add new book</h2>
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
                <el-button type="primary" @click="addBook" >Confirm</el-button>
                <el-button  @click="resetForm" >Reset</el-button>
            </el-form-item>
        </el-form>
</template>