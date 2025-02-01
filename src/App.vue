<script setup>
  import { ref } from "vue";

  // Game controller
  let gameStatus = true
  

  // Count score
  const score = ref(0)
  const clickObject = () => {
    if (!gameStatus) return
    // add combo
    countCombo()
    console.log("Combo: " + combo.value);

    // add score
    score.value += (1 * (1 + 0.1 * (combo.value - 1)))
    console.log("Score: " + score.value);
    console.log("Cal bonus: +" + (1 * (1 + 0.1 * (combo.value - 1))));

    console.log("###############");
  }


  // Count combo
  const combo = ref(0)
  let lastClick = null
  let countdownCombo = ref(0)
  const countCombo = () => {
    const currentClick = Date.now()
    
    // Set countdown combo
    if (combo.value >= 15) {
      countdownCombo.value = 1
    } else if (combo.value >= 10) {
      countdownCombo.value = 3
    } else {
      countdownCombo.value = 5
    }
    
    // Add combo 
    if (lastClick === null || (currentClick - lastClick) / 1000 > countCombo) {  
      combo.value = 1
    } else {
      if (combo.value < 20) combo.value++
    }
    // Set new lastClick
    lastClick = currentClick
    startCountdown()
  }

  // Show countdown combo
  let countdownTimer = null
  const startCountdown = () => {
    clearInterval(countdownTimer)
    countdownTimer = setInterval(() => {
      countdownCombo.value--
      if (countdownCombo.value <= 0) {
        clearInterval(countdownTimer)
        combo.value = 0
      }
    }, 1000)
  }


  // Life point
  const lifePoint = ref([true, true, true])
  let indexLifePoint = lifePoint.value.length - 1
  const clickMiss = () => {
    if (!gameStatus) return
    lifePoint.value[indexLifePoint] = false
    indexLifePoint -= 1
    combo.value = 0

    console.log("HP -1 -> " + lifePoint.value.filter(Boolean).length);
    console.log("Life Point: " + lifePoint.value);

    // Life point = [false, false, false]
    if(!lifePoint.value.includes(true)) gameOver()
  }


  // Game over
  const gameOver = () => {
    gameStatus = false

    console.log("Game over");
    console.log("Game status: " + gameStatus);
  }
</script>

<template>
  <div class="ml-2">
    <!-- SCORE -->
    <div>
      <div class="my-4 flex items-center gap-10">
        <p>Score: <span>{{ Math.round(score) }}</span></p>
        <p v-if="combo > 0">Combo: x<span>{{ combo }}</span></p>
        <p v-if="combo > 0">Combo Time Left: <span>{{ countdownCombo }}</span></p>
      </div>
      <!-- bt Hit -->
      <div  @click="clickObject" class="border border-blue-600 bg-blue-400 px-3 py-1 text-white text-xl inline-block">
        <p>Hit</p>
      </div>
    </div>

    <!-- LIFE -->
    <div>
      <div class="my-4">
        <div class="flex flex-row gap-5">
          <div v-for="hp in lifePoint">
            <p v-if="hp" class="broder rounded-full bg-green-600 p-1 text-xs">HP</p>
          </div>
        </div>
        <p v-if="!lifePoint.includes(true)" class="underline ">GAME OVER</p>
      </div>
      <!-- bt Miss -->
      <div  @click="clickMiss" class="border border-red-600 bg-red-400 px-3 py-1 text-white text-xl inline-block">
        <p>Miss</p>
      </div>
    </div>

    <!-- TEST COMOBO -->
    <div class="my-4">

    </div>
  </div>  
</template>
<style scoped>

</style>
