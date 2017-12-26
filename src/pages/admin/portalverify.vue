<template>
	<section>
		<div v-title :data-title="this.$route.name"></div>
		<el-row class="toolbar">
			<el-radio-group v-model="isVerified" @change="isVerifiedChange">
		    <el-radio-button :label="0">待审核</el-radio-button>
		    <el-radio-button :label="2">未通过</el-radio-button>
		  </el-radio-group>
    </el-row>
		<el-table 
      border 
      :data="partnerList" 
      v-loading="loading" 
      highlight-current-row
      style="width: 100%">
      <el-table-column type="index" width="55"></el-table-column>
      <el-table-column prop="partnerName" label="商家名称"></el-table-column>
      <el-table-column prop="contactName" label="联系人"></el-table-column>
      <el-table-column prop="email" label="邮箱"></el-table-column>
      <el-table-column prop="mobile" label="手机号"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" sortable :formatter="formatTime" width="160"></el-table-column>
      <el-table-column prop="status" label="状态" :formatter="formatStatus">
      </el-table-column>
      <el-table-column label="操作">
        <template scope="scope" v-if="scope.row.isVerified === 0">
        	<el-button size="small" type="success" @click="handlePass(scope.row)">通过</el-button>
        	<el-button size="small" type="warning" @click="handleReject(scope.row)">驳回</el-button>
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
    <!-- 驳回原因 -->
    <el-dialog :visible.sync="rejectInfoVisible" title="驳回原因">
			<p>{{partInfo.rejectInfo}}</p>
			<div slot="footer">
        <el-button @click="rejectInfoVisible = false">取消</el-button>
        <el-button type="primary" @click="rejectInfoVisible = false">确定</el-button>
      </div>
    </el-dialog>
	</section>
</template>
<script>
	import { getPortals, updatePortalIsVerified } from '@/api'
	export default {
		data() {
			return {
				pageNo: 1,
				pageSize: 10,
				total: 0,
				loading: false,
				isVerified: 0,
				partnerList: [],
				partInfo: {},
				registrantInfo: {},
				registrantVisible: false,
				registrantLoading: false,
				rejectForm: {
					rejectInfo: '',
				},
				rejectFormVisible: false,
				rejectInfoVisible: false,
			}
		},
		methods: {
			formatStatus(row) {
				return row.isVerified === 0 ? '待审核' : row.isVerified === 1 ? '审核通过' : '审核未通过'
			},
			formatTime(row) {
				return this.$moment(row.createTime).format('YYYY-MM-DD HH:mm')
			},
			handleSizeChange(val) {
				this.pageSize = val;
				this.getPortalList()
			},	
			handleCurrentChange(val) {
				this.pageNo = val;
				this.getPortalList()
			},
			isVerifiedChange(val) {
				this.isVerified = val;
				this.getPortalList()
			},
			getPortalList() {
				let params = {
					pageNo: this.pageNo,
					pageSize: this.pageSize,
					isVerified: this.isVerified,
				}
				this.loading = true
				getPortals(params).then(res => {
					if(res.data.code === '0001') {
						this.partnerList = res.data.result.portalList;
						this.total = res.data.result.pageInfo.total;
					} else {
						this.$message.error(res.data.message)
					}
					this.loading = false
				}).catch(err => {
					console.log(err)
					this.loading = false
				})
			},
			handlePass(row) {
				this.$confirm('确定通过审核？', '提示', {
	        confirmButtonText: '确定',
	        cancelButtonText: '取消',
	        type: 'warning'
	      }).then(() => {
	      	let data = {
	      		userId: row.userId,
	      		isVerified: 1,
	      	}
	      	updatePortalIsVerified(data).then(res => {
	      		if(res.data.code === '0001') {
	      			this.$message.success(res.data.message)
	      			this.getPortalList()
	      		} else {
	      			this.$message.error(res.data.message)
	      		}
	      	}).catch(err => {
	      		console.log(err)
	      		this.$catchError(err)
	      	})
	      }).catch(err => {
	      })
			},
			handleReject(row) {
				this.$confirm('确定驳回审核？', '提示', {
	        confirmButtonText: '确定',
	        cancelButtonText: '取消',
	        type: 'warning'
	      }).then(() => {
	      	let data = {
	      		userId: row.userId,
	      		isVerified: 2,
	      	}
	      	updatePortalIsVerified(data).then(res => {
	      		if(res.data.code === '0001') {
	      			this.$message.success(res.data.message)
	      			this.getPortalList()
	      		} else {
	      			this.$message.error(res.data.message)
	      		}
	      	}).catch(err => {
	      		console.log(err)
	      		this.$catchError(err)
	      	})
	      }).catch(err => {
	      })
			},
			// 查看驳回原因
			handleReason(row) {
				this.partInfo = row
				this.rejectInfoVisible = true;
			},
		},
		mounted() {
			this.getPortalList()
		}
	}
</script>
<style scoped>
	.avatar {
	  width: 160px;
	  height: 160px;
	  border-radius: 50%;
	  border: 1px solid #ddd;
	}
</style>