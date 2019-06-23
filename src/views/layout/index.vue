<template>
    <div>
        <p>App layout</p>
        <AppAside/>
        <AppHeader/>
    </div>
</template>

<script>
import AppAside from './components/AppAside'
import AppHeader from './components/AppHeader'
export default {
  components: {
    AppAside,
    AppHeader
  },
  data () {

  }
}
</script>

<style lang="less" scoped>
</style>
