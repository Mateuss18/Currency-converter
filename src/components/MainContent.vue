<template>
  <main>
    <div class="text">
      <h1 class="title">Conversor de Moedas</h1>
  
      <p class="subtitle">Digite o valor a ser convertido e escolha a moeda para conversão</p>
    </div>

    <div class="content">
      <div class="fieldToConvert">
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
          :clearable="false"
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

          <template #no-options>
            <span class="custom-no-options">
              Nenhuma opção encontrada
            </span>
          </template>
        </v-select>
      </div>

      <button class="swap-button" @click="swapConversion">
        <img src="../assets/icon-swap.svg" alt="">
      </button>

      <div class="fieldConverted">
        <div class="resultConverted">
          {{ valorConvertido }}
        </div>

        <v-select
          id="selectCurrency"
          :options="currencyValues"
          label="text"
          :reduce="(currencyValue) => currencyValue.flag"
          :selectable="(currencyValue) => currencyValue.flag !== moedaConvertida && currencyValue.flag !== moedaParaConverter"
          v-model="moedaConvertida"
          :clearable="false"
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
import api from "../service/api.js";

const currencyValues = ref([
  { id: 1, flag: "BRL", text: "Real", image: "https://flagcdn.com/br.svg" },
  { id: 2, flag: "USD", text: "Dolar", image: "https://flagcdn.com/us.svg" },
  { id: 3, flag: "EUR", text: "Euro", image: "https://flagcdn.com/eu.svg" },
  { id: 4, flag: "GBP", text: "Libra Esterlina", image: "https://flagcdn.com/gb.svg" },
  { id: 5, flag: "ARS", text: "Peso Argentino", image: "https://flagcdn.com/ar.svg" },
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

      valorDaTaxa = response.data.rates[moedaConvertida];
      // valorDaTaxa = response.data.conversion_rates[moedaParaConverter];

      if(moedaParaConverter !== 'ARS') {
        valorConvertido.value = (valorDaTaxa * valorParaConverter).toFixed(2);
      } else {
        valorConvertido.value = (valorDaTaxa * valorParaConverter).toFixed(5);
      }
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

main {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #1d1d1d;
  padding: 40px 50px 50px 50px;
  border-radius: 12px;
}
.title {
  font-size: 34px;
  line-height: normal;
}
.subtitle {
  font-size: 18px;
  margin-bottom: 32px;
}
.content {
  display: flex;
  align-items: center;
  gap: 20px;
}
.fieldToConvert input {
  padding-left: 16px;
  font-size: 18px;
  font-weight: 500;
  max-width: 180px;
  height: 58px;
}
.resultConverted {
  display: flex;
  align-items: center;
  background-color: #1e1e1e;
  width: 180px;
  height: 58px;
  text-align: start;
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  padding-left: 16px;
}
.swap-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  background: none;
  width: 30px;
  height: 30px;
  filter: brightness(100);
}
.fieldToConvert,
.fieldConverted {
  display: flex;
  color: #000;
}
#selectCurrency img {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  object-fit: cover;
}
@media (max-width: 1040px) {
  .content {
    flex-direction: column;
  }
  .swap-button {
    transform: rotate(90deg);
  }
}
@media (max-width: 550px) {
  .title {
    font-size: 28px;
  }
  .subtitle {
    font-size: 16px;
    margin-bottom: 22px;
  }
  .fieldToConvert input,
  .resultConverted {
    max-width: 110px;
  }
  #selectCurrency img {
    width: 30px;
    height: 30px;
  }
  .fieldToConvert input,
  .resultConverted {
    height: 56px;
  }
}
</style>

<style>
#selectCurrency li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 8px 14px;
}
.vs__dropdown-menu,
.svs__selected-options,
#selectCurrency {
  min-width: 214px !important;
}
.vs__dropdown-option span {
  width: 100% !important;
}
#selectCurrency,
.vs__selected-options {
  height: 56px;
}
.vs__selected {
  width: 100% !important;
  height: 100% !important;
  margin: 0 !important;
  padding: 0 0 0 12px !important;
  gap: 10px;
  color: #d8d8d8 !important;
}
.vs__dropdown-toggle {
  border-color: #d8d8d8 !important;
}
.vs__open-indicator {
  fill: #d8d8d8 !important;
}
.vs__search {
  color: #d8d8d8 !important;
}
.vs--searchable .vs__dropdown-toggle {
  padding: 0 !important;
  margin: 0 !important;
}
.vs__actions {
  padding: 0 12px 0 0 !important;
}
.vs__dropdown-option--disabled {
  display: none !important;
}
.vs__selected span {
  font-weight: 600;
}

@media (max-width: 550px) {
  .vs__dropdown-menu, .svs__selected-options, #selectCurrency {
    min-width: 190px !important;
  }
  .vs__selected span,
  .vs__dropdown-option span {
    font-size: 14px;
  }
  #selectCurrency li {
    gap: 10px;
  }
  #selectCurrency, 
  .vs__selected-options {
    height: 54px;
  }
}
</style>
