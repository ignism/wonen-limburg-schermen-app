<template>
  <div class="video-player px-4 relative z-30">
    <div class="dplayer-wrapper bg-black">
      <!-- <d-player ref="player" @error="errorHandling" :options="options" @ended="playbackEnded" @timeupdate="timeUpdate"/> -->
      <youtube
        :video-id="currVideo.id"
        ref="youtube"
        @ended="playbackEnded"
        @paused="paused"
        @playing="playing"
        @cued="canplay"
        :player-vars="options"
      ></youtube>
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
      </button>
    </div>
  </div>
</template>

<script>
import Vue from "vue";
import VueYoutube from "vue-youtube";
import "vue-dplayer/dist/vue-dplayer.css";
import store from "@/store.js";
// import posed from 'vue-pose';
import RangeSlider from "vue-range-slider";
import "vue-range-slider/dist/vue-range-slider.css";
import { setTimeout } from "timers";

Vue.use(VueYoutube);

export default {
  name: "VideoPlayer",
  components: {
    "progress-dot": RangeSlider
    // volume: RangeSlider
  },
  props: {
    msg: String
  },
  data() {
    return {
      interval: "",
      fitParent: true,
      currVolume: 0,
      isVolume: false,
      progressValue: 0,
      isDragging: false,
      dragTime: 0,
      leftPosition: "10%",
      currVideo: String,
      isPaused: true,
      isMuted: true,
      duration: 0,
      currTime: 0,
      options: {
        autoplay: 0,
        controls: 0,
        rel: 0
      }
    };
  },
  computed: {
    progressWidth() {
      let percentage = parseInt((this.currTime / this.duration) * 10000) / 100;
      // return 'calc(' + percentage + '% - ' + percentage * 0.02 + 'rem)'
      return percentage + "%";
    },
    player() {
      return this.$refs.youtube.player;
    }
  },
  methods: {
    canplay() {
      console.log("LOADED");

      setTimeout(() => {
        this.$parent.$refs.thumbnails.activateByID(this.currVideo.id);
        this.isDragging = false;
        this.dragPosition = "0%";
        this.dragTime = 0;
      }, 500);

      this.leftPosition = this.getLeftPosition();

      this.player.playVideo();
    },
    paused() {
      if (this.interval != '') {
        console.log('clearing interval', this.interval)
        window.clearInterval(this.interval);
        this.interval = "";
      }
    },
    playing() {
      this.isPaused = false;
      console.log("is playing");
      this.$refs.youtube.player.getDuration().then(response => {
        this.duration = response;
      });


      if (this.interval != '') {
        console.log('clearing interval', this.interval)
        window.clearInterval(this.interval);
        this.interval = "";
      }

      this.interval = window.setInterval(() => {
        this.$refs.youtube.player.getCurrentTime().then(response => {
          this.currTime = response;

          if (this.isDragging == false)
            this.progressValue =
              parseInt((this.currTime / this.duration) * 10000) / 100;
        });
      }, 500);
      console.log('got interval', this.interval)
    },
    draggingProgress() {
      this.isDragging = true;
    },
    changeProgress() {
      this.isDragging = false;

      let time = (this.progressValue / 100) * this.duration;
      console.log(time);
      this.player.seekTo(time);
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
      this.player.setVolume(0);
    },
    unmute() {
      this.player.setVolume(100);
    },
    pauseVideo() {
      this.player.pauseVideo();
    },
    playVideo() {
      this.player.playVideo();
    },
    playMuted() {
      this.mute()
      this.playVideo()
      this.isMuted = true;
    },
    playWithSound() {
      this.unmute()
      this.playVideo()
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
    // toggleVolume() {
    //   this.isVolume = !this.isVolume;
    // },
    toggleMute() {
      this.isMuted = !this.isMuted;

      if (this.isMuted) {
        this.mute();
      } else {
        this.unmute();
      }
    },
    playbackEnded() {
      let tid = this.$parent.$refs.thumbnails.getNextVideoId(this.currVideo.id);

      store.dispatch("getVideoById", tid).then(response => {
        this.loadVideo(response, false);
      });
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
      this.currVideo = video;

      setTimeout(() => {
        this.$parent.$refs.thumbnails.activateByID(video.id);
        this.isDragging = false;
        this.dragPosition = "0%";
        this.dragTime = 0;
      }, 500);
    }
  },
  mounted() {
    let intervalId = setInterval(() => {
      console.log("tick");
      if (store.state.initialized) {
        window.clearInterval(intervalId);

        store.dispatch("getVideo", 0).then(response => {
          this.currVideo = response;
          console.log(response);
        });
      }
    }, 100);
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

iframe {
  width: 100%;
  height: 100%;
}

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
