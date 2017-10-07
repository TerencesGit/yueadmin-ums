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
      <el-table-column prop="partnerId" label="商家编号" sortable width="140"></el-table-column>
      <el-table-column prop="name" label="商家名称"></el-table-column>
      <el-table-column prop="adminName" label="注册人"></el-table-column>
      <el-table-column prop="corporationName" label="商家法人"></el-table-column>
      <el-table-column prop="areaName" label="所在地"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" sortable :formatter="formatTime" width="160"></el-table-column>
      <el-table-column prop="status" label="状态" :formatter="formatStatus">
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template scope="scope" v-if="scope.row.isVerified === 0">
        	<el-button size="small" type="info" @click="handleAdminShow(scope.row)">注册人信息</el-button>
        	<el-button v-if="scope.row.isVerified === 0" size="small" type="primary" @click="handleVerify(scope.row)">审核</el-button>
        	<el-button v-if="scope.row.isVerified === 2" size="small" type="warning" @click="handleReason(scope.row)">驳回原因</el-button>
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
   	<!-- 注册人信息 -->
		<el-dialog :visible.sync="registrantVisible" title="注册人信息">
			<el-form :model="registrantInfo" label-width="120px" v-loading="registrantLoading">
				<el-row>
					<el-col :span="12" :offset="5">
						<el-form-item label="">
							<img v-if="registrantInfo.avatarUrl" :src="registrantInfo.avatarUrl" alt="头像" class="avatar">
							<img v-else src="../../assets/img/avatar.gif" alt="头像" class="avatar">
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="姓名：">
							<span>{{registrantInfo.realname}}</span>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="性别：">
							<span>{{registrantInfo.sexaul === 0 ? '女' : '男' }}</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="邮箱：">
							<span>{{registrantInfo.email | email}}</span>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="手机号：">
							<span>{{registrantInfo.mobile | mobile}}</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="QQ：">
							<span>{{registrantInfo.qq || '暂无'}}</span>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="生日：">
							<span>{{registrantInfo.birthday || '暂无'}}</span>
						</el-form-item>
					</el-col>
				</el-row>
				<!-- <el-row>
					<el-col :span="12">
						<el-form-item label="部门：">
							<span>{{registrantInfo.orgName || '暂无'}}</span>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="职位：">
							<span>{{registrantInfo.titleName || '暂无'}}</span>
						</el-form-item>
					</el-col>
				</el-row> -->
				<el-row>
					<el-col :span="12">
						<el-form-item label="所在地：">
							<span>{{registrantInfo.areaName}}</span>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="注册时间：">
							<span>{{registrantInfo.createTime | formatDate}}</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="身份证正面：">
							<img :src="registrantInfo.idcardFrontUrl" alt="暂无身份证正面" class="idcard-pic">
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="身份证背面：">
							<img :src="registrantInfo.idcardBackUrl" alt="暂无身份证背面" class="idcard-pic">
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<div slot="footer">
				<el-button @click="registrantVisible = false">取消</el-button>
				<el-button type="primary" @click="registrantVisible = false">确定</el-button>
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
	import { getPartners, getAdminInfoById, getPartnerTypes, updatePartType, updatePartnerStatus, examPartner, rejectPartner } from '@/api'
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
			// 注册人信息查看
			handleAdminShow(row) {
      	this.registrantInfo = {};
      	this.registrantVisible = true;
      	let params = {
					userId: row.adminId
				}
				this.registrantLoading = true;
				getAdminInfoById(params).then(res => {
					this.registrantLoading = false;
					let userInfo = res.data.result.userInfo;
					let fileInfos = res.data.result.fileInfos;
					if(JSON.stringify(fileInfos) !== '{}') {
						userInfo.avatarUrl = userInfo.avatar && fileInfos[userInfo.avatar].fileUri;
						userInfo.idcardFrontUrl = userInfo.idcardPicFront && fileInfos[userInfo.idcardPicFront].fileUri;
						userInfo.idcardBackUrl = userInfo.idcardPicBack && fileInfos[userInfo.idcardPicBack].fileUri;
					}
					this.registrantInfo = userInfo;
				}).catch(err => {
					console.log(err)
					this.registrantLoading = false;
					this.$catchError(err)
				})
      },
			handleVerify(row) {
				this.$router.push({
					path: `/domain/verifyinfo?partnerId=${row.partnerId}`,
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
<style scoped>
	.avatar {
	  width: 160px;
	  height: 160px;
	  border-radius: 50%;
	  border: 1px solid #ddd;
	}
</style>