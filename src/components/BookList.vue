  <script setup>
import { reactive, ref,onMounted,watch } from 'vue';
import { useBooksStore } from '../stores/books';
import { storeToRefs } from 'pinia';
import axios from 'axios';

const books = reactive([]);
const booksStore = useBooksStore();
const { bookList } = storeToRefs(booksStore);

watch(bookList, () => {
  Object.assign(books,bookList.value);
})

onMounted(() => {
  getAllBooks();
})

const getAllBooks = () => {
  // console.log("GET ALL BOOKS");
  if(!booksStore.lastBookSearch.lenght) {
  axios
    .get('http://localhost:8080/api/v1/books/all')
    .then((response) => {
      // console.log(response.data);
      bookList.value=response.data;
    })
    .catch(function(error) {
      console.log(error.response)
    })
  }
}

// const currentDate = ref(new Date())
</script>



<template>
<el-row>
  <el-card
  v-for="book in booksStore.bookList" 
  :key="book.id"
  :body-style="{ padding: '0px'}"
  class="card zoom"
  >
  <!-- :to="{ name: 'user', params: { userId: 123 }} -->
  <RouterLink :to="{ name: 'book', params: {id: book.id}}" >
  <img
    src="https://shadow.elemecdn.com/app/element/hamburger.9cf7b091-55e9-11e9-a976-7f4d0b07eef6.png"
    class="image"
  />
    <div style="padding: 14px">
      <span>{{book.title}}</span>
      
      <div class="bottom">
        <p class="time">{{ book.genre.name }}</p><br>
        <p class="time">{{ book.authorDTO.firstName}} {{ book.authorDTO.lastName }}</p>
      </div>
    </div>
  </RouterLink>
  </el-card>
</el-row>
</template>
<style scoped>
  .time {
    font-size: 12px;
    color: #999;
    text-decoration: none;
  }
  
  a {
    color: #000;
    text-decoration: none;
  }
  .bottom {
    margin-top: 13px;
    line-height: 12px;
    display: flex;
    flex-direction: column;
    justify-content: justify-content;
    align-items: flex-start;
  }
  
  .button {
    padding: 0;
    min-height: auto;
  }
  
  .image {
    width: 100%;
    display: block;
  }
  .card{
    width: 200px;
    margin-right: 20px;
    margin-bottom: 15px;
  }


  .el-row {
  margin-left: 40px;
  }

  .zoom {
  transition: transform .2s; /* Animation */
}

.zoom:hover {
  transform: scale(1.05);
  cursor: pointer
}

  </style>
  