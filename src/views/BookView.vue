<script setup>
import BookReview from '../components/BookReview.vue'
import {ref,reactive, onMounted} from 'vue';
import axios from 'axios';
import router from '../router';
import { useUserStore } from '../stores/user';
import AuthorRegistrationDialog from '../components/dialogs/AuthorRegistrationDialog.vue';
import AddBookToShelfDialog from '../components/dialogs/AddBookToShelfDialog.vue';
import { ElNotification } from 'element-plus';
import { Delete, Edit, Search, Share, Upload } from '@element-plus/icons-vue'


onMounted(() => {getBook();})

const store = useUserStore();

const book = ref({})
const author = ref({})
const genre = ref({})

const reviews = ref([])


const getBook = () => {

    axios
        .get('http://localhost:8080/api/v1/books/' + router.currentRoute.value.params.id)
        .then((response) => {
            console.log(response);
            // Object.assign(book.value,response.data)
            console.log("GET BOOK:")
            console.log("RESPONSE DATA")
            console.log(response.data)
            book.value = response.data;
            console.log(book.value)
            console.log("JUST GENRE:")
            console.log(response.data.genre)
            genre.value = response.data.genre;
            console.log(genre.value)
            console.log("JUST AUTHOR")
            console.log(response.data.authorDTO)
            // Object.assign(author,response.data.authorDTO)
            author.value = response.data.authorDTO
            console.log(author)
            // author.value = response.data.authorDTO
            getReviews();

        })
        .catch(function(error) {
            if(error.response){
                console.log(error.response.data);
                console.log(error.response.status);
            }
        })
}


const getReviews =  () => {

    axios
        .get('http://localhost:8080/api/v1/books/' + book.value.id + '/reviews' )
        .then((response) => {
            console.log(response);
            reviews.value = response.data;
        })
        .catch(function (error){
            if(error.response){
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.header);
            }
        })
}


const checkBookAuthor = () => {
    console.log('checkBookAuthor')
    console.log('Email in store: ' + store.getEmail)
    console.log('Author from book: ' + author.email)
    if(store.getEmail == author.email) return true
    return false
}

const checkLoggedUser = () => {
    if(store.getRole == 'READER' || store.getRole == 'AUTHOR') return true
    return false
}

const checkIfUserIsAdmin = () => {
    if(store.getRole == 'ADMIN' ) return true;
    return false;
}

const dialogVisible = ref(false)
const bookToShelfDialogVisible = ref(false);
const showDialog = () => {
    dialogVisible.value = !dialogVisible.value
}

const closeDialog = () => {
    dialogVisible.value = false
}

const showBookToShelfDialog = () => {
    bookToShelfDialogVisible.value = !bookToShelfDialogVisible.value;
}
const closeBookToShelfDialog = () => {
    bookToShelfDialogVisible.value = false;
}

const addBookToShelf = () => {
    showBookToShelfDialog();
}

const showAuthor = () => {
    router.push('/profiles/'+ book.value.authorDTO.id)
}

const removeBookByAdmin = () => {
    console.log('Remove book by ADMIN');
    axios
        .delete('http://localhost:8080/api/v1/books/' + router.currentRoute.value.params.id,{withCredentials:true})
        .then(response => {
            console.log(response)
            ElNotification({
                type: 'success',
                title: 'Success',
                message: 'Book successfully removed'
            })
            router.push('/admin/books');
        })
        .catch(function (error){
            if(error){
                console.log(error.response);
                ElNotification({
                    type:'error',
                    title: 'Delete book error',
                    message: error.response.data.message
                })
            }
        })
    }

const updateBookByAdmin = () => {
    console.log('Update book by ADMIN');
    router.push('/admin/books/' + router.currentRoute.value.params.id + '/update');
}


</script>
<template>
    <el-row class="container" justify="space-around">
        <el-col :span="3"></el-col>
        <el-col :span="18">
            <div class="background">
                <el-row >
                    <el-col :span="5" class="img-container">
                        <img
                        src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
                        class="image"
                        />
                    </el-col>
                    <el-col :span="18" class="book-info" >
                        <p>ISBN: {{ book.isbn }}</p>
                        <p>Title: {{ book.title }}</p>
                        <p>Publication date: {{book.publicationDate}}</p>
                        <p>Genre: {{genre.name}}</p>
                        <p>Number of pages: {{book.numberOfPages}}</p>
                        <p>Rating: {{book.rating}}</p>
                        <p>Author:<el-link @click="showAuthor">{{author.firstName}} {{ author.lastName }}</el-link></p>
                    </el-col>
                </el-row>
                <el-button v-if="checkBookAuthor()" type="danger">REMOVE BOOK</el-button>
                <el-button v-if="checkLoggedUser()" type="primary" @click="addBookToShelf">Add to shelf</el-button>
                <el-button v-if="checkIfUserIsAdmin()" type="danger" :icon="Delete" @click="removeBookByAdmin">Remove book</el-button>
                <el-button v-if="checkIfUserIsAdmin()" type="success" :icon="Edit" @click="updateBookByAdmin">Update book</el-button>
                <el-row >
                    <el-col :span="23" class="book-info" >
                        <p>Description:</p>
                        <p>{{ book.description }}</p>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="23">
                        <!-- ! BOOK REVIEW -->
                        <BookReview v-for="review in reviews" :review="review"/>
                    </el-col>
                </el-row>
                <AuthorRegistrationDialog 
                    :dialogVisibility = "dialogVisible"
                    :authorInfo="author"
                    @closeDialog="closeDialog" 
                    />
                <AddBookToShelfDialog 
                    :dialogVisibility = "bookToShelfDialogVisible"
                    :book = book
                    @closeDialog="closeBookToShelfDialog" 
                />
            </div>
        </el-col>
        <el-col :span="3"></el-col>
    </el-row>
</template>

<style scoped>

.image {
    display: flex;
    width: 200px;
    height: 300px;
}
.book{
    width: 100%;
}
.container{
    padding: 0;
    margin: 0;
}

.book-info{
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: flex-start;
    padding: 10px 15px 10px 50px;
    border: 7px solid #07689F;
    border-radius: 30px!important;
    background-color: #FAFAFA;
    box-shadow: 1px 1px 5px #EEEEEE;
    
}
.el-row {
  margin-bottom: 20px;
}
.background {
    background-color: #A2D5F2;
}
.el-row:last-child {
  margin-bottom: 0;
}
.el-col {
  border-radius: 4px;
}

.grid-content {
  border-radius: 4px;
  min-height: 36px;
}
</style>