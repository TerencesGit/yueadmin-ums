<template>
	<section>
			<div v-title :data-title="this.$route.name"></div>
	    <el-row class="toolbar">
	      <el-button type="primary" @click="handleAdd">新增角色</el-button>
	    </el-row>
	    <!-- 角色列表 -->
      <el-table 
	      border 
	      :data="roleList" 
	      v-loading="loading" 
	      highlight-current-row
	      style="width: 100%">
	      <el-table-column type="index" width="60"></el-table-column>
	      <el-table-column prop="roleId" label="角色编号" sortable width="140"></el-table-column>
	      <el-table-column prop="roleName" label="角色名称"></el-table-column>
	      <el-table-column prop="roleDesc" label="角色描述"></el-table-column>
	      <el-table-column prop="createTime" label="创建时间" sortable width="180" :formatter="formatTime"></el-table-column>
	      <el-table-column prop="status" label="状态" width="120" :formatter="formatStatus">
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
	        	<el-button size="small" type="info" @click="handleFunc(scope.row)">权限</el-button>
	          <el-button size="small" type="warning" @click="handleEdit(scope.row)">编辑</el-button>
	          <el-button size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
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
	    <!-- 角色表单 -->
	    <el-dialog :visible.sync="roleFormVisible" :title="roleFormTitle">
	    	<el-row>
	    		<el-col :span="18" :offset="3">
			    	<el-form :model="roleForm" ref="roleForm" :rules="rules" label-width="120px">
			    		<el-form-item label="角色名称" prop="roleName">
			    			<el-input v-model="roleForm.roleName" placeholder="角色名称"></el-input>
			    		</el-form-item>
			    		<el-form-item label="角色描述" prop="roleDesc">
			    			<el-input type="textarea" v-model="roleForm.roleDesc" placeholder="角色描述"></el-input>
			    		</el-form-item>
			    	</el-form>
	    		</el-col>
	    	</el-row>
	    	<div slot="footer">
	    		<el-button @click="roleFormVisible = false">取消</el-button>
	    		<el-button type="primary" @click="submitForm">确定</el-button>
	    	</div>
	    </el-dialog>
	    <!-- 权限配置 -->
			<el-dialog 
				title="权限配置"
				size="tiny" 
				:visible.sync="funcTreeVisible" 
				class="dialog-ztree">
				<ul id="functionTree" class="ztree" v-loading="treeLoading"></ul>
				<div slot="footer">
					<el-button @click="funcTreeVisible = false">取消</el-button>
					<el-button type="primary" @click="roleFuncSubmit">确定</el-button>
				</div>
			</el-dialog>
	</section>
</template>
<script>
	import '@/assets/plugins/zTree/css/zTreeStyle.css'
	import '@/assets/plugins/zTree/js/jquery.min.js'
	import '@/assets/plugins/zTree/js/jquery.ztree.all.min.js'
	import { getSysRoles, createRole, updateRole, updateRoleStatus, delRole, getFunctionTree, getRoleFunctions, updateRoleFunction } from '@/api'
	export default {
		data () {
			return {
				pageNo: 1,
				pageSize: 10,
				total: 0,
				loading: false,
				roleList: [],
				roleForm: {
					roleName: '',
					roleDesc: ''
				},
				rules: {
					roleName: [
						{ required: true, message: '请输入角色名称', trigger: 'blur'}
					],
					roleDesc: [
						{ required: true, message: '请输入角色描述', trigger: 'blur'}
					],
				},
				funTreeList: [],
				selectedRole: null,
				roleFormTitle: '',
				roleFormVisible: false,
				treeLoading: false,
				funcTreeVisible: false,
			}
		},
		methods: {
			formatStatus(row) {
				return row.status === 1 ? '启用' : '禁用'
			},
			formatTime() {
				return this.$moment(new Date()).format('YYYY-MM-DD')
			},
			handleSizeChange(val) {
				this.pageSize = val;
				this.getRoleList()
			},	
			handleCurrentChange(val) {
				this.pageNo = val;
				this.getRoleList()
			},
			// 角色分页列表
			getRoleList() {
				let params = {
					pageNo: this.pageNo,
					pageSize: this.pageSize
				}
				this.loading = true;
				getSysRoles(params).then(res => {
					this.loading = false;
					if(res.data.code === '0001') {
						this.roleList = res.data.result.roleList;
						this.total = res.data.result.pageInfo.total;
					} else {
						this.$message.error(res.data.message)
					}
				}).catch(err => {
					this.loading = false;
					console.log(err)
				})
			},
			// 设置状态
			handleStatus(row) {
				let data = {
					roleId: row.roleId,
					status: row.status
				}
				updateRoleStatus(data).then(res => {
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
			// 角色新增
			handleAdd() {
				this.roleForm = {
					roleName: '',
					roleDesc: ''
				}
				this.roleFormTitle = '新增角色'
				this.roleFormVisible = true;
			},
			// 角色编辑
			handleEdit(row) {
				this.roleForm = {
					roleId: row.roleId,
					roleName: row.roleName,
					roleDesc: row.roleDesc
				}
				this.roleFormTitle = '编辑角色'
				this.roleFormVisible = true;
			},
			// 表单提交
			submitForm() {
				this.$refs.roleForm.validate(valid => {
					if(!valid) return;
					let data = Object.assign({}, this.roleForm)
					if(data.roleId) {
						updateRole(data).then(res => {
						  if(res.data.code === '0001') {
								this.$message.success(res.data.message)
								this.getRoleList()
							} else {
								this.$message.error(res.data.message)
							}
						}).catch(err => {
							console.log(err)
							this.$catchError(err)
						})
					} else {
						createRole(data).then(res => {
							if(res.data.code === '0001') {
								this.$message.success(res.data.message)
								this.getRoleList()
							} else {
								this.$message.error(res.data.message)
							}
						}).catch(err => {
							console.log(err)
							this.$catchError(err)
						})
					}
					this.roleFormVisible = false;
				})
			},
			// 角色删除
			handleDelete(row) {
				this.$confirm(`确定删除 ${row.roleName} 角色？`, '提示', {type: 'warning'}).then(() => {
					let data = {
						roleId: row.roleId
					}
					delRole(data).then(res => {
						if(res.data.code === '0001') {
							this.$message.success(res.data.message)
							this.getRoleList()
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
			},
			// 获取系统功能树
			getFuncTree() {
				if(this.funTreeList.length !== 0) return;
				this.treeLoading = true;
				let data = {
					moduleId: 20170906001
				}
				getFunctionTree(data).then(res => {
					this.treeLoading = false
					if(res.data.code === '0001') {
						this.funTreeList = res.data.result.functionTree;
				    const setting = {
				      view: {
				        selectedMulti: false,
				      },
				      check: {
				    		enable: true
				    	},
				      data: {
				        simpleData: {
				          enable: true
				        }
				      },
				      // callback: {
				      // 	onClick: this.nodeClick
				      // }
				    }
				    const zNode = [];
				    this.funTreeList.forEach(func => {
				      let iconSkin = '';
				      if(!func.parentId){
				        iconSkin = 'root'
				      }else{
				        iconSkin = 'folder'
				      }
				      let treeObj = {
				        id: func.funcId,
				        funcId: func.funcId,
				        pId: func.parentId,
				        name: func.name,
				        desc: func.funcDesc,
				        status: func.status,
				        open: true,
				        iconSkin: iconSkin,
				      };
				      zNode.push(treeObj)
				    })
				    $.fn.zTree.init($('#functionTree'), setting, zNode);
					} else {
						this.$message.error(res.data.message)
					}
				}).catch(err => {
					this.treeLoading = false
					console.log(err)
					this.$catchError(err)
				})
			},
			// 获取角色关联的功能点
			getRoleFuncs() {
				let params = {
					roleId: this.selectedRole.roleId
				}
				getRoleFunctions(params).then(res => {
					if(res.data.code === '0001') {
						let treeObj = $.fn.zTree.getZTreeObj("functionTree");
						let nodes = treeObj.transformToArray(treeObj.getNodes());
						nodes.forEach(node => {
							treeObj.checkNode(node, false, true);
						})
						let roleFuncs = res.data.result.roleFuncs;
						let checkedNodes = [];
						roleFuncs.forEach(func => {
							checkedNodes.push(nodes.filter(node => node.funcId == func.funcId)[0])
						})
						checkedNodes.forEach(node => {
							treeObj.checkNode(node, true, true);
						})
					} else {
						this.$message.error(res.data.message)
					}
				}).catch(err => {
					console.log(err)
					this.$catchError(err)
				})
			},
			// 权限配置
			handleFunc(row) {
				this.selectedRole = row;
				this.getFuncTree()
				this.getRoleFuncs()
				this.funcTreeVisible = true
			},
			// 权限提交
			roleFuncSubmit() {
				let checkedNodes = $.fn.zTree.getZTreeObj('functionTree').getCheckedNodes(true);
				checkedNodes = checkedNodes.filter(node => node.check_Child_State === -1)
				let funcIds = checkedNodes.map(node => node.funcId)
				let data = {
					roleId: this.selectedRole.roleId,
					funcIdList: funcIds
				}
				// console.log(data)
				updateRoleFunction(data).then(res => {
					if(res.data.code === '0001') {
						this.$message.success(res.data.message)
					} else {
						this.$message.error(res.data.message)
					}
				}).catch(err => {
					console.log(err)
					this.$catchError(err)
				})
				this.funcTreeVisible = false;
			},
		},
		mounted() {
			this.getRoleList()
		}
	}
</script>
<style scoped lang="scss">
	
</style>