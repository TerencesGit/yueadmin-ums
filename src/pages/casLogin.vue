<template>
	<form id="casForm" :action="action" style="display: none">
    <input type="text" name="rawUrl" :value="rawUrl">
  </form>
</template>
<script>
export default {
	data () {
    return {
      rawUrl: '',
      action: '',
    }
  },
  mounted () {
  	this.rawUrl = '#'+this.$fromPath;
    this.action = window.location.protocol+ '//' + window.location.host + '/ums/ssoAjax/casProxy.do';
    setTimeout(() => {
  	  document.getElementById('casForm').submit()
    }, 500)
  }
}
</script>