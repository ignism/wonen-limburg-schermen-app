<template>
  <div class="header-logo">
    <div class="logo p-4 bg-white absolute z-10">
      <img src="/images/logo.svg" alt="">
    </div>
    <div class="line absolute absolute z-20">
      <img src="/images/line.svg" alt="" class="w-full">
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
        height: calc(8.333vw + 80px);
    }

    .logo {
      width: 12vw;
      top: 2.5vw;
      left: 10vw;
      transform: rotate(2deg);
      box-shadow: -5px 10px 20px rgba(0, 0, 0, 0.1);
    }

    .line {
      left: 0;
      top: 6.5vw;
      width: 16vw;
    }
</style>
