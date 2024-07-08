<script setup>
import { defineAsyncComponent, reactive, ref, watchEffect } from "vue";
import films from "../movies.json";
import { StarIcon, ArrowLeftCircleIcon } from "@heroicons/vue/24/solid";
const { id } = defineProps({
  id: String,
});

const MovieSkeleton = defineAsyncComponent(
  () => import("../MovieSkeleton.vue")
);

const movies = reactive(films.items);

const loading = ref(false);
const post = ref(null);
const error = ref(null);

watchEffect(() => id, fetchData(id), { immediate: true });

async function fetchData(id) {
  error.value = post.value = null;
  loading.value = true;

  try {
    post.value = await getPost(id);
  } catch (err) {
    error.value = err.toString();
  } finally {
    setTimeout(() => (loading.value = false), 1000);
  }
}

async function getPost(id) {
  const findMovie = movies.filter((movie) => movie.id == id);
  return findMovie.length > 0 ? findMovie[0] : null;
}
</script>

<template>
  <div class="grid place-items-center h-screen">
    <div>
      <router-link to="/" class="text-white flex mt-6"
        ><span class="mr-2">Go back</span>
        <ArrowLeftCircleIcon class="h-6 w-6" />
      </router-link>
    </div>
    <div v-if="loading">
      <MovieSkeleton></MovieSkeleton>
    </div>
    <div v-else-if="error">{{ error }}</div>
    <div
      v-else-if="post"
      class="flex flex-col md:flex-row max-w-3xl gap-5 md:p-0 p-5"
    >
      <div class="relative">
        <img :src="post.image" :alt="post.name" class="max-h-[95rem]" />

        <div class="absolute right-0 top-0 px-2 py-5">
          <StarIcon class="text-yellow-500 h-16 w-16 relative"></StarIcon>
          <p
            class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
          >
            {{ post.rating }}
          </p>
        </div>
      </div>
      <div class="flex flex-col justify-center text-white gap-5">
        <h2 class="text-3xl">{{ post.name }}</h2>
        <div class="movie-item-genres-wrapper">
          <span
            v-for="genre in post.genres"
            :key="genre"
            class="movie-item-genre-tag"
            >{{ genre }}</span
          >
        </div>

        <div class="text-sm">{{ post.description }}</div>
      </div>
    </div>
  </div>
</template>
