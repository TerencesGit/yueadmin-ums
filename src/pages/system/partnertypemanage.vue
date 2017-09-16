<template>
	<section>
		<div v-title :data-title="this.$route.name"></div>
    <el-row class="toolbar">
      <el-button type="primary" @click="handleAdd">新增商家类型</el-button>
    </el-row>
    <!-- 商家类型列表 -->
    <el-table 
      border 
      :data="typeList" 
      v-loading="loading" 
      highlight-current-row
      style="width: 100%">
      <el-table-column type="index" width="60"></el-table-column>
      <el-table-column prop="typeId" label="商家类型编号" sortable width="150"></el-table-column>
      <el-table-column prop="typeName" label="商家类型名称"></el-table-column>
      <el-table-column prop="note" label="商家类型描述"></el-table-column>
      <el-table-column label="更新时间" sortable width="180" :formatter="formatTime"></el-table-column>
      <el-table-column prop="status" label="状态">
      	<template scope="scope">
      		<el-switch
					  v-model="scope.row.status"
					  :on-value="1"
					  :off-value="0"
					  on-text="启用"
					  off-text="禁用"
					  @change="handleStatus(scope.row)">
					</el-switch>
      	</template>
      </el-table-column>
      <el-table-column label="操作" width="240">
        <template scope="scope">
        	<!-- <el-button size="small" type="info" @click="handleDetail(scope.row)">查看</el-button> -->
          <el-button size="small" type="warning" @click="handleEdit(scope.row)">编辑</el-button>
          <el-button size="small" type="info" @click="handleRoleSet(scope.row)">角色配置</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
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
    <!-- 商家类型表单 -->
    <el-dialog :visible.sync="typeFormVisible" :title="typeFormTitle">
    	<el-row>
    		<el-col :span="18" :offset="3">
		    	<el-form :model="typeForm" ref="typeForm" :rules="rules" label-width="120px">
		    		<el-form-item label="商家类型名称" prop="typeName">
		    			<el-input v-model="typeForm.typeName" placeholder="商家类型名称"></el-input>
		    		</el-form-item>
		    		<el-form-item label="商家类型描述" prop="note">
		    			<el-input type="textarea" v-model="typeForm.note" placeholder="商家类型描述"></el-input>
		    		</el-form-item>
		    	</el-form>
    		</el-col>
    	</el-row>
    	<div slot="footer">
    		<el-button @click="typeFormVisible = false">取消</el-button>
    		<el-button type="primary" @click="typeFormSubmit">确定</el-button>
    	</div>
    </el-dialog>
    <!-- 角色列表 -->
    <el-dialog title="角色列表" :visible.sync="roleListVisible">
      <el-row>
        <el-col :span="22" :offset="1">
          <el-table 
            border
            max-height="350"
            style="width: 100%"
            v-loading="roleLoading"
            ref="roleTable" 
            :data="roleList"
            @selection-change="handleSelectionChange">
            <el-table-column type="selection" width="50">
            </el-table-column>
            <el-table-column prop="roleName" label="角色名称" width="150"></el-table-column>
            <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <div slot="footer">
        <el-button @click="roleListVisible = false">取消</el-button>
        <el-button type="primary" @click="typeRoleSubmit">确定</el-button>
      </div>
    </el-dialog>
	</section>
</template>
<script>
	import { getPartnerTypes, updatePartnerTypeStatus, createPartnerType, updatePartnerType, getSysRoles, getRolesByPartType, updatePartnerTypeRole } from '@/api'
	export default {
		data() {
			return {
				loading: false,
				pageNo: 1,
				pageSize: 10,
				total: 0,
				typeList: [],
				typeForm: {
					typeId: '',
					typeName: '',
					note: ''
				},
				rules: {
					typeName: [
						{ required: true, message: '请输入商家类型名称', trigger: 'blur'}
					],
					note: [
						{ required: true, message: '请输入备注', trigger: 'blur'}
					],
				},
				selectedType: null,
				typeFormTitle: '',
				typeFormVisible: false,
				roleList: [],
				selectedRole: [],
				roleListVisible: false,
				roleLoading: false,
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
			getPartnerTypeList() {
				let params = {
					pageNo: this.pageNo,
					pageSize: this.pageSize
				}
				this.loading = true;
				getPartnerTypes(params).then(res => {
					this.loading = false
					if(res.data.code === '0001') {
						this.typeList = res.data.result.partnerTypes;
						this.total = res.data.result.pageInfo.total;
					} else {
						this.$message.error(res.data.message)
					}
				}).catch(err => {
					console.log(err)
					this.loading = false;
					this.$catchError(err)
				})
			},
			handleAdd(row) {
				this.typeForm = {
					typeName: '',
					note: ''
				}
				this.typeFormTitle = '新建商家类型'
				this.typeFormVisible = true
			},
			handleEdit(row) {
				this.typeForm = {
					typeId: row.typeId,
					typeName: row.typeName,
					note: row.note
				}
				this.typeFormTitle = '编辑商家类型'
				this.typeFormVisible = true
			},
			typeFormSubmit() {
				this.$refs.typeForm.validate(valid => {
					if(!valid) return;
					let data = Object.assign({}, this.typeForm)
					if(data.typeId) {
						updatePartnerType(data).then(res => {
							if(res.data.code === '0001') {
								this.$message.success(res.data.message)
								this.getPartnerTypeList()
							} else {
								this.$message.error(res.data.message)
							}
						}).catch(err => {
							console.log(err)
							this.$catchError(err)
						})
					} else {
						createPartnerType(data).then(res => {
							if(res.data.code === '0001') {
								this.$message.success(res.data.message)
								this.getPartnerTypeList()
							} else {
								this.$message.error(res.data.message)
							}
						}).catch(err => {
							console.log(err)
							this.$catchError(err)
						})
					}
					this.typeFormVisible = false
				})
			},
			// 获取角色列表
			getRoleList() {
				let params = {
					pageNo: 1,
					pageSize: 100
				}
				this.roleLoading = true;
				getSysRoles(params).then(res => {
					this.roleLoading = false;
					if(res.data.code === '0001') {
						this.roleList = res.data.result.roleList;
					} else {
						this.$message.error(res.data.message)
					}
				}).catch(err => {
					this.roleLoading = false;
					console.log(err)
				})
			},
			// 获取商家类型关联的角色列表
			getTypeRoles() {
				let params = {
					typeId: this.selectedType.typeId
				}
				getRolesByPartType(params).then(res => {
					if(res.data.code === '0001') {
						let typeRoles = res.data.result.roles;
						let selectedRows = [];
						typeRoles.forEach(typeRole => {
							this.roleList.filter(role => {
								if(role.roleId === typeRole.roleId) {
									selectedRows.push(role)
								}
							})
						})
						this.toggleSelection(selectedRows)
					} else {
						this.$message.error(res.data.message)
					}
				}).catch(err => {
					console.log(err)
					this.$catchError(err)
				})
			},
			toggleSelection(rows) {
				this.$refs.roleTable.clearSelection();
        if (rows.length > 0) {
          rows.forEach(row => {
            this.$refs.roleTable.toggleRowSelection(row, true)
          })
        }
      },
			handleSelectionChange(val) {
				this.selectedRole = val
			},
			handleRoleSet(row) {
				this.selectedType = row;
				this.roleList.length === 0 && this.getRoleList()
				this.getTypeRoles()
				this.roleListVisible = true
			},
			typeRoleSubmit() {
				let roleIds = this.selectedRole.map(role => role.roleId)
				let data = {
					typeId: this.selectedType.typeId,
					roleIdList: roleIds
				}
				updatePartnerTypeRole(data).then(res => {
					if(res.data.code === '0001') {
						this.$message.success(res.data.message)
					} else {
						this.$message.error(res.data.message)
					}
				}).catch(err => {
					console.log(err)
					this.$catchError(err)
				})
				this.roleListVisible = false
			},
			handleStatus(row) {
				let data = {
					typeId: row.typeId,
					status: row.status
				}
				console.log(data)
				updatePartnerTypeStatus(data).then(res => {
					if(res.data.code === '0001') {
						this.$message.success(res.data.message)
					} else {
						row.status = row.status === 0 ? 1 : 0;
						this.$message.error(res.data.message)
					}
				}).catch(err => {
					console.log(err)
					row.status = row.status === 0 ? 1 : 0;
					this.$catchError(err)
				})
			},
		},
		mounted() {
			this.getPartnerTypeList()
		}
	}
</script>