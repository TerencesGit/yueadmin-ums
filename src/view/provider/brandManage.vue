<template>
  <section>
    <el-row>
      <el-col>
        <el-button type="primary" class="pull-right" @click="beforeBrandAdd">添加品牌</el-button>
      </el-col>
    </el-row>
    <el-row :gutter="20" v-loading="loading">
      <el-col :xs="12" :sm="8" :md="8" :lg="6" v-for="(item, index) in brandList" :key="item.id">
        <transition name="el-fade-in-linear">
          <el-card :body-style="{ padding: '5px' }">
            <img :src="item.logoUrl" class="image" @click="handleBrandDetail(item._id)">
            <div style="padding: 14px;">
              <span>{{ item.brandName }}</span>
              <div class="bottom clearfix">
                <time class="time">{{ item.updateTime | DateFormat }}</time>
                <div style="float: right;">
                  <el-button :plain="true" type="warning" size="small" @click="handleBrandEdit(item)">编辑</el-button>
                  <el-button :plain="true" type="danger" size="small" @click="handleBrandDel(item.brandId)">删除</el-button>
                </div>
              </div>
            </div>
          </el-card>
        </transition>
      </el-col>
    </el-row>
    <el-dialog :title="formTitle" v-model="dialogFormVisible">
      <el-form :model="brandForm" :rules="brandRules" ref="brandForm" label-width="120px" style="padding: 30px" v-loading="loading">
        <el-form-item label="品牌名称" prop="brandName">
          <el-input v-model="brandForm.brandName" placeholder="品牌名称"></el-input>
        </el-form-item>
        <el-form-item label="LOGO" prop="logoUrl">
          <el-upload
            class="uploader"
            name="brandLogo"
            accept="image/jpeg, image/png"
            action="http://localhost:3000/brand/provider/brandUpload"
            :show-file-list="false"
            :on-success="handleSuccess"
            :on-progress="uploadProgress"
            :before-upload="beforeUpload"
            :auto-upload="true">
            <img v-if="brandForm.logoUrl" :src="brandForm.logoUrl" class="logo">
            <i v-else class="el-icon-plus uploader-icon" v-loading="uploading"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="品牌描述" prop="content">
          <el-input type="textarea" v-model="brandForm.content" placeholder="品牌描述"></el-input>
        </el-form-item>
        <el-form-item label="品牌专题页" prop="brandPage">
          <el-input v-model="brandForm.brandPage" placeholder="URL地址"></el-input>
        </el-form-item>
        <el-form-item label="状态">
          <el-switch v-model="brandForm.status" on-text="启用" off-text="禁用" on-value="1" off-value="0"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleCancel('brandForm')">取 消</el-button>
        <el-button type="primary" @click="submitForm('brandForm')">确 定</el-button>
      </div>
    </el-dialog>
  </section>
</template>
<script>
import { brandList, brandSave, brandDel } from '../../api'
export default {
  data() {
    return {
      dialogFormVisible: false,
      loading: false,
      uploading: false,
      brandList: [],
      formTitle: '',
      brandForm: {
        brandId: '',
        brandName: '',
        content: '',
        logoUrl: '',
        brandPage: '',
        status: '1'
      },
      brandRules: {
        brandName: [
          {required: true, message: '请输入品牌名称', trigger: 'blur'},
          {min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur'}
        ],
        content: [
          {required: true, message: '请输入品牌名称', trigger: 'blur'},
          {min: 2, message: '描述不少于 20 个字符', trigger: 'blur'}
        ],
        logoUrl: [
          {required: true, message: '请上传品牌LOGO', trigger: 'blur'}
        ]
      }
    }
  },
  methods: {
    loadBrandList () {
      this.loading = true
      brandList().then(res => {
        this.brandList = res.data.brands
      }).then(() => {
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    beforeBrandAdd () {
      this.formTitle = '添加品牌'
      this.brandForm = {
        brandId: '',
        brandName: '',
        content: '',
        logoUrl: '',
        brandPage: '',
        status: '1'
      }
      this.dialogFormVisible = true
    },
    beforeUpload (file) {
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
    uploadProgress () {
      this.uploading = true
    },
    handleSuccess (res, file) {
      this.uploading = false
      this.brandForm.logoUrl = res.logoUrl
      // this.imageUrl = URL.createObjectURL(file.raw)
    },
    submitForm (formName) {
      this.$refs[formName].validate((valid) => {
        if(valid) {
          this.loading = true
          brandSave(this.brandForm).then(res => {
            console.log(res.data)
            if(res.data.status === 1) {
              this.$message({
                type: 'success',
                message: res.data.message
              })
              this.loadBrandList()
            }else {
              this.$message({
                type: 'error',
                message: res.data.message
              })
            }
          })
          this.loading = false
          this.dialogFormVisible = false
        }
      })
    },
    handleCancel () {
      this.dialogFormVisible = false
      this.$message({
        type: 'info',
        message: '已取消操作'
      })
    },
    handleBrandEdit (brand) {
      this.formTitle = '品牌编辑'
      this.brandForm = brand
      this.dialogFormVisible = true
    },
    handleBrandDel (brandId) {
      this.$confirm('此操作将删除该品牌, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).then(() => {
        brandDel({id: brandId}).then(res => {
          if(res.data.status === 1) {
            this.loadBrandList()
            this.$message({
              type: 'success',
              message: res.data.message
            })
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消操作'
        })
      })
    },
    handleBrandDetail (brandId) {
      this.$router.push({
        path: '/provider/brandDetail?id=' + brandId
      })
    }
  },
  mounted () {
    this.loadBrandList()
  }
}
</script>
<style scoped>
  .image {
    display: block;
    width: 100%;
    height: 225px;
    cursor: pointer;
  }
  .time {
    font-size: 13px;
    color: #999;
  }
  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }
  .el-card {
    margin: 15px 0;
    transition: all .3s
  }
  .el-card:hover {
    transform: scaleX(1.03) scaleY(1.03);
  }
  .logo {
    display: block;
    width: 178px;
    height: 178px;
  }
</style>
