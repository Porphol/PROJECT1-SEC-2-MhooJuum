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

const position = ref(0)
const random = (num) =>{
  position.value = Math.floor(Math.random() * num) + 1
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
      <div v-for="hole in 9" :key="hole">
        <h1 class="text-7xl text-yellow-500" v-show="position === hole">JuumMhoo</h1>
        <h1 class="text-7xl text-yellow-500" v-show="position !== hole">MhooJuum</h1>
      </div>
      <button v-on:click="random(9)">hey</button>
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

<style scoped>

</style>
