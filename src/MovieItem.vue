<script setup>
import { ref, reactive } from "vue";
import {
  EyeIcon,
  StarIcon,
  TrashIcon,
  PencilIcon,
} from "@heroicons/vue/24/solid";

const showEditButton = ref(-1);
const showDeleteButton = ref(-1);
const showViewButton = ref(-1);

function setShowButtons(movieIndex, isHovering) {
  showEditButton.value = isHovering ? movieIndex : -1;
  showDeleteButton.value = isHovering ? movieIndex : -1;
  showViewButton.value = isHovering ? movieIndex : -1;
}

const props = defineProps({
  movie: Object,
  movieIndex: Number,
});

const emits = defineEmits(["deleteMovie", "editMovie", "updateRating"]);

function emitRating(star) {
  emits("updateRating", star, props.movieIndex); // Emit event with star and movie.id
}

function emitEditMovie() {
  emits("editMovie", props.movie?.id);
}

function emitDeleteMovie() {
  emits("deleteMovie", props.movieIndex);
}
</script>

<template>
  <div
    class="movie-item relative"
    @mouseover="setShowButtons(movieIndex, true)"
    @mouseleave="setShowButtons(movieIndex, false)"
  >
    <div class="movie-item-image-wrapper">
      <img :src="movie.image" class="movie-item-image" alt="" />
    </div>
    <div class="absolute right-0 top-0 text-white px-2 py-5">
      <StarIcon class="text-yellow-500 h-16 w-16 relative"></StarIcon>
      <p
        class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
      >
        {{ movie.rating }}
      </p>
    </div>

    <div class="movie-item-content-wrapper">
      <div class="movie-item-title-wrapper">
        <h3 class="movie-item-title">{{ movie.name }}</h3>
        <div class="movie-item-genres-wrapper">
          <span
            v-for="genre in movie.genres"
            :key="`${movie.id}-${genre}`"
            class="movie-item-genre-tag"
            >{{ genre }}</span
          >
        </div>
      </div>
      <div class="movie-item-description-wrapper">
        <p class="movie-item-description">{{ movie.description }}</p>
      </div>
      <div class="movie-item-rating-wrapper">
        <div
          class="movie-item-rating-text-wrapper w-full flex flex-row justify-between items-center"
        >
          <div class="flex items-center">
            <span class="movie-item-rating-text">
              Rating: ({{ movie.rating }}/5)
            </span>
            <button
              v-for="star in 5"
              :key="star"
              class="movie-item-star-icon-button"
              :class="
                star <= movie.rating ? 'text-yellow-500' : 'text-gray-500'
              "
              @click="emitRating(star)"
            >
              <StarIcon class="movie-item-star-icon" />
            </button>
          </div>

          <div class="flex items-center gap-5">
            <button
              class="movie-item-edit-button rounded-full bg-slate-200 p-2 hover:bg-green-300"
              @click="emitEditMovie(movie.id)"
              v-show="showEditButton === movieIndex"
            >
              <PencilIcon class="h-4 w-4"></PencilIcon>
            </button>

            <button
              class="movie-item-delete-button rounded-full bg-slate-200 p-2 hover:bg-red-300"
              @click="emitDeleteMovie(movie.id)"
              v-show="showDeleteButton === movieIndex"
            >
              <TrashIcon class="h-4 w-4"></TrashIcon>
            </button>
            <RouterLink
              :to="`${movie.id}`"
              :key="movie.id"
              v-show="showViewButton === movieIndex"
              class="movie-item-view-button rounded-full bg-slate-200 p-2 hover:bg-blue-300"
            >
              <EyeIcon class="h-4 w-4"></EyeIcon>
            </RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
