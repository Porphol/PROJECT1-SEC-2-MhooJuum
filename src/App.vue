<script setup>
import { ref, onMounted } from 'vue';

const totalTime = 5;
const remainTime = ref(totalTime);

const countTime = () => {
  const interval = setInterval(() => {
    if (remainTime.value > 0) {
      remainTime.value--;
      console.log(remainTime.value);
    } else {
      console.log('time out');
      clearInterval(interval);
    }
  }, 1000);
};

countTime();
</script>

<template>
  <div>
    {{ Math.floor(remainTime / 60) }}:{{ remainTime % 60 < 10 ? '0' : ''}}{{ remainTime % 60 }}
  </div>
</template>

<style scoped></style>
