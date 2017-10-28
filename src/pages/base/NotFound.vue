<template>
	<div class="wrap">
    <div class="top">
      <h1>404</h1>
    </div>
    <div class="bottom">
      <h3>Sorry, the page you visit does not exist</h3>
      <h3>抱歉，您访问的页面不存在</h3>
      <el-button type="default" @click="back">返回</el-button>
    </div>
  </div>
</template>
<script>
export default {
  methods: {
    back () {
      this.$router.go(-1)
    }
  }
}
</script>
<style scoped lang="scss">
  .wrap {
    position: fixed;
    width: 100%;
    height: 100%;
    color: #676a6c;
    text-align: center;
    background: #fff;
    .top {
      height: 70%;
      background: gray;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .top h1 {
      font-size: 200px;
      color: #fff;
    }
    .bottom {
      padding-top: 30px;
      h3 {
        margin: 15px 0;
      }
    }
  }
</style>