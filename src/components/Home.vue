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
        </div>
        <div class="list-right">
          <i class="iconfont">&#xe733;</i>
        </div>
      </li>
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
            <li class="playAll" @click="playerListFn('all')">
              <span>全部播放</span>
            </li>
            <li v-for="(item,index) in listItem" :key="index">
              <div
                @click="songItemTrue(item.name,item.al.picUrl,item.id,item.ar[0].name)"
                class="listBox"
              >
                <div class="spanBox">
                  <span>{{index +1}}</span>
                </div>
                <div class="img">
                  <img :src="item.al.picUrl" alt>
                </div>
                <div class="spanBoxs">
                  <span>{{item.name}}</span>
                </div>
              </div>

              <div class="add" @click="playerListFn('one',item.name,item.al.picUrl,item.id,)">
                <i class="iconfont" v-show="!Collection">&#xe669;</i>
              </div>
            </li>
          </vuescroll>
        </ul>
      </div>
    </div>
    <!-- 播放器组件 -->
    <player ref="player" :class="IsPlay ? 'deviation-0' : 'deviation-540'" :audioUrl="audioUrl"></player>
    <!-- 加载动画组件 -->
    <MaskLayer v-show="IsMaskLayer"></MaskLayer>
  </div>
</template>

<script>
// 滑动插件
import vuescroll from "vuescroll";
// 加载页面
import MaskLayer from "./MaskLayer.vue";
// 播放组件
import player from "./player.vue";

export default {
  name: "Home",
  data() {
    return {
      // 24个排行榜的数据
      list: [],
      // 由于获取排行榜数据的key是idx，网上获取不到，自己定义的id对于idx
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
      // 具体榜单的歌曲
      listItem: [],
      // 存储榜单数据
      listObj: {},
      // 具体排行榜的背景图地址
      bgImg: null,
      // 传给player组件的值(播放时的音乐地址和图片)
      audioUrl: {
        musicSrc: null,
        musicImgUrl: null
      },
      // 收藏判断
      Collection: false,
      // 播放歌单的每一项的模板
      playerListItem: {
        songName: null,
        songer: null,
        songID: null,
        songImg: null
      }
    };
  },
  mounted() {
    // 获取24个排行榜
    fetch("https://imusic-api.herokuapp.com/toplist/detail")
      .then(res => {
        return res.json();
      })
      .then(data => {
        for (let i = 0; i < 4; i++) {
          const element = data.list[i];
          this.list.push(element);
        }
      });
  },
  methods: {
    // 具体排行榜的数据获取
    listItemTrue(id) {
      // 初始化
      this.bgImg = null;
      this.listItem = [];
      // 加载动画
      this.$store.commit("setListShow", true);
      this.$store.commit("setIsMaskLayer", true);
      this.$store.commit("setIsLoading", true);
      // 本地是否储存了数据 true: 获取本地数据 false:获取网上数据
      if (this.listObj.hasOwnProperty(id)) {
        console.log("本地数据获取成功，正在调用");
        // 本地数据赋值
        this.listItem = this.listItem.concat(this.listObj[id]);
        this.bgImg = this.listObj[id].bgImg;
        // 加载动画结束
        this.$store.commit("setIsLoading", false);
        this.$store.commit("setIsMaskLayer", false);
      } else {
        console.log("数据获取成功！");
        // 遍历自定义的id与idx的对应
        this.listID.forEach(element => {
          // 如果传入的id找到与之匹配的id，通过idx获取数据
          if (element.id === id) {
            console.log("id确定成功，正在获取数据");
            fetch(
              `https://imusic-api.herokuapp.com/top/list?idx=` + element.idx
            )
              .then(res => {
                return res.json();
              })
              .then(data => {
                console.log("数据获取成功！");
                // 数据赋值
                this.bgImg = data.playlist.coverImgUrl;
                this.listItem = this.listItem.concat(data.playlist.tracks);
                // 数据保存到本地
                this.listObj[element.id] = data.playlist.tracks;
                this.listObj[element.id].bgImg = data.playlist.coverImgUrl;
                // 加载动画结束
                this.$store.commit("setIsLoading", false);
                this.$store.commit("setIsMaskLayer", false);
              });
          }
        });
      }
    },
    // 离开排行榜
    listItemFalse() {
      this.$store.commit("setListShow", false);
    },
    // 获取歌曲的id，接收传入的背景图url
    songItemTrue(songName, songImg, songID, songer) {
      console.log(this.playerList.length == 0);
      if (this.playerList.length == 0) {
        this.playerListItem.songName = songName;
        this.playerListItem.songImg = songImg;
        this.playerListItem.songID = songID;
        this.playerListItem.songer = songer;
        fetch("https://wd5641080783zkrsci.wilddogio.com/MusicList.json", {
          method: "post",
          body: JSON.stringify(this.playerListItem),
          headers: {
            "content-type": "application/json"
          }
        }).then(res => {
          this.$refs.player.getPlayerList();
        });
        // 播放这首歌
        console.log(this.$refs.player);
        this.$refs.player.playTheSong(0, element.songID, songImg);
        this.$store.commit("setIsPlay", true);
      } else {
        var inspect = true;
        for (let i = 0; i < this.playerList.length; i++) {
          const element = this.playerList[i];
          if (element.songID == songID) {
            console.log("这首歌已经在列表");
            // 播放这首歌
            this.$refs.player.playTheSong(i, element.songID, songImg);
            this.$store.commit("setIsPlay", true);
            inspect = false;
          }
        }

        if (inspect) {
          console.log("没添加过");
          this.playerListItem.songName = songName;
          this.playerListItem.songImg = songImg;
          this.playerListItem.songID = songID;
          this.playerListItem.songer = songer;
          fetch("https://wd5641080783zkrsci.wilddogio.com/MusicList.json", {
            method: "post",
            body: JSON.stringify(this.playerListItem),
            headers: {
              "content-type": "application/json"
            }
          }).then(res => {
            this.$refs.player.getPlayerList();
          });
          // 播放这首歌
          console.log(this.$refs.player);
          this.$refs.player.playTheSong(
            this.playerList.length,
            songID,
            songImg
          );
          this.$store.commit("setIsPlay", true);
        }
      }
    },
    // 离开播放页面
    songItemFalse() {
      this.$store.commit("setIsPlay", false);
    },
    // 构建播放列表
    playerListFn(result, songName, songImg, songID, songer) {
      switch (result) {
        case "all":
          console.log("添加所有歌曲");
          for (const key in this.listObj) {
            if (this.listObj.hasOwnProperty(key)) {
              const element = this.listObj[key];
              element.forEach(el => {
                this.addPlayerLIst(el.name, el.al.picUrl, el.id, el.ar[0].name);
              });
            }
          }
          break;
        case "one":
          console.log("添加一首歌曲");
          this.addPlayerLIst(songName, songImg, songID, songer);
          break;
        default:
          break;
      }
    },
    // 添加列表数据
    addPlayerLIst(songName, songImg, songID, songer) {
      console.log(this.playerList.length == 0);
      if (this.playerList.length == 0) {
        this.playerListItem.songName = songName;
        this.playerListItem.songImg = songImg;
        this.playerListItem.songID = songID;
        this.playerListItem.songer = songer;
        fetch("https://wd5641080783zkrsci.wilddogio.com/MusicList.json", {
          method: "post",
          body: JSON.stringify(this.playerListItem),
          headers: {
            "content-type": "application/json"
          }
        }).then(res => {
          this.$refs.player.getPlayerList();
        });
        this.$store.commit("setAddedSuccessfully", true);
        this.$store.commit("setIsMaskLayer", true);
        // 告知动画结束
        setTimeout(() => {
          this.$store.commit("setAddedSuccessfully", false);
          this.$store.commit("setIsMaskLayer", false);
        }, 500);
      } else {
        var inspect = true;
        this.playerList.forEach(element => {
          if (element.songID == songID) {
            console.log("这首歌已经在列表");
            inspect = false;
          }
        });

        if (inspect) {
          console.log("没添加过");
          this.playerListItem.songName = songName;
          this.playerListItem.songImg = songImg;
          this.playerListItem.songID = songID;
          this.playerListItem.songer = songer;
          fetch("https://wd5641080783zkrsci.wilddogio.com/MusicList.json", {
            method: "post",
            body: JSON.stringify(this.playerListItem),
            headers: {
              "content-type": "application/json"
            }
          }).then(res => {
            this.$refs.player.getPlayerList();
          });
          this.$store.commit("setAddedSuccessfully", true);
          this.$store.commit("setIsMaskLayer", true);
          // 告知动画结束
          setTimeout(() => {
            this.$store.commit("setAddedSuccessfully", false);
            this.$store.commit("setIsMaskLayer", false);
          }, 500);
        }
      }
    }
  },
  components: {
    vuescroll,
    MaskLayer,
    player
  },
  computed: {
    listShow() {
      return this.$store.state.listShow;
    },
    IsMaskLayer() {
      return this.$store.state.IsMaskLayer;
    },
    IsPlay() {
      return this.$store.state.IsPlay;
    },
    playerList() {
      return this.$store.state.playerList;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.home-container {
  background: #5c258d; /* fallback for old browsers */
  background: -webkit-linear-gradient(
    -45deg,
    #4389a2,
    #8f45cf
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(-45deg, #4389a2, #8f45cf);
}

.motto {
  width: 100%;
  height: 20vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.motto .logo {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
}

.motto .logo img {
  width: 100%;
  height: 100%;
}

.motto-p {
  width: 100%;
  height: 4vh;
  text-align: center;
  font-size: 14px;
  font-weight: bolder;
  color: #fff;
}

.home ul {
  height: 71vh;
  overflow: hidden;
}

.list {
  text-align: center;
  height: 17vh;
  display: flex;
  align-items: center;
}

.list .list-left {
  width: 80px;
  height: 80px;
  overflow: hidden;
  border-radius: 20px;
  margin-left: 10px;
}

.list .list-left img {
  width: 100%;
  height: 100%;
}

.list .list-center {
  width: 220px;
  text-align: left;
  margin-left: 20px;
}

.list .list-center p {
  font-size: 14px;
  margin-bottom: 10px;
  white-space: nowrap;
  overflow: hidden;
}
.list .list-center p:last-child {
  margin-bottom: 0px;
}

.list .list-center span {
  font-size: 14px;
  font-weight: bolder;
  white-space: nowrap;
  overflow: hidden;
}

.list .list-right {
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-left: 10px;
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
  height: 29vh;
  overflow: hidden;
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% 100%;
  background-color: #ccc;
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

.listItem-center {
  width: 100%;
  overflow: hidden;
}

.listItem-center ul {
  height: 79vh;
}

.listItem-center ul li {
  height: 80px;
  overflow: hidden;
  display: flex;
  align-items: center;
}

.listItem-center ul .playAll {
  margin-left: 40px;
}

.listItem-center ul li .listBox {
  display: flex;
  align-items: center;
}

.listItem-center ul li .spanBox {
  width: 60px;
  height: 60px;
  float: left;
  display: flex;
  justify-content: center;
  align-items: center;
}
.listItem-center ul li .spanBoxs {
  width: 200px;
  float: left;
  display: flex;
  align-items: center;
  margin-left: 20px;
}

.listItem-center ul li .add {
  margin-right: 20px;
  color: #4389a2;
  font-size: 18px;
}

.listItem-center ul li span {
  font-size: 14px;
  font-weight: bolder;
}
.listItem-center ul li .img {
  width: 60px;
  height: 60px;
  overflow: hidden;
  border-radius: 10px;
  display: inline-block;
  line-height: 80px;
}

.listItem-center ul li .img img {
  width: 100%;
  height: 100%;
}
</style>
