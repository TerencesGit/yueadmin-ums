<template>
	<div id="layout">
		<AsideComp :isHideSidebar="status"></AsideComp>
    <HeaderComp :isHideSidebar="status" v-on:toggleSide="toggleSidebar"></HeaderComp>
    <MainComp :isHideSidebar="status"></MainComp>
	</div>
</template>
<script>
import AsideComp from './Aside'
import HeaderComp from './Header'
import MainComp from './Main'
export default {
  name: 'layout',
  components: {
    AsideComp,
    HeaderComp,
    MainComp
  },
  data () {
  	return {
  		status: false
  	}
  },
  methods: {
  	toggleSidebar () {
  		this.status = !this.status
  	}
  }
}
</script>
