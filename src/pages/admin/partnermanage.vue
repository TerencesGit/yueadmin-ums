<template>
	<section>
		<div v-title :data-title="this.$route.name"></div>
		<el-row class="toolbar">
			<el-form inline>
				<!-- <el-form-item label="商家编号">
					<el-input v-model="filter.code" placeholder="商家编号"></el-input>
				</el-form-item> -->
				<el-form-item label="商家名称">
					<el-input v-model="partnerName" placeholder="商家名称"></el-input>
				</el-form-item>
				<el-form-item label="">
					<el-button type="primary" @click="getPartnerList">搜索</el-button>
				</el-form-item>
			</el-form>
    </el-row>
		<el-table 
      border 
      stripe
      :data="partnerList" 
      v-loading="loading" 
      highlight-current-row
      style="width: 100%">
      <el-table-column type="index" width="55"></el-table-column>
      <el-table-column prop="partnerId" label="商家编号" sortable></el-table-column>
      <el-table-column prop="name" label="商家名称"></el-table-column>
      <el-table-column prop="typeName" label="商家类型"></el-table-column>
      <el-table-column prop="adminName" label="管理员"></el-table-column>
      <el-table-column prop="corporationName" label="商家法人"></el-table-column>
      <el-table-column prop="areaName" label="所在地"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" sortable :formatter="formatTime"></el-table-column>
      <el-table-column prop="status" label="状态">
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
      <el-table-column label="商家信息" width="180">
        <template scope="scope">
        	<el-button size="small" type="info" @click="handleDetail(scope.row)">查看</el-button>
        <!-- 	<el-button size="small" type="info" @click="showStaffList(scope.row)">员工列表</el-button> -->
        	<router-link class="el-button el-button--info el-button--small" :to='"/domain/staffmanage?partnerId="+scope.row.partnerId' target="_blank">员工列表</router-link>
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
	</section>
</template>
<script>
	import { getPartners, getPartnerTypes, updatePartType, updatePartnerStatus } from '@/api'
	export default {
		data() {
			return {
				pageNo: 1,
				pageSize: 10,
				total: 0,
				partnerName: '',
				loading: false,
				partnerList: [],
				partInfo: {},
				partInfoVisible: false,
				typeId: '',
				typeList: [],
				tpyeLoading: false,
				typeListVisible: false,
			}
		},
		methods: {
			formatStatus(row) {
				return row.status === 1 ? '启用' : '禁用'
			},
			formatTime(row) {
				return this.$moment(row.createTime).format('YYYY-MM-DD')
			},
			handleSizeChange(val) {
				this.pageSize = val;
				this.getPartnerList()
			},	
			handleCurrentChange(val) {
				this.pageNo = val;
				this.getPartnerList()
			},
			handleSearch() {
				console.log(Object.assign({}, this.filter))
			},
			getPartnerList() {
				let params = {
					pageNo: this.pageNo,
					pageSize: this.pageSize,
					partnerName: this.partnerName,
					isVerified: 1
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
					this.$catchError(err)
				})
			},
			handleDetail(row) {
				this.$router.push({
					path: `/domain/partnerinfo?partnerId=${row.partnerId}`,
				})
				// this.partInfoVisible = true
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
			showStaffList(row) {
				this.$router.push({
					path: `/domain/partnerstaff?partnerId=${row.partnerId}`,
				})
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