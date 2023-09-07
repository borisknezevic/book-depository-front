import { ref, computed, watch } from 'vue';
import { defineStore } from 'pinia';

export const useBooksStore = defineStore('books', ()=> {
    const bookList = ref();
    const lastBookSearch = ref([]);
    

    const getLastBookSearch = computed(() => lastBookSearch.value)

    function setBooks(newBookList) {
        bookList.value = newBookList
        setLastBookSearch(bookList)
    }

    function setLastBookSearch(newBookSearch){
        lastBookSearch.value = newBookSearch
    }
    
    if(localStorage.getItem("lastBookSearch")){
        lastBookSearch.value = JSON.parse(localStorage.getItem("lastBookSearch"))
    }

    if(localStorage.getItem("bookList")){
        bookList.value = JSON.parse(localStorage.getItem("bookList"))
    }

    watch(lastBookSearch,(lastBookSearch) => {localStorage.setItem("lastBookSearch",JSON.stringify(lastBookSearch))},{deep: true})
    watch(bookList,(bookList) => {localStorage.setItem("bookList",JSON.stringify(bookList))},{deep: true})

    return { bookList ,setBooks,lastBookSearch,setLastBookSearch,getLastBookSearch}
})