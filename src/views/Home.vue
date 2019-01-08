<template>
  <div class="home">
    <header-logo msg="header"/>

    <section class="wrapper flex flex-wrap mx-auto w-5/6">
        <video-player ref="videoPlayer" msg="player" />
        <thumbnails msg="sidebar"/>
    </section>
  </div>
</template>

<script>
// @ is an alias to /src
import HeaderLogo from '@/components/HeaderLogo.vue'
import VideoPlayer from '@/components/VideoPlayer.vue'
import Thumbnails from '@/components/Thumbnails.vue'
import axios from 'axios'

export default {
  name: 'home',
  components: {
    HeaderLogo,
    VideoPlayer,
    Thumbnails
  },
  data() {
      return {
          url: String
      }
  },
  mounted() {
    axios
    .get('https://you-link.herokuapp.com/?url=https://www.youtube.com/watch?v=NlmlswjxEJw')
    .then((response) => {
        console.log(this.$refs.videoPlayer.setVideoUrl("urltje"))
    })
  }
}
</script>

<style>
.wrapper {
    margin-top: -80px;
    height: calc(100vh - 16.666vw);
    background: grey;
}
</style>
