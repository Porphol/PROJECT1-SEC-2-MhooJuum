<script setup>
import { ref } from "vue";

const isHomeVisible = ref(true);

const handlePlayButtonClick = () => {
  isHomeVisible.value = !isHomeVisible.value;
};
</script>

<template>
  <div class="w-full max-w-4xl">
    <div v-show="isHomeVisible" class="border">
      <p>mhoojuum</p>
      <button
        @click="handlePlayButtonClick"
        class="py-1 px-3 bg-yellow-200 rounded-lg"
      >
        PLAY
      </button>
    </div>

    <div v-show="!isHomeVisible" class="border">
      <p>game</p>
    </div>
  </div>
</template>

<style scoped></style>
