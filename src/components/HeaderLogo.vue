<template>
  <div class="header-logo">
    <h1>{{ msg }}</h1>
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

</style>
