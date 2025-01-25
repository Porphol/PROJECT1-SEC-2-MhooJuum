<script setup>
import { ref } from "vue";

const currentView = ref("home");
const handleButtonClick = (view) => {
  currentView.value = view;
};

const score = ref(0)
const hitObject = () => {
  score.value++
  console.log(score.value);
}

</script>

<template>
  <div class="w-full max-w-4xl">
    <div v-show="currentView === 'home'" class="border">
      <p>mhoojuum</p>
      <button @click="handleButtonClick('game')" class="py-1 px-3 bg-yellow-200 rounded-lg">
        PLAY
      </button>
      <br />
      <button @click="handleButtonClick('howToPlay')" class="py-1 px-3 bg-yellow-200 rounded-lg">
        HOW TO PLAY
      </button>
    </div>

    <div v-show="currentView === 'game'" class="border">
      <p>game</p>
      <button @click="handleButtonClick('home')" class="py-1 px-3 bg-yellow-200 rounded-lg">
        Back
      </button>
    </div>

    <div v-show="currentView === 'howToPlay'" class="border">
      <p>How to play</p>
      <button @click="handleButtonClick('home')" class="py-1 px-3 bg-yellow-200 rounded-lg">
        BACK
      </button>
    </div>
  </div>
</template>

<style scoped></style>
