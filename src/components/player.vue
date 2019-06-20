<template>
  <div class="player">
    <div class="player-container">
      <!-- 播放页面头部 -->
      <div class="player-header">
        <!-- 离开播放页面 -->
        <div class="back" @click="songItemFalse()">
          <i class="iconfont">&#xe724;</i>
        </div>
        <!-- 播放器 -->
        <audio
          :src="audioUrl.musicSrc"
          ref="audio"
          @play="onPlay"
          @pause="onPause"
          @timeupdate="updateTime"
          @loadedmetadata="onLoadedmetadata"
          @ended="onEnd"
          autoplay
        ></audio>
      </div>
      <!-- 播放页面的歌曲图和歌词 -->
      <div class="player-center">
        <!-- 歌曲图 -->
        <div class="player-img" :style="{backgroundImage: 'url(' + audioUrl.musicImgUrl + ')'}"></div>
        <!-- 歌词 -->
        <div class="player-lrc"></div>
      </div>
      <!-- 播放页面尾部 -->
      <div class="player-footer">
        <!-- 进度条 -->
        <div class="speedOut" @touchstart="TouchStart" @touchmove="TouchMove" @touchend="TouchEnd">
          <div class="speedInSpeed" :style="'width:'+audio.sliderTime+'%'"></div>
          <div class="speedInTool" :style="'left:'+audio.sliderTime+'%'"></div>
        </div>
        <!-- 播放实时时间和总时长 -->
        <div class="songTime">
          <span>{{audio.RealTime}}</span>
          <span>{{audio.endTime}}</span>
        </div>
        <!-- 播放控件 -->
        <div class="playiconbox">
          <!-- 播放模式icon -->
          <div class="playorder" @click="switchingSequence()">
            <i class="iconfont" v-show=" audio.order === 'loop'">&#xe66c;</i>
            <i class="iconfont" v-show=" audio.order === 'single'">&#xe66d;</i>
            <i class="iconfont" v-show=" audio.order === 'random'">&#xe66b;</i>
          </div>
          <!-- 上一曲icon -->
          <div class="prev" @click="prevSong">
            <i class="iconfont">&#xe6a6;</i>
          </div>
          <!-- 播放/暂停icon -->
          <div class="playing">
            <i class="iconfont" @click="onPlay()" v-show="!audio.playing">&#xe6a4;</i>
            <i class="iconfont" @click="onPause()" v-show="audio.playing">&#xe6a5;</i>
          </div>
          <!-- 下一曲icon -->
          <div class="next" @click="nextSong">
            <i class="iconfont">&#xe6a6;</i>
          </div>
          <!-- 播放列表icon -->
          <div class="playlist" @click="playListTrue">
            <i class="iconfont">&#xe683;</i>
          </div>
        </div>
      </div>
    </div>
    <!-- 播放列表 -->
    <div class="player-list-container" v-show="audio.listShow" @click="playListTrue">
      <div class="player-list" @click.stop>
        <!-- 头部 -->
        <div class="player-list-nav">
          <span>默认列表</span>
          <i class="iconfont" @click="deleteList('all')">&#xe68b;</i>
        </div>
        <!-- 列表 -->
        <ul>
          <vuescroll>
            <li v-for="(item,index) in playerList" :key="index">
              <!-- 歌曲序列 歌曲名字 歌手 -->
              <div class="list-item" @click="playTheSong(index,item.songID,item.songImg)">
                <span>{{index+1}}</span>
                <span>{{item.songName}}-{{item.songer}}</span>
              </div>
              <!-- 正在播放时显示 -->
              <div class="music icon" :class="playicon == index ? 'active':'none'">
                <i></i>
                <i></i>
                <i></i>
                <i></i>
              </div>
              <!-- 删除icon -->
              <i class="iconfont" @click="deleteList('one',item,index)">&#xe68b;</i>
            </li>
          </vuescroll>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
// 滑动插件
import vuescroll from "vuescroll";
export default {
  props: ["audioUrl"],
  data() {
    return {
      // 播放器的默认配置
      audio: {
        // 进度条百分比
        sliderTime: 0,
        // 实时播放时间
        currentTime: 0,
        // 歌曲总时长
        maxTime: 0,
        // 判断audio的播放
        playing: false,
        // 实时播放时间转换 分:秒 形式
        RealTime: "00:00",
        // 总时长转换 分:秒 形式
        endTime: "00:00",
        // 默认播放模式 顺序播放
        order: "loop",
        // 播放列表 默认不显示
        listShow: false
      },
      // 播放icon 默认不显示
      playicon: -1
    };
  },
  created() {
    // 获取播放列表
    this.getPlayerList();
  },
  methods: {
    // 离开播放页面
    songItemFalse() {
      this.$store.commit("setIsPlay", false);
    },
    // 歌曲播放
    onPlay(res) {
      this.$refs.audio.play();
      this.audio.playing = true;
    },
    // 歌曲暂停
    onPause() {
      this.$refs.audio.pause();
      this.audio.playing = false;
    },
    // 歌曲结束
    onEnd() {
      this.nextSong();
    },
    // audio的API 时间更新
    updateTime(res) {
      this.audio.currentTime = res.target.currentTime;
      this.audio.RealTime = this.TimeConversion(
        parseInt(this.audio.currentTime)
      );
      this.audio.sliderTime =
        parseFloat(this.audio.currentTime / this.audio.maxTime) * 100 + "";
    },
    // audio的事件 音乐的缓冲完成返回
    onLoadedmetadata(res) {
      console.log("loadedmetadata");
      this.audio.maxTime = parseInt(res.target.duration);
      this.audio.endTime = this.TimeConversion(parseInt(this.audio.maxTime));
    },
    // 时间转化 00:00
    TimeConversion(times) {
      var result = "00:00";
      var minute, second;
      if (times > 0) {
        minute = Math.floor(times / 60);
        if (minute < 10) {
          minute = "0" + minute;
        }
        second = Math.floor((times - 60 * minute) % 60);
        if (second < 10) {
          second = "0" + second;
        }
        result = minute + ":" + second;
      }
      return result;
    },
    // 触摸的三个时间 TouchStart开始触摸 TouchMove触摸中 触摸结束TouchEnd
    TouchStart(e) {
      console.log("开始触摸");
      // this.setValue(e.touches[0]);
    },
    TouchMove(e) {
      console.log("触摸中");
      this.setValue(e.touches[0]);
    },
    TouchEnd(e) {
      console.log("触摸后");
      this.setValue(e.changedTouches[0]);
    },
    // 对进度条进行时间控制，自动滑动
    setValue(e) {
      const value =
        ((e.clientX - 20) / 500) * 100;
      if (value <= 0) {
        this.audio.sliderTime = 0;
      } else if (value >= 100) {
        this.audio.sliderTime = 100;
      } else {
        this.audio.sliderTime = value;
      }
      let musicTime = (value / 100) * this.audio.maxTime;
      this.$refs.audio.currentTime = musicTime;
    },
    // 播放模式的控制
    switchingSequence() {
      switch (this.audio.order) {
        case "loop":
          this.audio.order = "single";
          break;
        case "single":
          this.audio.order = "random";
          break;
        case "random":
          this.audio.order = "loop";
          break;
        default:
          break;
      }
    },
    // 播放列表的控制
    playListTrue() {
      switch (this.audio.listShow) {
        case false:
          this.audio.listShow = true;
          console.log("打开播放列表");
          break;
        case true:
          this.audio.listShow = false;
          console.log("关闭播放列表");
          break;
        default:
          break;
      }
    },
    // 获取列表数据
    getPlayerList() {
      fetch("https://wd5641080783zkrsci.wilddogio.com/MusicList.json")
        .then(res => {
          return res.json();
        })
        .then(data => {
          var playList = [];
          for (const key in data) {
            if (data.hasOwnProperty(key)) {
              const element = data[key];
              data[key].idx = key;
              playList.push(element);
            }
          }
          this.$store.commit("setPlayerList", playList);
        });
    },
    // 删除列表数据
    deleteList(result, item, index) {
      switch (result) {
        case "all":
          console.log("清空所有列表");
          this.playerList.forEach(element => {
            fetch(
              "https://wd5641080783zkrsci.wilddogio.com/MusicList/" +
                element.idx +
                "/.json",
              {
                method: "delete"
              }
            )
              .then(res => {
                console.log("删除成功！");
                this.$store.commit("setPlayerList", []);
              })
              .catch(error => {
                console.log(error);
              });
          });
          break;
        case "one":
          console.log("清空这条数据");
          fetch(
            "https://wd5641080783zkrsci.wilddogio.com/MusicList/" +
              item.idx +
              "/.json",
            {
              method: "delete"
            }
          )
            .then(res => {
              console.log("删除成功！");
              this.playerList.splice(index, 1);
            })
            .catch(error => {
              console.log(error);
            });
          break;
        default:
          break;
      }
    },
    // 播放这首歌
    playTheSong(index, id, url) {
      // 加载动画
      this.$store.commit("setIsLoading", true);
      this.$store.commit("setIsMaskLayer", true);
      // 初始化
      this.audioUrl.musicSrc = null;
      this.audioUrl.musicImgUrl = url;
      // 将index传入this.audio
      this.audio.index = index;
      // 通过传过来的id判断是否具有版权
      fetch(`https://imusic-api.herokuapp.com/check/music?id=` + id)
        .then(res => {
          return res.json();
        })
        .then(data => {
          // 如果具有版权
          if (data.success == true) {
            // 获取歌曲信息
            fetch(`https://imusic-api.herokuapp.com/song/url?id=` + id)
              .then(res => {
                return res.json();
              })
              .then(data => {
                // 保存歌曲信息
                this.audioUrl.musicSrc = data.data[0].url;
                // 加载动画结束
                this.$store.commit("setIsLoading", false);
                this.$store.commit("setIsMaskLayer", false);
                console.log("数据获取成功，点击播放");
              });
          }
          // 获取没有版权
          else if (data.success == false) {
            // 加载动画结束，告知没有版权
            this.$store.commit("setIsLoading", false);
            this.$store.commit("setIsCopyright", true);
            // 告知动画结束
            setTimeout(() => {
              this.$store.commit("setIsCopyright", false);
              this.$store.commit("setIsMaskLayer", false);
            }, 1000);
          }
        });
      this.playicon = index;
    },
    // 上一曲
    prevSong() {
      console.log("上一曲");
      if (this.audio.index <= 0) {
        // 加载动画结束，没有上一曲了
        this.$store.commit("setIsMaskLayer", true);
        this.$store.commit("setNoMore", true);
        // 告知动画结束
        setTimeout(() => {
          this.$store.commit("setNoMore", false);
          this.$store.commit("setIsMaskLayer", false);
        }, 1000);
      } else {
        this.audio.index--;
        this.playTheSong(
          this.audio.index,
          this.playerList[this.audio.index].songID,
          this.playerList[this.audio.index].songImg
        );
      }
    },
    // 下一曲
    nextSong() {
      switch (this.audio.order) {
        case "loop":
          if (this.audio.index >= this.playerList.length - 1) {
            // 加载动画结束，没有下一曲了
            this.$store.commit("setIsMaskLayer", true);
            this.$store.commit("setNoMore", true);
            // 告知动画结束
            setTimeout(() => {
              this.$store.commit("setNoMore", false);
              this.$store.commit("setIsMaskLayer", false);
            }, 1000);
          } else {
            this.audio.index++;
            this.playTheSong(
              this.audio.index,
              this.playerList[this.audio.index].songID,
              this.playerList[this.audio.index].songImg
            );
          }
          break;
        case "single":
          this.$refs.audio.play();
          break;
        case "random":
          this.audio.index = Math.floor(
            Math.random() * (this.playerList.length + 1)
          );
          console.log(this.playerList[this.audio.index].songID)
          this.playTheSong(
            this.audio.index,
            this.playerList[this.audio.index].songID,
            this.playerList[this.audio.index].songImg
          );
          break;
        default:
          break;
      }
      console.log("下一曲");
    }
  },
  components: {
    vuescroll
  },
  computed: {
    // 播放列表数据
    playerList() {
      return this.$store.state.playerList;
    }
  }
};
</script>

<style scoped>
.deviation-540 {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 100vw;
}

.deviation-0 {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 2;
  background-color: #fff;
}
.player-container {
  background: #5c258d; /* fallback for old browsers */
  background: -webkit-linear-gradient(
    -45deg,
    #4389a2,
    #8f45cf
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(-45deg, #4389a2, #8f45cf);
}
.player-header {
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  margin-left: 20px;
  color: #fff;
}
.player-center {
  width: 100%;
  height: 250px;
  background: #5c258d; /* fallback for old browsers */
  background: -webkit-linear-gradient(
    -45deg,
    #4389a2,
    #8f45cf
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(-45deg, #4389a2, #8f45cf);
  position: relative;
}

.player-center .player-img {
  width: 300px;
  height: 300px;
  position: absolute;
  top: 90px;
  left: 50%;
  margin-left: -150px;
  background-color: #ccc;
  overflow: hidden;
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% 100%;
  -moz-box-shadow: 9px 8px 16px #333333;
  -webkit-box-shadow: 9px 8px 16px #333333;
  box-shadow: 9px 8px 16px #333333;
}

.player-center .player-lrc {
  width: 500px;
  height: 200px;
  position: absolute;
  top: 440px;
  left: 50%;
  margin-left: -250px;
  background-color: #ccc;
}

.player-footer {
  width: 100%;
  height: 260px;
  position: fixed;
  bottom: 0;
}

.player-footer .speedOut {
  width: 500px;
  height: 4px;
  background-color: #ccc;
  margin-top: 78px;
  margin-left: 20px;
  position: relative;
}

.player-footer .speedOut .speedInSpeed {
  height: 4px;
  background-color: #4389a2;
  position: absolute;
  top: 0;
  left: 0;
}

.player-footer .speedOut .speedInTool {
  width: 4px;
  height: 10px;
  background-color: #4389a2;
  margin-top: -5px;
  position: absolute;
  top: 50%;
  left: 0;
}
.player-footer .songTime {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 30px;
}

.player-footer .songTime span:nth-child(1) {
  margin-left: 20px;
}
.player-footer .songTime span:nth-child(2) {
  margin-right: 20px;
}

.player-footer .playiconbox {
  width: 100%;
  height: 132px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #ccc;
}

.player-footer .playiconbox .playorder {
  margin-left: 40px;
}

.player-footer .playiconbox .playorder i {
  font-size: 64px;
}

.player-footer .playiconbox .prev {
  transform: rotate(180deg);
}

.player-footer .playiconbox .prev i {
  font-size: 64px;
}

.player-footer .playiconbox .playing i {
  font-size: 64px;
}

.player-footer .playiconbox .next i {
  font-size: 64px;
}

.player-footer .playiconbox .playlist i {
  font-size: 64px;
  margin-right: 40px;
}
.player-list-container {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
}
.player-list-container .player-list-nav {
  width: 100%;
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 18px;
  border-bottom: 1px solid #fff;
}

.player-list-container .player-list-nav span {
  margin-left: 20px;
}
.player-list-container .player-list-nav i {
  margin-right: 20px;
}
.player-list {
  width: 100%;
  height: 480px;
  position: fixed;
  bottom: 0;
  background: #5c258d; /* fallback for old browsers */
  background: -webkit-linear-gradient(
    -45deg,
    #4389a2,
    #8f45cf
  ); /* Chrome 10-25, Safari 5.1-6 */
  background: linear-gradient(-45deg, #4389a2, #8f45cf);
  color: #fff;
}

.player-list ul {
  height: 419px;
  overflow: hidden;
}

.player-list ul li {
  width: 100%;
  height: 60px;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #fff;
}
.player-list ul li .list-item {
  flex: 2;
}
.player-list ul li span:nth-child(1) {
  margin-left: 20px;
}

.player-list ul li span:nth-child(2) {
  margin-left: 20px;
}
.music {
  width: 50px;
  height: 20px;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
}
.music i {
  width: 4px;
  height: 5px;
  position: absolute;
  bottom: 0;
  background-color: #fff;
}
.music i:nth-of-type(1) {
  left: 0;
}
.music i:nth-of-type(2) {
  left: 8px;
}
.music i:nth-of-type(3) {
  left: 16px;
}
.music i:nth-of-type(4) {
  left: 24px;
}

.music.icon i:nth-of-type(1) {
  -webkit-animation: wave 0.66s linear infinite;
  animation: wave 0.66s linear infinite;
}
.music.icon i:nth-of-type(2) {
  -webkit-animation: wave 0.8s linear infinite;
  animation: wave 0.8s linear infinite;
}
.music.icon i:nth-of-type(3) {
  -webkit-animation: wave 0.7s linear infinite;
  animation: wave 0.7s linear infinite;
}
.music.icon i:nth-of-type(4) {
  -webkit-animation: wave 0.5s linear infinite;
  animation: wave 0.5s linear infinite;
}

@-webkit-keyframes wave {
  0% {
    height: 8px;
  }
  50% {
    height: 32px;
  }
  100% {
    height: 12px;
  }
}
@keyframes wave {
  0% {
    height: 8px;
  }
  50% {
    height: 32px;
  }
  100% {
    height: 12px;
  }
}
.player-list ul li i {
  margin-right: 20px;
}
.active {
  display: block;
}
.none {
  display: none;
}
</style>
