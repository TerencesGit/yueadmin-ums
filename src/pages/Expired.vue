<template>
	<div class="wrap">
    <div class="bottom">
      <h3>当前验证链接已过期，请重新发送！
        <el-button type="default" @click="back">点此返回</el-button>
      </h3>
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
      font-size: 20px;
      color: #fff;
    }
    .bottom {
      padding-top: 30px;
      h3 {
        margin: 15px 0;
      }
      .el-button {
        border: 0
      }
    }
  }
</style>