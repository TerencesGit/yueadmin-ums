<template>
	<section>
		<div v-title :data-title="this.$route.name"></div>
		<el-card class="card-primary">
			<div slot="header">
				组织部门管理
			</div>
			<el-row :gutter="15">
				<el-col :span="6" class="tree" v-loading="loading">
					<el-tree 
						:data="organizeTree" 
						:props="defaultProps"
						empty-text="暂无部门"
						highlight-current
						default-expand-all
						:expand-on-click-node="false"
						@node-click="handleNodeClick">
					</el-tree>
				</el-col>
				<el-col :span="18" v-if="organizeTree.length !== 0">
					<el-row class="button-group">
						<el-button size="small" type="success" @click="handleAdd">
							<i class="fa fa-plus-square"></i>
							新增
						</el-button>
						<el-button size="small" type="warning" @click="handleEdit">
							<i class="fa fa-edit"></i>
							编辑
						</el-button>
						<el-button size="small" type="danger" @click="handleDelete">
							<i class="el-icon-delete"></i>
							删除
						</el-button>
						<el-button size="small" type="primary" icon="setting" @click="handleAdd">
						权限
						</el-button>
						<el-button size="small" type="info" @click="handleAdd">
							<i class="fa fa-unlock"></i>
							启用 
						</el-button>
						<el-button plain size="small" type="danger" @click="handleAdd">
							<i class="fa fa-ban"></i>
							禁用 
						</el-button>
						<el-button size="small" type="success" @click="handleAdd">
							<i class="fa fa-user"></i>
							注册员工 
						</el-button>
					</el-row>
					<h3 class="page-header">
						员工列表
					</h3>
					<el-table
						border
			      :data="staffList"
			      highlight-current-row
			      v-loading="tableLoading" 
			      style="width: 100%">
			      <el-table-column type="index" width="60"></el-table-column>
			      <el-table-column prop="name" label="姓名" width="80"></el-table-column>
			      <el-table-column prop="mobile" label="手机号" width="130" :formatter="formatMobile"></el-table-column>
			      <el-table-column prop="createTime" label="注册时间" width="180" :formatter="formatTime"></el-table-column>
			      <el-table-column prop="address" label="籍贯"></el-table-column>
			      <el-table-column label="操作">
			      	<template scope="scope">
			      		<el-button type="primary" size="small">查看</el-button>
			      		<el-button type="danger" size="small">移除</el-button>
			      	</template>
			      </el-table-column>
			    </el-table>
			    <el-row class="toolbar">
			    	<el-pagination
				      @size-change="handleSizeChange"
				      @current-change="handleCurrentChange"
				      :current-page="currentPage"
				      :page-sizes="[5, 10, 15, 20]"
				      :page-size="pageSize"
				      layout="total, sizes, prev, pager, next, jumper"
				      :total="total">
				    </el-pagination>
			    </el-row>
				</el-col>
			</el-row>
		</el-card>
		<el-dialog :visible.sync="orgFormVisible" :title="orgFormTitle">
			<el-row>
				<el-col :span="18" :offset="3">
					<el-form :model="organizeForm" :rules="rules" ref="organizeForm" label-width="120px">
						<el-form-item label="部门名称" prop="name">
							<el-input v-model="organizeForm.name" placeholder="请输入部门名称"></el-input>
						</el-form-item>
						<el-form-item label="部门简介" prop="note">
							<el-input type="textarea" v-model="organizeForm.note" placeholder="请输入部门简介"></el-input>
						</el-form-item>
					</el-form>
				</el-col>
			</el-row>
			<div slot="footer">
				<el-button @click="orgFormVisible = false">取消</el-button>
				<el-button type="primary" @click="submitForm">确定</el-button>
			</div>
		</el-dialog>
	</section>
</template>
<script>
	import { readOrganizeTree, getUserList, saveOrganizeTree, deleteOrganize } from '@/api'
	export default {
		data() {
			return {
				organizeTree: [],
        defaultProps: {
          label: 'name',
          children: 'children',
        },
        staffList: [],
	      checkedNode: null,
	      orgFormVisible: false,
	      orgFormTitle: '',
	      organizeForm: {
	      	orgId: '',
	      	name: '',
	      	note: '',
	      	parentId: ''
	      },
	      loading: false,
	      tableLoading: false,
	      currentPage: 1,
	      pageSize: 10,
	      total: 0,
	      rules: {
	      	name: [
	      		{ required: true, message: '请输入部门名称', trigger: 'blur'}
	      	],
	      	note: [
	      		{ required: true, message: '请输入部门简介', trigger: 'blur'}
	      	],
	      },
	      submitType: 0
			}
		},
		methods: {
			formatMobile(row) {
				return row.mobile.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
			},
			formatTime(row) {
				return this.$moment(row.createTime).format('YYYY-MM-DD ')
			},
			handleSizeChange(val) {
				this.pageSize = val
			},
			handleCurrentChange(val) {
				this.currentPage = val
			},
			// 获取组织部门树
			getOrganizeTree() {
				this.loading = true
				readOrganizeTree().then(res => {
					console.log(res)
					if(res.data.code === '0001') {
						this.organizeTree = res.data.result.organizeTree
					} else {
						this.$message(res.data.message)
					}
					this.loading = false
				}).catch(err => {
					this.loading = false
					console.log(err)
				})
			},
			// 获取部门员工
			getStaffList() {
				this.tableLoading = true
				getUserList().then(res => {
					this.tableLoading = false
					console.log(res)
					if(res.data.code === '0001') {
						this.staffList = res.data.result.userList;
						this.total = res.data.result.userList.length;
					} else {
						this.$message.error(res.data.message)
					}
				}).catch(err => {
					this.tableLoading = false
					console.log(err)
				})
			},
			handleNodeClick(data) {
        if(!data.parentId) return;
        if(this.checkedNode && this.checkedNode.orgId === data.orgId) return;
        this.checkedNode = data;
        console.log(this.checkedNode);
        this.getStaffList()
      },
      // 新增部门
      handleAdd() {
      	if (!this.checkedNode) {
      		return this.$notify.warning({title: '提示', message: '请选择部门'})
      	}
      	console.log(this.checkedNode)
      	this.submitType = 0
      	this.orgFormTitle = '新增部门'
      	this.organizeForm = {
      		orgId: '',
      		name: '',
      		note: '',
      		parentId: this.checkedNode.orgId
      	}
      	this.orgFormVisible = true
      },
      // 编辑部门
      handleEdit() {
      	if (!this.checkedNode) {
      		return this.$notify.warning({title: '提示', message: '请选择部门'})
      	}
      	this.organizeForm = {
      		orgId: this.checkedNode.orgId,
      		name: this.checkedNode.name,
      		note: this.checkedNode.note
      	}
      	this.submitType = 1
      	this.orgFormTitle = '编辑部门'
      	this.orgFormVisible = true
      },
      // 提交表单
      submitForm() {
      	this.$refs.organizeForm.validate(valid => {
      		if(valid) {
      			let data = Object.assign({}, this.organizeForm)
      			// if(this.submitType === 0) {
      			// 	console.log(data)

      			// } else if (this.submitType === 1) {
      			// 	console.log(data)
      			// }
      			saveOrganizeTree(data).then(res => {
      				console.log(res)
      				if(res.data.code === '0001') {
      					this.$message.success(res.data.message)
      					this.getOrganizeTree()
      				} else {
      					this.$message.error(res.data.message)
      				}
      			}).catch(err => {
      				console.log(err)
      			})
      			this.orgFormVisible = false
      		} else {
      			console.log('err submit')
      		}
      	})
      },
      // 删除部门
      handleDelete() {
      	if (!this.checkedNode) {
      		return this.$notify.warning({title: '提示', message: '请选择部门'})
      	}
      	this.$confirm(`确定删除${this.checkedNode.name}？`, '提示', {type: 'warning'}).then(() => {
      		let data = {
	      		orgId: this.checkedNode.orgId
	      	}
	      	deleteOrganize(data).then(res => {
	      		if(res.data.code === '0001') {
	  					this.$message.success(res.data.message)
	  					this.getOrganizeTree()
	  				} else {
	  					this.$message.error(res.data.message)
	  				}
	      	}).catch(err => {
	      		console.log(err)
	      	})
      	}).catch(err => {
      		console.log(err)
      		this.$message('已取消操作')
      	})
      }
		},
		mounted () {
			this.getOrganizeTree()
		}
	}
</script>
<style scoped lang="scss">
	.el-card {
		min-height: 500px
	}
	.el-tree {
		min-height: 400px;
		max-height: 600px;
		overflow-y: auto;
		&::-webkit-scrollbar {
      width: 4px;
      border-radius: 5px;
      background: #bbb
    }
	}
	.button-group {
		padding: 10px 20px;
		margin-bottom: 20px;
		box-shadow: 1px 1px 1px 1px #ddd;
		background: #fff;
	}
</style>