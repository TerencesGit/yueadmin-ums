<template>
	<section>
		<div v-title :data-title="this.$route.name"></div>
		<el-card class="card-primary">
			<div slot="header">
				组织部门管理
			</div>
			<el-row :gutter="15">
				<el-col :span="5" class="org-tree" v-loading="loading">
					<ul id="organizeTree" class="ztree"></ul>
				</el-col>
				<el-col :span="19">
					<!-- 工具栏 -->
					<el-row class="button-group">
						<el-button size="small" type="success" @click="handleAdd">
							<i class="fa fa-plus-square"></i>
							新增
						</el-button>
						<el-button size="small" type="warning" @click="handleEdit">
							<i class="fa fa-edit"> </i>
							编辑
						</el-button>
						<el-button size="small" type="danger" @click="handleDelete">
							<i class="el-icon-delete"></i>
							删除
						</el-button>
						<el-button size="small" type="primary" icon="setting" @click="handleFunc">
							权限
						</el-button>
						<el-button size="small" type="info" :disabled="disabled" @click="handleStatus">
							<i class="fa fa-unlock"></i>
							启用 
						</el-button>
						<el-button plain size="small" type="danger" :disabled="!disabled" @click="handleStatus">
							<i class="fa fa-ban"></i>
							禁用 
						</el-button>
						<el-button size="small" type="success" @click="handleRegister">
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
			      <el-table-column prop="realname" label="姓名" width="120"></el-table-column>
			      <el-table-column prop="email" label="邮箱" width="180"></el-table-column>
			      <el-table-column prop="createTime" label="注册时间" width="120"></el-table-column>
			      <el-table-column prop="orgName" label="部门" :formatter="formatOrg"></el-table-column>
			      <el-table-column prop="titleName" label="职位" :formatter="formatTitle"></el-table-column>
			      <el-table-column label="操作" width="200" fixed="right">
			      	<template scope="scope">
			      		<el-button type="primary" size="small" @click="handleShow(scope.row)" class="m-r">查看</el-button>
			      		<el-dropdown 
				      		split-button 
				      		type="info" 
				      		size="small" 
				      		trigger="click">
								  更多操作
								  <el-dropdown-menu slot="dropdown" class="staff-dropdown-menu">
								    <el-dropdown-item>
								    	<span @click="handleSetOrg(scope.row)">设置部门</span>
								    </el-dropdown-item>
								    <el-dropdown-item>
								    	<span @click="handleSetTitle(scope.row)">设置职位</span>
								    </el-dropdown-item>
								    <el-dropdown-item>
								    	<span v-if="scope.row.status === 1" @click="handleSetStatus(scope.row)">禁用</span>
								    	<span v-else @click="handleSetStatus(scope.row)">启用</span>
								    </el-dropdown-item>
								    <el-dropdown-item>
								    	<span @click="handleRemove(scope.row)">删除</span>
								    </el-dropdown-item>
								  </el-dropdown-menu>
								</el-dropdown>
			      	</template>
			      </el-table-column>
			    </el-table>
			    <!-- 分页 -->
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
		<!-- 部门表单 -->
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
		<!-- 权限设置 -->
		<el-dialog :visible.sync="funcListVisible" title="权限设置">
			<div slot="footer">
				<el-button @click="funcListVisible = false">取消</el-button>
				<el-button type="primary" @click="funcListVisible = false">确定</el-button>
			</div>
		</el-dialog>
		<!-- 注册员工 -->
		<el-dialog :visible.sync="registFormVisible" title="注册员工">
			<div slot="footer">
				<el-button @click="registFormVisible = false">取消</el-button>
				<el-button type="primary" @click="registFormVisible = false">确定</el-button>
			</div>
		</el-dialog>
		<!-- 员工信息 -->
		<el-dialog :visible.sync="staffInfoVisible" title="员工信息">
			<el-row>
				<el-col :span="18" :offset="3">
					<el-form :model="staffInfo" label-width="180px">
						<el-form-item label="">
							<img v-if="staffInfo.avatar" :src="staffInfo.avatar" alt="头像" class="avatar">
							<img v-else src="../../assets/img/avatar.gif" alt="头像" class="avatar">
						</el-form-item>
						<el-form-item label="姓名：">
							<span>{{staffInfo.realname}}</span>
						</el-form-item>
						<el-form-item label="邮箱：">
							<span>{{staffInfo.email}}</span>
						</el-form-item>
						<el-form-item label="手机号：">
							<span>{{staffInfo.mobile || '暂无'}}</span>
						</el-form-item>
						<el-form-item label="注册时间：">
							<span>{{staffInfo.createTime}}</span>
						</el-form-item>
						<el-form-item label="所属部门：">
							<span>{{staffInfo.orgName || '暂无'}}</span>
						</el-form-item>
						<el-form-item label="所在地：">
							<span>{{staffInfo.areaName}}</span>
						</el-form-item>
					</el-form>
				</el-col>
			</el-row>
			<div slot="footer">
				<el-button @click="staffInfoVisible = false">取消</el-button>
				<el-button type="primary" @click="staffInfoVisible = false">确定</el-button>
			</div>
		</el-dialog>
		<!-- 部门设置 -->
		<el-dialog 
			size="tiny"
			title="部门设置"
			:visible.sync="orgTreeVisible" 
			class="dialog-ztree">
			<ul id="dialogOrgTree" class="ztree" v-loading="treeLoading"></ul>
			<div slot="footer">
				<el-button @click="orgTreeVisible = false">取消</el-button>
				<el-button type="primary" @click="setOrgSubmit">确定</el-button>
			</div>
		</el-dialog>
		<!-- 职位列表 -->
    <el-dialog title="职位列表" :visible.sync="titleListVisible">
      <el-row>
        <el-col :span="22" :offset="1">
          <el-table 
            border
            max-height="350"
            style="width: 100%"
            v-loading="loading" 
            :data="titleList">
            <el-table-column width="80" label="选择" align="center">
              <template scope="scope">
                <el-radio class="radio no-label" v-model="titleId" :label="scope.row.titleId">
                </el-radio>
              </template>
            </el-table-column>
            <el-table-column prop="titleName" label="职位名称"></el-table-column>
            <el-table-column prop="note" label="职位描述"></el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <div slot="footer">
        <el-button @click="titleListVisible = false">取消</el-button>
        <el-button type="primary" @click="setTitleSubmit">确定</el-button>
      </div>
    </el-dialog>
	</section>
</template>
<script>
	import '@/assets/plugins/zTree/css/zTreeStyle.css'
	import '@/assets/plugins/zTree/js/jquery.min.js'
	import '@/assets/plugins/zTree/js/jquery.ztree.all.min.js'
	import { readOrganizeTree, getUserList, saveOrganizeTree, deleteOrganize, setOrganizeStatus, setUserOrg, removeUser, setUserStatus, getPartnerTitle, setUserTitle } from '@/api'
	export default {
		data() {
			return {
        defaultProps: {
          label: 'name',
          children: 'children',
        },
        staffList: [],
	      checkedNode: null,
	      orgFormVisible: false,
	      funcListVisible: false,
	      registFormVisible: false,
	      staffInfoVisible: false,
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
	      staffInfo: {},
	      submitType: 0,
	      treeLoading: false,
	      orgTreeVisible: false,
	      dialogCheckedNode: null,
	      titleListVisible: false,
	      titleList: [],
	      titleId: '',
			}
		},
		methods: {
			formatMobile(row) {
				return row.mobile ? row.mobile.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2') : '暂无'
			},
			formatOrg(row) {
				return row.orgName || '暂无'
			},
			formatTitle(row) {
				return row.titleName || '暂无'
			},
			handleSizeChange(val) {
				this.pageSize = val
			},
			handleCurrentChange(val) {
				this.currentPage = val
			},
			// 节点点击事件
			nodeClick(event, treeId, treeNode) {
				if(this.checkedNode === treeNode) return;
				this.checkedNode = treeNode;
				this.getStaffList(treeNode)
			},
			dialogNodeClick(event, treeId, treeNode) {
				if(this.dialogCheckedNode === treeNode) return;
				this.dialogCheckedNode = treeNode;
			},
			// 获取组织部门树
			getOrganizeTree() {
				this.loading = true
				readOrganizeTree().then(res => {
					console.log(res)
					if(res.data.code === '0001') {
						const organizes = res.data.result.organizeTree;
				    const setting = {
				      view: {
				        selectedMulti: false,
				      },
				      data: {
				        simpleData: {
				          enable: true
				        }
				      },
				      callback: {
				      	onClick: this.nodeClick
				      }
				    }
				    const zNode = [];
				    organizes.forEach(org => {
				      var iconSkin;
				      if(!org.parentId){
				        iconSkin = 'root'
				      }else{
				        iconSkin = 'folder'
				      }
				      let treeObj = {
				        id: org.orgId,
				        orgId: org.orgId,
				        pId: org.parentId,
				        name: org.name,
				        note: org.note,
				        status: org.status,
				        open: true,
				        iconSkin: iconSkin,
				      };
				      zNode.push(treeObj)
				    })
				    $.fn.zTree.init($('#organizeTree'), setting, zNode);
				    this.checkedNode = null;
					} else {
						this.$message(res.data.message)
					}
					this.loading = false
				}).catch(err => {
					this.loading = false
					console.log(err)
				})
			},
			getDialogOrgTree() {
				this.treeLoading = true;
				readOrganizeTree().then(res => {
					if(res.data.code === '0001') {
						let organizes = res.data.result.organizeTree;
				    let setting = {
				      view: {
				        selectedMulti: false,
				      },
				      data: {
				        simpleData: {
				          enable: true
				        }
				      },
				      callback: {
				      	onClick: this.dialogNodeClick
				      }
				    }
				    const zNode = [];
				    organizes.forEach(org => {
				      var iconSkin;
				      if(!org.parentId){
				        iconSkin = 'root'
				      }else{
				        iconSkin = 'folder'
				      }
				      let treeObj = {
				        id: org.orgId,
				        orgId: org.orgId,
				        pId: org.parentId,
				        name: org.name,
				        note: org.note,
				        status: org.status,
				        open: true,
				        iconSkin: iconSkin,
				      };
				      zNode.push(treeObj)
				    })
				    $.fn.zTree.init($('#dialogOrgTree'), setting, zNode);
				    this.dialogCheckedNode = null;
					} else {
						this.$message(res.data.message)
					}
					this.treeLoading = false;
				}).catch(err => {
					this.treeLoading = false;
					console.log(err)
				})
			},
			//获取被选中的单个节点
			// getSeletedNode() {
			// 	let treeObj = $.fn.zTree.getZTreeObj("organizeTree");
			//   this.checkedNode = treeObj.getSelectedNodes()[0];
			// },
			// 获取部门员工
			getStaffList(org) {
				this.tableLoading = true;
				let data = {
					orgId: org.orgId,
					name: org.name
				}
				getUserList(data).then(res => {
					this.tableLoading = false
					// console.log(res)
					if(res.data.code === '0001') {
						this.staffList = res.data.result.staffList;
						this.total = res.data.result.staffList.length;
					} else {
						this.$message.error(res.data.message)
					}
				}).catch(err => {
					this.tableLoading = false
					console.log(err)
				})
			},
      // 新增部门
      handleAdd() {
      	if(!this.checkedNode) {
      		return this.$notify.warning({title: '提示', message: '请选择部门'})
      	}
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
      	// console.log(this.checkedNode)
      	if(this.checkedNode.children) {
      		return this.$notify.error({title: '提示', message: '该部门有下级部门，不可删除'})
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
      },
      // 权限设置
      handleFunc() {
      	if (!this.checkedNode) {
      		return this.$notify.warning({title: '提示', message: '请选择部门'})
      	}
      	this.funcListVisible = true
      },
      // 状态设置
      handleStatus() {
      	if (!this.checkedNode) {
      		return this.$notify.warning({title: '提示', message: '请选择部门'})
      	}
      	let data = {
      		orgId: this.checkedNode.orgId,
      		status: this.checkedNode.status
      	}
      	setOrganizeStatus(data).then(res => {
      		if(res.data.code === '0001') {
      			this.$message.success(res.data.message)
      			this.checkedNode.status = this.checkedNode.status === 1 ? 0 : 1;
      		} else {
      			this.$message.error(res.data.message)
      		}
      	}).catch(err => {
      		console.log(err)
      	})
      },
      // 注册员工
      handleRegister() {
      	if (!this.checkedNode) {
      		return this.$notify.warning({title: '提示', message: '请选择部门'})
      	}
      	this.registFormVisible = true
      },
      handleClick() {
      	console.log('show')
      },
      // 员工信息
      handleShow(row) {
      	this.staffInfo = Object.assign({}, row)
      	this.staffInfoVisible = true
      },
      // 设置员工部门
      handleSetOrg(row) {
      	this.getDialogOrgTree()
      	this.staffInfo = Object.assign({}, row)
      	this.orgTreeVisible = true;
      },
      // 设置部门提交
      setOrgSubmit() {
      	if (!this.dialogCheckedNode) {
      		return this.$notify.warning({title: '提示', message: '请选择部门'})
      	}
				let data = {
					userId: this.staffInfo.userId,
					orgId: this.dialogCheckedNode.orgId
				}
				setUserOrg(data).then(res => {
					if(res.data.code === '0001') {
						this.$message.success(res.data.message)
						this.getStaffList(this.checkedNode)
					} else {
						this.$message.error(res.data.message)
					}
				}).catch(err => {
					console.log(err)
				})
				this.orgTreeVisible = false;
      },
      // 获取职位列表
      getTitleList() {
				this.loading = true;
				getPartnerTitle().then(res => {
					this.loading = false;
					if(res.data.code === '0001') {
						this.titleList = res.data.result.titleList
					} else {

					}
				}).catch(err => {
					this.loading = false;
					console.log(err)
				})
			},
      // 设置员工职位
      handleSetTitle(row) {
      	this.getTitleList()
      	this.staffInfo = Object.assign({}, row)
      	this.titleId = row.titleId;
      	this.titleListVisible = true;
      },
      // 设置员工职位提交
      setTitleSubmit() {
      	if(!this.titleId) {
      		return this.$notify.warning({title: '提示', message: '请选择职位'})
      	}
      	let data = {
      		userId: this.staffInfo.userId,
      		titleId: this.titleId
      	}
      	setUserTitle(data).then(res => {
      		if(res.data.code === '0001') {
      			this.$message.success(res.data.message)
      			this.getStaffList(this.checkedNode)
      		} else {
      			this.$message.error(res.data.message)
      		}
      		this.titleListVisible = false;
      	}).catch(err => {
      		console.log(err)
      		this.$catchError(err)
      	})
      },
      //设置员工状态 
      handleSetStatus(row) {
      	let status = row.status === 1 ? 0 : 1;
      	let statusText = row.status === 1 ? '禁用' : '启用';
      	this.$confirm(`确定将 ${row.realname} 设为${statusText}状态？`, '提示', {type: 'warning'}).then(() => {
	      	let data = {
	      		userId: row.userId,
	      		status: status
	      	}
	      	setUserStatus(data).then(res => {
	      		if(res.data.code === '0001') {
	      			this.$message.success(res.data.message)
	      			this.getStaffList(this.checkedNode)
	      		} else {
	      			this.$message.error(res.data.message)
	      		}
	      	}).catch(err => {
	      		console.log(err)
	      	})
	      }).catch(err => {
	      	console.log(err)
	      })
      	// this.$notify.error({
      	// 	title: '提示',
      	// 	message: '暂无该功能！', 
      	// })
      },
      // 删除员工
      handleRemove(row) {
      	this.$confirm(`确定将 ${row.realname} 从该公司删除？`, '提示', {type: 'warning'}).then(() => {
      		let data = {
	      		userId: row.userId
	      	}
      		removeUser(data).then(res => {
      			console.log(res)
      			if(res.data.code === '0001') {
      				this.$message.success(res.data.message)
      				this.getStaffList(this.checkedNode)
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
      },
		},
		computed: {
			disabled() {
				return this.checkedNode && this.checkedNode.status === 1 ? true : false
			}
		},
		mounted () {
			this.getOrganizeTree()
		}
	}
</script>
<style scoped lang="scss">
	.org-tree {
		.ztree {
			width: 100%;
			min-height: 400px;
			max-height: 600px;
			overflow-y: auto;
			padding: 15px 10px;
			border: 1px solid #ddd;
			&::-webkit-scrollbar {
	      width: 4px;
	      border-radius: 5px;
	      background: #bbb
	    }
		}
	}
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
	.avatar {
		width: 150px;
		height: 150px;
		border-radius: 50%;
		border: 1px solid #ddd;
	}
</style>