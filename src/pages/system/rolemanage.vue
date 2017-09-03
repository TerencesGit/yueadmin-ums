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
	        :current-page="filter.pageNo"
	        :page-size="filter.pageSize"
	        :page-sizes="[10, 20, 30, 40]"
	        layout="total, sizes, prev, pager, next, jumper"
	        :total="total"
	        class="pull-right">
	      </el-pagination>
	    </el-row>
	    <el-dialog :visible.sync="roleFormVisible" :title="roleFormTitle">
	    	
	    </el-dialog>
	</section>
</template>
<script>
	export default {
		data () {
			return {
				filter: {
					code: '',
					name: '',
					pageNo: 1,
					pageSize: 10
				},
				total: 0,
				loading: false,
				roleList: [],
				roleFormVisible: false,
				roleFormTitle: '',
			}
		},
		methods: {
			formatStatus(row) {
				return row.status === 1 ? '启用' : '禁用'
			},
			getRoleList() {

			},
			handleAdd() {
				this.roleFormTitle = '新增角色'
				this.roleFormVisible = true;
			},
			handleEdit() {

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