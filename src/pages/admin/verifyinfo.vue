<template>
	<section>
		<div v-title :data-title="this.$route.name"></div>
		<el-card class="card-primary">
			<div slot="header" class="card-header">
			  <strong>企业信息</strong>
			  <span @click="back">返回</span>
			</div>
			<el-row>
				<el-col :span="22" :offset="1">
					<el-form 
						:model="partnerForm" 
						ref="partnerForm" 
						label-width="150px"
						v-loading="loading"
						class="partner-form">
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
							<span>{{partnerForm.note}}</span>
						</el-form-item>
						<el-form-item class="button-item">
        			<el-button type="warning" @click="handleReject">驳回</el-button>
        			<el-button type="success" @click="handlePass">通过</el-button>
						</el-form-item>
					</el-form>
				</el-col>
			</el-row>
		</el-card>
		 <!-- 商家类型列表 -->
    <el-dialog title="选择商家类型列表" :visible.sync="typeListVisible">
      <el-row>
        <el-col :span="22" :offset="1">
          <el-table 
            border
            max-height="350"
            style="width: 100%"
            v-loading="tpyeLoading" 
            :data="typeList">
            <el-table-column width="80" label="选择" align="center">
              <template scope="scope">
                <el-radio class="radio no-label" v-model="typeId" :label="scope.row.typeId">
                </el-radio>
              </template>
            </el-table-column>
            <el-table-column prop="typeName" label="类型名称"></el-table-column>
            <el-table-column prop="note" label="类型描述"></el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <div slot="footer">
        <el-button @click="typeListVisible = false">取消</el-button>
        <el-button type="primary" @click="setTypeSubmit">确定</el-button>
      </div>
    </el-dialog>
    <!-- 商家驳回 -->
    <el-dialog title="商家驳回" :visible.sync="rejectFormVisible">
    	<el-row>
    		<el-col :span="20" :offset="2">
		    	<el-form :model="rejectForm" ref="rejectForm">
		    		<el-form-item 
			    		label="输入驳回原因" 
			    		prop="rejectInfo"
			    	  :rules="[
					      { required: true, message: '请输入驳回原因', trigger: 'blur' },
					    ]">
		    			<el-input type="textarea" :rows="5" v-model.trim="rejectForm.rejectInfo" placeholder="输入驳回原因"></el-input>
		    		</el-form-item>
		    	</el-form>
		    </el-col>
		  </el-row>
		  <div slot="footer">
    		<el-button @click="rejectFormVisible = false">取消</el-button>
    		<el-button type="primary" @click="rejectFormSubmit">确定</el-button>
    	</div>
    </el-dialog>
	</section>
</template>
<script>
	import { getPartnerInfoById, getPartnerTypes, updatePartType, examPartner, rejectPartner } from '@/api'
	export default {
		data() {
			return {
				partnerId: '',
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
			// 获取企业信息
			getPartnerInfo() {
				let params = {
					partnerId: this.partnerId
				}
				this.loading = true;
				getPartnerInfoById(params).then(res => {
					console.log(res)
					this.loading = false;
					if(res.data.code === '0001') {
						this.partnerForm = res.data.result.partnerInfo
						let fileInfos = res.data.result.fileInfos;
						this.logoUrl = fileInfos.logo;
						this.licenseUrl = fileInfos.licensePic;
						this.idcardFrontUrl = fileInfos.idcardPicFront;
						this.idcardBackUrl = fileInfos.idcardPicBack;
					} else {
						this.$message.error(res.data.message)
					}
				}).catch(err => {
					this.loading = false;
					console.log(err)
					this.$catchError(err)
				})
			},
			back() {
				this.$router.back()
			},
			getTypeList() {
				let params = {
					pageNo: 1,
					pageSize: 100
				}
				this.tpyeLoading = true;
				getPartnerTypes(params).then(res => {
					this.tpyeLoading = false
					if(res.data.code === '0001') {
						this.typeList = res.data.result.partnerTypes;
					} else {
						this.$message.error(res.data.message)
					}
				}).catch(err => {
					console.log(err)
					this.tpyeLoading = false;
					this.$catchError(err)
				})
			},
			handlePass() {
				this.typeList.length === 0 && this.getTypeList()
				this.typeListVisible = true
			},
			// 设置商家类型提交
			setTypeSubmit() {
				if(!this.typeId){
					this.$notify({
						type: 'warning',
						title: '提示',
						message: '请选择商家类型'
					})
					return;
				}
				let data = {
					partnerId: this.partnerId,
					typeId: this.typeId
				}
				examPartner(data).then(res => {
					if(res.data.code === '0001') {
						this.$message.success(res.data.message)
						this.back()
					} else {
						this.$message.error(res.data.message)
					}
				}).catch(err => {
					console.log(err)
					this.$catchError(err)
				})
				this.typeListVisible = false;
			},
			handleReject() {
				this.rejectFormVisible = true
			},
			// 驳回提交
			rejectFormSubmit() {
				this.$refs.rejectForm.validate(valid => {
					if(!valid) return;
					let data = {
						partnerId: this.partnerId,
						rejectInfo: this.rejectForm.rejectInfo
					}
					console.log(data)
					rejectPartner(data).then(res => {
						if(res.data.code === '0001') {
							this.$message.success(res.data.message)
							this.back()
							// this.getPartnerList()
						} else {
							this.$message.error(res.data.message)
						}
					}).catch(err => {
						console.log(err)
						this.$catchError(err)
					})
					this.rejectFormVisible = false
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
	.partner-form {
		padding: 20px;
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
	.button-item {
		margin: 30px 0 0 -60px;
		text-align: center;
		button {
			margin: 0 15px
		}
	}
</style>