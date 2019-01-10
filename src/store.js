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
        return context.state.videos[index]
    },
    initVideos(context) {
        let url = 'http://wl-schermen.test/admin/videos.json'

        axios.get(url).then((response) => {
            if (response.data.videos) {
                context.state.videos = response.data.videos
                context.state.initialized = true;
            }
        })
    }
  }
})
