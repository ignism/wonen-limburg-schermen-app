<template>
  <div class="video-player w-4/5 px-4">
    <d-player ref="player" :options=options />
  </div>
</template>

<script>
import VueDPlayer from 'vue-dplayer'
import 'vue-dplayer/dist/vue-dplayer.css'

export default {
  name: "VideoPlayer",
  components: {
      'd-player': VueDPlayer
  },
  props: {
    msg: String,
  },
  data() {
      return {
        url: String,
          options: {
              'autoplay': true,
              'volume': 0,
              'video': {
                'url': this.url
              }
          }
      }
  },
  methods: {
      setVideoUrl(url) {
        const player = this.$refs.player.dp
        player.switchVideo({
            url: 'https:\/\/r5---sn-vgqs7nez.googlevideo.com\/videoplayback?signature=D8D4FFA79C2E1E2CB8C5FC0BABAB1BE4782D6F0E.E3D1C380ECCFE1ED5EA28C55655EE700F8CAD7B6&source=youtube&fvip=4&itag=18&clen=31936004&ratebypass=yes&gir=yes&c=WEB&ipbits=0&lmt=1421229645416224&mn=sn-vgqs7nez%2Csn-vgqsdn7s&ip=54.147.13.50&mm=31%2C29&sparams=clen%2Cdur%2Cei%2Cgir%2Cid%2Cinitcwndbps%2Cip%2Cipbits%2Citag%2Clmt%2Cmime%2Cmm%2Cmn%2Cms%2Cmv%2Cpl%2Cratebypass%2Crequiressl%2Csource%2Cexpire&mime=video%2Fmp4&dur=545.250&id=o-AOYoh0AWbnRma249lUDRenQx5kCT297c5UP6Q8R5vCwT&mv=m&pl=14&mt=1546958682&requiressl=yes&ms=au%2Crdu&expire=1546980406&initcwndbps=2558750&key=yt6&ei=1rc0XMfDJ-eT8gTtxrKwCg',
            pic: 'second.png',
            thumbnails: 'second.jpg'
        })

        player.play()

        console.log('player')
        console.log(player)
        console.log('url')
        console.log(url)
      }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
