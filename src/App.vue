<template>
  <MainContent />
  <Footer />
</template>

<script>
import MainContent from './components/MainContent.vue';
import Footer from './components/Footer.vue'

export default {
  name: 'App',
  components: {
    MainContent,
    Footer
  }
}
</script>