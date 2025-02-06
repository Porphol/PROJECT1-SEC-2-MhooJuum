<script setup>
import { ref, computed } from "vue"

// Game controller
let gameStatus = true

// Count score
const score = ref(0)
const clickObject = () => {
  if (!gameStatus) return
  setCountdownCombo()
  if (combo.value < 20) combo.value++
  startCountdownCombo()
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

  if (!lifePoint.value.includes(true)) gameStatus = false
}
</script>

<template>
  <div class="ml-2 flex flex-col">
    <!-- SCORE -->
    <div>
      <div class="my-4 flex items-center gap-10">
        <p>Score: <span>{{ Math.round(score) }}</span></p>
      </div>

      <!-- bt Hit -->
      <div @click="clickObject" class="border border-blue-600 bg-blue-400 px-3 py-1 text-white text-xl inline-block mt-3">
        <p>Hit</p>
      </div>
    </div>

    <!-- LIFE -->
    <div>
      <div class="my-4">
        <div class="flex flex-row gap-5">
          <div v-for="hp in lifePoint">
            <p v-if="hp" class="border rounded-full bg-green-600 p-1 text-xs">HP</p>
          </div>
        </div>
        <p v-if="!lifePoint.includes(true)" class="underline text-red-500">GAME OVER</p>
      </div>

      <!-- bt Miss -->
      <div @click="clickMiss" class="border border-red-600 bg-red-400 px-3 py-1 text-white text-xl inline-block">
        <p>Miss</p>
      </div>
    </div>

    <!-- TEST SHOW COMBO -->
      <div v-if="combo > 0" class="relative w-32 h-32">
        <svg class="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
          <!-- Background circle -->
          <circle class="text-gray-700" stroke-width="8" stroke="currentColor" fill="transparent" r="40" cx="50" cy="50"/>
          <!-- Countdown circle -->
          <circle
            class="text-yellow-400 transition-all duration-100"
            stroke-width="8"
            stroke="currentColor"
            fill="transparent"
            r="40"
            cx="50"
            cy="50"
            :stroke-dasharray="circleCircumference"
            :stroke-dashoffset="strokeDashoffset"
          />
        </svg>
        <div class="absolute inset-0 flex items-center justify-center text-5xl font-bold">
          X{{ combo }}
        </div>
      </div>
  </div>  
</template>

<style scoped></style>
