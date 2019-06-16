<template>
  <div class="home">
    <!-- header -->
    <div class="home-container">
      <div class="motto">
        <div class="logo">
          <img src="../assets/logo.png" alt>
        </div>
      </div>
      <div class="motto-p">
        <p>热爱自己，热爱生活</p>
      </div>
    </div>
    <!-- 排行榜 -->
    <ul>
      <vuescroll>
        <!--li数据遍历循环部分-->
        <li class="list" v-for="(item,index) in list" :key="index" @click="listItemTrue(item.id)">
          <div class="list-left">
            <img :src="item.coverImgUrl" alt>
          </div>
          <div class="list-center">
            <p v-for="(songName,index) in item.tracks" :key="index" v-show="item.tracks.length">
              <span>NO.{{index+1}}</span>
              {{songName.first}}-{{songName.second}}
            </p>
            <span v-show="!item.tracks.length">{{item.name}}</span>
          </div>
          <div class="list-right">
            <i class="iconfont">&#xe733;</i>
          </div>
        </li>
      </vuescroll>
    </ul>
    <!-- 榜单歌曲 -->
    <div class="listItem" v-show="listShow">
      <div class="listItem-top" :style="{backgroundImage: 'url(' + bgImg + ')'}">
        <div class="back" @click="listItemFalse()">
          <i class="iconfont">&#xe724;</i>
        </div>
      </div>
      <div class="listItem-center">
        <ul>
          <vuescroll>
            <li v-for="(item,index) in listItem" :key="index" @click="songItemTrue(item.id)">
              <div class="spanBox">
                <span>{{index +1}}</span>
              </div>
              <div class="img">
                <img :src="item.al.picUrl" alt>
              </div>
              <div class="spanBoxs">
                <span>{{item.name}}</span>
              </div>
            </li>
          </vuescroll>
        </ul>
      </div>
    </div>
    <!-- 播放 -->
    <div :class="isPlay ? 'z-index200' : 'z-index-1'">
      <div class="player-header">
        <div class="back" @click="songItemFalse()">
          <i class="iconfont">&#xe724;</i>
        </div>
        <audio :src="musicSrc" controls></audio>
      </div>
    </div>
    <!-- 加载动画 -->
    <div class="loading" v-show="lsLoading">
      <span></span>
      <span></span>
      <span></span>
      <span></span>
      <span></span>
    </div>
  </div>
</template>

<script>
import vuescroll from "vuescroll";
export default {
  name: "Home",
  data() {
    return {
      list: [],
      listID: [
        {
          name: "云音乐新歌榜",
          id: 3779629,
          idx: 0
        },
        {
          name: "云音乐热歌榜",
          id: 3778678,
          idx: 1
        },
        {
          name: "网易原创歌曲榜",
          id: 2884035,
          idx: 2
        },
        {
          name: "云音乐飙升榜",
          id: 19723756,
          idx: 3
        },
        {
          name: "云音乐国电榜",
          id: 10520166,
          idx: 4
        },
        {
          name: "UK排行榜周榜",
          id: 180106,
          idx: 5
        },
        {
          name: "美国Billboard周榜",
          id: 60198,
          idx: 6
        },
        {
          name: "KTV唛榜",
          id: 21845217,
          idx: 7
        },
        {
          name: "iTunes榜",
          id: 11641012,
          idx: 8
        },
        {
          name: "Hit FM Top榜",
          id: 120001,
          idx: 9
        },
        {
          name: "日本Oricon周榜",
          id: 60131,
          idx: 10
        },
        {
          name: "韩国Melon排行榜周榜",
          id: 3733003,
          idx: 11
        },
        {
          name: "韩国Mnet排行榜周榜",
          id: 60255,
          idx: 12
        },
        {
          name: "韩国Melon原声周榜",
          id: 46772709,
          idx: 13
        },
        {
          name: "中国TOP排行榜（港台榜）",
          id: 112504,
          idx: 14
        },
        {
          name: "中国TOP排行榜（内地榜）",
          id: 64016,
          idx: 15
        },
        {
          name: "香港电台中文歌曲龙虎榜",
          id: 10169002,
          idx: 16
        },
        {
          name: "华语金曲榜",
          id: 4395559,
          idx: 17
        },
        {
          name: "中国嘻哈榜",
          id: 1899724,
          idx: 18
        },
        {
          name: "法国 NRJ Vos Hits 周榜",
          id: 27135204,
          idx: 19
        },
        {
          name: "台湾Hito排行榜",
          id: 112463,
          idx: 20
        },
        {
          name: "Beatport全球电子舞曲榜",
          id: 3812895,
          idx: 21
        },
        {
          name: "云音乐ACG音乐榜",
          id: 71385702,
          idx: 22
        },
        {
          name: "江小白YOLO云音乐说唱榜",
          id: 991319590,
          idx: 23
        }
      ],
      listItem: [],
      bgImg: null,
      lsLoading: false,
      isPlay: false,
      musicSrc: null
    };
  },
  mounted() {
    this.isPlay = true;
    fetch(" https://imusic-api.herokuapp.com/toplist/detail")
      .then(res => {
        return res.json();
      })
      .then(data => {
        this.isPlay = false;
        this.list = this.list.concat(data.list);
      });
  },
  methods: {
    listItemTrue(id) {
      this.bgImg = null;
      this.listItem = [];
      this.lsLoading = true;
      this.$store.commit("setListShow", true);
      this.listID.forEach(element => {
        if (element.id === id) {
          console.log("id确定成功，正在过去数据");
          fetch(`https://imusic-api.herokuapp.com/top/list?idx=` + element.idx)
            .then(res => {
              return res.json();
            })
            .then(data => {
              console.log("数据获取成功！");
              this.lsLoading = false;
              this.bgImg = data.playlist.coverImgUrl;
              this.listItem = this.listItem.concat(data.playlist.tracks);
            });
        }
      });
    },
    listItemFalse() {
      this.$store.commit("setListShow", false);
    },
    songItemTrue(id) {
      console.log(id);
      this.isPlay = true;
      this.lsLoading = true;
      this.musicSrc = null;
      fetch(`https://imusic-api.herokuapp.com/song/url?id=` + id)
        .then(res => {
          return res.json();
        })
        .then(data => {
          this.lsLoading = false;
          this.musicSrc = data.data[0].url;
        });
    },
    songItemFalse() {
      this.isPlay = false;
    }
  },
  components: {
    vuescroll
  },
  computed: {
    listShow() {
      return this.$store.state.listShow;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.home-container {
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

.motto {
  width: 100%;
  height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.motto .logo {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  overflow: hidden;
}

.motto .logo img {
  width: 100%;
  height: 100%;
}

.motto-p {
  width: 100%;
  height: 40px;
  text-align: center;
  font-size: 24px;
  font-weight: bolder;
  color: #fff;
  margin-top: -20px;
  margin-bottom: 10px;
}

.home ul {
  padding: 5px 0px;
  height: 520px;
  overflow: hidden;
}

.list {
  text-align: center;
  height: 150px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.list .list-left {
  width: 100px;
  height: 100px;
  overflow: hidden;
  border-radius: 20px;
  margin-left: 40px;
}

.list .list-left img {
  width: 100%;
  height: 100%;
}

.list .list-center {
  width: 300px;
  text-align: left;
  margin-left: 20px;
}

.list .list-center p {
  font-size: 18px;
  margin-bottom: 10px;
  white-space: nowrap;
  overflow: hidden;
}
.list .list-center p:last-child {
  margin-bottom: 0px;
}

.list .list-center span {
  font-size: 24px;
  font-weight: bolder;
  white-space: nowrap;
  overflow: hidden;
}

.list .list-right {
  width: 50px;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-right: 30px;
}

.listItem {
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 0;
  background-color: #fff;
}

.listItem .listItem-top {
  width: 100%;
  height: 300px;
  overflow: hidden;
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% 100%;
}

.listItem .listItem-top .back {
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  color: #fff;
}

.listItem .listItem-top .back i {
  margin-left: 20px;
}

.loading {
  width: 80px;
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
  background: lightgreen;
  -webkit-animation: load 1s ease infinite;
}
@-webkit-keyframes load {
  0%,
  100% {
    height: 40px;
    background: lightgreen;
  }
  50% {
    height: 70px;
    margin: -15px 0;
    background: lightblue;
  }
}
.loading span:nth-child(2) {
  -webkit-animation-delay: 0.2s;
}
.loading span:nth-child(3) {
  -webkit-animation-delay: 0.4s;
}
.loading span:nth-child(4) {
  -webkit-animation-delay: 0.6s;
}
.loading span:nth-child(5) {
  -webkit-animation-delay: 0.8s;
}

.listItem-center {
  width: 540px;
  overflow: hidden;
}

.listItem-center ul li {
  height: 100px;
  overflow: hidden;
  display: flex;
  align-items: center;
}
.listItem-center ul li .spanBox {
  width: 100px;
  height: 100px;
  float: left;
  display: flex;
  justify-content: center;
  align-items: center;
}
.listItem-center ul li .spanBoxs {
  width: 300px;
  height: 100px;
  float: left;
  display: flex;
  align-items: center;
  margin-left: 40px;
}
.listItem-center ul li span {
  font-size: 18px;
  font-weight: bolder;
}
.listItem-center ul li .img {
  width: 80px;
  height: 80px;
  overflow: hidden;
  border-radius: 10px;
  display: inline-block;
  line-height: 80px;
}

.listItem-center ul li .img img {
  width: 100%;
  height: 100%;
}

.z-index-1 {
  width: 100%;
  height: 100%;
  z-index: -1;
  position: fixed;
  top: 0;
  left: 0;
}

.z-index200 {
  width: 100%;
  height: 100%;
  z-index: 200;
  position: fixed;
  top: 0;
  left: 0;
  background-color: #fff;
}

.player-header {
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  margin-left: 20px;
}
</style>
