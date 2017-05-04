<template>
  <section>
    <el-row class="panel panel-primary">
      <div class="panel-heading clearfix">
        <span class="panel-title">添加商品</span>
        <back-button class="pull-right button-text"></back-button>
      </div>
      <div class="panel-body">
        <el-col :span="16" :offset="4">
          <el-form :model="wareForm" :rules="wareRules" ref="wareForm" label-width="160px" v-loading="loading">
            <el-form-item label="商品名称" prop="name">
              <el-input v-model="wareForm.name"></el-input>
            </el-form-item>
            <el-form-item label="供应商" prop="provider">
              <el-input v-model="wareForm.provider"></el-input>
            </el-form-item>
            <el-form-item label="商品类别" prop="kind">
              <el-input v-model="wareForm.kind"></el-input>
            </el-form-item>
            <el-form-item label="建议售价" prop="price">
              <el-input v-model="wareForm.price"></el-input>
            </el-form-item>
            <el-form-item label="行程天数" prop="days">
              <el-input v-model="wareForm.days"></el-input>
            </el-form-item>
            <el-form-item label="商品关键字" prop="keyWords">
              <el-input v-model="wareForm.keyWords"></el-input>
            </el-form-item>
            <el-form-item label="父商品" prop="parent">
              <el-input v-model="wareForm.parent"></el-input>
            </el-form-item>
            <el-form-item label="商品销售时间段" prop="date1">
              <el-date-picker v-model="wareForm.dateRange" type="datetimerange" class="form-control" placeholder="选择时间范围"></el-date-picker>
            </el-form-item>
            <el-form-item label="订单占位时长" prop="minute">
              <el-input v-model="wareForm.minute"></el-input>
            </el-form-item>
            <el-form-item label="城市代码" prop="city">
               <el-input v-model="wareForm.city"></el-input>
            </el-form-item>
            <el-form-item label="商品状态" prop="status">
               <el-radio-group v-model="wareForm.status">
                <el-radio label="上架"></el-radio>
                <el-radio label="下架"></el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="结算类型" prop="settle">
               <el-radio-group v-model="wareForm.settle">
                <el-radio label="自动结算"></el-radio>
                <el-radio label="手动结算"></el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="可售渠道" prop="channel">
              <el-radio-group v-model="wareForm.channel">
                <el-radio label="web渠道"></el-radio>
                <el-radio label="H5渠道"></el-radio>
                <el-radio label="app渠道"></el-radio>
                <el-radio label="其他渠道"></el-radio>
              </el-radio-group>
            </el-form-item>
            
            <el-form-item label="商品描述" prop="desc">
              <el-input type="textarea" v-model="wareForm.desc"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="submitForm('wareForm')">添加</el-button>
              <el-button @click="resetForm('wareForm')">重置</el-button>
            </el-form-item>
          </el-form>
        </el-col>
      </div>
    </el-row>
  </section>
</template>
<script>
import { addWare } from '../../api'
export default {
  data () {
    return {
      loading: false,
      wareForm: {
        name: '',
        provider: '',
        kind: '',
        price: '',
        days: '',
        keyWords: '',
        parent: '',
        dateRange: '',
        status: '',
        date1: '',
        city: '',
        settle: '',
        channel: '',
        minute: '',
        desc: ''
      },
      wareRules: {
        name: [
          { required: true, message: '请输入商品名', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        provider: [
          { required: true, message: '请输入供应商', trigger: 'blur' }
        ],
        kind: [
          { required: true, message: '请输入商品类别', trigger: 'blur' },
          { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
        ],
        price: [
          { required: true, message: '请输入建议售价', trigger: 'blur' }
        ],
        // days: [
        //   { required: true, message: '请输入行程天数', trigger: 'blur' }
        // ],
        // keyWords: [
        //   { required: true, message: '请输入商品关键字,不同关键字用,分隔开', trigger: 'blur' }
        // ],
        // parent: [
        //   { trigger: 'blur' }
        // ],
        // status: [
        //   { required: true, message: '请选择商品状态', trigger: 'change' }
        // ],
        // region: [
        //   { required: true, message: '请选择活动区域', trigger: 'change' }
        // ],
        // date1: [
        //   { type: 'date', required: true, message: '请选择日期', trigger: 'change' }
        // ],
        // city: [
        //   { required: true, message: '请选择时间', trigger: 'change' }
        // ],
        // settle: [
        //   { required: true, message: '请选择结算类型', trigger: 'change' }
        // ],
        // channel: [
        //   { required: true, message: '请选择可售渠道', trigger: 'change' }
        // ],
        // minute: [
        //   { required: true, message: '请选择无订金订单占位时长', trigger: 'blur' }
        // ],
        // desc: [
        //   { message: '请输入商品描述', trigger: 'blur' }
        // ]
      }
    }
  },
  methods: {
    submitForm (formName) {
      let _this = this
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.loading = true
          addWare(this.wareForm).then(res => {
            console.log(res.data)
            if (res.data.status === 2) {
              this.$message({
                type: 'success',
                message: '添加成功！'
              })
              this.resetForm('wareForm')
            }
          }).then(() => {
            this.loading = false
          })
        } else {
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    }
  }
}
</script>
