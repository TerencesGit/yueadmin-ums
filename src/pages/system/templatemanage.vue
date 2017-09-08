<template>
	<section>
	  <div v-title :data-title="this.$route.name"></div>
    <el-row class="toolbar">
      <el-button type="primary" @click="handleAdd">新增模板</el-button>
    </el-row>
    <!-- 模板列表 -->
    <el-table 
      border 
      :data="templateList" 
      v-loading="loading" 
      highlight-current-row
      style="width: 100%">
      <el-table-column type="index" width="60"></el-table-column>
      <el-table-column prop="templateId" label="模板编号" sortable width="140"></el-table-column>
      <el-table-column prop="name" label="模板名称"></el-table-column>
      <el-table-column prop="templateFile" label="模板文件"></el-table-column>
      <el-table-column prop="note" label="模板描述"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" sortable width="180" :formatter="formatTime"></el-table-column>
      <el-table-column label="操作" width="240">
        <template scope="scope">
        	<el-button size="small" type="info" @click="handleEdit(scope.row)">查看</el-button>
          <el-button size="small" type="warning" @click="handleEdit(scope.row)">编辑</el-button>
         <!--  <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button> -->
        </template>
      </el-table-column>
    </el-table>
    <el-row class="toolbar">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNo"
        :page-size="pageSize"
        :page-sizes="[10, 20, 30, 40]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-row>
    <!-- 模板表单 -->
    <el-dialog :visible.sync="templateFormVisible" :title="templateFormTitle">
    	<el-row>
    		<el-col :span="18" :offset="3">
		    	<el-form :model="templateForm" ref="templateForm" :rules="rules" label-width="120px">
		    		<el-form-item label="模板名称" prop="name">
		    			<el-input v-model="templateForm.name" placeholder="模板名称"></el-input>
		    		</el-form-item>
		    		<el-form-item label="模板文件" prop="templateFile">
		    			<el-upload
							  class="file-uploader"
							  action="https://jsonplaceholder.typicode.com/posts/"
							  :on-change="handleChange"
							  :file-list="fileList">
							  <el-button size="small" type="primary">点击上传</el-button>
							  <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
							</el-upload>
		    		</el-form-item>
		    		<el-form-item label="模板描述" prop="note">
		    			<el-input type="textarea" v-model="templateForm.note" placeholder="模板描述"></el-input>
		    		</el-form-item>
		    	</el-form>
    		</el-col>
    	</el-row>
    	<div slot="footer">
    		<el-button @click="templateFormVisible = false">取消</el-button>
    		<el-button type="primary" @click="submitForm">确定</el-button>
    	</div>
    </el-dialog>
	</section>
</template>
<script>
	import { getContractTemplates } from '@/api'
	export default {
		data() {
			return {
				loading: false,
				pageNo: 1,
				pageSize: 10,
				total: 0,
				templateList: [],
				templateForm: {
					templateId: '',
					name: '',
					templateFile: '',
					tempalteFileType: '',
					note: ''
				},
				rules: {
					name: [
						{ required: true, message: '请输入模板名称', trigger: 'blur'}
					],
					note: [
						{ required: true, message: '请输入备注', trigger: 'blur'}
					]
				},
				templateFormTitle: '',
				templateFormVisible: false,
				fileList: [{
          name: 'food.jpeg',
          url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
          status: 'finished'
        }, {
          name: 'food2.jpeg',
          url: 'https://fuss10.elemecdn.com/3/63/4e7f3a15429bfda99bce42a18cdd1jpeg.jpeg?imageMogr2/thumbnail/360x360/format/webp/quality/100',
          // status: 'finished'
        }]
			}
		},
		methods: {
			formatTime() {
				return this.$moment(new Date()).format('YYYY-MM-DD')
			},
			handleSizeChange(val) {
				this.pageSize = val;
				this.getTemplateList()
			},
			handleCurrentChange(val) {
				this.pageNo = val;
				this.getTemplateList()
			},
			getTemplateList() {
				let params = {
					pageNo: this.pageNo,
					pageSize: this.pageSize
				}
				getContractTemplates(params).then(res => {
					console.log(res)
					if(res.data.code === '0001') {
						this.templateList = res.data.result.templateList;
						this.total = res.data.result.pageInfo.total;
					} else {
						this.$message.error(res.data.message)
					}
				}).catch(err => {
					console.log(err)
				})
			},
			handleChange(file, fileList) {
        this.fileList = fileList.slice(-3);
      },
			handleAdd() {
				this.templateFormVisible = true
			},
			handleEdit() {

			},
			submitForm() {

			},
			handleDetail() {

			}
		},
		mounted() {
			this.getTemplateList()
		}
	}
</script>