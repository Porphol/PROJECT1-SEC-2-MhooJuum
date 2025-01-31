<script setup>
import { ref } from "vue";

const currentView = ref("home");
const handleButtonClick = (view) => {
  currentView.value = view;
};

const score = ref(0);
const hitObject = () => {
  score.value++;
};

const position = ref(0);
const random = (num) => {
  position.value = Math.floor(Math.random() * num) + 1
}

const time = ref(0)
const startTime = ref(0)

const gameStart = (duration) => {
  startTime.value = 3
  const startInterval = setInterval(() => {
    startTime.value--
    if (startTime.value <= 0) {
      clearInterval(startInterval)
      gameCountDown(() => random(9),duration)
      countDown(duration)
    }
  }, 1000)
}

const gameCountDown = (func, duration, delay = 1500) => {
  let gameTime = Math.floor(duration * (1000 / delay))
  const interval = setInterval(() => {
    func()
    gameTime--
    if (gameTime <= 0) {
      clearInterval(interval)
    }
  }, delay)
}

const countDown = (duration, delay = 1000) => {
  time.value = duration
  const interval = setInterval(() => {
    time.value--
    if (time.value <= 0) {
      clearInterval(interval);
      toggleModal("Time's up", `Your final score is ${score.value}`);
    }
  }, delay);
};

const showModal = ref(false);
const modalTitle = ref("");
const modalMessage = ref("");
const toggleModal = (title, message) => {
  modalTitle.value = title;
  modalMessage.value = message;
  showModal.value = !showModal.value;
};
</script>

<template>
  <!-- Home -->
  <div class="w-full max-w-4xl">
    <div v-show="currentView === 'home'" class="border">
      <p>mhoojuum</p>
      <button
        @click="handleButtonClick('game'), gameStart(90)"
        class="py-1 px-3 bg-yellow-200 rounded-lg"
      >
        PLAY
      </button>
      <br />
      <button
        @click="
          toggleModal(
            'How to Play',
            'Here are the instructions for how to play the game:'
          )
        "
        class="py-1 px-3 bg-yellow-200 rounded-lg"
      >
        HOW TO PLAY
      </button>
    </div>

    <!-- Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center"
      @click="toggleModal('', '')"
    >
      <div
        class="bg-white p-6 rounded-lg shadow-lg max-w-xl w-full"
        @click.stop
      >
        <h2 class="text-3xl mb-4">{{ modalTitle }}</h2>
        <p class="mb-4">{{ modalMessage }}</p>
        <button
          @click="toggleModal('', '')"
          class="py-2 px-4 bg-yellow-500 rounded-lg text-white mt-4"
        >
          Close
        </button>
      </div>
    </div>

    <!-- Game -->
    <div v-show="currentView === 'game'" class="border">
      <p>game</p>
      <div>
        {{ Math.floor(startTime / 60) }}:{{ startTime % 60 < 10 ? "0" : ""
        }}{{ startTime % 60 }}
      </div>
      <div>
        {{ Math.floor(time / 60) }}:{{ time % 60 < 10 ? "0" : ""
        }}{{ time % 60 }}
      </div>
      <div>{{ score }}</div>
      <div v-for="hole in 9" :key="hole">
        <h1
          class="text-7xl text-green-500"
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
  </div>
</template>

<style scoped></style>
