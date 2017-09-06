<template>
	<section>
			<div v-title :data-title="this.$route.name"></div>
	    <el-row class="toolbar">
	      <el-form :inline="true" :model="filter">
	       <!--  <el-form-item label="">
	          <el-input v-model="filter.code" placeholder="输入角色编号"></el-input>
	        </el-form-item> -->
	        <el-form-item label="">
	          <el-input v-model="filter.name" placeholder="输入角色名称"></el-input>
	        </el-form-item>
	        <el-form-item label="">
	          <el-button type="primary" @click="getRoleList">搜索</el-button>
	        </el-form-item>
	        <el-form-item label="">
	          <el-button type="primary" @click="handleAdd">新增角色</el-button>
	        </el-form-item>
	      </el-form>
	    </el-row>
      <el-table 
	      border 
	      :data="roleList" 
	      v-loading="loading" 
	      highlight-current-row
	      style="width: 100%">
	      <el-table-column type="index" width="60"></el-table-column>
	      <el-table-column prop="roleId" label="角色编号" sortable width="140"></el-table-column>
	      <el-table-column prop="roleName" label="角色名称"></el-table-column>
	      <el-table-column prop="status" label="状态" width="120" :formatter="formatStatus"></el-table-column>
	      <el-table-column prop="createTime" label="创建时间" sortable width="180"></el-table-column>
	      <el-table-column label="操作" width="240">
	        <template scope="scope">
	          <el-button plain type="warning" size="small" @click="handleEdit(scope.row.roleId)">编辑</el-button>
	          <el-button size="small" @click="handleDetail(scope.row.roleId)">详情</el-button>
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
	</section>
</template>
<script>
	import { getSysRoles } from '@/api'
	export default {
		data () {
			return {
				filter: {
					code: '',
					name: '',
				},
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
				roleFormTitle: '',
				roleFormVisible: false,
			}
		},
		methods: {
			formatStatus(row) {
				return row.status === 1 ? '启用' : '禁用'
			},
			// 角色分页列表
			getRoleList() {
				let params = {
					pageNo: this.pageNo,
					pageSize: this.pageSize
				}
				getSysRoles(params).then(res => {
					if(res.data.code === '0001') {
						this.roleList = res.data.result.roles;
					} else {
						this.$message.error(res.data.message)
					}
				}).catch(err => {
					console.log(err)
				})
			},
			handleAdd() {
				this.roleFormTitle = '新增角色'
				this.roleFormVisible = true;
			},
			handleEdit() {
				this.roleFormTitle = '编辑角色'
				this.roleFormVisible = true;
			},
			submitForm() {

			},
			handleDetail() {

			},
			handleSizeChange() {

			},
			handleCurrentChange() {

			}
		}
	}
</script>
<style scoped lang="scss">
	
</style>