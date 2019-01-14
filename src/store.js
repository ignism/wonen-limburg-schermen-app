import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    initialized: false,
    videos: [
        '1',
        '2',
        '3',
        '4',
        '5'
    ]
  },
  mutations: {

  },
  actions: {
    getVideos(context) {
      return context.state.videos
    },
    getVideo(context, index) {
      return context.state.videos[index].id
    },
    getNextVideo(context, id) {
      console.log(id)
      let index = 0;
      let num = context.state.videos.length;
      for (let i = 0; i < context.state.videos.length; i++) {
        if (id === context.state.videos[i].id) {
          index = i
        }
      }
      index = index + 1;
      if (index > num -1) index = 0;
      return (context.state.videos[index].id)
    },
    initVideos(context) {
        let url = 'http://wl-schermen_INLINE.test/videos.json'

        axios.get(url).then((response) => {
            if (response.data.videos) {
                context.state.videos = response.data.videos
                context.state.initialized = true;
            }
        })
    }
  }
})
