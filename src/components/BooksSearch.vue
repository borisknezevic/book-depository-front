<script setup>
import axios from 'axios';
import { reactive,ref } from 'vue';
import {onMounted} from 'vue';
import { useBooksStore } from '../stores/books';


const bookStore = useBooksStore();
const genres = ref([])

const ratings = [
  {
    value: '1',
    label: '0-1',
  },
  {
    value: '2',
    label: '1-2',
  },
  {
    value: '3',
    label: '2-3',
  },
  {
    value: '4',
    label: '3-4',
  },
  {
    value: '5',
    label: '4-5',
  },
]

const request = reactive({
  title: '',
  publicationYear: '',
  genre : {
    name: ''
  },
  rating : '',
})

onMounted(() => {getGenres();})

const getGenres = () => {
  axios
      .get('http://localhost:8080/api/v1/genres')
      .then((response) => {
          // console.log(response.data);
          genres.value = response.data;
        })
      .catch(function(error) {
        if(error){
          console.log(error.response.status);
          console.log(error.response.data);
        }
      })
}

const getBooks = () => {
  // console.log("submit");
  console.log(request.publicationYear)
  axios
    .get('http://localhost:8080/api/v1/books',
    {
      params:{ 
        title: request.title != '' ? request.title : null,
        publicationYear: request.publicationYear != 0 ? request.publicationYear : null ,
        genre: request.genre.name != '' ? request.genre.name : null,
        rating: request.rating != 0 ? request.rating : null
      }
    })
    .then((response) =>{
      // console.log(response.data);
      bookStore.setBooks(response.data);
    })
    .catch(function (error){
      console.log(error);
    })
}

const clearFields = () => {
    request.title = '';
    request.publicationYear = '';
    request.genre.name = '';
    request.rating = ''
  }

</script>

<template>
    <el-row class="row" :gutter="20" justify="space-evenly">
        <el-form :inline="true" :model="request" class="demo-form-inline">
            <el-form-item label="Title">
                <el-input v-model="request.title" placeholder="Book Title" />
            </el-form-item>
            <el-form-item label="Publication Year">
                <el-input 
                  v-model.number="request.publicationYear"
                  filterable placeholder="Select" />
                  <!-- <el-date-picker
                    v-model="request.publicationYear"
                    type="year"
                    placeholder="Pick a year"
                  /> -->
            </el-form-item>   
            <el-form-item label="Genre">
                <el-select v-model="request.genre.name" filterable placeholder="Select">
                    <el-option
                    v-for="item in genres"
                    :key="item.id"
                    :label="item.name"
                    :value="item.name"
                    />
                </el-select>
            </el-form-item>
            <el-form-item label="Rating">
                <el-select v-model="request.rating" filterable placeholder="Select">
                    <el-option
                    v-for="item in ratings"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                    />
                </el-select>
            </el-form-item>   
            <el-form-item>
                <el-button type="primary" @click="getBooks()">Search</el-button>
                <el-button @click="clearFields">Clear</el-button>
              </el-form-item>
        </el-form>
        <el-divider />
    </el-row>
</template>

<style scoped>
.row{
  margin-top:20px;
}
</style>