import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../views/HomeView.vue';
import BookView from '../views/BookView.vue';
import ProfileView from '../views/ProfileView.vue';
import RegistrationView from '../views/RegistrationView.vue';
import AdminView from '../views/AdminView.vue';
import AdminGenreView from '../views/AdminGenreView.vue';
import AdminAuthorsView from '../views/AdminAuthorsView.vue';
import AdminAuthorRequestsView from '../views/AdminAuthorRequestsView.vue';
import AdminAuthorRequestView from '../views/AdminAuthorRequestView.vue';
import AdminBooksView from '../views/AdminBooksView.vue';
import AdminAddAuthorView from '../views/AdminAddAuthorView.vue';
import AdminAddGenreView from '../views/AdminAddGenreView.vue';
import AdminAddBookView from '../views/AdminAddBookView.vue';
import AdminAuthorView from '../views/AdminAuthorView.vue';
import ProfileUpdateView from '../views/ProfileUpdateView.vue';
import ProfileReviewsView from '../views/ProfileReviewsView.vue';
import ReviewEditView from '../views/ReviewEditView.vue';
import AuthorPanelView from '../views/AuthorPanelView.vue';
import AuthorBookEditView from '../views/AuthorBookEditView.vue';
import AdminUpdateBookView from '../views/AdminUpdateBookView.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/books/:id',
      name: 'book',
      component: BookView
    },
    {
      path: '/profiles/:id',
      name: 'profile',
      component: ProfileView,
    },
    {   
      path: '/profiles/:id/update',
      name: 'profileUpdate',
      component: ProfileUpdateView
    },
    {   
      path: '/profiles/:id/reviews',
      name: 'profileReviews',
      component: ProfileReviewsView
    },
    {
      path: '/profiles/:id/reviews/:reviewId',
      name: 'reviewEdit',
      component: ReviewEditView
    },
    {
      path: '/authors/:id',
      name: 'authorPanel',
      component: AuthorPanelView
    },
    {
      path: '/authors/:id/books/:bookId',
      name: 'authorBookEdit',
      component: AuthorBookEditView
    },
    {
      path: '/registration',
      name: 'registration',
      component: RegistrationView
    },
    {
      path: '/admin',
      name: 'admin',
      redirect: '/admin/genres',
      component: AdminView,
      children: [
        {
          name: 'AdminGenres',
          path: 'genres',
          component: AdminGenreView,
        },
        {
          name: 'AdminAddGenre',
          path: 'genres/adding',
          component: AdminAddGenreView
        },
        {
          name: 'AdminAuthors',
          path: 'authors',
          component: AdminAuthorsView
        },
        {
          name: 'AdminAuthor',
          path: 'authors/:id',
          component: AdminAuthorView
        },
        {
          name: 'AdminAddAuthor',
          path: 'authors/adding',
          component: AdminAddAuthorView
        },
        {
          name: 'AdminAuthorRequests',
          path: 'requests',
          component: AdminAuthorRequestsView
        },
        {
          name: 'AdminAuthorRequest',
          path: 'requests/:id',
          component: AdminAuthorRequestView
        },
        {
          name: 'AdminBooks',
          path: 'books',
          component: AdminBooksView
        },
        {
          name: 'AdminAddBook',
          path: 'books/adding',
          component: AdminAddBookView
        },
        {
          name: 'AdminUpdateBook',
          path: 'books/:id/update',
          component: AdminUpdateBookView
        },
      ]
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    }
  ]
})

export default router
