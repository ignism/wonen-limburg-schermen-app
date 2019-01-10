<template>
  <div class="video-player w-4/5 px-4">
    <d-player ref="player" :options="options"/>

    <button @click="getVideoUrl()">get url</button>
  </div>
</template>

<script>
import VueDPlayer from "vue-dplayer";
import "vue-dplayer/dist/vue-dplayer.css";
import axios from 'axios'
// import store from '@/store.js'

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
      url: String,
      options: {
        autoplay: true,
        volume: 0,
        video: {
          url: this.url
        }
      }
    };
  },
  methods: {
    setVideoUrl(url) {
      const player = this.$refs.player.dp;
      player.switchVideo({
        url: url,
        pic: "second.png",
        thumbnails: "second.jpg"
      });

      player.play();

      console.log("player");
      console.log(player);
      console.log("url");
      console.log(url);
    },
    getVideoUrl(code) {
      // let code = 'NlmlswjxEJw'
      let url = 'https://you-link.herokuapp.com/?url=https://www.youtube.com/watch?v=' + code
      
      axios.get(url).then((response) => {
        let feeds = Array.from(response.data)
        let videoUrl = ''

        feeds.forEach(video => {
          let type = video.type.split(';')
          if (type[0] === 'video/mp4') {
            videoUrl = video.url
          }
        })

        console.log(videoUrl)

        if (videoUrl !== '') {
          this.setVideoUrl(videoUrl)
        }
      })
    }
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
