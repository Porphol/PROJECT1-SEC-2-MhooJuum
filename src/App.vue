<script setup>
import { ref, computed } from "vue"
const currentView = ref("home")
const handleButtonClick = (view) => {
  currentView.value = view
}

const position = ref(0)
const isMole = ref(true)
const isHit = ref(false)
const random = (num) => {
  position.value = Math.floor(Math.random() * num) + 1
  isMole.value = Math.random() < 0.7
}

const time = ref(0)
const startTime = ref(0)
let startInterval = null
const gameStart = (duration) => {
  startTime.value = 3
  startInterval = setInterval(() => {
    startTime.value--
    if (startTime.value <= 0) {
      clearInterval(startInterval)
      gameCountDown(() => random(9))
      countDown(duration)
    }
  }, 1000)
}

let gameInterval = null
const gameCountDown = (func, delay = 1500) => {
  func()
  gameInterval = setInterval(() => {
    func()
    isHit.value = false
  }, delay)
}

let timeInterval = null
const countDown = (duration, delay = 1000) => {
  time.value = duration
  timeInterval = setInterval(() => {
    time.value--
    // Time's up
    if (time.value <= 0) {
      clearInterval(timeInterval)
      clearInterval(gameInterval)
      gameStatus = false
      toggleModal("Time's up", `Your final score is ${score.value}`)
    }
    // Game over
    // Life point = [false, false, false]
    if (!lifePoint.value.includes(true)) {
      clearInterval(timeInterval)
      clearInterval(gameInterval)
      gameStatus = false
      toggleModal("Game over", `Your final score is ${score.value}`)
    }
  }, delay)
}

const showModal = ref(false)
const modalTitle = ref("")
const modalMessage = ref("")
const toggleModal = (title, message) => {
  modalTitle.value = title
  modalMessage.value = message
  showModal.value = !showModal.value
}

// Game controller
let gameStatus = true
const resetGame = () => {
  gameStatus = true
  score.value = 0
  combo.value = 0
  countdownCombo.value = 0
  lifePoint.value = [true, true, true]
  indexLifePoint = lifePoint.value.length - 1
  time.value = 0
  startTime.value = 0
  position.value = 0
  isHit.value = false
  isMole.value = true
  clearInterval(countdownTimer)
  clearInterval(startInterval)
  clearInterval(timeInterval)
  clearInterval(gameInterval)
}

// Count score
const score = ref(0)
const clickObject = () => {
  if (!gameStatus) return
  setCountdownCombo()
  if (combo.value < 20) combo.value++
  startCountdownCombo()

  isHit.value = true
}

// Count combo
const combo = ref(0)
const countdownCombo = ref(5)

const setCountdownCombo = () => {
  if (combo.value >= 15) {
    countdownCombo.value = 1.5
  } else if (combo.value >= 10) {
    countdownCombo.value = 3
  } else {
    countdownCombo.value = 5
  }
  countdownMax = countdownCombo.value
}

let countdownTimer = null;
const startCountdownCombo = () => {
  clearInterval(countdownTimer)

  countdownTimer = setInterval(() => {
    countdownCombo.value -= 0.1
    if (countdownCombo.value <= 0) {
      clearInterval(countdownTimer)
      if (combo.value >= 15) {
        combo.value = 10
        setCountdownCombo()
        startCountdownCombo()
      } else {
        combo.value = 0
      }
    }
  }, 100)
}

// Circle countdown
let countdownMax = 5
const circleCircumference = 2 * Math.PI * 40
const strokeDashoffset = computed(() => {
  return circleCircumference * (1 - (countdownCombo.value / countdownMax))
});

// Life point
const lifePoint = ref([true, true, true])
let indexLifePoint = lifePoint.value.length - 1
const clickMiss = () => {
  if (!gameStatus) return
  lifePoint.value[indexLifePoint] = false
  indexLifePoint -= 1
  combo.value = 0

  isHit.value = true
}
</script>

<template>
  <div>
    <!-- Div Home Page -->
    <div v-show="currentView === 'home'" class="border h-screen bg-cover bg-no-repeat bg-center bg-bgHome">
      <div class="absolute right-0 mr-10 mt-10">
        <button @click="
          toggleModal(
            'How to Play',
            'Here are the instructions for how to play the game:'
          )
          " class="pt-1 pb-2 px-5 bg-black rounded-[50%] font-bold text-white text-6xl">
          ?
        </button>
      </div>
      <div class="flex justify-center items-center flex-col mt-[5rem] gap-[10rem] h-max">
        <p class="text-center text-[13.5rem] font-Muffin tracking-wider flex-grow">
          MHOOJUUM
        </p>
        <div class="flex flex-col items-center flex-grow">
          <img src="./assets/image/MhooJuum_logo.png" alt=""
            class="max-h-[20vh] w-auto absolute top-[46vh] left-1/2 transform -translate-x-1/2" />
          <button @click="handleButtonClick('game'), gameStart(10)"
            class="py-[2vh] px-[12vh] bg-yellow-300 rounded-[4rem] text-[12vh] font-Muffin tracking-widest duration-200 hover:bg-yellow-500 hover:text-white hover:shadow-xl">
            PLAY
          </button>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-lg max-w-xl w-full" @click.stop>
        <h2 class="text-2xl sm:text-3xl mb-4">{{ modalTitle }}</h2>
        <p class="mb-4">{{ modalMessage }}</p>
        <button @click="toggleModal('', '')" class="py-2 px-4 bg-yellow-500 rounded-lg text-white mt-4">
          Close
        </button>
      </div>
    </div>

    <!-- Game View -->
    <div
      v-show="currentView === 'game'"
      class="absolute inset-0 flex flex-col items-center justify-start text-center bg-cover bg-center bg-no-repeat bg-bgGame"
 
    >
      <div
        class="flex justify-between items-center w-full px-8 py-4 bg-white bg-opacity-60 rounded-lg shadow-lg"
      >
        <!-- Timer -->
        <div class="text-4xl font-bold text-gray-800">
          {{ Math.floor(time / 60) }}:{{ time % 60 < 10 ? "0" : "" }}{{ time % 60 }} 
        </div>

        <!-- Score -->
        <div class="text-4xl font-bold text-yellow-500 flex items-center gap-2">
          Score: <span class="text-5xl">{{ score }}</span>
        </div>
        <!-- Life Points -->
        <div class="flex flex-row gap-5">
          <div v-for="hp in lifePoint">
            <img src="./assets/life.png" v-if="hp" class="w-12" />
          </div>
        </div>
      </div>
        <!-- combo -->

        <div class="h-32 self-end mt-8 mr-8">
          <div v-if="combo > 0" class="relative w-32 h-full">
            <svg class="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <!-- Background circle -->
              <circle class="text-gray-700" stroke-width="8" stroke="currentColor" fill="transparent" r="40" cx="50"
                cy="50" />
              <!-- Countdown circle -->
              <circle class="text-yellow-400 transition-all duration-100" stroke-width="8" stroke="currentColor"
                fill="transparent" r="40" cx="50" cy="50" :stroke-dasharray="circleCircumference"
                :stroke-dashoffset="strokeDashoffset" />
            </svg>
            <div class="absolute inset-0 flex items-center justify-center text-5xl font-bold">
              X{{ combo }}
            </div>
          </div>
        </div>
        
        <div class="grid grid-cols-3 gap-2 mt-20">
          <div v-for="hole in 9" :key="hole">
            <div v-if="position === hole && isMole && !isHit" @click="clickObject()"
              class="flex justify-center hover:cursor-pointer">
              <img src="./assets/holeWithMole.png" class="w-1/2" />
            </div>
            <div v-else-if="position === hole && !isMole && !isHit" @click="clickMiss()"
              class="flex justify-center hover:cursor-pointer">
              <img src="./assets/bomb.png" class="w-1/2" />
            </div>
            <div v-else class="flex justify-center">
              <img src="./assets/hole.png" class="w-1/2" />
            </div>
          </div>
        </div>
        <button @click="handleButtonClick('home'), resetGame()" class="py-1 px-3 bg-yellow-200 rounded-lg">
          Back
        </button>
      </div>
    </div>
</template>

<style scoped></style>
