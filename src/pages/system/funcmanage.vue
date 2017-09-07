<template>
	<section>
		<div v-title :data-title="this.$route.name"></div>
		<el-row class="toolbar">
			<label>当前模块：</label>
			<el-select v-model="moduleId" @change="moduleChange">
				<el-option 
					v-for="item in moduleList" 
					:key="item.moduleId"
					:label="item.name"
					:value="item.moduleId">
				</el-option>
			</el-select>
			<el-button type="primary" class="m-l" @click="handleCreateModule">新建模块</el-button>
		</el-row>
		<el-card class="card-primary">
			<div slot="header">
				组织部门管理
			</div>
			<el-row :gutter="15">
				<el-col :span="5" class="tree" v-loading="loading">
					<ul id="functionTree" class="ztree"></ul>
				</el-col>
				<el-col :span="19" v-if="functionTree.length === 0">
					<!-- 工具栏 -->
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
						<!-- <el-button size="small" type="primary" icon="setting" @click="handleFunc">
							权限
						</el-button> -->
						<el-button size="small" type="info" :disabled="disabled" @click="handleStatus">
							<i class="fa fa-unlock"></i>
							启用 
						</el-button>
						<el-button plain size="small" type="danger" :disabled="!disabled" @click="handleStatus">
							<i class="fa fa-ban"></i>
							禁用 
						</el-button>
					</el-row>
					<h3 class="page-header">
						功能点详情
					</h3>
					<el-table
						border
			      :data="funcData"
			      highlight-current-row
			      v-loading="tableLoading" 
			      style="width: 100%">
			      <!-- <el-table-column type="index" width="60"></el-table-column> -->
			      <el-table-column prop="funcId" label="功能编号" width="100"></el-table-column>
			      <el-table-column prop="name" label="名称"></el-table-column>
			      <el-table-column prop="desc" label="描述"></el-table-column>
			      <el-table-column prop="updateTime" label="更新时间" width="120" :formatter="formatTime"></el-table-column>
			      <el-table-column prop="status" label="状态" :formatter="formatStatus" width="80"></el-table-column>
			      <el-table-column label="操作" width="160">
			      	<template scope="scope">
			      		<el-button type="primary" size="small" @click="handleShow(scope.row)">查看</el-button>
			      		<el-button type="danger" size="small" @click="handleDelete">删除</el-button>
			      	</template>
			      </el-table-column>
			    </el-table>
			    <!-- 分页 -->
			    <!-- <el-row class="toolbar">
			    	<el-pagination
				      @size-change="handleSizeChange"
				      @current-change="handleCurrentChange"
				      :current-page="currentPage"
				      :page-sizes="[5, 10, 15, 20]"
				      :page-size="pageSize"
				      layout="total, sizes, prev, pager, next, jumper"
				      :total="total">
				    </el-pagination>
			    </el-row> -->
				</el-col>
			</el-row>
		</el-card>
		<el-dialog :visible.sync="moduleFormVisible" title="新建模块">
			
		</el-dialog>
		<!-- 功能点表单 -->
		<el-dialog :visible.sync="funcFormVisible" :title="funcFormTitle">
			<el-row>
				<el-col :span="18" :offset="3">
					<el-form :model="funcForm" :rules="rules" ref="funcForm" label-width="120px">
						<el-form-item label="功能点名称" prop="name">
							<el-input v-model="funcForm.name" placeholder="请输入功能点名称"></el-input>
						</el-form-item>
						<el-form-item label="功能点描述" prop="funcDesc">
							<el-input type="textarea" v-model="funcForm.funcDesc" placeholder="请输入功能点描述"></el-input>
						</el-form-item>
					</el-form>
				</el-col>
			</el-row>
			<div slot="footer">
				<el-button @click="funcFormVisible = false">取消</el-button>
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
		<!-- 功能点详情 -->
		<el-dialog :visible.sync="funcDetailVisible" title="功能点详情">
			<el-row>
				<el-col :span="18" :offset="3">
					<el-form :model="funcDetail" label-width="160px">
						<el-form-item label="功能名称：">
							<span>{{funcDetail.name}}</span>
						</el-form-item>
						<el-form-item label="功能描述：">
							<span>{{funcDetail.desc}}</span>
						</el-form-item>
						<el-form-item label="更新时间：">
							<span>{{this.$moment(new Date()).format('YYYY-MM-DD')}}</span>
						</el-form-item>
						<el-form-item label="状态：">
							<span>{{funcDetail.status ? '启用' : '禁用'}}</span>
						</el-form-item>
					</el-form>
				</el-col>
			</el-row>
			<div slot="footer">
				<el-button @click="funcDetailVisible = false">取消</el-button>
				<el-button type="primary" @click="funcDetailVisible = false">确定</el-button>
			</div>
		</el-dialog>
	</section>
</template>
<script>
	import '@/assets/plugins/zTree/css/zTreeStyle.css'
	import '@/assets/plugins/zTree/js/jquery.min.js'
	import '@/assets/plugins/zTree/js/jquery.ztree.all.min.js'
	import { getFunctionTree, createFunction, updateFunction, delFunction, setOrganizeStatus } from '@/api'
	export default {
		data() {
			return {
				moduleId: 20170906001,
				moduleList: [
					{moduleId: 20170906001, name: '用户模块', note: '用户模块101'},
					{moduleId: 20170906002, name: '交易模块', note: '交易模块102'},
					{moduleId: 20170906003, name: '支付模块', note: '支付模块103'},
				],
				moduleFormVisible: false,
				functionTree: [],
        funcData: [],
	      checkedNode: null,
	      funcFormVisible: false,
	      funcListVisible: false,
	      funcDetailVisible: false,
	      funcFormTitle: '',
	      funcForm: {
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
	      		{ required: true, message: '请输入功能点名称', trigger: 'blur'}
	      	],
	      	funcDesc: [
	      		{ required: true, message: '请输入功能点描述', trigger: 'blur'}
	      	],
	      },
	      funcDetail: {},
	      submitType: 0
			}
		},
		methods: {
			formatStatus(row) {
				return row.status === 1 ? '启用' : '禁用'
			},
			formatTime(row) {
				return this.$moment(new Date()).format('YYYY-MM-DD ')
			},
			handleSizeChange(val) {
				this.pageSize = val
			},
			handleCurrentChange(val) {
				this.currentPage = val
			},
			// 新建模块
			handleCreateModule() {
				this.moduleFormVisible = true
			},
			moduleChange(val) {
				this.moduleId = val
				this.getFuncTree()
			},
			// 节点点击事件
			nodeClick(event, treeId, treeNode) {
				if(this.checkedNode === treeNode) return;
				this.checkedNode = treeNode;
				this.funcData = [];
				this.funcData.push(this.checkedNode)
			},
			// 获取系统功能树
			getFuncTree() {
				this.loading = true;
				let data = {
					moduleId: this.moduleId
				}
				getFunctionTree(data).then(res => {
					console.log(res)
					if(res.data.code === '0001') {
						const funcTree = res.data.result.functionTree;
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
				    funcTree.forEach(func => {
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
			//获取被选中的单个节点
			getSeletedNode() {
				let treeObj = $.fn.zTree.getZTreeObj("functionTree");
			  this.checkedNode = treeObj.getSelectedNodes()[0];
			},
      // 新增功能点
      handleAdd() {
      	if(!this.checkedNode) {
      		return this.$notify.warning({title: '提示', message: '请选择功能点'})
      	}
      	this.submitType = 0
      	this.funcFormTitle = '新增功能点'
      	this.funcForm = {
      		funcId: '',
      		name: '',
      		funcDesc: '',
      		parentId: this.checkedNode.funcId
      	}
      	this.funcFormVisible = true
      },
      // 编辑功能点
      handleEdit() {
      	if (!this.checkedNode) {
      		return this.$notify.warning({title: '提示', message: '请选择功能点'})
      	}
      	this.funcForm = {
      		funcId: this.checkedNode.funcId,
      		name: this.checkedNode.name,
      		funcDesc: this.checkedNode.desc
      	}
      	this.submitType = 1
      	this.funcFormTitle = '编辑功能点'
      	this.funcFormVisible = true
      },
      // 提交表单
      submitForm() {
      	this.$refs.funcForm.validate(valid => {
      		if(valid) {
      			let data = Object.assign({}, this.funcForm)
      			console.log(data)
      			if(this.submitType === 0) {
      				createFunction(data).then(res => {
	      				console.log(res)
	      				if(res.data.code === '0001') {
	      					this.$message.success(res.data.message)
	      					this.getFuncTree()
	      				} else {
	      					this.$message.error(res.data.message)
	      				}
	      			}).catch(err => {
	      				console.log(err)
	      			})
      			} else {
      				updateFunction(data).then(res => {
      					if(res.data.code === '0001') {
	      					this.$message.success(res.data.message)
	      					this.getFuncTree()
	      				} else {
	      					this.$message.error(res.data.message)
	      				}
      				}).catch(err => {
	      				console.log(err)
	      			})
      			}
      			this.funcFormVisible = false
      		} else {
      			console.log('err submit')
      		}
      	})
      },
      // 删除功能点
      handleDelete() {
      	if (!this.checkedNode) {
      		return this.$notify.warning({title: '提示', message: '请选择功能点'})
      	}
      	// console.log(this.checkedNode)
      	if(this.checkedNode.children) {
      		return this.$notify.error({title: '提示', message: '该功能点有子节点，不可删除'})
      	}
      	this.$confirm(`确定删除 ${this.checkedNode.name} ？`, '提示', {type: 'warning'}).then(() => {
      		let data = {
	      		funcId: this.checkedNode.funcId
	      	}
	      	delFunction(data).then(res => {
	      		if(res.data.code === '0001') {
	  					this.$message.success(res.data.message)
	  					this.funcData = []
	  					this.getFuncTree()
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
      // handleFunc() {
      // 	if (!this.checkedNode) {
      // 		return this.$notify.warning({title: '提示', message: '请选择功能点'})
      // 	}
      // 	this.funcListVisible = true
      // },
      // 状态设置
      handleStatus() {
      	if (!this.checkedNode) {
      		return this.$notify.warning({title: '提示', message: '请选择功能点'})
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
      // 功能点信息
      handleShow(row) {
      	this.funcDetail = Object.assign({}, row)
      	this.funcDetailVisible = true
      },
		},
		computed: {
			disabled() {
				return this.checkedNode && this.checkedNode.status === 1 ? true : false
			}
		},
		mounted () {
			this.getFuncTree()
		}
	}
</script>
<style scoped lang="scss">
	.ztree {
		width: 100%;
		min-height: 400px;
		max-height: 600px;
		overflow-y: auto;
		border: 1px solid #ddd;
		
		&::-webkit-scrollbar {
      width: 4px;
      border-radius: 5px;
      background: #bbb
    }
    li {
    	overflow: hidden;
  		text-overflow: ellipsis;
  		white-space: nowrap;
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
</style>