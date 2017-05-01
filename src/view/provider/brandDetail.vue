<template>
  <section>
    <el-row class="panel panel-primary">
      <div class="panel-heading">
        <h3 class="panel-title">
          <span>品牌详情</span>
          <a href="javascript:;" class="pull-right" @click="back">返回列表</a>
          <a href="javascript:;" class="pull-right m-r" @click="handleBrandEdit(brandForm._id)">编辑</a>
        </h3>
      </div>
      <div class="panel-body clearfix">
        <el-col :span="16" :offset="4">
          <el-form :model="brandForm" ref="brandForm" label-width="160px" v-loading="loading">
            <el-form-item label="品牌名称" prop="name">
              <el-input v-model="brandForm.brand_name"></el-input>
            </el-form-item>
            <el-form-item label="品牌LOGO" prop="name">
              <img :src="brandForm.logo_url" style="width: 100%" alt="品牌LOGO">
            </el-form-item>
            <el-form-item label="品牌描述" prop="name">
              <el-input type="textarea" v-model="brandForm.content"></el-input>
            </el-form-item>
          </el-form>
        </el-col>
      </div>
    </el-row>
  </section>
</template>
<script>
import { brandDetail } from '../../api'
export default {
  data() {
    return {
      dialogFormVisible: false,
      imageUrl: false,
      loading: false,
      uploading: false,
      // brandList: [],
      brandForm: {
        _id: '',
        brand_name: '',
        content: '',
        logo_url: '',
        brand_page: ''
      },
      brandRules: {
        brand_name: [
          {required: true, message: '请输入品牌名称', trigger: 'blur'},
          {min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur'}
        ],
        content: [
          {required: true, message: '请输入品牌名称', trigger: 'blur'},
          {min: 2, message: '描述不少于 20 个字符', trigger: 'blur'}
        ],
        logo_url: [
          {required: true, message: '请选择品牌LOGO', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    uploadProgress () {
      this.uploading = true
    },
    handleAvatarSuccess (res, file) {
      this.uploading = false
      this.brandForm.logo_url = res.logo_url
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload (file) {
      const isJPG = file.type === 'image/jpeg' || 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isJPG) {
        this.$message.error('品牌LOGO只能是 JPG 或 PNG 格式!');
      }
      if (!isLt2M) {
        this.$message.error('品牌LOGO大小不能超过 2MB!');
      }
      return isJPG && isLt2M;
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if(valid) {
          this.loading = true
          brandAdd(this.brandForm).then(res => {
            if(res.data.status === 2) {
              this.$message({
                type: 'success',
                message: '添加成功！'
              })
            }
          }).then(() => {
            this.loading = false
            this.resetForm('brandForm')
            this.loadBrands()
          }).catch(() => {
            this.loading = false
            this.$message({
              type: 'success',
              message: '添加失败！'
            })
          })
          console.log(this.brandForm)
        }
      })
    },
    resetForm (formName) {
      this.imageUrl = false
      this.$refs[formName].resetFields()
      this.dialogFormVisible = false
    },
    loadBrands () {
      this.$nprogress.start()
      // this.loading = true
      brandList().then(res => {
        this.$store.dispatch('setBrandList', res.data.brands)
        // this.brandList = res.data.brands
      }).then(() => {
        this.loading = false
        this.$nprogress.done()
      })
    },
    handleBrandDel (id) {
      this.$confirm('此操作将删除该品牌, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
        brandDel({id: id}).then(res => {
          if(res.data.status === 2) {
            this.loadBrands()
            this.$message({
              type: 'success',
              message: '删除成功'
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    },
    getBrand () {
      let id = this.$route.query.id
      // this.loading = true
      brandDetail({id: id}).then(res => {
        if(res.data.status === 2) {
          this.brandForm = res.data.brand
        }
      })
    },
    handleBrandEdit (id) {
      this.$router.push({
        path: '/provider/brandEdit?id=' + id
      })
    },
    back () {
      this.$router.back()
    }
  },
  mounted () {
    this.getBrand()
  },
}
</script>
<style scoped>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #20a0ff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
  .time {
    font-size: 13px;
    color: #999;
  }
  
  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    /*padding: 0;*/
    float: right;
  }

  .image {
    display: block;
    width: 100%;
    height: 225px;
    cursor: pointer;
  }

  .el-card {
    margin-bottom: 30px;
    transition: all .3s
  }
  .el-card:hover {
    transform: scaleX(1.03) scaleY(1.03);
  }
  .router-fade-enter-active, .router-fade-leave-active {
    transition: opacity .3s;
  }
  .router-fade-enter, .router-fade-leave-active {
    /*transform: translateX(30px);*/
    opacity: 0;
  }

</style>
