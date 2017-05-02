<template>
  <section>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span class="card-title">品牌详情</span>
        <el-button style="float: right;" type="primary" @click="back">返回</el-button>
      </div>
      <div class="card-body" v-loading="loading">
        <el-col :span="12" :offset="6">
          <dl class="dl-horizontal">
            <dt>品牌名称：</dt>
            <dd>{{ brand.brandName }}</dd>
          </dl>
          <dl class="dl-horizontal">
            <dt>品牌描述：</dt>
            <dd>{{ brand.content }}</dd>
          </dl>
          <dl class="dl-horizontal">
            <dt>品牌Logo：</dt>
            <dd><img :src="brand.logoUrl" alt="品牌Logo" style="width: 100%"></dd>
          </dl>
          <dl class="dl-horizontal">
            <dt>品牌专题页：</dt>
            <dd v-if="brand.brandPage">{{ brand.brandPage }}</dd>
            <dd v-else>暂无</dd>
          </dl>
          <dl class="dl-horizontal">
            <dt>创建时间：</dt>
            <dd>{{ brand.createTime | TimeFormat}}</dd>
          </dl>
          <dl class="dl-horizontal">
            <dt>更新时间：</dt>
            <dd>{{ brand.updateTime | TimeFormat}}</dd>
          </dl>
        </el-col>
      </div>
    </el-card>
  </section>
</template>
<script>
import { brandDetail } from '../../api'
export default {
  data() {
   return {
    loading: false,
    brand: {}
   }
  },
  methods: {
    loadBrandDetail () {
      this.loading = true
      let brandId = this.$route.query.id
      brandDetail({id: brandId}).then(res => {
        this.brand = res.data.brand
      }).then(() => {
        this.loading = false
      })
    },
    back () {
      this.$router.back()
    }
  },
  mounted () {
    this.loadBrandDetail()
  }
}
</script>
