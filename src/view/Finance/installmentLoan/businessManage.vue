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
      <el-button type="primary" class="pull-right" @click="businessAdd">商户代注册</el-button>
    </el-row>
    <el-table :data="businessList" border v-loading="loading" style="width: 100%">
      <el-table-column type="index" label="商品编码" sortable width="100"></el-table-column>
      <el-table-column prop="shopName" label="商家名称" width="250"></el-table-column>
      <el-table-column prop="channelId" label="渠道商" width="150"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" sortable width="250"></el-table-column>
      <el-table-column label="商家信息" width="100">
          <template scope="scope">
            <el-button prop="information" size="small" @click.native="businessInfo(scope.row)">查看</el-button>
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
      <el-table-column prop="status" label="状态" width="100" fixed="right">
          <template scope="scope">
              <el-switch
                v-model="scope.row.status"
                on-color="#13ce66"
                off-color="#ff4949"
                on-text="启用"
                off-text="禁用"
                @change="changeStatus(scope.row)"
                >
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
        :total="recordsTotal"
        class="pull-right">
      </el-pagination>
    </el-row>
    <el-dialog title="商户代注册" v-model="addFormVisible" :close-on-click-modal="false">
      <el-form :model="addForm" label-width="120px" :rules="addFormRules" ref="addForm" style="padding: 30px">
          <el-form-item label="商家名称" prop="shopName">
              <el-input v-model="addForm.shopName" placeholder="请输入商家名称"></el-input>
          </el-form-item>
          <el-form-item label="账户名" prop="accountName">
              <el-input v-model="addForm.accountName" placeholder="请输入账户名"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
              <el-input type="password" v-model="addForm.password" placeholder="请输入密码"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="repassword">
              <el-input type="password" v-model="addForm.repassword" placeholder="请输入再次密码"></el-input>
          </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
          <el-button @click.native="addFormVisible = false">取消</el-button>
          <el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
      </div>
    </el-dialog>
  </section>
</template>
<script>
import { paginationYueShops, updateYueShopStatusById, operateYueShop } from '../../../api'
export default {
  data () {
    let validatePass2 = (rule, value, callback) => {
        if (value === '') {
            callback(new Error('请再次输入密码'))
        } else if (value !== this.addForm.password) {
            callback(new Error('两次输入密码不一致'))
        } else {
            callback()
        }
    }
    return {
      criteria: '',
      currentPage: 1,
      pageSize: 10,
      recordsTotal: 0,
      pageCount: 0,
      loading: false,
      businessList: [],
      addFormVisible: false,
      addForm: {
        shopName: '',
        accountName: '',
        password: '',
        repassword: ''
      },
      addLoading: false,
      addFormRules: {
        shopName: [
          {required: true, message: '请输入商家名称', trigger: 'blur'},
        ],
        accountName: [
          {required: true, message: '请输入账户名', trigger: 'blur'},
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur'}
        ],
        repassword: [
          {required: true, validator: validatePass2, trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    getBusinessList () {
      let self = this;
      this.$nprogress.start()
      this.loading = true
      let params = {
        pageNo: this.currentPage,
        pageSize: this.pageSize,
        sessionId: localStorage.getItem('sessionId')
      }
      paginationYueShops(params).then(res => {
        console.log(res)
        if(res.data.code === 0) {
          let result = res.data.result;
          this.recordsTotal = result.recordsTotal
          this.pageCount = result.pageCount
          this.businessList = result.data
          for (let i = 0; i < this.businessList.length; i++) {
            this.businessList[i].status = this.businessList[i].status === 0 ? true : false
          }
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
    businessAdd () {
      this.addFormVisible = true
      // this.$router.push('/provider/addWare')
    },
    addSubmit () {
      this.$refs.addForm.validate((valid) => {
        if(valid) {
          let data = {
            sessionId: localStorage.getItem('sessionId'),
            data: {
              operateType: 'ADD',
              accountVO: {
                tag: 'ACCOUNT',
                shopId: 0,
                id: 0,
                uuid: null,
                createUser: 0,
                createTime: null,
                updateUser: 0,
                updateTime: null,
                disabled: 0,
                orderBy: 0
              },
              shopBaseVO: {
                tag: 'BASE',
                shopName: this.addForm.shopName,
                accountName: this.addForm.accountName,
                accountPass: this.addForm.password,
                channelId: JSON.parse(localStorage.getItem('user')).channelId,
                status: 0,
                startDate: new Date(),
                registCapital: 0,
                id: 0,
                uuid: null,
                createUser: 0,
                createTime: null,
                updateUser: 0,
                updateTime: null,
                disabled: 0,
                orderBy: 0
              }
            }
          }
          console.log(data)
          operateYueShop(data).then(res => {
            console.log(res)
          })
        }
      })
      console.log(this.addForm)
    },
    handleSizeChange (val) {
      this.pageSize = val
      this.getBusinessList()
    },
    handleCurrentChange (val) {
      this.currentPage = val
      this.getBusinessList()
    },
    changeStatus (row) {
      console.log(row)
      // let status = row.status ? '禁用' : '启用'
      // this.$confirm('确定将'+row.shopName+'设为'+status+'?', '提示', {
      //   confirmButtonText: '确定',
      //   cancelButtonText: '取消',
      //   type: 'warning'
      // }).then(() => {

      // }).catch(() => {
      //   this.$message({
      //     type: 'info',
      //     message: '已取消操作'
      //   })
      // })
      let params = {
        id: row.id,
        status: row.status === true ? 0 : 1,
        sessionId: localStorage.getItem('sessionId')
      }
      updateYueShopStatusById(params).then(res => {
        console.log(res)
        if( res.data.code === 0) {
          this.$message({
            message: '修改成功'
          })
        } else {
          this.$message({
            message: res.data.message
          })
        }
      })
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
