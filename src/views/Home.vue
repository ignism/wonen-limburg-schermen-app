<template>
  <div class="home">
    <header-logo msg="header"/>

    <section class="wrapper flex flex-wrap mx-auto">
        <video-player ref="videoPlayer" msg="player" />
        <thumbnails ref="thumbnails" msg="sidebar"/>
    </section>
  </div>
</template>

<script>
// @ is an alias to /src
import HeaderLogo from '@/components/HeaderLogo.vue'
import VideoPlayer from '@/components/VideoPlayer.vue'
import Thumbnails from '@/components/Thumbnails.vue'
import store from '@/store.js'

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
    store.dispatch('initVideos')
  }
}
</script>

<style>
.wrapper {
    margin-top: -64px;
    width: 83.333vw;
}
</style>
