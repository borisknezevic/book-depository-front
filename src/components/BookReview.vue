<script setup>
import {ref} from 'vue';
import {RouterLink, useRoute, useRouter} from 'vue-router';

const router = useRouter();
const props = defineProps(['review']);

const review = ref(props.review);

const goToProfile = () => {
    router.push('/profiles/'+ review.value.userDTO.id);
}

</script>
<template>
    <div class="review">
        <div class="review-header">
            <div class="review-header-left">
                <p class="review-header-left-name">User: <el-link :underline="false" @click="goToProfile">{{ review.userDTO.firstName }} {{ review.userDTO.lastName }}  </el-link></p>
                <p class="review-header-left-date">Date: {{ review.reviewDate  }}</p>
            </div> 
            <div class="review-header-right">
                <p class="review-header-right-rating">Rating: {{review.rating}}</p>
            </div>
        </div>
        <div class="review-body">
            <p>{{ review.text }}</p>
        </div>
    </div>
    
</template>

<style scoped>
.review{
    display: flex;
    flex-direction: column;
    border: 7px solid red;
    border-radius: 30px;

}

.review-header{
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    margin-left: 30px;
    margin-right: 30px;
}

.review-body{
    margin-left: 30px;
    margin-right: 30px;
}
</style>