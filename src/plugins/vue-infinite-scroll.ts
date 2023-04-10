import infiniteScroll from 'vue3-infinite-scroll-better'

export default defineNuxtPlugin(nuxtApp => {
  nuxtApp.vueApp.use(infiniteScroll)
})
