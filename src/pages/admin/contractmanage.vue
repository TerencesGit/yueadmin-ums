<template>
	<section>
		<div v-title :data-title="this.$route.name"></div>
		<el-row class="toolbar">
			<el-button type="primary" @click="handleAdd">新建合同</el-button>
		</el-row>
		<el-table 
      border 
      :data="contractList" 
      v-loading="loading" 
      highlight-current-row
      style="width: 100%">
      <el-table-column type="expand">
	      <template scope="scope">
	        <el-form label-position="left" inline class="table-expand">
	          <el-form-item label="合同编号">
	            <span>{{ scope.row.contractCode }}</span>
	          </el-form-item>
	          <el-form-item label="合同模板">
	          	<span>{{ scope.row.templateName }}</span>
	          </el-form-item>
	          <el-form-item label="合同甲方">
	            <span >{{ scope.row.partyAName }}</span>
	          </el-form-item>
	          <el-form-item label="合同乙方">
	            <span >{{ scope.row.partyBName }}</span>
	          </el-form-item>
	          <el-form-item label="签署时间">
	            <span >{{ scope.row.signTime }}</span>
	          </el-form-item>
	          <el-form-item label="合同文件">
	          	<el-tag type="gray" v-for="(item, index) in scope.row.attachFiles" :key="index">{{item.fileRawName}}</el-tag>
	          </el-form-item>
	          <el-form-item label="生效日期">
	            <span >{{ scope.row.effectiveDate }}</span>
	          </el-form-item>
	          <el-form-item label="失效日期">
	            <span >{{ scope.row.expireDate }}</span>
	          </el-form-item>
	          <!-- <el-form-item label="更新人">
	            <span >{{ scope.row.updateBy }}</span>
	          </el-form-item> -->
	          <el-form-item label="更新时间">
	            <span >{{ scope.row.updateTime | formatDateTime }}</span>
	          </el-form-item>
	          <el-form-item label="合同备注">
	            <span >{{ scope.row.note }}</span>
	          </el-form-item>
	        </el-form>
	      </template>
      </el-table-column>
      <el-table-column prop="contractCode" label="合同编号" sortable></el-table-column>
      <el-table-column prop="partyAName" label="合同甲方"></el-table-column>
      <el-table-column prop="partyBName" label="合同乙方"></el-table-column>
      <el-table-column prop="templateName" label="合同模板"></el-table-column>
      <el-table-column prop="signTime" label="签署时间" sortable></el-table-column>
      <el-table-column prop="updateTime" label="更新时间" sortable :formatter="formatTime" width="160"></el-table-column>
      <el-table-column label="操作">
        <template scope="scope">
        	<el-button size="small" type="warning" @click="handleEdit(scope.row)">编辑</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-row class="m-t">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNo"
        :page-size="pageSize"
        :page-sizes="[10, 20, 30, 40]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        class="pull-right">
      </el-pagination>
    </el-row>
    <!-- 合同表单 -->
    <el-dialog :visible.sync="contractFormVisible" :title="contractFormTitle">
    	<el-row>
    		<el-col :span="16" :offset="4">
		    	<el-form :model="contractForm" ref="contractForm" :rules="rules" label-width="100px">
		    		<el-form-item label="合同编号：" prop="contractCode">
		    			<el-input v-model.trim="contractForm.contractCode" placeholder="合同编号" style="width: 217px"></el-input>
		    		</el-form-item>
		    		<el-form-item label="合同甲方：">
		    			<span>{{ contractForm.partyAName }}</span>
		    		</el-form-item>
		    		<el-form-item label="合同乙方：" prop="partyB">
		    			<el-select v-model="contractForm.partyB">
		    				<el-option v-for="item in partnerList" :key="item.partnerId" :label="item.name" :value="item.partnerId"></el-option>
		    			</el-select>
		    		</el-form-item>
		    		<el-form-item label="合同模板：" prop="templateId">
		    			<el-select v-model="contractForm.templateId">
		    				<el-option v-for="item in templateList" :key="item.templateId" :label="item.name" :value="item.templateId"></el-option>
		    			</el-select>
		    		</el-form-item>
		    		<el-form-item label="签署时间：" prop="signTime">
		    			<el-date-picker
					      v-model="contractForm.signTime"
					      type="date"
					      :clearable="false"
					      placeholder="选择日期">
					    </el-date-picker>
		    		</el-form-item>
		    		<el-form-item label="生效日期：" prop="effectiveDate">
		    			<el-date-picker
					      v-model="contractForm.effectiveDate"
					      type="date"
					      :clearable="false"
					      placeholder="选择日期">
					    </el-date-picker>
		    		</el-form-item>
		    		<el-form-item label="失效日期：" prop="expireDate">
		    			<el-date-picker
					      v-model="contractForm.expireDate"
					      type="date"
					      :clearable="false"
					      placeholder="选择日期">
					    </el-date-picker>
		    		</el-form-item>
		    		<el-form-item label="合同附件：" prop="attachFiles">
		    			<el-upload
							  class="file-uploader"
							  name='uploadFile'
							  :action="uploadAction"
							  :data="{category: 'contract'}"
							  :on-error="handleError"
							  :on-success="handleSuccess"
							  :on-change="handleChange"
							  :on-remove="handleRemove"
							  :file-list="fileList">
							  <el-button size="small" type="primary" icon="upload">点击上传</el-button>
							</el-upload>
		    		</el-form-item>
		    		<el-form-item label="备注：" prop="note">
							<el-input v-model="contractForm.note" type="textarea" placeholder="请输入备注"></el-input>
		    		</el-form-item>
		    	</el-form>
    		</el-col>
    	</el-row>
    	<div slot="footer">
    		<el-button @click="contractFormVisible = false">取消</el-button>
    		<el-button type="primary" @click="contractFormSubmit">确定</el-button>
    	</div>
    </el-dialog>
	</section>
</template>
<script>
	// import { mapGetters } from 'vuex'
	import { getContracts, getPartners, getContractTemplates, createContract, updateContract } from '@/api'
	export default {
		data () {
			return {
				// uploadAction: '/uploadFileUrl',
				uploadAction: '/ums/baseInter/uploadFile.do',
				loading: false,
				pageNo: 1,
				pageSize: 10,
				total: 0,
				contractList: [],
				templateList: [],
				partnerList: [],
				fileList: [],
				contractForm: {},
				rules: {
					contractCode: [
						{ required: true, message: '请选择合同编号', trigger: 'blur'}
					],
					partyB: [
						{ required: true, type: 'number', message: '请选择合同乙方', trigger: 'blur'}
					],
					templateId: [
						{ required: true, type: 'number', message: '请选择合同模板', trigger: 'blur'}
					],
					signTime: [
						{ required: true, type: 'date', message: '请选择签署日期', trigger: 'blur'}
					],
					effectiveDate: [
						{ required: true, type: 'date', message: '请选择生效日期', trigger: 'blur'}
					],
					expireDate: [
						{ required: true, type: 'date', message: '请选择失效日期', trigger: 'blur'}
					],
					attachFiles: [
						{ required: true, type: 'array', message: '请选择合同附件', trigger: 'blur'}
					],
					note: [
						{ required: true, message: '请输入合同备注', trigger: 'blur'}
					],
				},
				contractFormTitle: '',
				contractFormVisible: false
			}
		},
		methods: {
			formatStatus(row) {
				return row.status === 1 ? '启用' : '禁用'
			},
			formatTime(row) {
				return this.$moment(row.updateTime).format('YYYY-MM-DD HH:mm')
			},
			handleSizeChange(val) {
				this.pageSize = val;
				this.getContractList()
			},	
			handleCurrentChange(val) {
				this.pageNo = val;
				this.getContractList()
			},
			getContractList() {
				let params = {
					pageNo: this.pageNo,
					pageSize: this.pageSize
				}
				this.loading = true
				getContracts(params).then(res => {
					if(res.data.code === '0001') {
						this.contractList = res.data.result.contracts;
						this.total = res.data.result.pageInfo.total;
					} else {
						this.$message.error(res.data.message)
					}
					this.loading = false
				}).catch(err => {
					console.log(err)
					this.loading = false
					this.$catchError(err)
				})
			},
			getTemplateList() {
				let params = {
					pageNo: 1,
					pageSize: 100
				}
				getContractTemplates(params).then(res => {
					if(res.data.code === '0001') {
						this.templateList = res.data.result.templateList;
					} else {
						this.$message.error(res.data.message)
					}
				}).catch(err => {
					console.log(err)
					this.$carchError(err)
				})
			},
			getPartnerList() {
				let params = {
					pageNo: 1,
					pageSize: 100
				}
				getPartners(params).then(res => {
					if(res.data.code === '0001') {
						this.partnerList = res.data.result.partners;
					} else {
						this.$message.error(res.data.message)
					}
				}).catch(err => {
					console.log(err)
				})
			},
			handleAdd() {
				this.partnerList.length === 0 && this.getPartnerList()
				this.templateList.length === 0 && this.getTemplateList()
				this.contractForm = {
					contractId: '',
					partyAName: '北京悦己视觉文化传媒有限公司',
					partyB: '',
					templateId: '',
					attachFiles: [],
					signTime: '',
					effectiveDate: '',
					expireDate: '',
					note: '',
				}
				this.fileList = []
				this.contractFormTitle = '新建合同'
				this.contractFormVisible = true
			},
			handleEdit(row) {
				this.partnerList.length === 0 && this.getPartnerList()
				this.templateList.length === 0 && this.getTemplateList()
				this.contractForm = {
					contractId: row.contractId,
					contractCode: row.contractCode,
					partyAName: row.partyAName,
					partyB: row.partyB,
					templateId: row.templateId,
					signTime: new Date(row.signTime),
					effectiveDate: new Date(row.effectiveDate),
					expireDate: new Date(row.expireDate),
					note: row.note,
				}
				this.contractForm.attachFiles = row.attachFiles.map(file => file.fileUuid)
				this.fileList = [];
				row.attachFiles.forEach((file, index) => {
					this.fileList.push({
						uid: file.fileUuid,
						name: file.fileRawName
					})
				})
				this.contractFormTitle = '编辑合同'
				this.contractFormVisible = true
			},
			handleError(err) {
				console.log(err)
				this.$message.error('上传失败，请稍后重试')
			},
			handleSuccess(res, file, fileList) {
				console.log(res)
				if(res.code === '0001') {
					this.contractForm.attachFiles.push(res.result.fileInfo.fileUuid);
					this.fileList = fileList;
				} else {
					this.$message.error(res.message)
				}
			},
			handleChange(file, fileList) {
				// console.log(fileList)
      },
      handleRemove(file, fileList) {
      	this.contractForm.attachFiles = [];
      	fileList.forEach(file => {
      		this.contractForm.attachFiles.push(file.uid)
      	})
      },
      contractFormSubmit() {
      	this.$refs.contractForm.validate(valid => {
      		if(!valid) return;
      		let data = Object.assign({}, this.contractForm)
      		data.signTime = this.$moment(data.signTime).format('YYYY-MM-DD')
      		data.effectiveDate = this.$moment(data.effectiveDate).format('YYYY-MM-DD')
      		data.expireDate = this.$moment(data.expireDate).format('YYYY-MM-DD')
      		console.log(data)
      		if(data.contractId) {
      			updateContract(data).then(res => {
      			  if(res.data.code === '0001') {
			      		this.$message.success(res.data.message)
			      		this.getContractList()
							} else {
								this.$message.error(res.data.message)
							}
						}).catch(err => {
							console.log(err)
							this.$catchError(err)
						})
      		} else {
	      		createContract(data).then(res => {
			      	if(res.data.code === '0001') {
			      		this.$message.success(res.data.message)
			      		this.getContractList()
							} else {
								this.$message.error(res.data.message)
							}
						}).catch(err => {
							console.log(err)
							this.$catchError(err)
						})
					}
					this.$refs.contractForm.resetFields()
					this.contractFormVisible = false
      	})
      }
		},
		mounted () {
			this.getContractList()
		}
	}
</script>