<template>
  <div class="home">
    <header-logo msg="header"/>

    <section>
        <video-player msg="player"/>
        <thumbnails msg="sidebar"/>
    </section>
  </div>
</template>

<script>
// @ is an alias to /src
import HeaderLogo from '@/components/HeaderLogo.vue'
import VideoPlayer from '@/components/VideoPlayer.vue'
import Thumbnails from '@/components/Thumbnails.vue'

export default {
  name: 'home',
  components: {
    HeaderLogo,
    VideoPlayer,
    Thumbnails
  }
}
</script>
