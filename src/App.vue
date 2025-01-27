<script setup>
import { ref } from "vue"

const currentView = ref("home")


const handleButtonClick = (view) => {
  currentView.value = view
}

const score = ref(0)
const hitObject = () => {
  score.value++
}

const position = ref(0)
const random = (num) => {
  position.value = Math.floor(Math.random() * num) + 1
}

const time = ref(0)

const countDown = (func, duration, delay = 1000) => {
  time.value = duration
  const interval = setInterval(() => {
    func()
    time.value--
    if (time.value <= 0) {
      clearInterval(interval)
    }
  }, delay)
}
</script>

<template>
  <div>
    <!-- Div Home Page -->
    <div v-show="currentView === 'home'" class="border bg-cover bg-no-repeat bg-center bg-bgHome">
      <div class=" flex justify-center items-center flex-col my-32 gap-[5rem]">
        <p class=" text-center text-8xl font-Muffin tracking-wider">MHOOJUUM</p>
        <div class="relative flex flex-col items-center">
      <img src="./assets/image/MhooJuum_logo.png" alt="" class="" width="300">
      <button
        @click="handleButtonClick('game'), countDown(() => random(9), 5)"
        class="py-[1rem] px-[7rem] bg-yellow-300 rounded-[2.5rem] text-7xl font-Muffin tracking-wide"
      >
        PLAY
      </button>
    </div>

      </div>
      <button
          @click="handleButtonClick('howToPlay')"
          class="py-1 px-3 bg-yellow-200 rounded-lg"
        >
          HOW TO PLAY
        </button>
    </div>

    <div v-show="currentView === 'game'" class="border">
      <p>game</p>
      <div>
        {{ Math.floor(time / 60) }}:{{ time % 60 < 10 ? "0" : ""
        }}{{ time % 60 }}
      </div>
      <div>{{ score }}</div>
      <div v-for="hole in 9" :key="hole">
        <h1
          class="text-7xl text-yellow-500"
          v-show="position === hole"
          @click="hitObject()"
        >
          JuumMhoo
        </h1>
        <h1 class="text-7xl text-yellow-500" v-show="position !== hole">
          MhooJuum
        </h1>
      </div>
      <button v-on:click="random(9)">hey</button>
      <button
        @click="handleButtonClick('home')"
        class="py-1 px-3 bg-yellow-200 rounded-lg"
      >
        Back
      </button>
    </div>

    <div v-show="currentView === 'howToPlay'" class="border">
      <p>How to play</p>
      <button
        @click="handleButtonClick('home')"
        class="py-1 px-3 bg-yellow-200 rounded-lg"
      >
        BACK
      </button>
    </div>
  </div>
</template>

<style scoped></style>
