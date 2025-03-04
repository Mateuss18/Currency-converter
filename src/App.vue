<template>
  <main>
    <h1>Currency Converter</h1>

    <p>Digite o valor a ser convertido e escolha a moeda para conversão</p>

    <div class="group">
      <div class="valueToConvert">
        <input
          type="number"
          v-model="valorParaConverter" 
        />

        <v-select
          id="selectCurrency"
          :options="currencyValues"
          label="text"
          :reduce="(currencyValue) => currencyValue.flag"
          :selectable="(currencyValue) => currencyValue.flag !== moedaParaConverter && currencyValue.flag !== moedaConvertida"
          v-model="moedaParaConverter"
        >
          <template #selected-option="{ image, text }">
            <img :src="image" :alt="('Icone da badeira do ', text)" />
            <span>{{ text }}</span>
          </template>

          <template #option="{ image, text }">
            <img
              :src="image"
              :alt="('Icone da badeira do ', text)" />
            <span>{{ text }}</span>
          </template>
        </v-select>
      </div>

      <button class="swap-button" @click="swapConversion">
        <img src="./assets/icon-swap.svg" alt="">
      </button>

      <div class="valueConverted">
        <div class="inputFake">
          {{ valorConvertido }}
        </div>

        <v-select
          id="selectCurrency"
          :options="currencyValues"
          label="text"
          :reduce="(currencyValue) => currencyValue.flag"
          :selectable="(currencyValue) => currencyValue.flag !== moedaConvertida && currencyValue.flag !== moedaParaConverter"
          v-model="moedaConvertida"
        >
          <template #selected-option="{ image, text }">
            <img
              :src="image"
              :alt="('Icone da badeira do ', text)" />
            <span>{{ text }}</span>
          </template>

          <template #option="{ image, text }">
            <img
              :src="image"
              :alt="('Icone da badeira do ', text)" />
            <span>{{ text }}</span>
          </template>
        </v-select>
      </div>
    </div>
  </main>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import api from "./service/api.js";

const currencyValues = ref([
  { id: 1, flag: "BRL", text: "REAL", image: "https://flagcdn.com/br.svg" },
  { id: 2, flag: "EUR", text: "EURO", image: "https://flagcdn.com/eu.svg" },
  { id: 3, flag: "USD", text: "DOLAR", image: "https://flagcdn.com/us.svg" },
]);

const valorParaConverter = ref(1);
const valorConvertido = ref(0);
let valorDaTaxa = null;
let moedaParaConverter = ref("USD");
let moedaConvertida = ref("BRL");

async function fetchAPI(
  valorParaConverter,
  moedaConvertida,
  moedaParaConverter
) {
  try {
    if (moedaParaConverter && moedaConvertida) {
      const response = await api.get(moedaParaConverter);

      console.log(response);
      

      valorDaTaxa = response.data.rates[moedaConvertida];
      // valorDaTaxa = response.data.conversion_rates[moedaParaConverter];

      valorConvertido.value = (valorDaTaxa * valorParaConverter).toFixed(2);
    }
  } catch (error) {
    console.error("Erro ao buscar moedas: ", error);
  }
}

function swapConversion() {
  [moedaConvertida.value, moedaParaConverter.value] = [moedaParaConverter.value, moedaConvertida.value]
}

watch(
  [
    valorParaConverter,
    () => moedaConvertida.value,
    () => moedaParaConverter.value,
  ],
  ([
    newValorParaConverter,
    newmoedaConvertida,
    newmoedaParaConverter,
  ]) => {
    fetchAPI(
      newValorParaConverter,
      newmoedaConvertida,
      newmoedaParaConverter
    );
  }
);

onMounted(() => {
  fetchAPI(
    valorParaConverter.value,
    moedaConvertida.value,
    moedaParaConverter.value
  );
});
</script>

<style scoped>
@import "vue-select/dist/vue-select.css";

body {
  background-color: blue;
}

.inputFake {
  background-color: #3b3b3b;
  width: 177px;
  text-align: start;
  color: #fff;
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

.swap-button {
  padding: 0;
  background: none;
  width: 30px;
  height: 30px;
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

.group {
  display: flex;
  flex-direction: column;
  gap: 28px;
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
