<script setup>
import { useDebounceFn } from '@vueuse/core'
import { onMounted, reactive, ref } from "vue";


const props = defineProps({
  modelValue: { type: Object },
  showForm: { type: Boolean, default: false },
  formState: { type: String },
});

const emit = defineEmits(["update:modelValue", "cancel", "edit:modelValue"]);

const input = ref(null);

onMounted(() => {
  if (input.value) {
    input.value.focus();
  }
});

const fieldError = reactive({
  name: false,
  genres: false,
});

const form = reactive({
  id: props.modelValue?.id,
  name: props.modelValue?.name,
  description: props.modelValue?.description,
  image: props.modelValue?.image,
  inTheaters: props.modelValue?.inTheaters || false,
  genres: props.modelValue?.genres || [],
  rating: props.modelValue?.rating || null,
});

function generateData() {
  return {
    id: form.id || Number(Date.now()),
    name: form.name,
    description: form.description,
    image: form.image,
    genres: form.genres,
    inTheaters: form.inTheaters,
    rating: form.rating || 0,
  };
}

function handleForm() {
  fieldError.name = form.name.trim() === "" ? true : false;
  fieldError.genres = form.genres.length === 0 ? true : false;

  if (fieldError.name || fieldError.genres) {
    // Show error messages
    return;
  }

  if (form.name && form.genres.length > 0) {
    const data = generateData();
    emit("update:modelValue", data);

    clearForm();
  }
}

function searchPoster() {
  if (input.value) {
    input.value.focus();
  }
  if (form.name.trim() === "") {
    form.image = "";
    return;
  }


const url = `https://api.themoviedb.org/3/search/movie?api_key=${import.meta.env.VITE_TMDB_API_KEY}&query=${encodeURIComponent(form.name)}`;
  const fetchPoster = fetch(url)
    .then((response) => response.json())
    .then((data) => {
      if (data.results && data.results.length > 0) {
        form.image = `https://image.tmdb.org/t/p/w500${data.results[0].poster_path}`;
      } else {
        form.image = "";
      }
    })
    .catch((error) => {
      console.error("Error fetching movie poster:", error);
      form.image = "";
    });



  // Placeholder for future poster search functionality
useDebounceFn(() => {
  // do something
  fetchPoster
}, 1000)

}

function editMovie() {
  const data = generateData();
  emit("edit:modelValue", data);
  clearForm();
}

function cancelForm() {
  clearForm();
  emit("cancel");
}

function clearForm() {
  form.name = "";
  form.description = "";
  form.image = "";
  form.genres = [];
  form.inTheaters = false;
  clearErrors();
}

function clearErrors() {
  fieldError.name = false;
  fieldError.genres = false;
}
</script>

<template>
  <form class="flex flex-col gap-5 text-blue-300">
    <div class="movie-form-input-wrapper">
      <label for="name">Name:</label>
      <input
        type="text"
        name="name"
        id="name"
        v-model="form.name"
        @input="searchPoster"
        ref="input"
      />
      <span v-if="fieldError.name" class="text-red-500"> Name is required</span>
    </div>

    <div class="movie-form-input-wrapper max-h-28">
      <label for="description">Description: </label>

      <textarea
        name="description"
        id="description"
        class="movie-form-textarea"
        v-model="form.description"
      ></textarea>
    </div>
    <div class="movie-form-input-wrapper">
      <label for="image">Image: </label>
      <input type="url" name="image" id="image" v-model="form.image" />
    </div>
    <div class="movie-form-input-wrapper selectbox">
      <select name="genres" id="genres" v-model="form.genres" multiple required>
        <option value="Action">Action</option>
        <option value="Comedy">Comedy</option>
        <option value="Crime">Crime</option>
        <option value="Drama">Drama</option>
        <option value="Thriller">Thriller</option>
        <option value="Romance">Romance</option>
      </select>
      <span v-if="fieldError.genres" class="text-red-500">
        At least one genre is required
      </span>
    </div>
    <div class="flex flex-row gap-2">
      <input
        type="checkbox"
        name="inTheaters"
        id="inTheaters"
        v-model="form.inTheaters"
      />
      <label for="inTheaters">In Theaters</label>
    </div>

    <div class="flex justify-between">
      <button
        class="bg-blue-500 text-white px-4 py-2 rounded-md"
        @click.prevent="cancelForm"
        type="reset"
      >
        Cancel
      </button>
      <button
        class="bg-blue-500 text-white px-4 py-2 rounded-md"
        @click.prevent="editMovie"
        v-if="formState === 'edit'"
        type="submit"
      >
        Update
      </button>
      <button
        class="bg-blue-500 text-white px-4 py-2 rounded-md"
        @click.prevent="handleForm"
        v-else
        type="submit"
      >
        Submit
      </button>
    </div>
  </form>
</template>

<style lang="scss" scoped></style>
