<script setup>
import GenreTable from '../components/GenreTable.vue';
import router from '../router';

const showAddGenreForm = () => {
   router.push('/admin/genres/adding')
}

</script>
<template>
   <el-button type="primary" @click="showAddGenreForm">Add new gerne</el-button>
   <el-divider></el-divider>
   <GenreTable />
</template>