<template>
  <div class="thumbnails relative">
    <div class="scroll-up absolute bg-purple z-10" @click="scrollUp">
      <img src="assets/images/arrow.svg" alt="">
    </div>
    <div class="thumbnails-wrapper px-4 flex flex-wrap overflow-scroll">
      <div class="w-full bg-red mb-8 relative" v-for="(video, index) in videos" :key="index">
        <div class="relative thumbnail w-full h-full" @click="loadVideo(index, true)">
          <div class="background-wrapper w-full h-full overflow-hidden relative">
            <div class="background w-full h-full ">
              <img :src="video.thumbnail" alt="">
            </div>
            <!-- <div class="background" :style="{ backgroundImage: 'url(' + video.thumbnail + ')' }"></div> -->
          </div>
          <div class="description p-2 bg-white absolute">
            <span class="font-bold">Title van deze video is lang</span>
            <br>
            <span>Saskia van Sanderhovenachter</span>
          </div>
          <div class="absolute indicator pin-t pin-l bg-white-75 text-purple h-full w-full flex flex-col justify-center">
            <div class="text-center">speelt nu af</div>
          </div>
        </div>
      </div>
    </div>
    <div class="scroll-down absolute bg-purple z-10" @click="scrollDown">
      <img src="assets/images/arrow.svg" alt="">
    </div>
  </div>
</template>

<script>
import store from "@/store.js";
import YouTube from "simple-youtube-api";
const youtube = new YouTube("AIzaSyBT3erBppFscGZRzeDcVQh0y-FwZgzzGYU");
import { tween, styler } from 'popmotion';

export default {
  name: "Thumbnails",
  props: {
    msg: String
  },
  data() {
    return {
      codes: [],
      thumbnails: [],
      videos: []
    };
  },
  methods: {
    initVideos() {
      for (let i = 0; i < this.codes.length; i++) {
        youtube.getVideoByID(this.codes[i].id).then(result => {
          let video = {
            id: this.codes[i].id,
            thumbnail: result.thumbnails.standard.url
          };

          this.videos.push(video);
        });
      }
    },
    loadVideo(index, onClick) {
      let thumbs = Array.from(document.getElementsByClassName("thumbnail"));

      thumbs.forEach(thumb => {
        thumb.classList.remove("active");
      });

      this.$parent.$refs.videoPlayer.loadVideo(this.videos[index].id, onClick);
    },
    activate(index) {
      let thumbs = Array.from(document.getElementsByClassName("thumbnail"));

      thumbs.forEach(thumb => {
        thumb.classList.remove("active");
      });

      thumbs[index].classList.add("active");
    },
    activateByID(id) {
      let index = 0;

      for (let i = 0; i < this.videos.length; i++) {
        if (this.videos[i].id === id) {
          index = i;
        }
      }

      this.activate(index);
    },
    getThumbHeight() {
      let thumb = document.querySelector('.thumbnail')
      return thumb.offsetHeight + 32
    },
    scrollUp () {
      let wrapper = document.querySelector('.thumbnails-wrapper')
      let thumb = document.querySelector('.thumbnail')

      let currPos = wrapper.scrollTop;
      let toPos = currPos - (thumb.offsetHeight + 32)

      const updateWrapper = v => (wrapper.scrollTop = v);

      tween({ from: currPos, to: toPos, duration: 400 }).start({
        update: updateWrapper
      });
    },
    scrollDown () {
      let wrapper = document.querySelector('.thumbnails-wrapper')
      let thumb = document.querySelector('.thumbnail')

      let currPos = wrapper.scrollTop;
      let toPos = currPos + (thumb.offsetHeight + 32)

      const updateWrapper = v => (wrapper.scrollTop = v);

      tween({ from: currPos, to: toPos, duration: 400 }).start({
        update: updateWrapper
      });
    }
  },
  mounted() {
    let intervalId = setInterval(() => {
      if (store.state.initialized) {
        window.clearInterval(intervalId);

        store.dispatch("getVideos").then(response => {
          if (response) {
            this.codes = response;
            this.initVideos();
          }
        });
      }
    }, 100);
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.thumbnails {
  width: 16.667vw;
}
.thumbnails-wrapper {
  height: calc((66.666vw - 2rem) * 9 / 16);
}

.thumbnails-wrapper::-webkit-scrollbar {
    width: 0px;
    height: 0px;
    background: transparent; /* make scrollbar transparent */
}

.thumbnail {
  cursor: pointer;
  height: 9.375vw;
}

.background {
  width: 140%;
  height: 140%;
  position: relative;
  top: -25%;
  left: -20%;
}

.description {
  left: 0.5rem;
  bottom: -1rem;
  transition: opacity 400ms ease;
}

.thumbnail.active .description {
  opacity: 0;
}

.indicator {
  opacity: 0;
  transition: opacity 400ms ease;
}

.thumbnail.active .indicator {
  opacity: 1;
}

.scroll-up,
.scroll-down {
  width: 3vw;
  height: 3vw;
  left: 50%;
  margin-left: -1.5vw;
}

.scroll-up {
  top: -1rem;
  box-shadow: -5px 10px 20px rgba(0, 0, 0, 0.25);
}

.scroll-up img {
  transform: scale(0.6) translate(0, -6px);
  transform-origin: center;
}

.scroll-down {
  bottom: -1rem;
  box-shadow: -5px 10px 20px rgba(0, 0, 0, 0.25);
}

.scroll-down img {
  transform: scale(0.6) translate(0, -6px) rotate(180deg);
  transform-origin: center;
}
</style>
