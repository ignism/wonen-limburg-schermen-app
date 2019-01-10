<template>
  <div class="thumbnails w-1/5 px-4 flex flex-wrap h-full overflow-scroll">
    <div class="w-full h-32 bg-red mb-8" v-for="(video, index) in videos" :key="index">
      <div class=" thumbnail w-full h-full" @click="loadVideo(index, true)" :style="{ backgroundImage: 'url(' + video.thumbnail + ')' }"></div>
    </div>
  </div>
</template>

<script>
import store from '@/store.js'
import YouTube from 'simple-youtube-api'
const youtube = new YouTube('AIzaSyBT3erBppFscGZRzeDcVQh0y-FwZgzzGYU')

export default {
  name: 'Thumbnails',
  props: {
    msg: String
  },
  data () {
    return {
      codes: [],
      thumbnails: [],
      videos: [],
    }
  },
  methods: {
    initVideos(){
      for (let i = 0; i < this.codes.length; i++) {
        youtube.getVideoByID(this.codes[i].id).then(result => {
          let video = {
            id: this.codes[i].id,
            thumbnail: result.thumbnails.standard.url
          }
          
          this.videos.push(video)
        })
      }
    },
    loadVideo(index, onClick) {
      this.$parent.$refs.videoPlayer.loadVideo(this.videos[index].id, onClick)
    },
  },
  mounted() {
    let intervalId = setInterval(() => {

      if (store.state.initialized) {
        window.clearInterval(intervalId)

        store.dispatch('getVideos').then((response) => {
          if (response) {
            this.codes = response
            this.initVideos()
          }
        })
      }
    }, 100)
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .h-32 {
        height: 120px;
    }

    .thumbnail {
      background-size: cover;
      background-position: center;
      cursor: pointer;
    }
</style>
