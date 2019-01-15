<template>
  <div class="video-player px-4 relative z-30">
    <div class="dplayer-wrapper bg-black">
      <d-player ref="player" :options="options" @ended="playbackEnded" @timeupdate="timeUpdate"/>
    </div>
    <div class="title px-6 py-8 absolute bg-white">
      <h1 class="text-4xl">{{ currVideo.title }}</h1>
      <div class="persona px-4 py-2 text-white bg-purple absolute">
        <span class="text-xl">{{ currVideo.name }}</span>
        <br>{{ currVideo.function }}
      </div>
    </div>
    <div class="progress absolute pin-t pin-l h-1 mx-4 bg-purple z-50" :style="{ width: progressWidth }"></div>
    <div
      class="duration absolute mx-4 p-2 text-sm pin-t pin-r bg-white-75 z-40"
    >{{ filterTime(duration) }}</div>
    <div class="controls absolute">
      <button class="btn btn-play" @click="togglePause">
        <img v-if="isPaused" class="btn-icon" src="assets/images/play.svg">
        <img v-else class="btn-icon" src="assets/images/pause.svg">
      </button>
      <button class="btn btn-mute" @click="toggleMute">
        <img v-if="isMuted" class="btn-icon" src="assets/images/sound_off.svg">
        <img v-else class="btn-icon" src="assets/images/sound_on.svg">
      </button>
    </div>
  </div>
</template>

<script>
import VueDPlayer from "vue-dplayer";
import "vue-dplayer/dist/vue-dplayer.css";
import axios from "axios";
import store from "@/store.js";

export default {
  name: "VideoPlayer",
  components: {
    "d-player": VueDPlayer
  },
  props: {
    msg: String
  },
  data() {
    return {
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
    progressWidth: function () {
      let percentage = parseInt(this.currTime/this.duration * 10000) / 100;
      return 'calc(' + percentage + '% - ' + percentage * 0.02 + 'rem)'
    }
  },
  methods: {
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
      player.play();
      this.isMuted = true;
    },
    playWithSound() {
      const player = this.$refs.player.dp;
      player.volume(100);
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
      player.switchVideo({
        url: url
      });
    },
    playbackEnded() {
      store.dispatch("getNextVideo", this.currVideo).then(response => {
        this.currVideo = response;
        this.loadVideo(response, false);
      });
    },
    timeUpdate() {
      const player = this.$refs.player.dp;
      this.duration = player.video.duration;
      this.currTime = player.video.currentTime;
    },
    filterTime(seconds) {
      if (seconds) {
        seconds = parseInt(seconds)
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
      console.log(video)
      let url =
        "https://you-link.herokuapp.com/?url=https://www.youtube.com/watch?v=" +
        video.id;

      axios.get(url).then(response => {
        console.log("got response");
        let feeds = Array.from(response.data);
        console.log(response.data);
        let videoUrl = "";

        feeds.forEach(video => {
          let type = video.type.split(";");
          if (type[0] === "video/mp4") {
            videoUrl = video.url;
          }
        });

        console.log(videoUrl);

        if (videoUrl !== "") {
          this.setVideoUrl(videoUrl);
          this.currVideo = video;

          setTimeout(() => {
            this.$parent.$refs.thumbnails.activateByID(video.id);

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
.video-player {
  width: 66.666vw;
}

.dplayer-wrapper {
  height: calc((66.666vw - 2rem)*9/16);
}

.title {
  bottom: -2rem;
  left: 20%;
  box-shadow: -5px 10px 20px rgba(0, 0, 0, 0.1);
}

.persona {
  top: -2rem;
  left: 10%;
}

.controls {
  bottom: -1.525vw;
  right: 3.125vw;
}

.btn:focus {
  outline: none !important;
}

.btn-icon {
  width: 4vw;
  height: 3vw;
  transform: scale(1.5);
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
