<script setup>
import { ref } from 'vue'

const position = ref(0)

const random = (num) =>{
  position.value = Math.floor(Math.random() * num) + 1
}

</script>

<template>
    <div v-for="hole in 9" :key="hole">
      <h1 class="text-7xl text-yellow-500" v-show="position === hole">JuumMhoo</h1>
      <h1 class="text-7xl text-yellow-500" v-show="position !== hole">MhooJuum</h1>
    </div>
    <button v-on:click="random(9)">hey</button>
</template>

<style scoped>

</style>