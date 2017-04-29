<template>
	<div id="layout">
		<AsideComp></AsideComp>
    <HeaderComp></HeaderComp>
    <keep-alive>
      <MainComp></MainComp>
    </keep-alive>
	</div>
</template>
<script>
import AsideComp from './Aside'
import HeaderComp from './Header'
import MainComp from './Main'
import { getUserPermission } from '../api'
export default {
  name: 'layout',
  components: {
    AsideComp,
    HeaderComp,
    MainComp
  },
  created () {
    getUserPermission().then(res => {
      let data = res.data
      this.$store.dispatch('setUserPermission', data.permission)
      this.$store.dispatch('setUserName', data.name)
      this.$store.dispatch('setPartner', data.partner)
    })
    .catch(function (error) {
      console.log(error)
    })
  }
}
</script>
