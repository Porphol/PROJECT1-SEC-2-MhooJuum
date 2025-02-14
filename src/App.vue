<script setup>
import { ref, computed, watch } from 'vue'
const currentView = ref('home')
const changePage = (view) => {
  currentView.value = view
}


const characters = ref(["mole", "rat", "mhoojuum"])

const selectedIndex = ref(0)
const selectedCharacter = ref(characters.value[selectedIndex.value])

const nextCharacter = () => {
  characters.value.length - 1 === selectedIndex.value ? selectedIndex.value = 0 : selectedIndex.value++
  selectedCharacter.value = characters.value[selectedIndex.value]
}

const prevCharacter = () => {
  selectedIndex.value === 0 ? selectedIndex.value = characters.value.length - 1 : selectedIndex.value--
  selectedCharacter.value = characters.value[selectedIndex.value]
}

const logo = ref('/MhooJuum_logo.png')
const moleImg = ref('/holeWithMole.png')
const holeImg = ref('/hole.png')
const bombImg = ref('/bomb.png')
const gameBg = ref('/bg-game.png')

watch(selectedCharacter, () => {
  if (selectedCharacter.value === 'mole') {
    logo.value = '/MhooJuum_logo.png'
    moleImg.value = '/holeWithMole.png'
    holeImg.value = '/hole.png'
    bombImg.value = '/bomb.png'
    gameBg.value = '/bg-game.png'
  } else if (selectedCharacter.value === 'rat') {
    logo.value = '/mouse.png'
    moleImg.value = '/holeWithMouse.png'
    holeImg.value = '/mouseHole.png'
    bombImg.value = '/angryCat.png'
    gameBg.value = '/bgHouse.png'
  } else if (selectedCharacter.value === 'mhoojuum') {
    logo.value = '/Pork.png'
    moleImg.value = '/hotpotWithBoiledPork.png'
    holeImg.value = '/hotpot.png'
    bombImg.value = '/hotpotWithRawPork.png'
    gameBg.value = '/bg-mhoojuum.png'
  }
})



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
  resetGame()
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
      updateHighScore()
      toggleModal(
        "Time's up",
        `Your high score is ${highScore.value} \n Your final score is ${score.value}`
      )
    }
    // Game over
    // Life point = [false, false, false]
    if (!lifePoint.value.includes(true)) {
      clearInterval(timeInterval)
      clearInterval(gameInterval)
      updateHighScore()
      gameStatus = false
      toggleModal(
        'Game over',
        `Your high score is ${highScore.value} \n Your final score is ${score.value}`
      )
    }
  }, delay)
}

const showModal = ref(false)
const modalTitle = ref('')
const modalMessage = ref('')
const toggleModal = (title, message) => {
  modalTitle.value = title
  modalMessage.value = message
  showModal.value = !showModal.value
}

// Game controller
let gameStatus = true
const resetGame = () => {
  gameStatus = true
  selectedIndex.value === 0
  score.value = 0
  combo.value = 0
  countdownCombo.value = 10
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
  score.value += Math.round(1 * (1 + 0.1 * (combo.value - 1)))
  isHit.value = true
  playSoundEffect('correct')
}

// Count combo
const combo = ref(0)
const countdownCombo = ref(5)

const setCountdownCombo = () => {
  if (combo.value >= 15) {
    countdownCombo.value = 3
  } else if (combo.value >= 10) {
    countdownCombo.value = 5
  } else {
    countdownCombo.value = 8
  }
  countdownMax = countdownCombo.value
}

let countdownTimer = null
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
  return circleCircumference * (1 - countdownCombo.value / countdownMax)
})

// Life point
const lifePoint = ref([true, true, true])
let indexLifePoint = lifePoint.value.length - 1
const clickMiss = () => {
  if (!gameStatus) return
  lifePoint.value[indexLifePoint] = false
  indexLifePoint -= 1
  combo.value = 0
  isHit.value = true
  playSoundEffect('wrong')
}

// High Score
const highScore = ref(0)
const updateHighScore = () => {
  if (score.value > highScore.value) {
    highScore.value = score.value
  }
}

const soundOn = ref(true)
const playSound = () => {
  soundOn.value = !soundOn.value
}

// playSoundEffect
const correctSoundPlayer = ref('')
const wrongSoundPlayer = ref('')

const playSoundEffect = (sound) => {
  if (sound === 'correct' && soundOn.value) {
    correctSoundPlayer.value.play()
    correctSoundPlayer.value.volume = 0.1
  } else if (sound === 'wrong' && soundOn.value) {
    wrongSoundPlayer.value.play()
    wrongSoundPlayer.value.volume = 0.1
  }
}
</script>

<template>
  <div class="font-Muffin text-black">
    <!-- Div Home Page -->
    <div v-show="currentView === 'home'" class="border h-screen bg-cover bg-no-repeat bg-center bg-bgHome">
      <div class="absolute right-0 mr-10 mt-10">
        <button @click="
          toggleModal(
            'How to Play',
            `- Select your favorite character before starting the game.
             - Click the character to score points.
             - Avoid clicking bombs to save your lives.`
          )
          " class="pt-1 pb-2 px-5 bg-black rounded-[50%] font-bold text-white text-6xl">
          ?
        </button>
      </div>
      <div>
        <p class="text-center text-[180px] tracking-wider pt-6">
          MHOOJUUM
        </p>
        <div class="absolute top-[70%] left-1/2 transform -translate-x-1/2 -translate-y-1/2">

          <!-- Select character -->
          <div class="flex items-center gap-4">
            <button @click="prevCharacter"
              class="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-full shadow-md transition text-5xl transform hover:scale-125">
              < </button>

                <div>
                  <img :src="logo" alt=""
                    class="max-h-[200px] w-auto absolute -top-[9.5rem] left-1/2 transform -translate-x-1/2" />
                  <button @click="changePage('game'), gameStart(30)"
                    class="py-2 px-14 bg-yellow-300 rounded-[4rem] text-[8rem] tracking-widest duration-200 hover:bg-yellow-500 hover:text-white hover:shadow-xl">
                    PLAY
                  </button>
                </div>

                <button @click="nextCharacter"
                  class="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-full shadow-md transition text-5xl transform hover:scale-125">
                  >
                </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal -->
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-lg w-2/3 sm:w-2/3 md:w-1/2 lg:w-1/2 xl:w-2/5" @click.stop>
        <h2 class="text-2xl sm:text-3xl md:text-3xl mb-4 text-center">{{ modalTitle }}</h2>
        <p class="my-8 text-lg sm:text-lg md:text-xl leading-8 whitespace-pre-line">
          {{ modalMessage }}
        </p>
        <button @click="toggleModal('', ''), changePage('home')"
          class="py-1 px-4 bg-yellow-500 rounded-lg text-white mt-2 sm:mt-4 md:mt-4 lg:mt-4 xl:mt-4">
          Close
        </button>
      </div>
    </div>

    <!-- Game View -->
    <div v-show="currentView === 'game'"
      class="absolute inset-0 flex flex-col items-center justify-start text-center bg-cover bg-center bg-no-repeat"
      :style="{ backgroundImage: `url(${gameBg})` }">
      <!-- countDown before start -->
      <div v-if="startTime > 0"
        class="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 text-[180px] text-white">
        {{ startTime }}
      </div>
      <!-- sound effect -->
      <audio ref="correctSoundPlayer">
        <source src="./assets/sound/correct.mp3" type="audio/mp3" />
      </audio>

      <audio ref="wrongSoundPlayer">
        <source src="./assets/sound/wrong.mp3" type="audio/mp3" />
      </audio>

      <div
        class="flex justify-between items-center w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12 py-4 bg-white bg-opacity-60 rounded-lg shadow-lg">
        <!-- Timer -->
        <div class="text-xl sm:text-3xl md:text-3xl lg:text-4xl font-bold text-gray-800">
          {{ Math.floor(time / 60) }}:{{ time % 60 < 10 ? '0' : '' }}{{ time % 60 }} </div>

            <!-- High Score -->
            <div class="text-xl sm:text-3xl md:text-3xl lg:text-4xl font-bold text-gray-800">
              High score: <span class="text-xl sm:text-3xl md:text-4xl lg:text-5xl">{{ highScore }}</span>
            </div>

            <!-- Score -->
            <div class="text-xl sm:text-3xl md:text-3xl lg:text-4xl font-bold text-yellow-500 flex items-center gap-2">
              Score: <span class="sm:text-3xl md:text-4xl lg:text-5xl">{{ score }}</span>
            </div>

            <!-- Life Points -->
            <div class="flex flex-row gap-1 sm:gap-5 md:gap-5 lg:gap-5">
              <div v-for="hp in lifePoint">
                <img src="./assets/life.png" v-if="hp" class="w-4 sm:w-8 md:w-10 lg:w-12 xl:w-12" />
              </div>
            </div>

            <!-- sound -->
            <label class="swap">
              <input type="checkbox" @click="playSound" v-model="soundOn" />
              <!-- volume on icon -->
              <svg class="swap-on fill-current" xmlns="http://www.w3.org/2000/svg" width="42" height="42"
                viewBox="0 0 24 24">
                <path
                  d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z" />
              </svg>

              <!-- volume off icon -->
              <svg class="swap-off fill-current" xmlns="http://www.w3.org/2000/svg" width="36" height="36"
                viewBox="0 0 24 24">
                <path
                  d="M3,9H7L12,4V20L7,15H3V9M16.59,12L14,9.41L15.41,8L18,10.59L20.59,8L22,9.41L19.41,12L22,14.59L20.59,16L18,13.41L15.41,16L14,14.59L16.59,12Z" />
              </svg>
            </label>
        </div>
        <div class="w-full flex justify-between mt-8 px-16"
          :class="selectedCharacter === 'mhoojuum' ? 'text-white' : 'text-black'">
          <button @click="changePage('home'), resetGame()" class="text-6xl">BACK</button>
          <!-- combo -->
          <div class="h-32">
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
        </div>
        <div
          class="grid grid-cols-3 gap-2 gap-y-10 sm:gap-2 md:gap-2 lg:gap-2 mt-32 sm:mt-28 md:mt-28 lg:mt-16 xl:mt-36">
          <div v-for="hole in 9" :key="hole">
            <div v-show="position === hole && isMole && !isHit" @click="clickObject()"
              class="flex justify-center hover:cursor-pointer">
              <img :src="moleImg" class="w-30 sm:w-3/4 md:w-2/3 lg:w-3/5 xl:w-1/2" />
            </div>
            <div v-show="position === hole && !isMole && !isHit" @click="clickMiss()"
              class="flex justify-center hover:cursor-pointer">
              <img :src="bombImg" class="w-30 sm:w-3/4 md:w-2/3 lg:w-3/5 xl:w-1/2" />
            </div>
            <div v-show="!(position === hole && !isHit)" class="flex justify-center">
              <img :src="holeImg" class="w-30 sm:w-3/4 md:w-2/3 lg:w-3/5 xl:w-1/2" />
            </div>
          </div>
        </div>
      </div>
    </div>
</template>

<style scoped></style>
