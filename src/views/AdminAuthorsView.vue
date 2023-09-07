<script setup>
import AuthorTable from '../components/AuthorTable.vue';
import router from '../router';

const showAddingForm = () => {
    router.push('/admin/authors/adding');
}

</script>
<template>
    <el-button type="primary" @click="showAddingForm">Add new author</el-button>
    <el-divider />
    <AuthorTable /> 
</template>