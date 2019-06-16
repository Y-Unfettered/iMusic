<template>
  <div class="footer-container">
    <ul class="tabbar">
      <router-link :to="{name:'Home'}" class="tabbar-link" tag="li">
        <i class="iconfont">&#xe62a;</i>
        Home
      </router-link>
      <router-link :to="{name:'Video'}" class="tabbar-link" tag="li">菜单</router-link>
    </ul>
  </div>
</template>

<script>
export default {
  name: "Footer",
  data() {
    return {};
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.footer-container {
  width: 100%;
  height: 60px;
  position: fixed;
  bottom: 0;
  background-color: #fff;
}

.footer-container .tabbar {
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}
</style>
