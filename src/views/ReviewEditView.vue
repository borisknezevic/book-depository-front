<script setup>
import {reactive, ref, onMounted} from 'vue';
import axios from 'axios';
import { useUserStore } from '../stores/user';
import router from '../router';
import { ElNotification } from 'element-plus';

const dateWidth = '250px'
const userStore = useUserStore();
const reviewForm = reactive({
    readingDates: '',
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


onMounted(() => {getReview();})

const getReview = () => {
    console.log("Review id: " + router.currentRoute.value.params.reviewId)
    axios
        .get('http://localhost:8080/api/v1/reviews/' + router.currentRoute.value.params.reviewId)
        .then((response) => {
            console.log(response.data)
            reviewForm.text = response.data.text;
            reviewForm.rating = response.data.rating;
            reviewForm.readingDates = response.data.readingDates;
        })
        .catch(function(error) {
            if(error.response){
                console.log(error.response)
            }
        })
    }

const updateReview = () => {
    console.log("CLICLEDs" + router.currentRoute.value.params.reviewId)
    axios
        .put('http://localhost:8080/api/v1/reviews/' + router.currentRoute.value.params.reviewId,reviewForm,{withCredentials:true} )
        .then((response)=>{
            console.log(response.data)
            reviewForm.text = response.data.text;
            reviewForm.rating = response.data.rating;
            reviewForm.readingDates = response.data.readingDates;
            ElNotification({
                type:'success',
                title: 'Success',
                message: 'Review successfuly updated'
            });
            goToBook(response.data);
        })
        .catch(function(error) {
            if(error) {
                console.log(error.response)
            }
        })
}

const goToBook = (review) => {
    router.push('/books/' + review.bookDTO.id)
}


</script>
<template>
    <h4>Edit review</h4>
    <el-form
        v-model="reviewForm"
        label-position="top"
    >
        <el-form-item label="The date the book was read:">
            <el-date-picker
                v-model="reviewForm.readingDates"
                type="dates"
                placeholder="Pick one or more dates"
                style="width: 100%"
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
            <el-button type="primary" @click="updateReview">Submit update</el-button>
        </el-form-item>
    </el-form>
</template>

<style scoped>

</style>