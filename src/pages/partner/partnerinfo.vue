<template>
	<section>
		<div v-title :data-title="this.$route.name"></div>
		<el-card class="card-primary">
			<div slot="header" class="card-header">
			  <strong>企业信息</strong>
			  <span @click="handleEdit"><i class="fa fa-edit"></i>编辑</span>
			</div>
			<el-row>
				<el-col :span="22" :offset="1">
					<el-form 
						:model="partnerForm" 
						ref="partnerForm" 
						label-width="150px">
						<el-row class="title">
							<h3>{{partnerForm.name}}</h3>
						</el-row>
						<el-row>
							<el-col :span="12">
								<el-form-item label="企业简称：">
									<span>{{partnerForm.shortName}}</span>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item label="企业所在地：">
									<span>{{partnerForm.areaName}}</span>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="12">
								<el-form-item label="企业电话：">
									<span>{{partnerForm.mobile}}</span>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item label="企业邮箱：">
									<span>{{partnerForm.email}}</span>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="12">
								<el-form-item label="企业邮编：">
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
								<el-form-item label="企业法人：">
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
								<el-form-item label="企业固话：">
									<span>{{partnerForm.telphone}}</span>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item label="企业传真：">
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
						<el-form-item label="企业简介：" prop="note">
							<p>{{partnerForm.note}}</p>
						</el-form-item>
					</el-form>
				</el-col>
			</el-row>
		</el-card>
	</section>
</template>
<script>
	import { getMyPartnerInfo } from '@/api'
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
			}
		},
		methods: {
			// 获取企业信息
			getPartnerInfo() {
				getMyPartnerInfo().then(res => {
					// console.log(res)
					if(res.data.code === '0001') {
						this.partnerForm = res.data.result.partnerInfo;
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
					this.$catchError(err)
				})
			},
			handleEdit() {
				this.$router.push('/partner/infoedit')
			}
		},
		mounted() {
			this.getPartnerInfo()
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
		margin: 30px 0;
		text-align: center;
		font-size: 20px;
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
	}
</style>