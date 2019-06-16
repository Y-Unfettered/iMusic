<template>
  <div class="header-container">
    <div class="header">
      <i slot="icon" class="iconfont header-left">&#xe615;</i>
      <p>IMUSIC</p>
      <i slot="icon" class="iconfont header-right">&#xe611;</i>
    </div>
  </div>
</template>

<script>
export default {
  name: "Header",
  data() {
    return {};
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.header-container {
  background: #5c258d; /* fallback for old browsers */
  background: -webkit-linear-gradient(
    to right,
    #4389a2,
    #5c258d
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(
    to right,
    #4389a2,
    #5c258d
  ); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */
}

.container-bottom {
  width: 100%;
  margin-top: -1px;
  overflow-y: auto;
}

.header {
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
  font-size: 25px;
}
.header .header-left {
  margin-left: 20px;
}

.header .header-right {
  margin-right: 20px;
}
</style>
