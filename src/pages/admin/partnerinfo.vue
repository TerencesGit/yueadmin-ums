<template>
	<section>
		<div v-title :data-title="this.$route.name"></div>
		<el-card class="card-primary">
			<div slot="header" class="card-header">
			  <strong>商家信息</strong>
			  <span @click="handleBack">返回</span>
			</div>
			<el-row>
				<el-col :span="22" :offset="1">
					<el-form 
						:model="partnerForm" 
						ref="partnerForm" 
						label-width="150px"
						v-loading="loading">
						<el-row class="title">
							<h3>{{partnerForm.name}}</h3>
							<span>管理员：<strong title="查看信息" @click="handleAdminShow">{{partnerForm.adminName}}</strong></span>
						</el-row>
						<el-row>
							<el-col :span="12">
								<el-form-item label="商家简称：">
									<span>{{partnerForm.shortName}}</span>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item label="商家所在地：">
									<span>{{partnerForm.areaName}}</span>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="12">
								<el-form-item label="商家电话：">
									<span>{{partnerForm.mobile}}</span>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item label="商家邮箱：">
									<span>{{partnerForm.email}}</span>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="12">
								<el-form-item label="商家邮编：">
									<span>{{partnerForm.post}}</span>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item label="联系地址：">
									<span>{{partnerForm.contactAddress}}</span>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="12">
								<el-form-item label="商家法人：">
									<span>{{partnerForm.corporationName}}</span>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item label="法人身份证号：">
									<span>{{partnerForm.idcardNum}}</span>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="12">
								<el-form-item label="营业执照注册号：">
									<span>{{partnerForm.licenseNum}}</span>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item label="联系人：">
									<span>{{partnerForm.contactName}}</span>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="12">
								<el-form-item label="商家固话：">
									<span>{{partnerForm.telphone}}</span>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item label="商家传真：">
									<span>{{partnerForm.fax}}</span>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="12">
								<el-form-item label="LOGO：">
									<img :src="logoUrl" alt="LOGO" class="logo">
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item label="营业执照图片：">
									<img :src="licenseUrl" alt="营业执照图片" class="lisence">
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="12">
								<el-form-item label="法人身份证正面：">
									<img :src="idcardFrontUrl" alt="法人身份证正面" class="idcard">
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item label="法人身份证背面：">
									<img :src="idcardBackUrl" alt="法人身份证背面" class="idcard">
								</el-form-item>
							</el-col>
						</el-row>
						<el-form-item label="商家简介：" prop="note">
							<p style="word-wrap: break-word;">{{partnerForm.note}}</p>
						</el-form-item>
					</el-form>
				</el-col>
			</el-row>
		</el-card>
		<!-- 管理员信息 -->
		<el-dialog :visible.sync="registrantVisible" title="管理员信息">
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
				<el-row>
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
				</el-row>
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
	</section>
</template>
<script>
	import { getPartnerInfoById, getAdminInfoById } from '@/api'
	export default {
		data() {
			return {
				partnerForm: {
					name: '',
					shortName: '',
					email: '',
					telphone: '',
					mobile: '',
					post: '',
					logo: '',
					fax: '',
					idcardNum: '',
					idcardPicFront: '',
					idcardPicBack: '',
					contactName: '',
					contactAddress: '',
					licenseNum: '',
					licensePic: '',
					corporationName: '',
					note: ''
				},
				logoUrl: '',
				licenseUrl: '',
				idcardFrontUrl: '',
				idcardBackUrl: '',
				loading: false,
				registrantInfo: {},
				registrantVisible: false,
				registrantLoading: false,
			}
		},
		methods: {
			// 获取商家信息
			getPartnerInfo() {
				let params = {
					partnerId: this.partnerId
				}
				this.loading = true;
				getPartnerInfoById(params).then(res => {
					this.loading = false;
					if(res.data.code === '0001') {
						this.partnerForm = res.data.result.partnerInfo
						let fileInfos = res.data.result.fileInfos;
						if(JSON.stringify(fileInfos) !== '{}') {
	      			this.logoUrl = this.partnerForm.logo && fileInfos[this.partnerForm.logo].fileUri;
							this.licenseUrl = this.partnerForm.licensePic && fileInfos[this.partnerForm.licensePic].fileUri;
							this.idcardFrontUrl = this.partnerForm.idcardPicFront && fileInfos[this.partnerForm.idcardPicFront].fileUri;
							this.idcardBackUrl = this.partnerForm.idcardPicBack && fileInfos[this.partnerForm.idcardPicBack].fileUri;
						}
					} else {
						this.$message.error(res.data.message)
					}
				}).catch(err => {
					console.log(err)
					this.loading = false;
					this.$catchError(err)
				})
			},
			handleBack() {
				this.$router.back()
			},
			// 管理员信息查看
			handleAdminShow() {
      	this.registrantInfo = {};
      	this.registrantVisible = true;
      	let params = {
					userId: this.partnerForm.adminId
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
		},
		mounted() {
			this.partnerId = this.$route.query.partnerId;
			this.partnerId && this.getPartnerInfo()
		}
	}
</script>
<style scoped lang="scss">
	.card-header {
		display: flex;
		justify-content: space-between;
		span {
			cursor: pointer
		}
	}
	.title {
		margin: 20px 0;
		text-align: center;
		h3 {
			margin-bottom: 10px;
			font-size: 22px;
		}
		span {
			font-size: 16px
		}
		strong {
			font-weight: normal;
			cursor: pointer;
			&:hover {
				color: #23527c
			}
		}
	}
	.el-form-item {
		span {
			font-size: 16px;
		}
	}
	.logo {
		display: inline-block;
		width: 150px;
		height: 150px;
	}
	.lisence {
		display: inline-block;
		width: 250px;
		height: 200px;
	}
	.idcard {
		display: inline-block;
		width: 253px;
		height: 156px;
		border-radius: 4px;
	}
	.avatar {
	  width: 160px;
	  height: 160px;
	  border-radius: 50%;
	  border: 1px solid #ddd;
	}
</style>