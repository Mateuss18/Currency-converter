<template>
  <main>
    <div class="text">
      <h1 class="title">Converta aqui</h1>
      <p class="subtitle">Digite o valor a ser convertido e escolha a moeda para conversão</p>
    </div>

    <div class="content">
      <div class="fieldToConvert campo">
        <label for="valorParaConverter" class="label">Quantia</label>
        <div class="label-wrapper">
          <input
            id="valorParaConverter"
            type="text"
            autocomplete="off"
            v-model="valorParaConverter"
            min="0"
            @keypress="validateInput"
            aria-label="Valor a ser convertido"
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
              <img :src="image" :alt="('Icone da bandeira do ' + text)" />
              <span>{{ text }}</span>
            </template>
            <template #option="{ image, text }">
              <img :src="image" :alt="('Icone da bandeira do ' + text)" />
              <span>{{ text }}</span>
            </template>
            <template #no-options>
              <span class="custom-no-options">Nenhuma opção encontrada</span>
            </template>
          </v-select>
        </div>
      </div>

      <button class="swap-button" @click="swapConversion" aria-label="Trocar a conversão">
        <img src="../assets/icon-swap.svg" alt="Icone de troca" />
      </button>

      <div class="fieldConverted campo">
        <div for="valorParaConverter" class="label">Convertido</div>
        <div class="label-wrapper">
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
              <img :src="image" :alt="('Icone da bandeira do ' + text)" />
              <span>{{ text }}</span>
            </template>
            <template #option="{ image, text }">
              <img :src="image" :alt="('Icone da bandeira do ' + text)" />
              <span>{{ text }}</span>
            </template>
          </v-select>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { onMounted, ref, watch } from "vue";
import api from "../service/api.js";

const valorParaConverter = ref(1);
const moedaParaConverter = ref("USD");
const moedaConvertida = ref("BRL");
const valorConvertido = ref("0");

const currencyValues = ref([
  { id: 1, flag: "BRL", text: "Real", image: "https://flagcdn.com/br.svg" },
  { id: 2, flag: "USD", text: "Dolar", image: "https://flagcdn.com/us.svg" },
  { id: 3, flag: "EUR", text: "Euro", image: "https://flagcdn.com/eu.svg" },
  { id: 4, flag: "GBP", text: "Libra Esterlina", image: "https://flagcdn.com/gb.svg" },
  { id: 5, flag: "ARS", text: "Peso Argentino", image: "https://flagcdn.com/ar.svg" },
]);

const estadoConversao = ref({
  valorParaConverter: 1,
  moedaParaConverter: "USD",
  moedaConvertida: "BRL",
  valorConvertido: "0",
  taxa: null,
});

watch(valorParaConverter, (novoValor) => {
  const valorNormalizado = novoValor.replace(",", "."); 
  
  estadoConversao.value.valorParaConverter = valorNormalizado; 
  calcularValorConvertido();
});
watch(moedaParaConverter, (novoValor) => {  
  estadoConversao.value.moedaParaConverter = novoValor;
});
watch(moedaConvertida, (novoValor) => {
  estadoConversao.value.moedaConvertida = novoValor;
});
watch(() => estadoConversao.value.valorConvertido, (novoValor) => {
  valorConvertido.value = novoValor;
});

function formatarNumero(valor) {
  const casasDecimais = valor >= 1 ? 2 : 5;
  const fator = Math.pow(10, casasDecimais);
  const valorCortado = Math.floor(valor * fator) / fator;

  return new Intl.NumberFormat("pt-BR", {
    minimumFractionDigits: casasDecimais,
    maximumFractionDigits: casasDecimais,
  }).format(valorCortado);
}

function swapConversion() {
  [moedaConvertida.value, moedaParaConverter.value] = [
    moedaParaConverter.value, 
    moedaConvertida.value
  ];
}

watch(
  [() => moedaConvertida.value, () => moedaParaConverter.value],
  async ([novaMoedaConvertida, novaMoedaParaConverter]) => {
    await fetchTaxa(novaMoedaConvertida, novaMoedaParaConverter);
    calcularValorConvertido();
  }
);

async function fetchTaxa(moedaConvertida, moedaParaConverter) {
  try {
    const response = await api.get(`?base=${moedaParaConverter}`);
    // const response = await api.get(moedaParaConverter);
    
    // estadoConversao.value.taxa = response.data.conversion_rates[moedaConvertida];
    estadoConversao.value.taxa = response.data.rates[moedaConvertida];
  } catch (error) {
    console.error("Erro ao buscar taxa:", error);
    if (error.response && error.response.status === 404) {
        console.error("Moeda não encontrada:", error); 
        alert('Moeda não encontrada') 
    } else if (error.response && error.response.status === 400) {
        console.error("Requisição inválida:", error); 
        alert('Requisição inválida') 
    } else {
        console.error("Erro ao buscar taxa:", error);
        alert('Erro ao buscar taxa'); 
    }
    estadoConversao.value.taxa = null;
  }
}

function calcularValorConvertido() {
  if (estadoConversao.value.taxa !== null) {
    const valorNumerico = parseFloat(estadoConversao.value.valorParaConverter);
    if (!isNaN(valorNumerico)) {
      const resultado = valorNumerico * estadoConversao.value.taxa;
      // console.log(resultado.toString());

      // console.log(resultado);
      
      estadoConversao.value.valorConvertido = formatarNumero(resultado);
    } else {
      estadoConversao.value.valorConvertido = "0";
    }
  } else {
    estadoConversao.value.valorConvertido = "0";
  }
}

onMounted(async () => {
  await fetchTaxa(estadoConversao.value.moedaConvertida, estadoConversao.value.moedaParaConverter);
  calcularValorConvertido();
});

function validateInput(event) {
  const charCode = event.charCode;
  const input = event.target.value;
  const commaCount = (input.match(/,/g) || []).length;

  if (
    [8, 9, 27, 13, 46].indexOf(event.keyCode) !== -1 ||
    (event.keyCode === 65 && event.ctrlKey === true) || // Ctrl+A
    (event.keyCode === 67 && event.ctrlKey === true) || // Ctrl+C
    (event.keyCode === 88 && event.ctrlKey === true) || // Ctrl+X
    (event.keyCode >= 35 && event.keyCode <= 39) // Home, End, Left, Right
  ) {
    return true;
  }
  if ((charCode >= 48 && charCode <= 57) || charCode === 44) {
    if (charCode === 44 && commaCount >= 1) {
      event.preventDefault();
      return false;
    }
    return true;
  }

  event.preventDefault();
  return false;
}
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
  color: #E2E2E2;
}
.subtitle {
  font-size: 18px;
  margin-top: 4px;
  margin-bottom: 56px;
  color: #E2E2E2;
}
.inputSkeleton {
  max-width: 398px;
  width: 398px;
  height: 58px;
  border-radius: 4px;
  background: #0C0C0C;
  border: solid 1px #FFF;
}
.content {
  display: flex;
  align-items: center;
  gap: 20px;
}
.campo {
  position: relative;
}
.campo .label {
  font-size: 14px;
  position: absolute;
  top: -28px;
  color: #FFF;
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
.label-wrapper {
  display: flex;
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
  overflow: hidden;
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
    padding: 14px;
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

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type=number] {
  -moz-appearance:textfield;
}
</style>
