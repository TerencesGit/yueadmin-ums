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
    <el-table :data="businessList" border v-loading="loading" style="width: 100%">
      <el-table-column type="index" label="商品编码" sortable width="100"></el-table-column>
      <el-table-column prop="shopName" label="商家名称" width="250"></el-table-column>
      <el-table-column prop="provider_id" label="渠道商" width="150"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" sortable width="250"></el-table-column>
      <el-table-column prop="ware_kind" label="商家信息" width="100">
        <template scope="scope">
            <el-button prop="information" size="small" @click.native="jumpTo(scope.row)">查看</el-button>
        </template>
      </el-table-column>
      <el-table-column prop="protocol" label="金服协议" width="100">
                <template scope="scope">
                    <el-button size="small" @click.native="jumpToServer(scope.row)">管理</el-button>
                </template>
            </el-table-column>

            <el-table-column prop="manage" label="管理" width="100">
                <template scope="scope">
                    <el-button size="small" @click.native="editBusiness(scope.row)">编辑</el-button>
                </template>
            </el-table-column>
            <el-table-column prop="addr" label="状态" width="100" fixed="right">
                <template scope="scope">
                    <el-switch
                            v-model="scope.row.status"
                            on-color="#13ce66"
                            off-color="#ff4949"
                            @change="changeStatus(scope.row)">
                    </el-switch>
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
import { getBusinessList } from '../../../api'
export default {
  data () {
    return {
      criteria: '',
      page: 1,
      currentPage: 1,
      pageSize: 10,
      recordsTotal: 0,
      loading: false,
      businessList: [],

    }
  },
  methods: {
    getBusinessList () {
      let self = this;
      this.$nprogress.start()
      this.loading = true
      let params = {
          pageNo: this.page,
          pageSize: this.pageSize,
          sessionId: localStorage.getItem('sessionId')
      }
      getBusinessList(params).then(res => {
        console.log(res)
        if(res.data.code === 0) {
          let result = res.data.result;
          this.businessList = result.data
        } else {
          self.$message({
            type: 'error',
            message: res.data.message
          })
        }
        
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
    changeStatus () {

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
    this.getBusinessList()
  },
  // computed: {
  //   ...mapGetters([
  //     'wareList'
  //   ]),
  //   businessList () {
  //     return this.wareList.filter(ware => ware.ware_name.indexOf(this.criteria) !== -1)
  //   }
  // }
}
</script>
