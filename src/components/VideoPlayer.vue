<template>
  <div class="video-player w-4/5 px-4">
    <d-player ref="player" :options="options" @ended="playbackEnded"/>

    <button @click="getVideoUrl()">get url</button>
  </div>
</template>

<script>
import VueDPlayer from "vue-dplayer";
import "vue-dplayer/dist/vue-dplayer.css";
import axios from "axios";
import store from '@/store.js'

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
      options: {
        autoplay: false,
        volume: 0.0
      }
    };
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
    playMuted() {
      const player = this.$refs.player.dp;
      player.volume(0);
      player.play();
    },
    playWithSound() {
      const player = this.$refs.player.dp;
      player.volume(100);
      player.play();
    },
    setVideoUrl(url) {
      const player = this.$refs.player.dp;
      player.switchVideo({
        url: url
      });
    },
    playbackEnded() {
      store.dispatch('getNextVideo', this.currVideo).then((response) => {
        this.currVideo = response
        this.loadVideo(response, false)
      })
    },
    loadVideo(code, sound) {
      let url =
        "https://you-link.herokuapp.com/?url=https://www.youtube.com/watch?v=" +
        code;

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
          this.currVideo = code;

          setTimeout(() => {
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
      console.log('tick')
      if (store.state.initialized) {
        window.clearInterval(intervalId)

        store.dispatch('getVideo', 0).then((response) => {
          this.currVideo = response
          this.loadVideo(response, false)
        })
      }
    }, 100)
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
