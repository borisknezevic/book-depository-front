<script setup>
import BooksSearch from '../components/BooksSearch.vue';
import BookSearchByIsbn from '../components/BookSearchByIsbn.vue';
import BookList from '../components/BookList.vue';
import router from '../router';

const showAddingBookForm = () => {
    router.push('/admin/books/adding');
}

</script>
<template>
    <el-button type="primary" @click="showAddingBookForm">Add new book</el-button>
    <el-divider />
    <BooksSearch />
    <BookSearchByIsbn />
    <BookList />
</template>