<template>
  <section>
    <el-row class="panel panel-primary">
      <div class="panel-heading">
        <h3 class="panel-title">
          <span>品牌编辑</span>
          <a href="javascript:;" class="pull-right" @click="back">返回列表</a>
        </h3>
      </div>
      <div class="panel-body clearfix">
        <el-col :span="16" :offset="4">
          <el-form :model="brandForm" ref="brandForm" label-width="160px" v-loading="loading">
            <el-form-item label="品牌名称" prop="name">
              <el-input v-model="brandForm.brandName"></el-input>
            </el-form-item>
            <!-- <el-form-item label="当前LOGO" prop="name">
              <img :src="brandForm.logoUrl" style="width: 100%" alt="当前LOGO">
            </el-form-item> -->
            <el-form-item label="上传新LOGO" prop="name">
              <el-upload
                class="uploader"
                name="logo"
                ref="upload"
                accept="image/jpeg, image/png"
                action="http://localhost:3000/brand/provider/brandUpload"
                :show-file-list="false"
                :on-change="handleChange"
                :on-priview="handlePreview"
                :on-success="handleAvatarSuccess"
                :on-progress="uploadProgress"
                :before-upload="beforeAvatarUpload"
                :auto-upload="false">
                <img v-if="brandForm.logo_Url" :src="brandForm.logoUrl" class="avatar" title="选择LOGO">
                <i v-else class="el-icon-plus uploader-icon" v-loading="uploading"></i>
                <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
              </el-upload>
              <!-- <el-button size="small" type="info" style="width: 180px" @click="submitUpload">确定上传</el-button> -->
            </el-form-item>
            <el-form-item label="品牌描述" prop="name">
              <el-input type="textarea" v-model="brandForm.content"></el-input>
            </el-form-item>
            <el-form-item label="品牌专题页" prop="name">
              <el-input v-model="brandForm.content"></el-input>
            </el-form-item>
            <el-form-item label="状态">
              <el-switch on-text="启用" off-text="禁用" v-model="brandForm.status"></el-switch>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('brandForm')">确定</el-button>
              <el-button @click="back">取消</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </div>
    </el-row>
    <!-- <el-dialog title="添加品牌" v-model="dialogFormVisible">
      <el-form :model="brandForm" :rules="brandRules" ref="brandForm" label-width="120px" style="padding: 30px" v-loading="loading">
        <el-form-item label="品牌名称" prop="brand_name">
          <el-input v-model="brandForm.brand_name" placeholder="品牌名称"></el-input>
        </el-form-item>
        <el-form-item label="LOGO" prop="logo_url">
          <el-upload
            class="avatar-uploader"
            name="logo"
            accept="image/jpeg, image/png"
            action="http://localhost:3000/brand/provider/brandUpload"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :on-progress="uploadProgress"
            :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon" v-loading="uploading"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="品牌描述" prop="content">
          <el-input type="textarea" v-model="brandForm.content" placeholder="品牌描述"></el-input>
        </el-form-item>
        <el-form-item label="专题页" prop="brand_page">
          <el-input v-model="brandForm.brand_page" placeholder="可选"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="resetForm('brandForm')">取 消</el-button>
        <el-button type="primary" @click="submitForm('brandForm')">确 定</el-button>
      </div>
    </el-dialog> -->
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
      brandForm: {
        brandId: '',
        brandName: '',
        content: '',
        logoUrl: '',
        brandPage: '',
        status: true
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
    handleChange (file) {
      console.log("file")
      console.log(file)
    },
    uploadProgress () {
      this.uploading = true
    },
    handlePreview (file) {
      console.log(file)
      this.brandForm.logoUrl = URL.createObjectURL(file.raw)
    },
    handleAvatarSuccess (res, file) {
      this.uploading = false
      this.brandForm.logo_url = res.logo_url
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeAvatarUpload (file) {
      console.log('file')
      console.log(file)
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
    submitUpload () {
      this.$refs.upload.submit()
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
  .brand-logo {
    width: 100%;
  }
</style>
