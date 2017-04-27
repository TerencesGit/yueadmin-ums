<template>
	<div class="main transition" :class="{'spread': sidebarStatus}">
		<div class="wrapper">
			<div class="container-fluid">
				<transition name="custom-classes-transition"
		    enter-active-class="animated fadeInRight"
		    leave-active-class="animated fadeOutRight">
					<router-view></router-view>
				</transition>
				<div class="wrap-footer"></div>
			</div>
		</div>
		<footer class="site-footer">
	    <span>Copyright © 2017 yueshijue.com</span>
	    <a href="javascript:;" class="back-top" @click="backTop">
	      <i class="fa fa-angle-up"></i>
	    </a>
	  </footer>
	</div>
</template>
<script>
import { mapGetters } from 'vuex'
export default {
  methods: {
	    backTop () {
      document.body.scrollTop = 0
      document.documentElement.scrollTop = 0
    }
  },
  computed: {
    ...mapGetters([
      'sidebarStatus'
    ])
  }
}
</script>
<style scoped lang="scss">
	.main {
		position: absolute;
    top: 60px;
    left: 240px;
    right: 0;
    height: calc(100% - 60px);
    .wrapper {
	    min-height: 100%;
	    height: auto !important;
	    height: 100%;
	    margin-bottom: -40px;
	    background: #f0f3f4;
	  }
	}
	.main.spread {
		left: 0;
	}
  .container-fluid {
    margin-right: auto;
    margin-left: auto;
    padding: 20px;
  }
  .wrap-footer {
		height: 40px;
	}
	.site-footer {
    position: relative;
    padding: 11px 0;
    text-align: center;
    color: #fff;
    background: #5b6e84;
	}
	.back-top {
		position: absolute;
		right: 1%;
	  width: 20px;
	  height: 20px;
	  color: #72d0eb;
	  background: rgba(127, 221, 248, .5);
	  border-radius: 50%;
	  i {
			color: #2A3542;
		}
	}
	.router-fade-enter-active, .router-fade-leave-active {
	  transition: opacity .3s;
	}
	.router-fade-enter, .router-fade-leave-active {
		transform: translateX(30px);
	  opacity: 0;
	}
</style>
