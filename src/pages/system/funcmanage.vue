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
			<el-button type="success" class="m-l" @click="handleCreateModule">新建模块</el-button>
			<el-button type="warning" class="m-l" @click="handleUpdateModule">编辑当前模块</el-button>
		</el-row>
		<el-card class="card-primary">
			<div slot="header">组织部门管理</div>
			<el-row :gutter="15">
				<el-col :span="5" class="tree" v-loading="loading">
					<ul id="functionTree" class="ztree"></ul>
				</el-col>
				<el-col :span="19" v-if="functionTree.length === 0">
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
					</el-row>
					<h3 class="page-header">当前功能点</h3>
					<el-table
						border
			      :data="funcData"
			      highlight-current-row
			      v-loading="tableLoading" 
			      style="width: 100%">
			      <el-table-column prop="funcId" label="编号" width="120"></el-table-column>
			      <el-table-column prop="name" label="名称"></el-table-column>
			      <el-table-column prop="md5" label="编码"></el-table-column>
			      <el-table-column prop="funcurl" label="路由"></el-table-column>
			      <el-table-column prop="updateTime" label="更新时间" width="120"></el-table-column>
			      <el-table-column prop="status" label="状态" :formatter="formatStatus" width="80"></el-table-column>
			      <el-table-column label="详情" width="80">
			      	<template scope="scope">
			      		<el-button type="primary" size="small" @click="handleShow(scope.row)">查看</el-button>
			      	</template>
			      </el-table-column>
			    </el-table>
				</el-col>
			</el-row>
		</el-card>
		<!-- 模块表单 -->
		<el-dialog :visible.sync="moduleFormVisible" :title="moduleFormTitle">
			<el-row>
				<el-col :span="18" :offset="3">
					<el-form :model="moduleForm" :rules="moduleRules" ref="moduleForm" label-width="120px">
						<el-form-item label="模块名称" prop="name">
							<el-input v-model="moduleForm.name" placeholder="请输入模块名称"></el-input>
						</el-form-item>
						<el-form-item label="部署根路径" prop="contextRoot">
							<el-input v-model="moduleForm.contextRoot" placeholder="部署根路径"></el-input>
						</el-form-item>
						<!-- <el-form-item label="模块标识">
							<el-select v-model="moduleForm.clientId" style="width: 100%">
								<el-option 
									v-for="item in clientList" 
									:key="item.clientId"
									:label="item.clientName"
								  :value="item.clientId">
								</el-option>
							</el-select>
						</el-form-item> -->
						<el-form-item label="模块描述" prop="note">
							<el-input type="textarea" v-model="moduleForm.note" placeholder="请输入模块描述"></el-input>
						</el-form-item>
					</el-form>
				</el-col>
			</el-row>
			<div slot="footer">
				<el-button @click="moduleFormVisible = false">取消</el-button>
				<el-button type="primary" @click="moduleFormSubmit">确定</el-button>
			</div>
		</el-dialog>
		<!-- 功能点表单 -->
		<el-dialog :visible.sync="funcFormVisible" :title="funcFormTitle">
			<el-row>
				<el-col :span="18" :offset="3">
					<el-form :model="funcForm" :rules="rules" ref="funcForm" label-width="120px">
						<el-form-item label="功能点名称" prop="name">
							<el-input v-model="funcForm.name" placeholder="请输入功能点名称"></el-input>
						</el-form-item>
						<el-form-item label="功能点编码" prop="funcMd5">
							<el-input v-model="funcForm.funcMd5" placeholder="请输入功能点编码"></el-input>
						</el-form-item>
						<el-form-item label="功能点路由" prop="funcUrl">
							<el-input v-model="funcForm.funcUrl" placeholder="请输入功能点路由"></el-input>
						</el-form-item>
						<el-form-item label="同级序列号" prop="funcSeq">
							<el-input v-model="funcForm.funcSeq" placeholder="请输入同级序列号"></el-input>
						</el-form-item>
						<el-form-item label="菜单显示名称" prop="viewname">
							<el-input v-model="funcForm.viewname" placeholder="菜单显示名称"></el-input>
						</el-form-item>
						<el-form-item label="功能点图标" prop="funcIco">
							<el-input v-model="funcForm.funcIco" placeholder="功能点图标"></el-input>
						</el-form-item>
						<el-form-item label="是否为菜单项">
							<el-select v-model="funcForm.isMenu" style="width: 100%">
								<el-option label="是" :value="1"></el-option>
								<el-option label="否" :value="0"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="功能点状态">
							<el-select v-model="funcForm.status" style="width: 100%">
								<el-option label="启用" :value="1"></el-option>
								<el-option label="禁用" :value="0"></el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="功能点描述" prop="funcDesc">
							<el-input type="textarea" :rows="2" v-model="funcForm.funcDesc" placeholder="请输入功能点描述"></el-input>
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
						<el-form-item label="功能点名称：">
							<span>{{funcDetail.name}}</span>
						</el-form-item>
						<el-form-item label="功能点编码：">
							<span>{{funcDetail.md5}}</span>
						</el-form-item>
						<el-form-item label="功能点路由：">
							<span>{{funcDetail.funcurl}}</span>
						</el-form-item>
						<el-form-item label="同级序列号：">
							<span>{{funcDetail.seq}}</span>
						</el-form-item>
						<el-form-item label="菜单显示名称：">
							<span>{{funcDetail.viewname}}</span>
						</el-form-item>
						<el-form-item label="功能点图标：">
							<span>{{funcDetail.ico}}</span>
						</el-form-item>
						<el-form-item label="是否为菜单项：">
							<span>{{funcDetail.ismunu === 1 ? '是' : '否'}}</span>
						</el-form-item>
						<el-form-item label="功能点状态：">
							<span>{{funcDetail.status === 1 ? '启用' : '禁用'}}</span>
						</el-form-item>
						<el-form-item label="功能点描述：">
							<span>{{funcDetail.desc}}</span>
						</el-form-item>
						<el-form-item label="更新时间：">
							<span>{{this.$moment(new Date()).format('YYYY-MM-DD')}}</span>
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
	import { getModuleFunctionList, createFunction, updateFunction, 								 delFunction, setOrganizeStatus, getModules, createModule, 
				   updateModule } from '@/api'
	export default {
		data() {
			return {
				moduleId: '',
				moduleList: [],
				moduleFormTitle: '',
				moduleFormVisible: false,
				// clientList: [],
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
	      	parentId: '',
	      	funcMd5: '',
	      	funcSeq: '',
	      	funcUrl: '',
	      	funcDesc: '',
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
	      	funcMd5: [
	      		{ required: true, message: '请输入功能点编码', trigger: 'blur'}
	      	],
	      	funcUrl: [
	      		{ required: true, message: '请输入功能点路由', trigger: 'blur'}
	      	],
	      	funcDesc: [
	      		{ required: true, message: '请输入功能点描述', trigger: 'blur'}
	      	],
	      	funcSeq: [
	      		{ required: true, message: '请输入同级序列号', trigger: 'blur'}
	      	],
	      	viewname: [
	      		{ required: true, message: '请输入菜单显示名称', trigger: 'blur'}
	      	],
	      	funcIco: [
	      		{ required: true, message: '请输入功能点图标', trigger: 'blur'}
	      	],
	      },
	      funcDetail: {},
	      moduleForm: {
	      	name: '',
	      	contextRoot: '',
	      	note: '',
	      },
	      moduleRules: {
	      	name: [
	      		{ required: true, message: '请输入模块名称', trigger: 'blur'}
	      	],
	      	contextRoot: [
	      		{ required: true, message: '请输入模块部署根路径', trigger: 'blur'}
	      	],
	      	note: [
	      		{ required: true, message: '请输入模块描述', trigger: 'blur'}
	      	],
	      },
			}
		},
		methods: {
			formatStatus(row) {
				return row.status === 1 ? '启用' : '禁用'
			},
			handleSizeChange(val) {
				this.pageSize = val
			},
			handleCurrentChange(val) {
				this.currentPage = val
			},
			// 获取功能模块列表
			getModuleList() {
				getModules().then(res => {
					if(res.data.code === '0001') {
						this.moduleList = res.data.result.modules
						this.moduleId = this.moduleList[0].moduleId;
  				} else {
  					this.$message.error(res.data.message)
  				}
				}).catch(err => {
					console.log(err)
					this.$catchError(err)
				})
			},
			// 获取模块标识列表
			// getClientList() {
			// 	getMailClientList().then(res => {
			// 		console.log(res)
			// 		if(res.data.code === '0001') {
			// 				this.clientList = res.data.result.clientList
	  // 				} else {
	  // 					this.$message.error(res.data.message)
	  // 				}
			// 		}).catch(err => {
			// 			console.log(err)
			// 			this.$catchError(err)
			// 		})
			// },
			// 新建模块
			handleCreateModule() {
				this.moduleForm = {
	      	name: '',
	      	contextRoot: '',
	      	note: '',
	      },
				this.moduleFormTitle = '新建系统模块'
				this.moduleFormVisible = true
			},
			// 编辑模块
			handleUpdateModule() {
				let currModule = this.moduleList.filter(module => module.moduleId === this.moduleId)[0];
				this.moduleForm = {
					moduleId: currModule.moduleId,
					name: currModule.name,
	      	contextRoot: currModule.contextRoot,
	      	note: currModule.note,
				}
				this.moduleFormTitle = '编辑系统模块'
				this.moduleFormVisible = true
			},
			// 模块提交
			moduleFormSubmit() {
				this.$refs.moduleForm.validate(valid => {
					if(!valid) return;
					let data = Object.assign({}, this.moduleForm)
					if(data.moduleId) {
						updateModule(data).then(res => {
							if(res.data.code === '0001') {
								this.$message.success(res.data.message)
								this.getModuleList()

		  				} else {
		  					this.$message.error(res.data.message)
		  				}
						}).catch(err => {
							console.log(err)
							this.$catchError(err)
						})
					} else {
						createModule(data).then(res => {
							if(res.data.code === '0001') {
								this.$message.success(res.data.message)
								this.getModuleList()
		  				} else {
		  					this.$message.error(res.data.message)
		  				}
						}).catch(err => {
							console.log(err)
							this.$catchError(err)
						})
					}
					this.moduleFormVisible = false
				})
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
				getModuleFunctionList(data).then(res => {
					if(res.data.code === '0001') {
						const funcTree = res.data.result.functions;
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
				        md5: func.funcMd5,
				        funcurl: func.funcUrl,
				        seq: func.funcSeq,
				        viewname: func.viewname,
				        ico: func.funcIco,
				        desc: func.funcDesc,
				        status: func.status,
				        ismenu: func.isMenu,
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
      	this.funcFormTitle = '新增功能点'
      	this.funcForm = {
      		funcId: '',
      		name: '',
      		funcMd5: '',
      		funcUrl: '',
      		funcSeq: '',
      		viewname: '',
      		funcIco: '',
      		funcDesc: '',
      		status: 1,
      		isMenu: 1,
      		parentId: this.checkedNode.funcId,
      		moduleId: this.moduleId
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
      		funcMd5: this.checkedNode.md5,
      		funcUrl: this.checkedNode.funcurl,
      		funcSeq: this.checkedNode.seq + '',
      		viewname: this.checkedNode.viewname,
      		funcIco: this.checkedNode.ico,
      		funcDesc: this.checkedNode.desc,
      		status: this.checkedNode.status,
      		isMenu: this.checkedNode.ismenu,
      	}
      	this.funcFormTitle = '编辑功能点'
      	this.funcFormVisible = true
      },
      // 提交表单
      submitForm() {
      	this.$refs.funcForm.validate(valid => {
      		if(valid) {
      			let data = Object.assign({}, this.funcForm)
      			// console.log(data)
      			if(data.funcId) {
      				updateFunction(data).then(res => {
      					if(res.data.code === '0001') {
	      					this.$message.success(res.data.message)
	      					this.getFuncTree()
	      					this.funcData = [];
	      				} else {
	      					this.$message.error(res.data.message)
	      				}
      				}).catch(err => {
	      				console.log(err)
	      			})
      			} else {
      				createFunction(data).then(res => {
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
	      		this.$catchError(err)
	      	})
      	}).catch(err => {
      		console.log(err)
      		this.$message('已取消操作')
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
			this.getModuleList()
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