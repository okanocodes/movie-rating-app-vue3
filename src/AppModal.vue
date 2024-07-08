<script setup>
import { onClickOutside } from "@vueuse/core";
import { vOnClickOutside } from "@vueuse/components";

const props = defineProps({
  title: { type: String, default: null },
  showModal: { type: Boolean, default: false },
});

const emit = defineEmits(["close"]);

function closeModal() {
  console.log("close modal");
}

const onClickOutsideHandler = [
  (ev) => {
    console.log(ev);
    emit("close");
  },
];
</script>

<template>
  <Transition name="modal">
    <div
      v-if="showModal"
      class="fade flex bg-black text-white bg-opacity-70 fixed top-0 left-0 w-full h-full z-50 backdrop-blur-lg"
    >
      <div class="flex justify-center items-center w-full h-fit min-h-full">
        <div
          class="modal-body flex flex-col max-w-2xl w-full max-h-full h-auto overflow-scroll my-5 relative bg-slate-800 rounded-md"
        >
          <div class="modal-header px-10 py-5">
            <h3 class="text-xl">{{ title }}</h3>
          </div>
          <div
            class="px-10 py-5 bg-slate-600 rounded-b-md"
            v-on-click-outside="onClickOutsideHandler"
          >
            <slot> </slot>
          </div>

          <button
            @click="emit('close')"
            class="absolute top-4 right-5 w-10 h-10 rounded-full bg-slate-500 flex justify-center items-center"
          >
            <span>X</span>
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
.modal-enter-active,
.modal-leave-active {
  transition: all 0.7s ease-out;
}
.modal-enter-from,
.modal-leave-to {
  opacity: 0;
  backdrop-filter: blur(0);
}

.modal-enter-active .modal-body,
.modal-leave-active .modal-body {
  transition: all 0.5s ease;
}

.modal-enter-from .modal-body,
.modal-leave-to .modal-body {
  opacity: 0;
  transform: translateY(-100px);
}
</style>
