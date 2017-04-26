<template>
	<el-row :gutter="20">
    <div class="grid-content bg-purple">
      <h1>悦视觉后台管理</h1>
    </div>
	  <el-col :span="6" v-for="item in items">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span style="line-height: 36px; font-weight: bold">{{ item.name }}</span>
          <el-button style="float: right;" type="primary">操作按钮</el-button>
        </div>
        <div v-for="o in 4" class="text item">
          {{'列表内容 ' + o }}
        </div>
      </el-card>
	  </el-col>
	</el-row>
</template>
<script>
// import { getPartnerList } from '../../api/api'
export default {
  data () {
    return {
      items: [
        {
          name: '账户管理'
        },
        {
          name: '供应商'
        },
        {
          name: '分销商'
        },
        {
          name: '平台管理员'
        }
      ]
    }
  },
  methods: {
    getPart () {
      let param = ''
      getPartnerList(param).then(res => {
        console.log(res.data.funcs)
        this.funcs = res.data.funcs
      })
    }
  }
}
</script>
<style>
  .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
    text-align: center;
    margin: 0 10px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
  .text {
    font-size: 14px;
  }

  .item {
    padding: 18px 0;
  }
  .el-card.box-card {
    transition: all .3s
  }
  .el-card.box-card:hover {
    transform: scaleX(1.03) scaleY(1.03);
  }
</style>
