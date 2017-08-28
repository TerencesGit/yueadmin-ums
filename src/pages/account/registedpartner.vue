<template>
	<section>
		<el-card class="card-primary">
			<div slot="header">
				注册我的企业
			</div>
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
									<el-input v-model="partnerForm.name" placeholder="请输入企业名称"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item label="企业简称" prop="shortName">
									<el-input v-model="partnerForm.shortName" placeholder="请输入企业简称"></el-input>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="12">
								<el-form-item label="营业执照注册号" prop="licenseNum">
									<el-input v-model="partnerForm.licenseNum" placeholder="请输入营业执照注册号"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item label="法定代表人" prop="corporationName">
									<el-input v-model="partnerForm.corporationName" placeholder="请输入法定代表人"></el-input>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="12">
								<el-form-item label="联系人" prop="contactName">
									<el-input v-model="partnerForm.contactName" placeholder="请输入联系人"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item label="地址" prop="contactAddress">
									<el-input v-model="partnerForm.contactAddress" placeholder="请输入企业地址"></el-input>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="12">
								<el-form-item label="联系电话" prop="mobile">
									<el-input v-model="partnerForm.mobile" placeholder="请输入企业联系电话"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item label="邮编" prop="post">
									<el-input v-model="partnerForm.post" placeholder="请输入企业邮编"></el-input>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="12">
								<el-form-item label="固话" prop="telphone">
									<el-input v-model="partnerForm.telphone" placeholder="例如：010-12345678"></el-input>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item label="企业邮箱" prop="email">
									<el-input v-model="partnerForm.email" placeholder="请输入企业邮箱"></el-input>
								</el-form-item>
							</el-col>
						</el-row>
						<el-row>
							<el-col :span="12">
								<el-form-item label="LOGO" prop="telphone">
									<el-upload
									  class="uploader"
									  action="https://jsonplaceholder.typicode.com/posts/"
									  :show-file-list="false"
									  :on-success="handleLogoSuccess"
									  :before-upload="beforeUpload">
									  <img v-if="logoUrl" :src="logoUrl">
									  <i v-else class="el-icon-plus"></i>
									</el-upload>
								</el-form-item>
							</el-col>
							<el-col :span="12">
								<el-form-item label="营业执照图片" prop="email">
									<el-upload
									  class="uploader lisence-uploader"
									  action="https://jsonplaceholder.typicode.com/posts/"
									  :show-file-list="false"
									  :on-success="handleLicenseSuccess"
									  :before-upload="beforeUpload">
									  <img v-if="licenseUrl" :src="licenseUrl">
									  <i v-else class="el-icon-plus"></i>
									</el-upload>
								</el-form-item>
							</el-col>
						</el-row>
						<el-form-item label="企业简介" prop="note">
							<el-input type="textarea" :rows="3" v-model="partnerForm.note" placeholder="请输入企业简介"></el-input>
						</el-form-item>
						<el-form-item label="" class="button-item">
							<el-button @click="resetForm">重 置</el-button>
							<el-button type="primary" @click="submitForm">提 交</el-button>
						</el-form-item>
					</el-form>
				</el-col>
			</el-row>
		</el-card>
	</section>
</template>
<script>
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
				partnerForm: {
					name: '',
					shortName: '',
					email: '',
					telphone: '',
					mobile: '',
					post: '',
					logo: '',
					memberNum: '',
					idcardNum: '',
					idcardPicFront: '',
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
						{ required: true, validator: validateMobile, trigger: 'blur'}
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
				},
				logoUrl: '',
				licenseUrl: ''
			}
		},
		methods: {
			handleLogoSuccess(res, file) {
        this.logoUrl = URL.createObjectURL(file.raw);
        this.partnerForm.logo = URL.createObjectURL(file.raw);
      },
      handleLicenseSuccess(res, file) {
        this.licenseUrl = URL.createObjectURL(file.raw);
        this.partnerForm.licensePic = URL.createObjectURL(file.raw);
      },
      beforeUpload(file) {
        const isJPG = file.type === 'image/jpeg';
        const isLt2M = file.size / 1024 / 1024 < 2;

        if (!isJPG) {
          this.$message.error('上传头像图片只能是 JPG 格式!');
        }
        if (!isLt2M) {
          this.$message.error('上传头像图片大小不能超过 2MB!');
        }
        return isJPG && isLt2M;
      },
      resetForm() {
      	this.$refs.partnerForm.resetFields()
      },
			submitForm() {
				this.$refs.partnerForm.validate(valid => {
					if(valid) {
						let data = Object.assign({}, this.partnerForm)
						console.log(data)

					} else {
						this.$notify({
							type: 'warning',
							title: '提示',
							message: '请把注册信息填写完整'
						})
					}
				})
			}
		},
		mounted() {

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