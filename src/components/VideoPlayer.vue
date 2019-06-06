<template>
  <div class="video-player px-4 relative z-30">
    <div class="dplayer-wrapper bg-black">
      <d-player ref="player" @error="errorHandling" :options="options" @ended="playbackEnded" @timeupdate="timeUpdate"/>
    </div>
    <div
      v-if="currVideo.title"
      class="title px-6 py-8 absolute bg-white"
      :style="{ left: leftPosition }"
    >
      <h1 class="text-4xl">{{ currVideo.title }}</h1>
      <div v-if="currVideo.name" class="persona px-4 py-2 text-white bg-purple absolute">
        <span class="text-xl">{{ currVideo.name }}</span>
        <br>
        {{ currVideo.function }}
      </div>
    </div>
    <div
      id="progress-bar"
      class="progress-background absolute pin-t pin-l pin-r h-2 ml-4 mr-20 z-50"
    >
      <progress-dot
        ref="dot"
        step="0.01"
        @input="draggingProgress"
        @change="changeProgress"
        v-model="progressValue"
        class="absolute pin z-50 w-full p-0"
      ></progress-dot>
    </div>
    <div
      class="duration absolute mx-4 py-2 px-3 w-16 text-sm pin-t pin-r text-lg bg-white-75 z-40"
    >{{ filterTime(duration) }}</div>
    <div class="controls absolute">
      <button class="btn btn-play" @click="togglePause">
        <img v-if="isPaused" class="btn-icon" src="assets/images/play.svg">
        <img v-else class="btn-icon" src="assets/images/pause.svg">
      </button>
      <button class="btn btn-volume" @click="toggleMute">
        <img v-if="isMuted" class="btn-icon" src="assets/images/sound_off.svg">
        <img v-else class="btn-icon" src="assets/images/sound_on.svg">
        <!-- <volume
          class="volume-slider"
          min="0"
          max="1"
          step="0.1"
          @input="draggingVolume"
          @change="changeVolume"
          v-model="currVolume"
          :class="{active: isVolume}"
        ></volume> -->
      </button>
    </div>
  </div>
</template>

<script>
import VueDPlayer from "vue-dplayer";
import "vue-dplayer/dist/vue-dplayer.css";
import axios from "axios";
import store from "@/store.js";
// import posed from 'vue-pose';
import RangeSlider from "vue-range-slider";
import "vue-range-slider/dist/vue-range-slider.css";

export default {
  name: "VideoPlayer",
  components: {
    "d-player": VueDPlayer,
    "progress-dot": RangeSlider,
    // volume: RangeSlider
  },
  props: {
    msg: String
  },
  data() {
    return {
      currVolume: 0,
      isVolume: false,
      progressValue: 0,
      isDragging: false,
      dragTime: 0,
      leftPosition: "10%",
      currVideo: String,
      isPaused: false,
      isMuted: true,
      duration: 0,
      currTime: 0,
      options: {
        autoplay: false,
        volume: 0.0
      }
    };
  },
  computed: {
    progressWidth: function() {
      let percentage = parseInt((this.currTime / this.duration) * 10000) / 100;
      // return 'calc(' + percentage + '% - ' + percentage * 0.02 + 'rem)'
      return percentage + "%";
    }
  },
  methods: {
    errorHandling() {
      console.log('retrying')
      this.loadVideo(this.currVideo, false)
    },
    draggingVolume() {
      const player = this.$refs.player.dp;

      if (this.currVolume == 0) {
        this.isMuted = true;
        console.log(this.currVolume);
      } else {
        this.isMuted = false;
      }

      player.volume(this.currVolume);
    },
    changeVolume() {
      const player = this.$refs.player.dp;

      player.volume(this.currVolume);
    },
    draggingProgress() {
      this.isDragging = true;
    },
    changeProgress() {
      this.isDragging = false;

      const player = this.$refs.player.dp;

      let time = (this.progressValue / 100) * this.duration;
      console.log(time);

      player.seek(time);
    },
    updateDragPosition(event) {
      let percentage = parseFloat(event) / 100;
      let time = this.duration * percentage;

      if (time) {
        this.dragTime = time;
      }
    },
    callback(event) {
      console.log("callbeck test");
      console.log(event);
    },
    getLeftPosition() {
      let randomLeft = Math.random() * 15 + 5 + "%";
      return randomLeft;
    },
    mute() {
      const player = this.$refs.player.dp;
      player.volume(0);
    },
    unmute() {
      const player = this.$refs.player.dp;
      player.volume(100);
    },
    pauseVideo() {
      const player = this.$refs.player.dp;
      player.pause();
    },
    playVideo() {
      const player = this.$refs.player.dp;
      player.play();
    },
    playMuted() {
      const player = this.$refs.player.dp;
      player.volume(0);
      this.currVolume = 0;
      player.play();
      this.isMuted = true;
    },
    playWithSound() {
      const player = this.$refs.player.dp;

      if (this.currVolume > 0) {
        player.volume(this.currVolume);
      } else {
        player.volume(1);
        this.currVolume = 1;
      }

      player.play();
      this.isMuted = false;
    },
    togglePause() {
      this.isPaused = !this.isPaused;

      if (this.isPaused) {
        this.pauseVideo();
      } else {
        this.playVideo();
      }
    },
    toggleVolume() {
      this.isVolume = !this.isVolume;
      
    },
    toggleMute() {
      this.isMuted = !this.isMuted;

      if (this.isMuted) {
        this.mute();
      } else {
        this.unmute();
      }
    },
    setVideoUrl(url) {
      const player = this.$refs.player.dp;
      try {
        player.switchVideo({
          url: url
        });
        console.log('switched')
      } catch (error) {
        console.log(error)
      }
    },
    playbackEnded() {
      let tid = this.$parent.$refs.thumbnails.getNextVideoId(this.currVideo.id)

      store.dispatch("getVideoById", tid).then(response => {
        this.currVideo = response;
        console.log(this.currVideo.id)
        this.loadVideo(response, false);
      });
    },
    timeUpdate() {
      const player = this.$refs.player.dp;
      this.duration = player.video.duration;
      this.currTime = player.video.currentTime;

      if (this.isDragging == false) {
        this.progressValue =
          parseInt((this.currTime / this.duration) * 10000) / 100;
      }
    },
    filterTime(seconds) {
      if (seconds) {
        seconds = parseInt(seconds);
        let remainder = seconds % 60.0;
        remainder = remainder < 10 ? "0" + remainder : remainder;
        let minutes = (seconds - remainder) / 60;
        minutes = minutes < 10 ? "0" + minutes : minutes;
        let time = minutes + ":" + remainder;
        return time;
      } else {
        return "00:00";
      }
    },
    loadVideo(video, sound) {
      console.log(video);
      // let url = "http://wl-schermen_INLINE.test/ytdl/getvideo.php?videoid=" + video.id + "&type=Download&format=ipad"

      // let url = "http://wl-schermen.test/yt-link.php?id=" + video.id;
      let url = "http://onzebuurtinbeeld.nl/wl-schermen/yt-link.php?id=" + video.id;

      axios.get(url).then(response => {
        console.log("got response");
        let feeds = Array.from(response.data);
        console.log(response.data);
        let videoUrl = "";

        feeds.forEach(video => {
          console.log(video);

          if (video.mime === "video/mp4") {
            videoUrl = video.url;
          }
        });

        console.log(videoUrl);
        
        if (videoUrl !== "") {
          this.setVideoUrl(videoUrl);
          this.currVideo = video;
          this.leftPosition = this.getLeftPosition();

          setTimeout(() => {
              this.$parent.$refs.thumbnails.activateByID(video.id);
            this.isDragging = false;
            this.dragPosition = "0%";
            this.dragTime = 0;

            if (sound) {
              this.playWithSound();
            } else {
              this.playMuted();
            }
          }, 1000);
        }
      });
    }
  },
  mounted() {
    let intervalId = setInterval(() => {
      console.log("tick");
      if (store.state.initialized) {
        window.clearInterval(intervalId);

        store.dispatch("getVideo", 0).then(response => {
          this.currVideo = response;
          this.loadVideo(response, false);
        });
      }
    }, 100);
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.btn-volume {
  position: relative;
}

.range-slider {
  height: 0.5rem;
}

.volume-slider.active {
  opacity: 1;
  bottom: 110%;
}

.volume-slider {
  opacity: 0;
  transition: opacity 200ms ease, bottom 200ms ease-out;
  position: absolute;
  left: 50%;
  bottom: 90%;
  width: 100px;
  margin-left: -50px;
  height: 40px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.5);
}

.volume-slider::after {
  content: "";
  position: absolute;
  left: 34px;
  top: 100%;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 16px 16px 0 16px;
  border-color: rgba(255, 255, 255, 0.5) transparent transparent transparent;
}

.range-slider-rail {
  height: 0.5rem;
  border-radius: 0;
  background: rgba(255, 255, 255, 0.75);
}

.range-slider-inner {
  height: 0.5rem;
  position: absolute;
  left: 0;
}

.volume-slider .range-slider-inner {
  top: 50%;
  margin-top: -0.25rem;
  width: 80px;
  left: 10px;
}

.range-slider-fill {
  height: 0.5rem;
  border-radius: 0;
  background: #4f0b7b;
}

.range-slider-knob {
}

.video-player {
  width: 66.666vw;
}

.dplayer-wrapper {
  height: calc((66.666vw - 2rem) * 9 / 16);
}

.title {
  bottom: -4.75rem;
  box-shadow: -5px 10px 20px rgba(0, 0, 0, 0.1);
  transition: left 800ms ease;
}

.persona {
  top: -2rem;
  left: 10%;
}

.controls {
  bottom: -3vw;
  right: 3.125vw;
}

.btn {
  position: relative;
  left: 0;
  top: 0;
}

.btn:nth-child(2) {
  left: -10px;
}

.btn:focus {
  outline: none !important;
}

.btn-icon {
  width: 6vw;
  height: 6vw;
}

.dplayer-controller,
.dplayer-controller-mask,
.dplayer-info-panel,
.dplayer-menu,
.dplayer-notice,
.dplayer-bezel {
  display: none !important;
}
</style>
