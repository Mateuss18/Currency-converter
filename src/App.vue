<template>
  <main>
    <h1>Coin Converter</h1>

    <!-- <div v-if="dataUSD">
      <h2>Digite o valor em </h2>
      <input type="number">
      {{ dataUSD }}
    </div>
  
    <div v-if="dataBRL">
      <h2>Digite o valor em </h2>
      <input type="number">
      {{ dataBRL }}
    </div> -->


    <input type="number" v-model="valorDolar">

    <p>VALOR EM REAIS</p>
    <p v-if="convertedValue">{{ convertedValue }}</p>
  </main>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import api from './service/api.js'

const currency = ref(["BRL", "EUR", "USD"])
let valorDolar = ref([1])
let convertedValue = ref([])

console.log(valorDolar.value);

  // "BRL": "Real",
  // "EUR": "Euro",
  // "USD": "Dolar"

const fetchAPI = async () => {
  try {
    if (currency) {
      const response = await api.get(currency.value[2])
  
      convertedValue.value = response.data.rates.BRL
    }
  } catch (error) {
    console.error('Erro ao buscar moedas: ', error)
  }
  // const coinsRates = response.data.conversion_rates
  // console.log(response.data); 
  // this.dataUSD = coinsRates.USD
  // this.dataBRL = coinsRates.BRL
}

onMounted(() => {
  fetchAPI()
})
</script>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
