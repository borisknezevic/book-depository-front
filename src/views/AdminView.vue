<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
        <el-container class="container">
            <el-aside width="200px" class="aside">
                <el-menu>
                        <RouterLink to="/admin/genres" replace style="text-decoration: none; color: inherit;">
                            <el-menu-item index="1">
                                <el-icon><Promotion /></el-icon>
                                <span>Genres</span>
                            </el-menu-item>
                        </RouterLink>
                        <RouterLink to="/admin/authors" replace style="text-decoration: none; color: inherit;">
                            <el-menu-item index="2">
                                <el-icon><Position /></el-icon>
                                <span>Authors</span>
                            </el-menu-item>
                        </RouterLink>
                        <RouterLink to="/admin/requests" replace style="text-decoration: none; color: inherit;">
                            <el-menu-item index="3">
                                <el-icon><document /></el-icon>
                                <span>Author Requests</span>
                            </el-menu-item>
                        </RouterLink>
                        <RouterLink to="/admin/books" replace style="text-decoration: none; color: inherit;">
                            <el-menu-item index="4">
                                <el-icon><Location /></el-icon>
                                <span>Books</span>
                            </el-menu-item>
                        </RouterLink>
                </el-menu>
            </el-aside>
            <el-main>
                <el-container>
                    <el-main>
                        <el-scrollbar>
                            <RouterView />
                        </el-scrollbar>
                    </el-main>
                </el-container>    
            </el-main>
        </el-container>
</template>

<style scoped>
.container{
    height: 85vh;
}

.aside{
    width: 200px;
    height: 100%;
    border-right: 2px solid #07689F;
    color: #07689F;
}

</style>
