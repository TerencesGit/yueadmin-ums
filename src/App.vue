<template>
  <div id="app">
    <AsideComp></AsideComp>
    <HeaderComp></HeaderComp>
    <MainComp></MainComp>
  </div>
</template>

<script>
import AsideComp from '@/components/Aside'
import HeaderComp from '@/components/Header'
import MainComp from '@/components/Main'
export default {
  name: 'app',
  components: {
    AsideComp,
    HeaderComp,
    MainComp
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
body {
  margin: 0;
  color: #333;
}
a {
  text-decoration: none
}
.clearfix:after,
.clearfix:before,
.container-fluid:after,
.container-fluid:before {
  display: table;
  content: '';
}
.clearfix:after,
.container-fluid:after {
  clear: both
}
.pull-right {
  float: right
}
.pull-left {
  float: left
}
.ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
