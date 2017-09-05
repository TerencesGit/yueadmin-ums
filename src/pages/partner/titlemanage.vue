<template>
	<section>
			<div v-title :data-title="this.$route.name"></div>
	    <el-row class="toolbar">
	    	<el-button type="primary" @click="handleAdd">新增职位</el-button>
	    </el-row>
      <el-table 
	      border 
	      :data="titleList" 
	      v-loading="loading" 
	      highlight-current-row
	      style="width: 100%">
	      <el-table-column type="selection" width="60"></el-table-column>
	      <el-table-column type="index" width="60"></el-table-column>
	      <el-table-column prop="titleId" label="职位编号" sortable width="140"></el-table-column>
	      <el-table-column prop="titleName" label="职位名称"></el-table-column>
	      <el-table-column prop="createTime" label="更新时间" sortable width="180" :formatter="formatTime"></el-table-column>
	      <el-table-column prop="note" label="备注"></el-table-column>
	      <el-table-column label="操作" width="240">
	        <template scope="scope">
	          <el-button type="primary" size="small" @click="handleDetail(scope.row)">详情</el-button>
	          <el-button type="warning" size="small" @click="handleEdit(scope.row)">编辑</el-button>
	          <el-button type="danger" size="small" @click="handleDelete(scope.row)">删除</el-button>
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
	    <el-dialog :visible.sync="titleFormVisible" :title="titleFormTitle">
	    	
	    </el-dialog>
	</section>
</template>
<script>
	import { getPartnerTitle } from '@/api'
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
				titleList: [],
				titleFormVisible: false,
				titleFormTitle: '',
			}
		},
		methods: {
			formatTime(row) {
				return this.$moment(new Date()).format('YYYY-MM-DD HH:mm')
			},
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
			handleAdd() {
				this.titleFormTitle = '新增职位'
				this.titleFormVisible = true;
			},
			handleDetail() {
				this.$notify.error({
      		title: '提示',
      		message: '暂无该功能！', 
      	})
			},
			handleEdit() {
				this.$notify.error({
      		title: '提示',
      		message: '暂无该功能！', 
      	})
			},
			handleDelete() {
				this.$notify.error({
      		title: '提示',
      		message: '暂无该功能！', 
      	})
			},
			handleSizeChange() {

			},
			handleCurrentChange() {

			}
		},
		mounted() {
			this.getTitleList()
		}
	}
</script>
<style scoped lang="scss">
	
</style>