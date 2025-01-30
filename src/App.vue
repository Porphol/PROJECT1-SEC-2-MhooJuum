<script setup>
  import { ref } from "vue";

  // Count score
  const score = ref(0)
  const hitObject = () => {
    // add combo
    countCombo()
    console.log("Combo: " + combo.value);

    // add score
    score.value = Math.round(score.value + (1 * (1 + 0.1 * (combo.value - 1))))
    console.log("Score: " + score.value);
    console.log("Cal bonus: " + (1 * (1 + 0.1 * (combo.value - 1))));

    console.log("###############");
  }


  // Count combo
  let lastClick = null
  const combo = ref(0)
  const countCombo = () => {
    const currentClick = Date.now()

    if (lastClick === null || (currentClick - lastClick) / 1000 > 1) {  
      combo.value = 1
    } else {
      if (combo.value <= 20) combo.value++
    }
    // Set new lastClick
    lastClick = currentClick
  }

</script>

<template>
  <div class="my-4">
    <p>Score: <span>{{ score }}</span></p>
    <p>Combo: <span>{{ combo }}</span></p>
  </div>
  <div  v-on:click="hitObject" class="border border-red-600 bg-red-400 px-3 py-1 text-white text-xl inline-block">
    <p>Mhoo</p>
  </div>
</template>
<style scoped>

</style>
