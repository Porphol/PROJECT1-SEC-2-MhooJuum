<script setup>
import { ref } from "vue";
const currentView = ref("home");
const handleButtonClick = (view) => {
  currentView.value = view;
};

const position = ref(0);
const isMole = ref(true);
const isHit = ref(false);
const random = (num) => {
  position.value = Math.floor(Math.random() * num) + 1;
  isMole.value = Math.random() < 0.7;
};

const time = ref(0);
const startTime = ref(0);
let startInterval = null;
const gameStart = (duration) => {
  startTime.value = 3;
  startInterval = setInterval(() => {
    startTime.value--;
    if (startTime.value <= 0) {
      clearInterval(startInterval);
      gameCountDown(() => random(9));
      countDown(duration);
    }
  }, 1000);
};

let gameInterval = null;
const gameCountDown = (func, delay = 1500) => {
  gameInterval = setInterval(() => {
    func();
    isHit.value = false;
  }, delay);
};

let timeInterval = null;
const countDown = (duration, delay = 1000) => {
  time.value = duration;
  timeInterval = setInterval(() => {
    time.value--;
    if (time.value <= 0) {
      clearInterval(timeInterval);
      clearInterval(gameInterval);
      gameOver();
      toggleModal(
        "Time's up",
        `Your final score is ${Math.round(score.value)}`
      );
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

// Game controller
let gameStatus = true;
const resetGame = () => {
  gameStatus = true;
  score.value = 0;
  combo.value = 0;
  countdownCombo.value = 0;
  lifePoint.value = [true, true, true];
  indexLifePoint = lifePoint.value.length - 1;
  time.value = 0;
  startTime.value = 0;
  position.value = 0;
  isHit.value = false;
  isMole.value = true;
  clearInterval(countdownTimer);
  clearInterval(startInterval);
  clearInterval(timeInterval);
  clearInterval(gameInterval);
};

// Count score
const score = ref(0);
const clickObject = () => {
  if (!gameStatus) return;
  // add combo
  countCombo();
  console.log("Combo: " + combo.value);

  // add score
  score.value += 1 * (1 + 0.1 * (combo.value - 1));
  console.log("Score: " + score.value);
  console.log("Cal bonus: +" + 1 * (1 + 0.1 * (combo.value - 1)));

  console.log("###############");

  isHit.value = true;
};

// Count combo
const combo = ref(0);
let lastClick = null;
let countdownCombo = ref(0);
const countCombo = () => {
  const currentClick = Date.now();

  // Set countdown combo
  if (combo.value >= 15) {
    countdownCombo.value = 1;
  } else if (combo.value >= 10) {
    countdownCombo.value = 3;
  } else {
    countdownCombo.value = 5;
  }

  // Add combo
  if (lastClick === null || (currentClick - lastClick) / 1000 > countCombo) {
    combo.value = 1;
  } else {
    if (combo.value < 20) combo.value++;
  }
  // Set new lastClick
  lastClick = currentClick;
  startCountdown();
};

// Show countdown combo
let countdownTimer = null;
const startCountdown = () => {
  clearInterval(countdownTimer);
  countdownTimer = setInterval(() => {
    countdownCombo.value--;
    if (countdownCombo.value <= 0) {
      clearInterval(countdownTimer);
      combo.value = 0;
    }
  }, 1000);
};

// Life point
const lifePoint = ref([true, true, true]);
let indexLifePoint = lifePoint.value.length - 1;
const clickMiss = () => {
  if (!gameStatus) return;
  lifePoint.value[indexLifePoint] = false;
  indexLifePoint -= 1;
  combo.value = 0;

  console.log("HP -1 -> " + lifePoint.value.filter(Boolean).length);
  console.log("Life Point: " + lifePoint.value);

  isHit.value = true;

  // Life point = [false, false, false]
  if (!lifePoint.value.includes(true)) gameOver();
};

// Game over
const gameOver = () => {
  gameStatus = false;

  console.log("Game over");
  console.log("Game status: " + gameStatus);
};
</script>

<template>
  <!-- Home -->
  <div class="w-full max-w-4xl">
    <div v-show="currentView === 'home'" class="border">
      <p>mhoojuum</p>
      <button
        @click="handleButtonClick('game'), gameStart(10)"
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
      class="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50"
    >
      <div
        class="bg-white p-6 rounded-lg shadow-lg max-w-xl w-full"
        @click.stop
      >
        <h2 class="text-2xl sm:text-3xl mb-4">{{ modalTitle }}</h2>
        <p class="mb-4">{{ modalMessage }}</p>
        <button
          @click="toggleModal('', '')"
          class="py-2 px-4 bg-yellow-500 rounded-lg text-white mt-4"
        >
          Close
        </button>
      </div>
    </div>

    <!-- Game View -->
    <div
      v-show="currentView === 'game'"
      class="absolute inset-0 flex flex-col items-center justify-start text-center"
      style="
        background-image: url('/bg-game.png');
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        text-align: center;
      "
    >
      <div
        class="flex justify-between items-center w-full px-8 py-4 bg-white bg-opacity-60 rounded-lg shadow-lg"
      >
        <!-- Timer -->
        <div class="text-4xl font-bold text-gray-800">
          {{ Math.floor(time / 60) }}:{{ time % 60 < 10 ? "0" : ""
          }}{{ time % 60 }}
        </div>

        <!-- Score -->
        <div class="text-4xl font-bold text-yellow-500 flex items-center gap-2">
          Score: <span class="text-5xl">{{ Math.round(score) }}</span>
        </div>

        <!-- Combo -->
        <div
          v-if="combo > 0"
          class="text-4xl font-bold text-red-600 flex items-center gap-2"
        >
          Combo: <span class="text-5xl">{{ combo }}</span>
        </div>

        <!-- Life Points -->
        <div class="flex flex-row gap-5">
          <div v-for="hp in lifePoint">
            <img src="./assets/life.png" v-if="hp" class="w-12" />
          </div>
        </div>
      </div>

      <div class="grid grid-cols-3 gap-2 mt-56">
        <div v-for="hole in 9" :key="hole">
          <div
            v-if="position === hole && isMole && !isHit"
            @click="clickObject()"
            class="flex justify-center hover:cursor-pointer"
          >
            <img src="./assets/holeWithMole.png" class="w-1/2" />
          </div>
          <div
            v-else-if="position === hole && !isMole && !isHit"
            @click="clickMiss()"
            class="flex justify-center hover:cursor-pointer"
          >
            <img src="./assets/bomb.png" class="w-1/2" />
          </div>
          <div v-else class="flex justify-center">
            <img src="./assets/hole.png" class="w-1/2" />
          </div>
        </div>
      </div>
      <button
        @click="handleButtonClick('home'), resetGame()"
        class="py-1 px-3 bg-yellow-200 rounded-lg"
      >
        Back
      </button>
    </div>
  </div>
</template>

<style scoped></style>
