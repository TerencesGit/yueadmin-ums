<template>
  <section>
    <el-row>
      <el-col :span="20" :offset="2">
        <el-button type="primary" class="pull-right" @click="dialogFormVisible = true">添加品牌</el-button>
        <el-button class="pull-right m-r">批量操作</el-button>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="6" v-for="(item, index) in brandList" :offset="index % 3 === 0 ? 2 : 1" v-loading="loading">
        <transition name="fade" mode="out-in">
          <el-card :body-style="{ padding: '5px' }">
            <img :src="item.logo_url" class="image">
            <div style="padding: 14px;">
              <span>{{ item.brand_name }}</span>
              <div class="bottom clearfix">
                <time class="time">{{item.meta.createAt | format}}</time>

                <el-button type="default" size="small" class="button" @click="handleBrandDel(item._id)">删除</el-button>
              </div>
            </div>
          </el-card>
        </transition>
      </el-col>
    </el-row>
    <el-dialog title="添加品牌" v-model="dialogFormVisible">
      <el-form :model="brandForm" :rules="brandRules" ref="brandForm" label-width="120px" style="padding: 30px" v-loading="loading">
        <el-form-item label="品牌名称" prop="brand_name">
          <el-input v-model="brandForm.brand_name" placeholder="品牌名称"></el-input>
        </el-form-item>
        <el-form-item label="LOGO" prop="logo_url">
          <el-upload
            class="avatar-uploader"
            name="logo"
            accept="image/jpeg, image/png"
            action="http://localhost:3000/user/upload"
            :show-file-list="false"
            :on-success="handleLogoSuccess"
            :on-progress="uploadProgress"
            :before-upload="beforeLogoUpload">
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
    </el-dialog>
  </section>
</template>
<script>
import { brandList, brandAdd, brandDel } from '../../api'
export default {
  data() {
    return {
      dialogFormVisible: false,
      imageUrl: false,
      loading: false,
      uploading: false,
      brandList: [],
      brandForm: {
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
      },
      currentDate: this.$moment(new Date()).format('YYYY-MM-DD')
    }
  },
  methods: {
    uploadProgress () {
      this.uploading = true
    },
    handleLogoSuccess (res, file) {
      this.uploading = false
      this.brandForm.logo_url = res.logo_url
      this.imageUrl = URL.createObjectURL(file.raw)
    },
    beforeLogoUpload (file) {
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
      brandList().then(res => {
        this.brandList = res.data.brands
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
    }
  },
  created () {
    this.loadBrands()
  }
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
  }

  .el-card {
    margin-bottom: 30px;
    cursor: pointer;
    transition: all .3s
  }
  .el-card:hover {
    transform: scaleX(1.03) scaleY(1.03);
  }
</style>
