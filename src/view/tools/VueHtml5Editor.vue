<template>
	<vue-html5-editor :content="content" :height="400"></vue-html5-editor>
</template>
<script>
	export default {
		data () {
			return {
				content: 'html5Editor'
			}
		}
	}
</script>