<template>
  <div class="header-logo">
    <div class="logo p-4 absolute z-10">
      <img src="assets/images/logo-box.svg" alt="">
    </div>
    <div class="line absolute absolute z-20">
      <img src="assets/images/line.svg" alt="" class="w-full">
    </div>
  </div>
</template>

<script>
export default {
  name: 'HeaderLogo',
  props: {
    msg: String
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .header-logo {
        height: calc(17.59vh);
    }

    .logo {
      width: 20vw;
      top: 1.125vw;
      left: 6vw;
      /* transform: rotate(2deg); */
      /* box-shadow: -5px 10px 20px rgba(0, 0, 0, 0.1); */
    }

    .line {
      left: 0;
      top: 6.5vw;
      width: 14.5vw;
    }
</style>
