<template>
  <main>
    <div class="text">
      <h1 class="title">Converta aqui</h1>
  
      <p class="subtitle">Digite o valor a ser convertido e escolha a moeda para conversão</p>
    </div>

    <div class="content">
      <div class="fieldToConvert">
        <input
          type="number"
          autocomplete="off"
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

      <button class="swap-button" @click="swapConversion" aria-label="Trocar a conversão">
        <img src="../assets/icon-swap.svg" alt="Icone de troca">
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

      const resultado = truncarComCasaExtra(valorDaTaxa * valorParaConverter);
      valorConvertido.value = resultado;
    }
  } catch (error) {
    console.error("Erro ao buscar moedas: ", error);
  }
}

function truncarComCasaExtra(valor) {
  // Converte o número para string
  let str = valor.toString();
  
  // Trata notação científica, se necessário
  if (str.includes('e')) {
    str = valor.toFixed(15).replace(/0+$/, '');
  }
  
  // Se não houver ponto decimal, adiciona ",00"
  if (!str.includes('.')) {
    return str + ',00';
  }
  
  // Divide em parte inteira e decimal
  let [parteInteira, parteDecimal] = str.split('.');
  
  // Determina a parte decimal final
  let decimalFinal;
  if (parteDecimal.length <= 1) {
    // Para 0 ou 1 casa decimal, completa com zeros até 2 casas
    decimalFinal = parteDecimal.padEnd(2, '0');
  } else {
    // Para 2 ou mais casas, remove o último dígito e garante pelo menos 2 casas
    decimalFinal = parteDecimal.slice(0, -1).padEnd(2, '0');
  }
  
  // Retorna o número formatado com vírgula
  return `${parteInteira},${decimalFinal}`;
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
  background-color: #0c0c0c;
  border: solid 1px #FFF;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
}
.resultConverted {
  display: flex;
  align-items: center;
  background-color: #575757;
  width: 180px;
  height: 58px;
  text-align: start;
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  padding-left: 16px;
  border-top-left-radius: 4px;
  border-bottom-left-radius: 4px;
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
#selectCurrency {
  background-color: #0c0c0c;
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
  main {
    padding: 24px;
  }
  .title {
    font-size: 26px;
    margin-bottom: 6px;
  }
  .subtitle {
    font-size: 14px;
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
@media (max-width: 405px) {
  main {
    padding: 16px;
  }
  .fieldToConvert input, 
  .resultConverted {
    font-size: 14px;
    max-width: 90px;
    padding-left: 12px;
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
  min-width: 218px !important;
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
