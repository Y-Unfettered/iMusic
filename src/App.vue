<template>
  <div id="app">
    <Header></Header>
    <router-view/>
  </div>
</template>

<script>
import Header from "./components/Header";
export default {
  name: "App",
  data() {
    return {};
  },
  components: {
    Header
  },
  mounted() {
    console.log(this.$route.name);
  },
  methods: {
    
  }
};
</script>

<style>
</style>
