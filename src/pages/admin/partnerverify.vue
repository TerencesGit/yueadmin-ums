<template>
	<section>
		<div v-title :data-title="this.$route.name"></div>
		<el-row class="toolbar">
			<el-radio-group v-model="isVerified" @change="isVerifiedChange">
		    <el-radio-button :label="0">待审核</el-radio-button>
		    <!-- <el-radio-button :label="1">已通过</el-radio-button> -->
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
      <el-table-column prop="partnerId" label="商家编号" sortable width="140"></el-table-column>
      <el-table-column prop="name" label="商家名称"></el-table-column>
      <el-table-column prop="corporationName" label="联系人"></el-table-column>
      <el-table-column prop="contactAddress" label="联系地址"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" sortable :formatter="formatTime" width="160"></el-table-column>
      <el-table-column prop="status" label="状态" :formatter="formatStatus">
      </el-table-column>
      <el-table-column label="操作">
        <template scope="scope" v-if="scope.row.isVerified === 0">
        	<el-button v-if="scope.row.isVerified === 0" size="small" type="info" @click="handleVerify(scope.row)">审核</el-button>
        	<el-button v-if="scope.row.isVerified === 2" size="small" type="info" @click="handleReason(scope.row)">驳回原因</el-button>
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
    <!-- 商家信息 -->
    <el-dialog :visible.sync="partInfoVisible" title="商家信息">
    	<el-row>
    		<el-col :span="14" :offset="5">
		    	<el-form label-width="150px">
		    		<el-form-item label="" label-width="100px">
		    			<img :src="partInfo.logoUri" alt="logo" class="logo">
		    		</el-form-item>
		    		<el-form-item label="商家名称：">
		    			<span>{{partInfo.name}}</span>
		    		</el-form-item>
		    		<el-form-item label="商家简称：">
		    			<span>{{partInfo.shortName}}</span>
		    		</el-form-item>
		    		<el-form-item label="商家邮箱：">
		    			<span>{{partInfo.email}}</span>
		    		</el-form-item>
		    		<el-form-item label="移动电话：">
		    			<span>{{partInfo.mobile}}</span>
		    		</el-form-item>
		    		<el-form-item label="固话：">
		    			<span>{{partInfo.telphone}}</span>
		    		</el-form-item>
		    		<el-form-item label="地址：">
		    			<span>{{partInfo.contactAddress}}</span>
		    		</el-form-item>
		    		<el-form-item label="备注：">
		    			<span>{{partInfo.note}}</span>
		    		</el-form-item>
		    	</el-form>
    		</el-col>
    	</el-row>
    	<div slot="footer">
    		<el-button @click="partInfoVisible = false">取消</el-button>
    		<el-button type="primary" @click="partInfoVisible = false">确定</el-button>
    	</div>
    </el-dialog>
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
	import { getPartners, getPartnerTypes, updatePartType, updatePartnerStatus, examPartner, rejectPartner } from '@/api'
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
				partInfoVisible: false,
				typeId: '',
				typeList: [],
				tpyeLoading: false,
				typeListVisible: false,
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
				this.getPartnerList()
			},	
			handleCurrentChange(val) {
				this.pageNo = val;
				this.getPartnerList()
			},
			isVerifiedChange(val) {
				this.isVerified = val;
				this.getPartnerList()
			},
			getPartnerList() {
				let params = {
					pageNo: this.pageNo,
					pageSize: this.pageSize,
					isVerified: this.isVerified,
				}
				this.loading = true
				getPartners(params).then(res => {
					if(res.data.code === '0001') {
						this.partnerList = res.data.result.partners;
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
			handleVerify(row) {
				this.$router.push({
					path: `/domain/verifyinfo?partnerId=${row.partnerId}`,
				})
			},
			handleStatus(row) {
				let data = {
					partnerId: row.partnerId,
					status: row.status
				}
				updatePartnerStatus(data).then(res => {
					if(res.data.code === '0001') {
						this.$message.success(res.data.message)
					} else {
						row.status = row.status === 1 ? 0 : 1;
						this.$message.error(res.data.message)
					}
				}).catch(err => {
					console.log(err)
					row.status = row.status === 1 ? 0 : 1;
					this.$catchError(err)
				})
			},
			// 查看驳回原因
			handleReason(row) {
				this.partInfo = row
				this.rejectInfoVisible = true;
			},
		},
		mounted() {
			this.getPartnerList()
		}
	}
</script>
<style scoped lang="scss">
	.logo {
		display: inline-block;
		width: 150px;
		height: 150px;
		border-radius: 5px;
	}
</style>