<script setup>
import { ref } from "vue";

const time = ref(0);

const test = () => {
  console.log(test);
};
const countDown = (func, duration, delay = 1000) => {
  time.value = duration;
  const interval = setInterval(() => {
    func();
    time.value--;
    if (time.value === 0) {
      console.log("time out");
      clearInterval(interval);
    }
  }, delay);
};

countDown(test, 5);
</script>

<template>
  <div class="text-7xl">
    {{ Math.floor(time / 60) }}:{{ time % 60 < 10 ? "0" : "" }}{{ time % 60 }}
  </div>
</template>

<style scoped></style>
