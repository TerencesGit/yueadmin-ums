<template>
	<section>
		<div v-title :data-title="this.$route.name"></div>
		<el-card class="card-primary">
			<div slot="header">编辑企业信息</div>
			<el-row>
				<el-col :span="22" :offset="1">
					<el-form 
						:model="partnerForm" 
						:rules="rules" 
						ref="partnerForm" 
						label-width="120px" 
						class="partner-form">
						<el-row>
							<el-col :span="12">
								<el-form-item label="企业名称" prop="name">
									<el-input v-model="partnerForm.name" placeholder="输入企业名称"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item label="企业简称" prop="shortName">
									<el-input v-model="partnerForm.shortName" placeholder="输入企业简称"></el-input>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="12">
								<el-form-item label="企业电话" prop="mobile">
									<el-input v-model="partnerForm.mobile" placeholder="输入企业联系电话"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item label="企业邮箱" prop="email">
									<el-input v-model="partnerForm.email" placeholder="输入企业邮箱"></el-input>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="12">
								<el-form-item label="企业邮编" prop="post">
									<el-input v-model="partnerForm.post" placeholder="输入企业邮编"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item label="联系地址" prop="contactAddress">
									<el-input v-model="partnerForm.contactAddress" placeholder="输入企业联系地址"></el-input>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="12">
								<el-form-item label="企业法人" prop="corporationName">
									<el-input v-model="partnerForm.corporationName" placeholder="输入企业法人"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item label="法人身份证号" prop="idcardNum">
									<el-input v-model="partnerForm.idcardNum" placeholder="输入法人身份证号"></el-input>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="12">
								<el-form-item label="营业执照注册号" prop="licenseNum">
									<el-input v-model="partnerForm.licenseNum" placeholder="输入营业执照注册号"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item label="联系人" prop="contactName">
									<el-input v-model="partnerForm.contactName" placeholder="输入联系人"></el-input>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="12">
								<el-form-item label="企业固话" prop="telphone">
									<el-input v-model="partnerForm.telphone" placeholder="例如：010-12345678"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item label="企业传真" prop="fax">
									<el-input v-model="partnerForm.fax" placeholder="输入企业传真"></el-input>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="12">
								<el-form-item label="企业所在地：" prop="areaId">
									<el-row>
										<el-col :span="11">
											<el-select v-model="region.province" placeholder="选择省" @change="provinceChange" style="width: 100%">
										    <el-option
										      v-for="item in regionList.province"
										      :key="item.id"
										      :label="item.name"
										      :value="item.id">
										    </el-option>
										  </el-select>
										</el-col>
										<el-col :offset="2" :span="11">
											<el-select v-model="region.city" placeholder="选择市" @change="cityChange" style="width: 100%">
										    <el-option
										      v-for="item in regionList.city"
										      :key="item.id"
										      :label="item.name"
										      :value="item.id">
										    </el-option>
										  </el-select>
										</el-col>
									</el-row>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="12">
								<el-form-item label="LOGO" prop="logo">
									<el-upload
									  class="uploader"
									  accept="image/jpeg, image/png"
									  name='uploadFile'
									  :action="uploadAction"
									  :data="{category: 'partner'}"
									  :show-file-list="false"
									  :on-error="handleError"
									  :on-success="handleLogoSuccess"
									  :before-upload="beforeUpload">
									  <img v-if="logoUrl" :src="logoUrl">
									  <i v-else class="el-icon-plus"></i>
									</el-upload>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item label="营业执照图片" prop="licensePic">
									<el-upload
									  class="uploader lisence-uploader"
									  accept="image/jpeg, image/png"
									  name='uploadFile'
									  :action="uploadAction"
									  :data="{category: 'partner'}"
									  :show-file-list="false"
									  :on-success="handleLicenseSuccess"
									  :before-upload="beforeUpload">
									  <img v-if="licenseUrl" :src="licenseUrl">
									  <i v-else class="el-icon-plus"></i>
									</el-upload>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="12">
								<el-form-item label="法人身份证正面" prop="idcardPicFront">
									<el-upload
									  class="uploader idcard-uploader"
									  accept="image/jpeg, image/png"
									  name='uploadFile'
									  :action="uploadAction"
									  :data="{category: 'partner'}"
									  :show-file-list="false"
									  :on-error="handleError"
									  :on-success="handleFrontSuccess"
									  :before-upload="beforeUpload">
									  <img v-if="idcardFrontUrl" :src="idcardFrontUrl">
									  <i v-else class="el-icon-plus"></i>
									</el-upload>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item label="法人身份证背面" prop="idcardPicBack">
									<el-upload
									  class="uploader idcard-uploader"
									  accept="image/jpeg, image/png"
									  name='uploadFile'
									  :action="uploadAction"
									  :data="{category: 'partner'}"
									  :show-file-list="false"
									  :on-success="handleBackSuccess"
									  :before-upload="beforeUpload">
									  <img v-if="idcardBackUrl" :src="idcardBackUrl">
									  <i v-else class="el-icon-plus"></i>
									</el-upload>
								</el-form-item>
							</el-col>
						</el-row>
						<el-form-item label="企业简介" prop="note">
							<el-input type="textarea" :rows="4" v-model="partnerForm.note" placeholder="请输入企业简介"></el-input>
						</el-form-item>
						<el-form-item label="" class="button-item">
							<el-button @click="back">返 回</el-button>
							<el-button type="primary" @click="submitForm">提 交</el-button>
						</el-form-item>
					</el-form>
				</el-col>
			</el-row>
		</el-card>
	</section>
</template>
<script>
	 import Region from '@/assets/js/region'
	import { getMyPartnerInfo, updateMyPartnerInfo } from '@/api'
	export default {
		data() {
			const validateMobile = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('请输入联系电话'));
        }
        setTimeout(() => {
          if (!value.match(/^(13|14|15|17|18)\d{9}$/)) {
            callback(new Error('请输入正确手机号'));
          } else {
          	callback()
          }
        }, 0);
      }
			return {
				// uploadAction: '/uploadFileUrl',
				uploadAction: '/ums/baseInter/uploadFile.do',
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
				rules: {
					name: [
						{ required: true, message: '请输入企业名称', trigger: 'blur'},
					],
					shortName: [
						{ required: true, message: '请输入企业简称', trigger: 'blur'},
					],
					mobile: [
						{ required: true, validator: validateMobile, trigger: 'blur' },
					],
					email: [
						{ required: true, message: '请输入企业邮箱', trigger: 'blur' },
						{ type: 'email', message: '邮箱格式不正确', trigger: 'blur' }
					],
					post: [
						{ required: true, message: '请输入企业邮编', trigger: 'blur'},
					],
					contactName: [
						{ required: true, message: '请输入企业联系人', trigger: 'blur'},
					],
					contactAddress: [
						{ required: true, message: '请输入企业地址', trigger: 'blur'},
					],
					licenseNum: [
						{ required: true, message: '请输入营业执照注册号', trigger: 'blur'},
					],
					corporationName: [
						{ required: true, message: '请输入企业法定代表人', trigger: 'blur'},
					],
					idcardNum: [
						{ required: true, message: '请输入法定身份证号', trigger: 'blur'},
					],
					logo: [
						{ required: true, message: '请选择企业logo', trigger: 'change'},
					],
					licensePic: [
						{ required: true, message: '请选择企业营业执照', trigger: 'change'},
					],
					idcardPicFront	: [
						{ required: true, message: '请选择法人身份证正面', trigger: 'change'},
					],
					idcardPicBack: [
						{ required: true, message: '请选择法人身份证背面', trigger: 'change'},
					],
					note: [
						{ required: true, message: '请输入企业简介', trigger: 'blur'},
					],
				},
				logoUrl: '',
				licenseUrl: '',
				idcardFrontUrl: '',
				idcardBackUrl: '',
				region: {
					province: '',
					city: '',
				},
				regionList: {
					province: [],
					city: [],
				},
				provinceId: 1,
			}
		},
		methods: {
			// 获取企业信息
			getPartnerInfo() {
				getMyPartnerInfo().then(res => {
					console.log(res)
					if(res.data.code === '0001') {
						this.partnerForm = res.data.result.partnerInfo
						let fileInfos = res.data.result.fileInfos;
						this.logoUrl = fileInfos.logo;
						this.licenseUrl = fileInfos.licensePic;
						this.idcardFrontUrl = fileInfos.idcardPicFront;
						this.idcardBackUrl = fileInfos.idcardPicBack;
						if(this.partnerForm.areaId) {
							this.provinceId = Region.filter(region => region.id === this.partnerForm.areaId)[0].pid;
							this.formatRegion(this.partnerForm.areaId)
						}
					} else {
						this.$message.error(res.data.message)
					}
				}).catch(err => {
					console.log(err)
					this.$catchError(err)
				})
			},
			// 上传校验
			beforeUpload(file) {
        const isJPG = file.type === 'image/jpeg' || file.type === 'image/png';
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isJPG) {
          this.$message.error('上传图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
      // 上传失败
			handleError(err, file) {
				// console.log(err)
				this.$message.error('上传失败，请稍后重试')
			},
			// 企业logo上传成功
			handleLogoSuccess(res, file) {
				console.log(res)
        if(res.code === '0001') {
					this.$message.success('上传成功')
					this.logoUrl = URL.createObjectURL(file.raw);
					this.partnerForm.logo = res.result.fileInfo.fileUuid;
				} else {
					this.$message.error(res.message)
				}
      },
      // 营业执照上传成功
      handleLicenseSuccess(res, file) {
        console.log(res)
        if(res.code === '0001') {
					this.$message.success('上传成功')
					this.licenseUrl = URL.createObjectURL(file.raw);
					this.partnerForm.licensePic = res.result.fileInfo.fileUuid;
				} else {
					this.$message.error(res.message)
				}
      },
       // 法人身份证正面上传成功
      handleFrontSuccess(res, file) {
      	if(res.code === '0001') {
					this.$message.success('上传成功')
					this.idcardFrontUrl = URL.createObjectURL(file.raw);
					this.partnerForm.idcardPicFront = res.result.fileInfo.fileUuid;
				} else {
					this.$message.error(res.message)
				}
      },
      // 法人身份证背面上传成功
      handleBackSuccess(res, file) {
      	if(res.code === '0001') {
					this.$message.success('上传成功')
					this.idcardBackUrl = URL.createObjectURL(file.raw);
					this.partnerForm.idcardPicBack = res.result.fileInfo.fileUuid;
				} else {
					this.$message.error(res.message)
				}
      },
      back() {
      	this.$router.back()
      },
      // 选择省、市、区
      provinceChange (pid) {
      	if(pid === this.provinceId) return;
      	this.provinceId = pid;
      	this.regionList.city = Region.filter(region => region.pid === pid)
      	this.region.city = this.regionList.city[0].id;
      },
      cityChange (cid) {
      	this.partnerForm.areaId = cid;
      },
      // 所在地回显
			formatRegion(areaId) {
				let origin = Region.filter(region => region.id === areaId)[0];
				if(!origin) return;
				if (origin.level === 2) {
					this.region.province = Region.filter(region => region.id === origin.pid)[0].id;
					this.regionList.city = Region.filter(region => region.pid === origin.pid);
					this.region.city = areaId;
				}
			},
      // 更新企业信息提交
			submitForm() {
				this.$refs.partnerForm.validate(valid => {
					if(valid) {
						let data = Object.assign({}, this.partnerForm)
						console.log(data)
						updateMyPartnerInfo(data).then(res => {
							if(res.data.code === '0001') {
								this.$message.success(res.data.message)
							} else {
								this.$message.error(res.data.message)
							}
						}).catch(err => {
							console.log(err)
							this.$catchError(err)
						})
					} else {
						this.$notify({
							type: 'warning',
							title: '提示',
							message: '请将注册信息填写完整'
						})
					}
				})
			}
		},
		mounted() {
			this.getPartnerInfo()
			this.regionList.province = Region.filter(region => region.level === 1)
		}
	}
</script>
<style scoped lang="scss">
	.partner-form {
		margin: 30px 0
	}
	.button-item {
		margin: 30px 0 0 -60px;
		text-align: center;
		button {
			margin: 0 15px
		}
	}
</style>