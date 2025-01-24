<script setup>
  import { ref } from "vue";

  const score = ref(0)
  const hitObject = () => {
    score.value++
    console.log(score.value);
    
  }
</script>

<template>
  <div class="my-4">
    <p>Score: <span>{{ score }}</span></p>
  </div>
  <div  v-on:click="hitObject" class="border border-red-600 bg-red-400 px-3 py-1 text-white text-xl inline-block">
    <p>Mhoo</p>
  </div>
</template>

<style scoped>

</style>
