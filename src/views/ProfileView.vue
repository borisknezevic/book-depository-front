<script setup>
import { ref, onMounted } from 'vue';
import router from '../router';
import Shelf from '../components/Shelf.vue';
import axios from 'axios';
import {useUserStore} from '../stores/user'
import AuthorRegistrationDialog from '../components/dialogs/AuthorRegistrationDialog.vue';

const userStore = useUserStore();
onMounted(() => {getUser();})

const user = ref({});
const authorStatus = ref(true)
const dialogVisible = ref(false)

const showDialog = () => {
    dialogVisible.value = true;
}

const closeDialog = () => {
    dialogVisible.value = false
}

const getUser = () => {
    axios
        .get('http://localhost:8080/api/v1/users/' + router.currentRoute.value.params.id )
        .then((response) => {
            console.log(response);
            user.value = response.data;
            checkUserRole();
        })
        .catch(function(error) {
            if(error.response){
                console.log(error.response.status);
            }
        })
}

const showUpdateProfile = () => {
    // router.go('/profiles/' + router.currentRoute.value.params.id +'/update')
    router.push('/profiles/' + router.currentRoute.value.params.id +'/update')
}

const showProfileReviews = () => {
    console.log('Click on reviews')
    router.push('/profiles/' + router.currentRoute.value.params.id + '/reviews')
}

const showAuthorPanel = () => {
    console.log('author panel')
    router.push('/authors/' + router.currentRoute.value.params.id)
}

async function checkUserRole(){
    if (user.value.role == 'AUTHOR' && userStore.getRole == 'ANON'){
        axios
            .get('http://localhost:8080/api/v1/authors/'+ router.currentRoute.value.params.id + '/status')
            .then((response)=>{
                console.log(response.data);
                authorStatus.value = response.data;
            })
            .catch(function(error){
                if(error){
                    console.log(error.response)
                }
            })
    }
}

// const checkAuthorStatus = () => {
//     return 
// }

</script>
<template>
    <el-row class="container" justify="space-around">
        <el-col :span="3"></el-col>
        <el-col :span="18">
            <div class="background">
                <el-container class="user_info">
                    <el-aside>                       
                        <el-image
                            style="width: 200px; height: 200px; borderRadius: var(--el-border-radius-small); boxShadow: var(--el-box-shadow-light); border: 4px solid var(--el-border-color);"
                            src="http://thenewcode.com/assets/images/thumbnails/sarah-parmenter.jpeg"
                            fit="cover" />
                    </el-aside>
                    <el-main>
                        <!-- <el-tag
                            :v-if="user.getRole == 'AUTHOR'"
                            :type="authorStatus == true ? 'success' : 'info'"
                            class="mx-1"
                            effect="dark"
                        >Verified</el-tag> -->
                        <p>Ime: {{user.firstName}}</p>
                        <p>Prezime: {{user.lastName}}</p>
                        <el-button 
                        v-if="userStore.userId == router.currentRoute.value.params.id"
                        @click="showUpdateProfile">Update profile</el-button>
                    <el-button 
                        v-if="userStore.userId == router.currentRoute.value.params.id"
                        @click="showProfileReviews">Show reviews</el-button>
                    <el-button
                        v-if="userStore.role == 'AUTHOR' && userStore.userId == router.currentRoute.value.params.id"
                        @click="showAuthorPanel"
                        >Author panel</el-button>
                    <el-button 
                        v-if="authorStatus == false" 
                        type="primary" 
                        @click="showDialog">Register as author
                        </el-button>
                    </el-main>
                </el-container>
                <el-container>
                    <el-main>
                        <el-divider content-position="left">Description</el-divider>
                        <p v-if="user.description">{{ user.description }}</p>
                        <p v-else>No description</p>
                        <el-divider /> <br />
                    </el-main>
                </el-container>
                <el-row>
                    <el-col :span="23">
                        <Shelf />
                    </el-col>
                </el-row>
            </div>
        </el-col>
        <el-col :span="3"></el-col>
        <AuthorRegistrationDialog 
                    :dialogVisibility = "dialogVisible"
                    :authorInfo="user"
                    @closeDialog="closeDialog" 
                    />
    </el-row>
</template>
<style scoped>
.user_info{
    margin-top:10px;
}
</style>