<template>
  <div id="app">
    <Header></Header>
    <router-view/>
    <Footer></Footer>
  </div>
</template>

<script>
import Header from "./components/Header";
import Footer from "./components/Footer";
export default {
  name: "App",
  data() {
    return {};
  },
  components: {
    Header,
    Footer
  },
  mounted(){
    console.log(this.$route.name)
  },
  methods:{

  }
};
</script>

<style>
</style>
