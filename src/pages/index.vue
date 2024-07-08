<script setup>
import { ref, reactive, defineAsyncComponent } from "vue";
import { items } from "../movies.json";

import MovieItem from "../MovieItem.vue";

const AppModal = defineAsyncComponent(() => import("../AppModal.vue"));
const MovieForm = defineAsyncComponent(() => import("../MovieForm.vue"));

const movies = reactive(items);
const showForm = ref(false);
const showModal = ref(false);

const formState = ref("");
const editingMovieIndex = ref(null);

const name = ref("");
const description = ref("add");
const image = ref("");
const genres = ref([]);
const inTheaters = ref(false);

function hideForm() {
  editingMovieIndex.value = null;
  formState.value = "";
  clearForm();
  showModal.value = false;
}

function handleSaveMovie(data) {
  movies.push(data);
  hideForm();
}

function handleUpdateMovie(data) {
  const movieIndex = movies.findIndex((movie) => movie.id === data.id);
  movies[movieIndex] = data;
  clearForm();
  editingMovieIndex.value = null;
  showModal.value = false;
  formState.value = "";
}

function handleMovieEdit(id) {
  editingMovieIndex.value = movies.find((movie) => movie.id === id);
  formState.value = "edit";
  showModal.value = true;
  showForm.value = true;
}

function handleNewMovie() {
  editingMovieIndex.value = null;
  formState.value = "new";
  showModal.value = true;
  showForm.value = true;
}

function handleDeleteMovie(movieIdx) {
  movies.splice(movieIdx, 1);
}

function handleCancelForm() {
  editingMovieIndex.value = null;
  formState.value = "";
  clearForm();
}
function handleUpdateRating(star, movieIdx) {
  movies[movieIdx].rating = star;
}

function clearForm() {
  name.value = "";
  description.value = "";
  image.value = "";
  genres.value = [];
  inTheaters.value = false;
}

function avarageRating() {
  let sum = 0;
  let result = 0;
  movies.forEach((movie) => {
    sum += movie.rating;
  });
  result = sum / movies.length;
  return result.toFixed(2);
}

function removeRatings() {
  movies.forEach((movie) => (movie.rating = 0));
}
</script>

<template>
  <div class="my-20 flex flex-col gap-5 justify-center items-center">
    <div class="flex gap-10 items-center">
      <div class="text-white">
        total movies: {{ movies.length }} / avarage rating:
        {{ avarageRating() }}
      </div>
      <button
        class="bg-blue-500 text-white px-4 py-2 rounded-md"
        @click="removeRatings"
      >
        remove ratings
      </button>

      <button
        class="bg-blue-500 text-white px-4 py-2 rounded-md"
        @click="handleNewMovie"
      >
        add movie
      </button>
    </div>
    <div class="mt-20 grid grid-cols-1 lg:grid-cols-3 gap-5">
      <MovieItem
        v-for="(movie, movieIndex) in movies"
        :key="movie.id"
        :movie="movie"
        :movie-index="movieIndex"
        @update-rating="handleUpdateRating"
        @delete-movie="handleDeleteMovie"
        @edit-movie="handleMovieEdit"
      ></MovieItem>
    </div>
    <div>
      <transition name="modal">
        <template v-if="showModal">
          <AppModal
            @close="showModal = false"
            title="Add movie"
            :show-modal="showModal"
          >
            <MovieForm
              :show-form="showForm"
              @update:modelValue="handleSaveMovie"
              @edit:modelValue="handleUpdateMovie"
              :modelValue="editingMovieIndex"
              :form-state="formState"
              @cancel="handleCancelForm"
            ></MovieForm>
          </AppModal>
        </template>
      </transition>
    </div>
  </div>
</template>

<style scoped>
.movieform-enter-active,
.movieform-leave-active {
  transition: all 2s ease;
}
.movieform-enter-active {
  transition-delay: 0.5s;
}

.movieform-enter-from,
.movieform-leave-to {
  opacity: 0;
}
</style>
