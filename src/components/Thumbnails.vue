<template>
  <div class="thumbnails w-1/5 px-4 flex flex-wrap h-full overflow-scroll">
    <div class="w-full h-32 bg-red mb-8" v-for="(background, index) in thumbnails" :key="index">
      <div class=" thumbnail w-full h-full" @click="loadVideo(index)" :style="{ backgroundImage: 'url(' + background + ')' }"></div>
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
      videos: [],
      thumbnails: []
    }
  },
  methods: {
    getThumbnails() {
      for (let i = 0; i < this.videos.length; i++) {
        youtube.getVideoByID(this.videos[i].id).then(video => {
          this.thumbnails.push(video.thumbnails.standard.url)
        })
      }
    },
    loadVideo(index) {
      this.$parent.$refs.videoPlayer.getVideoUrl(this.videos[index].id)
    }
  },
  mounted() {
    let intervalId = setInterval(() => {
      console.log('tick')

      if (store.state.initialized) {
        console.log('initialized')
        window.clearInterval(intervalId)

        store.dispatch('getVideos').then((response) => {
          if (response) {
            this.videos = response
            this.getThumbnails()
          }
        })
      }
    })
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
