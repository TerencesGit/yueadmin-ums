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
						<el-button size="small" type="primary" icon="setting" @click="handleOrgRoles">
							权限
						</el-button>
						<!-- <el-button size="small" type="primary" icon="setting" @click="showOrgFunctions">
							功能点
						</el-button> -->
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
			      v-loading="staffLoading" 
			      style="width: 100%">
			      <el-table-column type="index" width="55"></el-table-column>
			      <el-table-column prop="realname" label="姓名" sortable width="120" :formatter="formatName"></el-table-column>
			      <el-table-column prop="email" label="邮箱" width="180" :formatter="formatEmail"></el-table-column>
			      <el-table-column prop="createTime" label="注册时间" sortable width="120" :formatter="formatTime"></el-table-column>
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
								   <!--  <el-dropdown-item disabled>
								    	<span @click="handleRemove(scope.row)">删除</span>
								    </el-dropdown-item> -->
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
				      :current-page="pageNo"
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
				<el-button type="primary" @click="orgSubmit">确定</el-button>
			</div>
		</el-dialog>
		<!-- 权限设置 -->
		<el-dialog :visible.sync="orgRolesVisible" title="权限设置">
			<el-table 
	      border 
	      :data="roleList"
	      ref="roleTable" 
	      v-loading="roleLoading" 
	      highlight-current-row
	      max-height="350"
	      style="width: 100%"
	      @selection-change="handleSelectionChange">
	      <el-table-column type="selection" width="50"></el-table-column>
	      <el-table-column prop="roleName" label="角色名称"></el-table-column>
	      <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
			</el-table>
			<div slot="footer">
				<el-button @click="orgRolesVisible = false">取消</el-button>
				<el-button type="primary" @click="orgRolesSubmit">确定</el-button>
			</div>
		</el-dialog>
		<!-- 注册员工 -->
		<el-dialog :visible.sync="registFormVisible" :title="registFormTitle">
			<el-row>
    		<el-col :span="18" :offset="3">
		    	<el-form :model="registForm" ref="registForm" :rules="rules" label-width="120px">
		    		<el-form-item label="真实姓名" prop="realname">
		    			<el-input v-model.trim="registForm.realname" placeholder="注册员工姓名"></el-input>
		    		</el-form-item>
		    		<el-form-item label="注册邮箱" prop="email">
		    			<el-input v-model.trim="registForm.email" placeholder="注册员工邮箱"></el-input>
		    		</el-form-item>
		    		<el-form-item label="设置密码" prop="password">
		    			<el-input type="password" v-model.trim="registForm.password" placeholder="密码长度不少于8位"></el-input>
		    		</el-form-item>
		    		<el-form-item label="确认密码" prop="confirmPass">
		    			<el-input type="password" v-model.trim="registForm.confirmPass" placeholder="再次输入密码"></el-input>
		    		</el-form-item>
		    	</el-form>
    		</el-col>
    	</el-row>
			<div slot="footer">
				<el-button @click="registFormVisible = false">取消</el-button>
				<el-button type="primary" @click="registSubmit">确定</el-button>
			</div>
		</el-dialog>
		<!-- 员工信息 -->
		<el-dialog :visible.sync="staffInfoVisible" title="员工信息">
			<el-form :model="staffInfo" label-width="120px" v-loading="staffInfoLoading">
				<el-row>
					<el-col :span="12" :offset="5">
						<el-form-item label="">
							<img v-if="staffInfo.avatarUrl" :src="staffInfo.avatarUrl" alt="头像" class="avatar">
							<img v-else src="../../assets/img/avatar.gif" alt="头像" class="avatar">
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="姓名：">
							<span>{{staffInfo.realname}}</span>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="性别：">
							<span>{{staffInfo.sexaul === 0 ? '女' : '男' }}</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="邮箱：">
							<span>{{staffInfo.email | email}}</span>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="手机号：">
							<span>{{staffInfo.mobile | mobile}}</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="QQ：">
							<span>{{staffInfo.qq || '暂无'}}</span>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="生日：">
							<span>{{staffInfo.birthday || '暂无'}}</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="部门：">
							<span>{{staffInfo.orgName || '暂无'}}</span>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="职位：">
							<span>{{staffInfo.titleName || '暂无'}}</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="所在地：">
							<span>{{staffInfo.areaName}}</span>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="注册时间：">
							<span>{{staffInfo.createTime}}</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="身份证正面：">
							<img :src="staffInfo.idcardFrontUrl" alt="暂无身份证正面" class="idcard-pic">
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="身份证背面：">
							<img :src="staffInfo.idcardBackUrl" alt="暂无身份证背面" class="idcard-pic">
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
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
				<el-button type="primary" @click="staffOrgSubmit">确定</el-button>
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
            v-loading="titleLoading" 
            :data="titleList">
            <el-table-column width="80" label="选择" align="center">
              <template scope="scope">
                <el-radio class="radio no-label" v-model="titleId" :label="scope.row.id">
                </el-radio>
              </template>
            </el-table-column>
            <el-table-column prop="titleName" label="职位名称"></el-table-column>
            <el-table-column prop="titleDesc" label="职位描述"></el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <div slot="footer">
        <el-button @click="titleListVisible = false">取消</el-button>
        <el-button type="primary" @click="staffTitleSubmit">确定</el-button>
      </div>
    </el-dialog>
	</section>
</template>
<script>
	import Md5 from '@/assets/js/md5'
	import '@/assets/plugins/zTree/css/zTreeStyle.css'
	import '@/assets/plugins/zTree/js/jquery.min.js'
	import '@/assets/plugins/zTree/js/jquery.ztree.all.min.js'
	import { getMyPartnerOrgs, getMyPartnerRoles, getRolesByOrg, updateOrgRole, getOrganizeStaff, createOrganize, updateOrganize, delOrganize, updateOrgStatus, updateStaffOrg, updateStaffStatus, getPartnerTitle, updateStaffTitle, registerByAgency, getFunctionsByOrg, getUserInfoById } from '@/api'
	import { mapGetters } from 'vuex'
	export default {
		data() {
			const validatePass = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请再次输入密码'));
        }
        if (value !== this.registForm.password) {
          callback(new Error('两次密码输入不一致'));
        } else {
        	callback()
        }
      }
			return {
				loading: false,
				staffList: [],
	      staffLoading: false,
	      staffInfoLoading: false,
	      pageNo: 1,
	      pageSize: 10,
	      total: 0,
	      checkedNode: null,
	      orgFormVisible: false,
	      orgRolesVisible: false,
	      staffInfo: {},
	      staffInfoVisible: false,
	      orgFormTitle: '',
	      organizeForm: {
	      	orgId: '',
	      	name: '',
	      	note: '',
	      	parentId: ''
	      },
	      registForm: {
	      	realname: '',
	      	email: '',
	      	password: '',
	      	confirmPass: ''
	      },
	      registFormTitle: '',
	      registFormVisible: false,
	      rules: {
	      	name: [
	      		{ required: true, message: '请输入部门名称', trigger: 'blur'}
	      	],
	      	note: [
	      		{ required: true, message: '请输入部门简介', trigger: 'blur'}
	      	],
	      	realname: [
	      		{ required: true, message: '请输入真实姓名', trigger: 'blur'}
	      	],
	      	email: [
	      		{ required: true, message: '请输入注册邮箱', trigger: 'blur'},
	      		{ type: 'email', message: '邮箱格式不正确', trigger: 'blur'},
	      	],
	      	password: [
	      		{ required: true, message: '请输入密码', trigger: 'blur'},
	      		{ min: 8, max: 20, message: '密码长度不少于8位', trigger: 'blur'},
	      	],
	      	confirmPass: [
	      		{ required: true, validator: validatePass, trigger: 'blur'}
	      	],
	      },
	      treeLoading: false,
	      orgTreeVisible: false,
	      dialogCheckedNode: null,
	      roleList: [],
	      selectedRole: [],
	      roleLoading: false,
	      titleId: '',
	      titleList: [],
	      titleLoading: false,
	      titleListVisible: false,
			}
		},
		methods: {
			formatName(row) {
				return row.userId === this.userInfo.userId ? `${row.realname}(我)` : row.realname;
			},
			formatEmail(row) {
				return row.email && row.email.replace(/(.{3}).+(.{2}@.+)/, '$1****$2')
			},
			formatTime(row) {
				return this.$moment(row.createTime).format('YYYY-MM-DD')
			},
			formatOrg(row) {
				return row.orgName || '暂无'
			},
			formatTitle(row) {
				return row.titleName || '暂无'
			},
			handleSizeChange(val) {
				this.pageSize = val
				this.getStaffList()
			},
			handleCurrentChange(val) {
				this.pageNo = val
				this.getStaffList()
			},
			// 节点点击事件
			nodeClick(event, treeId, treeNode) {
				if(this.checkedNode === treeNode) return;
				this.checkedNode = treeNode;
				this.getStaffList()
			},
			dialogNodeClick(event, treeId, treeNode) {
				if(this.dialogCheckedNode === treeNode) return;
				this.dialogCheckedNode = treeNode;
			},
			// 获取组织部门树
			getOrganizeTree() {
				this.loading = true
				getMyPartnerOrgs().then(res => {
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
				    this.roleList.length === 0 && this.getPartnerRoles()
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
				getMyPartnerOrgs().then(res => {
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
			// 获取部门员工
			getStaffList() {
				this.staffLoading = true;
				let data = {
					orgId: this.checkedNode.orgId,
					pageNo: this.pageNo,
					pageSize: this.pageSize,
				}
				getOrganizeStaff(data).then(res => {
					this.staffLoading = false
					if(res.data.code === '0001') {
						this.staffList = res.data.result.userList;
						this.total = res.data.result.pageInfo.total;
					} else {
						this.$message.error(res.data.message)
					}
				}).catch(err => {
					this.staffLoading = false
					console.log(err)
				})
			},
      // 新增部门
      handleAdd() {
      	if(!this.checkedNode) {
      		return this.$notify.warning({title: '提示', message: '请选择部门'})
      	}
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
      	this.orgFormTitle = '编辑部门'
      	this.orgFormVisible = true
      },
      // 部门表单提交
      orgSubmit() {
      	this.$refs.organizeForm.validate(valid => {
      		if(valid) {
      			let data = Object.assign({}, this.organizeForm)
      			if(data.orgId) {
      				updateOrganize(data).then(res => {
	      				if(res.data.code === '0001') {
	      					this.$message.success(res.data.message)
	      					this.getOrganizeTree()
	      				} else {
	      					this.$message.error(res.data.message)
	      				}
	      			}).catch(err => {
	      				console.log(err)
	      			})
      			} else {
      				createOrganize(data).then(res => {
	      				if(res.data.code === '0001') {
	      					this.$message.success(res.data.message)
	      					this.getOrganizeTree()
	      				} else {
	      					this.$message.error(res.data.message)
	      				}
	      			}).catch(err => {
	      				console.log(err)
	      			})
      			}
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
      	if(this.checkedNode.children) {
      		return this.$notify.error({title: '提示', message: '该部门有下级部门，不可删除'})
      	}
      	this.$confirm(`确定删除${this.checkedNode.name}？`, '提示', {type: 'warning'}).then(() => {
      		let data = {
	      		orgId: this.checkedNode.orgId
	      	}
	      	delOrganize(data).then(res => {
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
      // 获取商家角色列表
      getPartnerRoles() {
      	this.roleLoading = true;
      	getMyPartnerRoles().then(res => {
      		this.roleLoading = false;
    			if(res.data.code === '0001') {
    				this.roleList = res.data.result.roleList;
  				} else {
  					this.$message.error(res.data.message)
  				}
      	}).catch(err => {
      		console.log(err)
      		this.roleLoading = false;
      	})
      },
      // 获取部门关联的角色列表
      getOrgRoles() {
      	let params = {
      		orgId: this.checkedNode.orgId
      	}
      	getRolesByOrg(params).then(res => {
      		if(res.data.code === '0001') {
    				let orgRoles = res.data.result.orgRoles;
						let selectedRows = [];
						orgRoles.forEach(orgRole => {
							this.roleList.filter(role => {
								if(role.roleId === orgRole.roleId) {
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
      		this.roleLoading = false;
      	})
      },
      // 权限设置
      handleOrgRoles() {
      	if (!this.checkedNode) {
      		return this.$notify.warning({title: '提示', message: '请选择部门'})
      	}
      	// this.roleList.length === 0 && this.getPartnerRoles()
      	this.getOrgRoles()
      	this.orgRolesVisible = true
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
			// 部门角色配置
			orgRolesSubmit() {
				let roleIds = this.selectedRole.map(role => role.roleId)
				let data = {
					orgId: this.checkedNode.orgId,
					roleIdList: roleIds
				}
				updateOrgRole(data).then(res => {
					if(res.data.code === '0001') {
    				this.$message.success(res.data.message)
  				} else {
  					this.$message.error(res.data.message)
  				}
      	}).catch(err => {
      		console.log(err)
      	})
      	this.orgRolesVisible = false
			},
			// 获取部门所拥有的功能点
			getOrgFuncstions() {
				let params = {
					orgId: this.checkedNode.orgId
				}
				getFunctionsByOrg(params).then(res => {
					if(res.data.code === '0001') {
						let orgFuncs = res.data.result.orgFuncs;
						console.log(orgFuncs)
  				} else {
  					this.$message.error(res.data.message)
  				}
      	}).catch(err => {
      		console.log(err)
      	})
			},
			// 功能点查看
			showOrgFunctions() {
				if (!this.checkedNode) {
      		return this.$notify.warning({title: '提示', message: '请选择部门'})
      	}
      	this.getOrgFuncstions()
			},
      // 状态设置
      handleStatus() {
      	if (!this.checkedNode) {
      		return this.$notify.warning({title: '提示', message: '请选择部门'})
      	}
      	let status = this.checkedNode.status === 1 ? 0 : 1
      	let data = {
      		orgId: this.checkedNode.orgId,
      		status
      	}
       	updateOrgStatus(data).then(res => {
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
      	this.registForm = {
      		realname: '',
      		email: '',
      		password: '',
      		confirmPass: '',
      	}
      	this.registFormTitle = `注册员工（${this.checkedNode.name}）`;
      	this.registFormVisible = true
      },
      // 注册员工提交
      registSubmit() {
      	this.$refs.registForm.validate(valid => {
      		if(!valid) return;
      		let data = {
      			orgId: this.checkedNode.orgId,
      			realname: this.registForm.realname,
      			email: this.registForm.email,
      			passwd: Md5.hex_md5(this.registForm.password),
      			passwd2: Md5.hex_md5(this.registForm.confirmPass),
      		}
      		registerByAgency(data).then(res => {
      			if(res.data.code === '0001') {
      				this.$message.success(res.data.message)
      				this.getStaffList()
      			} else {
      				this.$message.error(res.data.message)
      			}
      			this.registFormVisible = false
      		}).catch(err => {
      			console.log(err)
      		})
      		this.registFormVisible = false
      	})
      },
      // 员工信息展示
      handleShow(row) {
      	this.staffInfo = {};
      	this.staffInfoVisible = true;
      	let params = {
					userId: row.userId
				}
				this.staffInfoLoading = true;
				getUserInfoById(params).then(res => {
					this.staffInfoLoading = false;
					let userInfo = res.data.result.userInfo;
					let fileInfos = res.data.result.fileInfos;
					if(JSON.stringify(fileInfos) !== '{}') {
						userInfo.avatarUrl = userInfo.avatar && fileInfos[userInfo.avatar].fileUri;
						userInfo.idcardFrontUrl = userInfo.idcardPicFront && fileInfos[userInfo.idcardPicFront].fileUri;
						userInfo.idcardBackUrl = userInfo.idcardPicBack && fileInfos[userInfo.idcardPicBack].fileUri;
					}
					this.staffInfo = userInfo;
				}).catch(err => {
					console.log(err)
					this.staffInfoLoading = false;
					this.$catchError(err)
				})
      },
      // 设置员工部门
      handleSetOrg(row) {
      	this.getDialogOrgTree()
      	this.staffInfo = Object.assign({}, row)
      	this.orgTreeVisible = true;
      },
      // 设置部门提交
      staffOrgSubmit() {
      	if (!this.dialogCheckedNode) {
      		return this.$notify.warning({title: '提示', message: '请选择部门'})
      	}
				let data = {
					userId: this.staffInfo.userId,
					orgId: this.dialogCheckedNode.orgId
				}
				updateStaffOrg(data).then(res => {
					if(res.data.code === '0001') {
						this.$message.success(res.data.message)
						this.getStaffList()
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
				this.titleLoading = true;
				let params = {
					pageNo: 1,
					pageSize: 100
				}
				getPartnerTitle(params).then(res => {
					this.titleLoading = false;
					if(res.data.code === '0001') {
						this.titleList = res.data.result.titleList
					} else {
						this.$message.error(res.data.message)
					}
				}).catch(err => {
					this.titleLoading = false;
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
      staffTitleSubmit() {
      	if(!this.titleId) {
      		return this.$notify.warning({title: '提示', message: '请选择职位'})
      	}
      	let data = {
      		userId: this.staffInfo.userId,
      		titleId: this.titleId
      	}
      	updateStaffTitle(data).then(res => {
      		if(res.data.code === '0001') {
      			this.$message.success(res.data.message)
      			this.getStaffList()
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
	      	updateStaffStatus(data).then(res => {
	      		if(res.data.code === '0001') {
	      			this.$message.success(res.data.message)
	      			this.getStaffList()
	      		} else {
	      			this.$message.error(res.data.message)
	      		}
	      	}).catch(err => {
	      		console.log(err)
	      	})
	      }).catch(err => {
	      	console.log(err)
	      })
      },
      handleRemove(row) {
      	this.$confirm(`确定将 ${row.realname} 从该公司删除？`, '提示', {type: 'warning'}).then(() => {
      		let data = {
	      		userId: row.userId
	      	}
      		removeUser(data).then(res => {
      			if(res.data.code === '0001') {
      				this.$message.success(res.data.message)
      				this.getStaffList()
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
				return this.checkedNode && this.checkedNode.status === 1 ? true : false;
			},
			roleDisabled() {
				return this.checkedNode && this.checkedNode.pId ? false : true;
			},
			...mapGetters([
	  		'userInfo'
	  	]),
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
		width: 160px;
		height: 160px;
		border-radius: 50%;
		border: 1px solid #ddd;
	}
</style>