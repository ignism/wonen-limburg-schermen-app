<template>
  <div class="thumbnails w-1/5 px-4 flex flex-wrap h-full overflow-scroll">
    <div class="w-full h-32 bg-red mb-8"></div>
    <div class="w-full h-32 bg-red mb-8"></div>
    <div class="w-full h-32 bg-red mb-8"></div>
    <div class="w-full h-32 bg-red mb-8"></div>
    <div class="w-full h-32 bg-red mb-8"></div>
  </div>
</template>

<script>
export default {
  name: 'Thumbnails',
  props: {
    msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .h-32 {
        height: 120px;
    }
</style>
