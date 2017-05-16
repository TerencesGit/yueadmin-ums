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
import { getPermissionList } from '../api'
export default {
  name: 'layout',
  components: {
    AsideComp,
    HeaderComp,
    MainComp
  },
  created () {
    let sessionId = localStorage.getItem('sessionId')
    console.log(sessionId)
    getPermissionList({sessionId: sessionId}).then(res => {
      console.log(res)
      let data = res.data
      this.$store.dispatch('setUserPermission', data.result)
      // this.$store.dispatch('setUserName', data.name)
      // this.$store.dispatch('setPartner', data.partner)
    })
    .catch(function (error) {
      console.log(error)
    })
  }
}
</script>
