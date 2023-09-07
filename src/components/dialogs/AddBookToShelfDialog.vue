<script setup>
import {ref,reactive, watch, onMounted, onUpdated,onActivated} from 'vue';
import { ElNotification } from 'element-plus';
import router from './../../router'
import axios from 'axios';
import { useUserStore } from '../../stores/user';


const props = defineProps(['dialogVisibility','book'])
const emits = defineEmits(['closeDialog'])

const bookId = router.currentRoute.value.params.id;

const form = reactive({
    shelfItemId: '',
    shelfName: '',
    nonPrimaryShelvesIds: [],
    readingDates: [],
    rating: '',
    comment: ''
})

const reviewForm = reactive({
    shelfItemId: '',
    shelfName: '',
    nonPrimaryShelvesIds: [],
    readingDates: [],
    rating: '',
    text: ''
})

const ratingOptions = [
    {value : 1},
    {value : 2},
    {value : 3},
    {value : 4},
    {value : 5}
] 

const shelves = ref([])
const nonPrimaryShelfList = ref([])

const formLabelWidth = '80px'
const shelfSelected = ref(false)
const store =  useUserStore()
const closeDialog = () => {
    emits('closeDialog')
}

const showReviewForm = ref(false)
const bookIsOnPrimaryShelf = ref(false)

const hideReviewDialog = () => {
    showReviewForm.value = false
}

const showReviewDialog = () => {
    showReviewForm.value = true
}


onUpdated(() => {
    getShelves();
    checkIfBookIsOnPrimaryShelf();
})




const getShelves = () => {
    console.log("AddBookToShelfDialog: GET SHELVES")

    axios
    .get('http://localhost:8080/api/v1/users/' + store.userId + '/shelves')
    .then((response) => {   
        console.log(response.data);
        shelves.value = response.data;
    })
    .catch(function(error) {
        if(error.response){
        console.log(error.response.data);
        console.log(error.response.status);
    }
    })
}


const checkIfBookIsOnPrimaryShelf = () => {
    console.log(props.book.id)
    axios
        .get('http://localhost:8080/api/v1/books/bookOnPrimaryShelf',
        {
            params:{
                id:props.book.id
            },
            withCredentials: true
        })
        .then((response) => {
            console.log(response.data);
            bookIsOnPrimaryShelf.value = response.data;
        })
        .catch(function (error) {
            if(error){
                console.log(error.response)
            }
        })
}


const addBookToShelf = () => {
    console.log("BOOK ID: " + bookId)

    axios.
        post('http://localhost:8080/api/v1/shelves/book',
            {
                shelfId: form.shelfId,
                bookId: bookId
            },
            {withCredentials:true}
        )
        .then((response) => {
            console.log(response);
            //when shelf = read
            if(response.data.name == 'Read'){
                //show review form
                console.log("SHELF NAME IS READ")
                showReviewDialog()
            } else {
                //when shelf != read

                ElNotification({
                    type:'success',
                    title: 'Success',
                    message: 'Book successfuly added on shelf.'
                })

                closeDialog();
            }
            
        })
        .catch(function (error){
            if(error.response){
                ElNotification({
                    type:'error',
                    title: 'Error',
                    message: error.response.data.message
                });
                closeDialog();
                console.log(error.response)
                console.log(error.response.data)
            }
        })

}

const submitReview = () => {
    reviewForm.shelfItemId = bookId;
    axios
        .post('http://localhost:8080/api/v1/reviews',reviewForm,{withCredentials:true})
        .then((response)=> {
            ElNotification({
                type:'success',
                title:'Success',
                message: 'Review successfuly added.'
            });
            closeDialog();
        })
        .catch(function(error){
            if(error){
                console.log(error.response);
            }
        })

}

</script>
<template>
    <el-dialog v-model="props.dialogVisibility" 
        title="Add book to shelf" 
        width="30%" 
        :show-close="false" 
        :close-on-press-escape="false" 
        :close-on-click-modal="false"
        :center="true" >
    <!-- <el-alert title="Unique name" type="error" :style="{display: display, visibility: visibility }" @close="hideAlert" :description="errorMessage" show-icon /> -->
    <el-form v-model="form"
    label-position="top"
    >
        <el-form-item label="Select shelf:" v-if="bookIsOnPrimaryShelf == false" >
            <el-select 
                v-model="form.shelfId" 
                class="m-2" 
                placeholder="Select">
            <el-option
            v-for="shelf in shelves.filter((sh) => sh.isPrimary == true)"
                :key="shelf.id"
                :label="shelf.name"
                :value="shelf.id"
            />
            </el-select>
            <el-button 
                type="primary" 
                :disabled="form.shelfId == ''"
                @click="addBookToShelf"    
            >Add</el-button>
        </el-form-item>
        <el-form-item label="Shelf:" v-if="bookIsOnPrimaryShelf == true" >
            <el-select 
                v-model="form.shelfId" 
                class="m-2" 
                placeholder="Select">
            <el-option
            v-for="shelf in shelves.filter((sh) => sh.isPrimary == false)"
            :key="shelf.id"
            :label="shelf.name"
            :value="shelf.id"
            />
            </el-select>
            <el-button 
                type="primary" 
                :disabled="form.shelfId == ''"
                @click="addBookToShelf"    
            >Add</el-button>
        </el-form-item>
    </el-form>
    <el-form
        v-model="reviewForm"
        label-position="top"
        v-if="showReviewForm"
    >
        <el-form-item label="Shelves:" v-if="shelves.filter((sh) => sh.isPrimary == false).length > 0">
            <el-checkbox-group v-model="reviewForm.nonPrimaryShelvesIds" size="large">
                <el-checkbox-button v-for="shelf in shelves.filter((sh) => sh.isPrimary == false)" :key="shelf.id" :label="shelf.id">
                    {{ shelf.name }}
                </el-checkbox-button>
            </el-checkbox-group>
        </el-form-item>
        <el-form-item label="The date the book was read:">
            <el-date-picker
                v-model="reviewForm.readingDates"
                type="dates"
                placeholder="Pick one or more dates"
            />
        </el-form-item>
        <el-form-item label="Rating:">
            <el-select
                v-model="reviewForm.rating"    
            >
            <el-option
                v-for="option in ratingOptions"
                :key="option.value"
                :label="option.value"
                :value="option.value"
            />    
            </el-select>
        </el-form-item>
        <el-form-item 
            label="Comment:"
        >
            <el-input
                v-model="reviewForm.text"
                type="textarea"
                rows="10"
            />
        </el-form-item>
        <el-form-item>
            <el-button @click="closeDialog">Cancel</el-button>
            <el-button @click="submitReview">Submit</el-button>
        </el-form-item>
    </el-form>
</el-dialog>
</template>

<style scoped>

</style>