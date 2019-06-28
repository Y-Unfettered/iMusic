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
        <div class="player-lrc">
          <ul class="playerLrcRoll">
            <li
              class="playerLrcRollLi"
              v-for="(item,index) in audio.lrc"
              :key="index"
              :data-time="item.t"
            >{{item.c}}</li>
          </ul>
        </div>
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
                <div class="songNamePlayer">
                  <span>{{item.songName}}-{{item.songer}}</span>
                </div>
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
        // 播放的歌曲index
        index: 0,
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
        listShow: false,
        // 歌词
        lrc: []
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
      this.songLrcRoll(this.audio.currentTime);
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
      const value = ((e.clientX - 20) / 340) * 100;
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
      fetch("https://imusic-4c411.firebaseio.com/MusicList.json")
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
              "https://imusic-4c411.firebaseio.com/MusicList/" +
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
            "https://imusic-4c411.firebaseio.com/MusicList/" +
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
                this.songLrc(id);
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
          console.log(this.playerList[this.audio.index].songID);
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
    },
    // 歌词获取并处理
    songLrc(id) {
      fetch(`https://imusic-api.herokuapp.com/lyric?id=` + id)
        .then(res => {
          return res.json();
        })
        .then(data => {
          var lrc = data.lrc.lyric;
          let oLRC = {
            ti: "", //歌曲名
            ms: [] //歌词数组{t:时间,c:歌词}
          };
          let lrcs = lrc.split("\n"); //用回车拆分成数组
          for (let i in lrcs) {
            //遍历歌词数组
            lrcs[i] = lrcs[i].replace(/(^\s*)|(\s*$)/g, ""); //去除前后空格
            let t = lrcs[i].substring(
              lrcs[i].indexOf("[") + 1,
              lrcs[i].indexOf("]")
            ); //取[]间的内容
            let s = t.split(":"); //分离:前后文字
            if (isNaN(parseInt(s[0]))) {
              //不是数值
              for (let i in oLRC) {
                if (i != "ms" && i == s[0].toLowerCase()) {
                  oLRC[i] = s[1];
                }
              }
            } else {
              //是数值
              let arr = lrcs[i].match(/\[(\d+:.+?)\]/g); //提取时间字段，可能有多个
              let start = 0;
              for (let k in arr) {
                start += arr[k].length; //计算歌词位置
              }
              let content = lrcs[i].substring(start); //获取歌词内容
              for (let k in arr) {
                let t = arr[k].substring(1, arr[k].length - 1); //取[]间的内容
                let s = t.split(":"); //分离:前后文字
                oLRC.ms.push({
                  //对象{t:时间,c:歌词}加入ms数组
                  t: (parseFloat(s[0]) * 60 + parseFloat(s[1])).toFixed(3),
                  c: content
                });
              }
            }
          }
          oLRC.ms.sort(function(a, b) {
            //按时间顺序排序
            return a.t - b.t;
          });
          this.audio.lrc = [];
          this.audio.lrc = this.audio.lrc.concat(oLRC.ms);
        });
    },
    // 歌词滚动
    songLrcRoll(currentTime) {
      for (const i in this.audio.lrc) {
        if (parseInt(this.audio.lrc[i].t) == parseInt(currentTime)) {
          var playerLrcRoll = document.getElementsByClassName(
            "playerLrcRoll"
          )[0];
          var liList = document.getElementsByClassName("playerLrcRollLi");
          playerLrcRoll.style.top = i * -50 + 50 + "px";
          if (i >= 1) {
            liList[i - 1].classList.remove("Highlight");
          }
          liList[i].classList.add("Highlight");
        }
      }
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
  height: 6vh;
  display: flex;
  align-items: center;
  margin-left: 20px;
  color: #fff;
}
.player-center {
  width: 100%;
  height: 25vh;
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
  width: 200px;
  height: 200px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin-left: -100px;
  margin-top: -20px;
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
  width: 90%;
  height: 150px;
  position: absolute;
  top: 180%;
  left: 50%;
  margin-left: -45%;
  overflow: hidden;
}

.player-center .player-lrc .playerLrcRoll {
  width: 100%;
  position: absolute;
  top: 50px;
}

.player-center .player-lrc .playerLrcRoll li {
  width: 100%;
  height: 50px;
  text-align: center;
  line-height: 50px;
}

.player-footer {
  width: 100%;
  height: 25vh;
  position: fixed;
  bottom: 0;
}

.player-footer .speedOut {
  width: 340px;
  height: 4px;
  background-color: #ccc;
  margin:10px auto;
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
  margin-top: 10px;
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
  margin-left: 20px;
}

.player-footer .playiconbox .playorder i {
  font-size: 24px;
}

.player-footer .playiconbox .prev {
  transform: rotate(180deg);
}

.player-footer .playiconbox .prev i {
  font-size: 24px;
}

.player-footer .playiconbox .playing i {
  font-size: 24px;
}

.player-footer .playiconbox .next i {
  font-size: 24px;
}

.player-footer .playiconbox .playlist i {
  font-size: 24px;
  margin-right: 20px;
}
.player-list-container {
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
}
.player-list-container .player-list-nav {
  width: 100%;
  height: 5vh;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
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
  height: 50vh;
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
  overflow: hidden;
}

.player-list ul {
  height: 45vh;
}

.player-list ul li {
  width: 100%;
  height: 8vh;
  display: flex;
  align-items: center;
  border-bottom: 1px solid #fff;
  font-size: 14px;
}
.player-list ul li .list-item {
  flex: 2;
  display: flex;
  align-items: center;
}
.player-list ul li span:nth-child(1) {
  margin-left: 20px;
}
.songNamePlayer {
  width: 270px;
  overflow: hidden;
  display: inherit;
}

.songNamePlayer span {
  margin-left: 20px;
  white-space: nowrap;
}

.music {
  width: 22px;
  height: 20px;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
}
.music i {
  width: 2px;
  height: 4px;
  position: absolute;
  bottom: 0;
  background-color: #fff;
}
.music i:nth-of-type(1) {
  left: 0;
}
.music i:nth-of-type(2) {
  left: 4px;
}
.music i:nth-of-type(3) {
  left: 8px;
}
.music i:nth-of-type(4) {
  left: 12px;
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
    height: 4px;
  }
  50% {
    height: 16px;
  }
  100% {
    height: 8px;
  }
}
@keyframes wave {
  0% {
    height: 4px;
  }
  50% {
    height: 16px;
  }
  100% {
    height: 8px;
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
.Highlight {
  font-size: 20px;
  font-weight: bolder;
}
</style>
