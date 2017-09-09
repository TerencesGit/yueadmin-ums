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
      <el-table-column type="expand">
	      <template scope="scope">
	        <el-form label-position="left" inline class="table-expand">
	          <el-form-item label="模板编号">
	            <span>{{ scope.row.templateId }}</span>
	          </el-form-item>
	          <el-form-item label="模板文件">
	          	<el-tag type="gray" v-for="(item, index) in scope.row.templateFile" :key="index">{{item}}</el-tag>
	          </el-form-item>
	          <el-form-item label="模板名称">
	            <span >{{ scope.row.name }}</span>
	          </el-form-item>
	          <el-form-item label="更新人">
	            <span >{{ userInfo.name }}</span>
	          </el-form-item>
	          <el-form-item label="模板描述">
	            <span >{{ scope.row.note }}</span>
	          </el-form-item>
	          <el-form-item label="更新时间">
	            <span >{{ scope.row.updateTime | formatDate }}</span>
	          </el-form-item>
	        </el-form>
	      </template>
      </el-table-column>
      <el-table-column prop="templateId" label="模板编号" sortable width="140"></el-table-column>
      <el-table-column prop="name" label="模板名称"></el-table-column>
      <el-table-column prop="templateFile" label="模板文件" class-name="file-cell">
      	<template scope="scope">
      		<el-tag type="gray" v-for="(item, index) in scope.row.templateFile" :key="index">{{item}}</el-tag>
      	</template>
      </el-table-column>
      <el-table-column prop="createTime" label="更新时间" sortable width="160" :formatter="formatTime"></el-table-column>
      <el-table-column label="操作" width="180">
        <template scope="scope">
        	<!-- <el-button size="small" type="info" @click="handleDetail(scope.row)">查看</el-button> -->
          <el-button size="small" type="warning" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
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
							  :on-remove="handleRemove"
							  :file-list="fileList">
							  <el-button size="small" type="primary" icon="upload">点击上传</el-button>
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
    <!-- 模板详情 -->
    <el-dialog :visible.sync="templateInfoVisible" title="模板信息">
			<el-row>
    		<el-col :span="14" :offset="5">
		    	<el-form label-width="180px">
		    		<el-form-item label="模板名称：">
		    			<span>{{templateForm.name}}</span>
		    		</el-form-item>
		    		<el-form-item label="模板文件：">
		    			<span>{{templateForm.templateFile}}</span>
		    		</el-form-item>
		    		<el-form-item label="模板描述：">
		    			<span>{{templateForm.note}}</span>
		    		</el-form-item>
		    		<el-form-item label="更新人：">
		    			<span>{{userInfo.name}}</span>
		    		</el-form-item>
		    		<el-form-item label="更新时间：">
		    			<span>{{templateForm.createTime | formatDate}}</span>
		    		</el-form-item>
		    	</el-form>
		    </el-col>
		  </el-row>
		  <div slot="footer">
    		<el-button @click="templateInfoVisible = false">取消</el-button>
    		<el-button type="primary" @click="templateInfoVisible = false">确定</el-button>
    	</div>
    </el-dialog>
	</section>
</template>
<script>
	import { mapGetters } from 'vuex'
	import { getContractTemplates, createTemplate, updateTemplate, delTemplate } from '@/api'
	export default {
		data() {
			return {
				loading: false,
				pageNo: 1,
				pageSize: 10,
				total: 0,
				templateList: [],
				templateForm: {},
				rules: {
					name: [
						{ required: true, message: '请输入模板名称', trigger: 'blur'}
					],
					note: [
						{ required: true, message: '请输入备注', trigger: 'blur'}
					],
					templateFile: [
						{ required: true, type: 'array', message: '请选择模板文件', trigger: 'blur'}
					],
				},
				fileList: [],
				templateFormTitle: '',
				templateFormVisible: false,
				templateInfoVisible: false,
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
				this.loading = true;
				getContractTemplates(params).then(res => {
					this.loading = false;
					if(res.data.code === '0001') {
						this.templateList = res.data.result.templateList;
						this.total = res.data.result.pageInfo.total;
					} else {
						this.$message.error(res.data.message)
					}
				}).catch(err => {
					this.loading = false;
					console.log(err)
					this.$carchError(err)
				})
			},
			handleChange(file, fileList) {
				this.templateForm.templateFile = fileList.map(file => file.name);
        this.fileList = fileList;
        // fileList.slice(-1);
      },
      handleRemove(file, fileList) {
      	this.templateForm.templateFile = fileList.map(file => file.name)
      },
			handleAdd() {
				this.templateForm = {
					name: '',
					note: '',
					templateFile: '',
				}
				this.fileList = [];
				this.templateFormTitle = '新建模板';
				this.templateFormVisible = true
			},
			handleEdit(row) {
				this.templateForm = {
					templateId: row.templateId,
					templateFile: row.templateFile,
					name: row.name,
					note: row.note,
				}
				this.fileList = []
				row.templateFile.forEach((file, index) => {
					this.fileList.push({
						uid: index,
						name: file
					})
				})
				this.templateFormTitle = '编辑模板';
				this.templateFormVisible = true
			},
			submitForm() {
				this.$refs.templateForm.validate(valid => {
					if(!valid) return;
					let data = Object.assign({}, this.templateForm)
					// console.log(data)
					if(data.templateId) {
						updateTemplate(data).then(res => {
							if(res.data.code === '0001') {
								this.$message.success(res.data.message)
								this.getTemplateList()
							} else {
								this.$message.error(res.data.message)
							}
						}).catch(err => {
							console.log(err)
							this.$catchError(err)
						})
					} else {
						createTemplate(data).then(res => {
							if(res.data.code === '0001') {
								this.$message.success(res.data.message)
								this.getTemplateList()
							} else {
								this.$message.error(res.data.message)
							}
						}).catch(err => {
							console.log(err)
							this.$catchError(err)
						})
					}
					this.templateFormVisible = false
				})
			},
			handleDetail(row) {
				this.templateForm = {
					name: row.name,
					templateFile: row.templateFile,
					note: row.note
				}
				this.templateInfoVisible = true
			},
			handleDelete(row) {
				this.$confirm(`确定删除${row.name}？`, '提示', {type: 'warning'}).then(() => {
					let data = {
						templateId: row.templateId
					}
					delTemplate(data).then(res => {
						if(res.data.code === '0001') {
							this.$message.success(res.data.message)
							this.getTemplateList()
						} else {
							this.$message.error(res.data.message)
						}
					}).catch(err => {
						console.log(err)
						this.$catchError(err)
					})
				}).catch(err => {
					console.log(err)
					this.$message('已取消操作')
				})
			}
		},
		computed: {
			...mapGetters([
	  		'userInfo'
	  	])
		},
		mounted() {
			this.getTemplateList()
		}
	}
</script>