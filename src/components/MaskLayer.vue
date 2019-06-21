<template>
  <div class="mask">
    <div class="Popup">
      <!-- 加载动画 -->
      <div class="loading" v-show="IsLoading">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div class="Tips" v-show="IsCopyright">歌曲没有版权</div>
      <div class="add" v-show="AddedSuccessfully">歌曲添加成功</div>
      <div class="noMore" v-show="noMore">没有更多了</div>
    </div>
  </div>
</template>


<script>
export default {
  name: "MaskLayer",
  data() {
    return {};
  },
  computed: {
    IsLoading() {
      return this.$store.state.IsLoading;
    },
    IsCopyright() {
      return this.$store.state.IsCopyright;
    },
    AddedSuccessfully() {
      return this.$store.state.AddedSuccessfully;
    },
    noMore() {
      return this.$store.state.noMore;
    }
  }
};
</script>

<style scoped>
.mask {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 999;
  background-color: transparent;
  display: flex;
  justify-content: center;
  align-items: center;
}

.mask .Popup {
  width: 200px;
  height: 100px;
  background-color: #ccc;
  border-radius: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.loading {
  width: 60px;
  height: 40px;
  position: fixed;
  top: 50%;
  left: 50%;
  margin-top: -20px;
  margin-left: -40px;
  z-index: 999;
}
.loading span {
  display: inline-block;
  width: 8px;
  height: 100%;
  border-radius: 4px;
  background: #4389a2;
  animation: load 1s ease infinite;
}
@keyframes load {
  0%,
  100% {
    height: 40px;
    background: #4389a2;
  }
  50% {
    height: 70px;
    margin: -15px 0;
    background: #8f45cf;
  }
}
.loading span:nth-child(2) {
  animation-delay: 0.2s;
}
.loading span:nth-child(3) {
  animation-delay: 0.4s;
}
.loading span:nth-child(4) {
  animation-delay: 0.6s;
}
.loading span:nth-child(5) {
  animation-delay: 0.8s;
}

.Tips {
  font-weight: bolder;
  font-size: 18px;
  color: #fff;
}

.add {
  font-weight: bolder;
  font-size: 18px;
  color: #fff;
}
.noMore {
  font-weight: bolder;
  font-size: 18px;
  color: #fff;
}
</style>
