<template>
  <main>
    <h1>Coin Converter</h1>

    <div class="valueToConvert">
      <input type="number" v-model="valorDolar">

      <v-select 
        id="selectCurrency"
        :options="currencyValues"
        label="text"
        :reduce="currencyValue => currencyValue.flag"
        v-model="moedaSelecionada"
      >
        <template #option="{ image, text }">
          <img :src="image" :alt="'Icone da badeira do ', text">
          <span>{{ text }}</span>
        </template>
      </v-select>
    </div>

    <div v-if="convertedValue" class="valueConverted">
      <div class="inputFake">
        {{ convertedValue }}
      </div>

      <v-select 
        id="selectCurrency"
        :options="currencyValues"
        label="text"
        :reduce="currencyValue => currencyValue.flag"
        v-model="moedaSelecionada"
      >
        <template #option="{ image, text }">
          <img :src="image" :alt="'Icone da badeira do ', text">
          <span>{{ text }}</span>
        </template>
      </v-select>
    </div>
  </main>
</template>

<script setup>
import { onMounted, ref, watch } from 'vue'
import api from './service/api.js'

const currencyValues = ref([
  { flag: 'BRL', text: 'Real', image: 'https://flagcdn.com/br.svg' },
  { flag: 'EUR', text: 'Euro', image: 'https://flagcdn.com/eu.svg' },
  { flag: 'USD', text: 'Dolar', image: 'https://flagcdn.com/us.svg' },
])

let valorDolar = ref(1)
let convertedValue = ref(0)
let rateValue = null
let moedaSelecionada = ref('USD')

async function fetchAPI (valorDolar, moedaSelecionada) {
  try {
    if (moedaSelecionada) {
      const response = await api.get(moedaSelecionada)
  
      rateValue = response.data.rates.BRL
      convertedValue.value = (rateValue * valorDolar).toFixed(2)
    }
  } catch (error) {
    console.error('Erro ao buscar moedas: ', error)
  }
}

watch([valorDolar, () => moedaSelecionada.value], ([newValorDolar, newMoedaSelecionada]) => {  
  fetchAPI(newValorDolar, newMoedaSelecionada)
})

onMounted(() => {
  fetchAPI(valorDolar.value, moedaSelecionada.value)
})
</script>

<style scoped>
@import "vue-select/dist/vue-select.css";

body {
  background-color: blue;
}

.inputFake {
  background-color: #3B3B3B;
  width: 177px;
  text-align: start;
  color: #FFF;
}
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

.valueToConvert,
.valueConverted {
  display: flex;
  color: #000;
}

#selectCurrency img {
  width: 35px; 
  height: 35px; 
  border-radius: 50%; 
  object-fit: cover;
}
</style>

<style>
#selectCurrency li {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.vs__dropdown-menu {
  min-width: 120px !important;
}
</style>
