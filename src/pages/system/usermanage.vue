<template>
	<section class="user-page">
		<div v-title :data-title="this.$route.name"></div>
   	<h2 class="page-header">C端用户列表</h2>
    <!-- 账户列表 -->
    <el-table  
      border 
      :data="userList" 
      v-loading="loading" 
      highlight-current-row
      style="width: 100%">
      <el-table-column type="index" width="55"></el-table-column>
      <el-table-column prop="id" label="用户ID" sortable></el-table-column>
      <el-table-column prop="username" label="用户名"></el-table-column>
      <el-table-column prop="phone" label="手机号码" width="180"></el-table-column>
      <el-table-column label="注册时间" sortable :formatter="formatTime"></el-table-column>
      <!-- <el-table-column prop="status" label="状态">
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
      </el-table-column> -->
      <el-table-column label="操作">
        <template scope="scope">
          <el-button size="small" type="primary" @click="handleShow(scope.row)">详情</el-button>
          <el-button size="small" type="warning" @click="handleNote(scope.row)">备注信息</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <el-row class="toolbar">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pageNo"
        :page-size="pageSize"
        :page-sizes="[10, 20, 30, 40]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-row>
    <!-- 账户信息 -->
		<el-dialog :visible.sync="userInfoVisible" title="用户信息">
			<el-form :model="userInfo" label-width="120px" v-loading="userLoading">
				<el-row>
					<el-col :span="12" :offset="5">
						<el-form-item label="">
							<img v-if="userInfo.picUrl" :src="userInfo.picUrl" alt="头像" class="avatar">
							<img v-else src="../../assets/img/avatar.gif" alt="头像" class="avatar">
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="用户名：">
							<span>{{userInfo.username}}</span>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="性别：">
							<span>{{userInfo.sex === 0 ? '女' : '男' }}</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="邮箱：">
							<span>{{userInfo.email | email}}</span>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="手机号：">
							<span>{{userInfo.phone}}</span>
						</el-form-item>
					</el-col>
				</el-row>
				<el-row>
					<el-col :span="12">
						<el-form-item label="真实姓名：">
							<span>{{userInfo.realName}}</span>
						</el-form-item>
					</el-col>
					<el-col :span="12">
						<el-form-item label="注册时间：">
							<span>{{userInfo.createTime | formatDate}}</span>
						</el-form-item>
					</el-col>
				</el-row>
			</el-form>
			<div slot="footer">
				<div>
					<el-button @click="userInfoVisible = false">取消</el-button>
					<el-button type="primary" @click="userInfoVisible = false">确定</el-button>
				</div>
			</div>
		</el-dialog>
		<!-- 用户备注 -->
		<el-dialog :visible.sync="userNoteVisible" :title="noteTitle">
			<el-form :model="noteForm" ref="noteForm" style="width: 90%;margin: auto;">
				<el-form-item label="输入备注信息"
					prop="note" 
					:rules="[{ required: true, message: '请输入备注信息', trigger: 'blur' }]">
					<el-input 
						type="textarea" 
						:rows="5" 
						v-model.trim="noteForm.note" 
						placeholder="200字以内">
					</el-input>
				</el-form-item>
			</el-form>
			<div slot="footer">
				<div>
					<el-button @click="userNoteVisible = false">取消</el-button>
					<el-button type="primary" @click="noteFormSubmit">确定</el-button>
				</div>
			</div>
		</el-dialog>
	</section>
</template>
<script>
	import { getMyInfo, getCEndUsers, updateUserStatus, updateUserNote } from '@/api'
	export default {
		data() {
			return {
				loading: false,
				total: 0,
				pageNo: 1,
				pageSize: 10,
				userList: [],
				userInfo: {},
				userInfoVisible: false,
				userLoading: false,
				userNoteVisible: false,
				noteTitle: '',
				noteForm: {
					userId: '',
					note: '',
				},
			}
		},
		methods: {
			// 获取用户信息
	    getUserInfo() {
	      getMyInfo().then(res => {
	        if(res.data.code === '0001') {
	          // let userInfo = res.data.result.userInfo;
	          // console.log(userInfo)
	        } else {
	          this.$message.error(res.data.message)
	        }
	      }).catch(err => {
	        console.log(err)
	        this.$catchError(err)
	      })
	    },
			formatTime(row) {
				return this.$moment(row.createTime).format('YYYY-MM-DD HH:mm:ss')
			},
			handleSizeChange(val) {
				this.pageSize = val;
				this.handlePageJump()
			},
			handleCurrentChange(val) {
				this.pageNo = val;
				this.handlePageJump()
			},
			handlePageJump() {
				this.$router.push({
					path : '/admin/usermanage',
					query: {
						pageNo: this.pageNo,
						pageSize: this.pageSize,
					}
				})
			},
			getUserList() {
				let params = {
					pageNo: this.pageNo,
					pageSize: this.pageSize,
				}
				this.loading = true;
				getCEndUsers(params).then(res => {
					this.loading = false
					if(res.data.code === '0001') {
						this.userList = res.data.result.userList;
						this.total = res.data.result.pageInfo.total;
					} else {
						this.$message.error(res.data.message)
					}
				}).catch(err => {
					console.log(err)
					this.loading = false;
					this.$catchError(err)
				})
			},
			// 账户信息详情
      handleShow(row) {
      	this.userInfo = Object.assign({}, row);
      	this.userInfoVisible = true;
      },
			handleStatus(row) {
				let data = {
					userId: row.userId,
					status: row.status
				}
				updateUserStatus(data).then(res => {
					if(res.data.code === '0001') {
						this.$message.success(res.data.message)
					} else {
						row.status = row.status === 0 ? 1 : 0;
						this.$message.error(res.data.message)
					}
				}).catch(err => {
					console.log(err)
					row.status = row.status === 0 ? 1 : 0;
					this.$catchError(err)
				})
			},
			// 备注用户信息
			handleNote(row) {
				this.noteForm.userId = row.id;
				this.noteTitle = `备注 ${row.username} 信息`;
				this.noteForm.note = row.note;
				this.userNoteVisible = true;
			},
			noteFormSubmit() {
				this.$refs.noteForm.validate(valid => {
					if(!valid) return;
					let data = Object.assign({}, this.noteForm)
					updateUserNote(data).then(res => {
						this.userNoteVisible = false;
						if(res.data.code === '0001') {
							this.$message.success(res.data.message)
							this.getUserList()
						} else {
							this.$message.error(res.data.message)
						}
					}).catch(err => {
						console.log(err)
						this.userNoteVisible = false;
						this.$catchError(err)
					})
				})
			},
		},
		beforeRouteUpdate (to, from, next) {
			this.getUserList()
			next()
		},
		created() {
			this.getUserInfo()
			this.pageNo = this.$route.query.pageNo && Number(this.$route.query.pageNo) || 1;
			this.pageSize = this.$route.query.pageSize && Number(this.$route.query.pageSize) || 10;
			this.getUserList()
		},
	}
</script>
<style scoped lang="scss">
	.user-page {
		padding: 30px;
	}
	.avatar {
		width: 160px;
		height: 160px;
		border-radius: 50%;
		border: 1px solid #ddd;
	}
</style>