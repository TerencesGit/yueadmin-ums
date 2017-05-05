<template>
  <section>
    <div v-title :data-title="this.$route.name"></div>
    <el-row class="m-b">
      <el-input
        placeholder="输入商品名称"
        icon="search"
        v-model="criteria"
        :on-icon-click="handleIconClick"
        style="width: 300px; float: left">
      </el-input>
      <el-button :plain="true" type="primary" class="pull-right" @click="addWare">添加商品</el-button>
    </el-row>
    <el-table :data="filteredWare" v-loading="loading" style="width: 100%">
      <el-table-column prop="ware_code" label="商品编码" sortable width="200"></el-table-column>
      <el-table-column prop="ware_name" label="商品名称" width="100"></el-table-column>
      <el-table-column prop="provider_id" label="供应商" width="150"></el-table-column>
      <el-table-column prop="create_time" label="创建时间" sortable width="150"></el-table-column>
      <el-table-column prop="ware_kind" label="商品类别" width="100"></el-table-column>
      <el-table-column prop="suggested_price" label="建议售价" width="140"></el-table-column>
      <el-table-column prop="key_words" label="商品关键字" width="140"></el-table-column>
      <el-table-column prop="status" label="状态" width="80"></el-table-column>
      <el-table-column prop="verify_status" label="审核状态" width="100"></el-table-column>
      <el-table-column label="操作" width="280" fixed="right">
      <template scope="scope">
        <el-button
          :plain="true"
          size="small"
          type="primary"
          @click="showWare(scope.$index, scope.row)">查看</el-button>
        <el-button
          :plain="true"
          size="small"
          type="primary"
          @click="setSKU(scope.$index, scope.row)">设置SKU</el-button>
        <el-button
          :plain="true"
          size="small"
          type="primary"
          @click="setStock(scope.$index, scope.row)">设置库存</el-button>
      </template>
    </el-table-column>
    </el-table>
    <el-row class="m-t">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[10, 20, 30, 40]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="100"
        class="pull-right">
      </el-pagination>
    </el-row>
  </section>
</template>
<script>
import { getWareList } from '../../api'
import { mapGetters } from 'vuex'
export default {
  data () {
    return {
      criteria: '',
      currentPage: 1,
      loading: false
    }
  },
  methods: {
    getWareList () {
      this.$nprogress.start()
      this.loading = true
      getWareList().then(res => {
        this.$store.dispatch('setWareList', res.data.wareList)
      }).then(() => {
        this.$nprogress.done()
        this.loading = false
      }).catch((error) => {
        this.$nprogress.done()
        this.loading = false
      })
    },
    handleIconClick () {
      console.log(this.criteria)
    },
    addWare () {
      this.$router.push('/provider/addWare')
    },
    handleSizeChange (val) {
    },
    handleCurrentChange (val) {
      this.currentPage = val
    },
    showWare ($index, row) {
      this.$router.push({
        path: '/provider/editWare?id=' + row.ware_code
      })
    },
    setSKU ($index, row) {
      this.$router.push({
        path: '/provider/setSKU?id=' + row.ware_code
      })
    },
    setStock ($index, row) {
      this.$router.push({
        path: '/provider/setStock?id=' + row.ware_code
      })
    }   
  },
  mounted () {
    this.getWareList()
  },
  computed: {
    ...mapGetters([
      'wareList'
    ]),
    filteredWare () {
      return this.wareList.filter(ware => ware.ware_name.indexOf(this.criteria) !== -1)
    }
  }
}
</script>
