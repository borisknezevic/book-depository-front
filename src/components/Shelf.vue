<script setup>
import { ElMessage, ElMessageBox,ElNotification } from 'element-plus'
import NewShelfDialog from './dialogs/NewShelfDialog.vue'
import { ref, onMounted } from 'vue';
import router from '../router';
import axios from 'axios';
import { useUserStore } from '../stores/user';
import {
  Check,
  Delete,
  Edit,
  Message,
  Search,
  Star,
} from '@element-plus/icons-vue'



onMounted(() => {getShelves();})

const dialogVisible = ref(false)
const userStore = useUserStore();
const shelves = ref([]);
const userId = router.currentRoute.value.params.id;
const deleteShelfDialogVisible = ref(false)
const deleteConfirmationText = ref('')

const closeDialog = () => {
  getShelves();
  dialogVisible.value = false;
}


const getShelves = () => {
  axios
    .get('http://localhost:8080/api/v1/users/' + userId + '/shelves')
    .then((response) => {
      console.log(response.data);
      shelves.value = response.data;
    })
    .catch(function(error) {
      if(error.reponse){
        console.log(error.response.data);
        console.log(error.response.status);
      }
    })
}

const testClick = (si) => {
  router.push("/books/" + si.book.id)
}

const userIsLoggedIn = () => {
  console.log("User is logged in")
  console.log("userStore ID:" + userStore)
  console.log("Page ID: " + userId)
  if(userStore.userId == userId) return true;
  return false;
}

const addNewShelf = () => {
  console.log("ADD NEW SHELF CLICKED!");
  dialogVisible.value = !dialogVisible.value;
  //show dialog 
}  

const removeTab = (shelfName) => {
  console.log("TEST")
  console.log(shelfName)
  deleteShelfDialogVisible.value = true
}

const deleteShelf = (shelf) => {
  axios
      .delete('http://localhost:8080/api/v1/users/' + userId + '/shelves',
      {
        params:{
        shelfId: shelf.id
        },
        withCredentials:true  
      }
      )
      .then((response) => {
        deleteConfirmationText.value=''
        deleteShelfDialogVisible.value = false;
        ElNotification({
          title: 'Success',
          message: `Shelf: ${shelf.name} successfully deleted.`,
          type: 'success',
        })
        getShelves();
      })
      .catch(function (error){
        console.log(error.response)
        console.log(error.response.data)
        console.log(error.response.status)
      })
}

const deleteBookFromShelf = (shelf,shelfItem) => {

  console.log('Shelf item id: ' + shelf.id);
  console.log(shelfItem.book.id);

  const requestBody = 
    {
      shelfId: shelf.id,
      shelfItemId: shelfItem.book.id
    }

  axios 
      .delete('http://localhost:8080/api/v1/shelves/book',
        {
          withCredentials:true,
          data: requestBody
        }
      )
      .then((response) => {
        console.log(response.data);
        getShelves();
      })
      .catch(function (error){
        if(error){
          console.log(error.response)
        }
      })
}

const goToBookPage = (book) => {
  router.push('/books/'+ book.id)
}
</script>
<template>
  <el-button v-if="userIsLoggedIn()" @click="addNewShelf">Add new shelf</el-button>
  <el-tabs type="card" @tab-remove="removeTab">
    <el-tab-pane v-for="item in shelves" :label="item.name" :name="item.name" :key="item.id" :closable="!item.isPrimary" >
      <el-row >
        <el-scrollbar native>
          <div class="scrollbar-flex-content">
            <p v-for="shelfItem in item.shelfItemList" :key="shelfItem.book.id" class="scrollbar-demo-item zoom">
                <el-card class="book">
                    <div class="button_container">
                      <el-button @click="deleteBookFromShelf(item,shelfItem)" type="danger" size="small" :icon="Delete"  circle />
                    </div>
                    <div @click="goToBookPage(shelfItem.book)">
                      <div class="book-img">
                          <img src="https://www.subtraction.com/wp-content/uploads/2015/03/2015-03-23-random-book-covers-03.png" alt="radnom book cover">
                      </div>
                      <div class="book-description">
                          <p class="book-description-name">{{shelfItem.book.title}}</p>
                          <p class="book-descripton-author">{{shelfItem.book.authorDTO.firstName}} {{ shelfItem.book.authorDTO.lastName }}</p>
                      </div>
                    </div>
                </el-card>
            </p>
          </div>
        </el-scrollbar>
      </el-row>
      <el-dialog v-model="deleteShelfDialogVisible" title="Warning" width="30%" center>
        <span>
          Type 'Delete {{ item.name }}' to detele shelf: {{ item.name }}
        </span>
        <el-input v-model="deleteConfirmationText" type="text" />
        <template #footer>
          <span class="dialog-footer">
            <el-button @click="deleteShelfDialogVisible = false">Cancel</el-button>
            <el-button :disabled='!(deleteConfirmationText == `Delete ${item.name}`)' type="danger" @click="deleteShelf(item)">
              Delete
            </el-button>
          </span>
        </template>
      </el-dialog>
    </el-tab-pane>
  </el-tabs>
  <NewShelfDialog  
    :dialogVisibility = "dialogVisible" 
    @closeDialog="closeDialog"/>
</template>
  
<style scoped>


.book-container{
    display: flex;
    flex-direction: row;
}  
.book{
    display: flex;
    margin-right: 5px;
    width: 200px;
    height: 300px;
}
.book-img{
    display:block;
    width: 100%; 
    height: 45%; 
    /* position:relative; 
    left: 0px; 
    top: 0px;  */
    z-index: -1; /* Ensure div tag stays behind content; -999 might work, too. */
}

.book-img img{
    height: 100%;
    width: 100%;
    object-fit: cover;
}

.scrollbar-flex-content {
  display: flex;
  height: 320px;
  flex-direction: row;
}

.scrollbar-demo-item {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 200px;
  height: 300px;
  margin: 10px;
  text-align: center;
  border-radius: 4px;
  background: var(--el-color-danger-light-9);
  color: var(--el-color-danger);
}

.zoom {
  transition: transform .2s; /* Animation */
}

.zoom:hover {
  transform: scale(1.05);
  cursor: pointer
}

.button_container{
  display: flex;
  justify-content: flex-end;
}
</style>