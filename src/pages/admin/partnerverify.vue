<template>
	<section>
		<div v-title :data-title="this.$route.name"></div>
		<!-- <el-row class="toolbar">
			<el-form inline>
				<el-form-item label="商家编号">
					<el-input placeholder="商家编号"></el-input>
				</el-form-item>
				<el-form-item label="商家名称">
					<el-input placeholder="商家名称"></el-input>
				</el-form-item>
				<el-form-item label="">
					<el-button type="primary">搜索</el-button>
				</el-form-item>
			</el-form>
    </el-row> -->
		<el-table 
      border 
      :data="partnerList" 
      v-loading="loading" 
      highlight-current-row
      style="width: 100%; margin-top: 30px">
      <el-table-column type="index" width="60"></el-table-column>
      <el-table-column prop="partnerId" label="商家编号" sortable width="140"></el-table-column>
      <el-table-column prop="name" label="商家名称"></el-table-column>
      <el-table-column prop="corporationName" label="注册人"></el-table-column>
      <el-table-column prop="contactAddress" label="地址"></el-table-column>
      <el-table-column prop="createTime" label="创建时间" sortable width="140" :formatter="formatTime"></el-table-column>
      <el-table-column prop="status" label="状态" width="100" :formatter="formatStatus">
      </el-table-column>
      <el-table-column label="操作" width="240">
        <template scope="scope">
        	<el-button size="small" type="info" @click="handleDetail(scope.row)">详情</el-button>
        	<el-button size="small" type="primary" @click="handlePass(scope.row)">通过</el-button>
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
    <!-- 商家信息 -->
    <el-dialog :visible.sync="partInfoVisible" title="商家信息">
    	<el-row>
    		<el-col :span="14" :offset="5">
		    	<el-form label-width="150px">
		    		<el-form-item label="" label-width="100px">
		    			<img :src="partInfo.logo" alt="logo" class="logo">
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
    <el-dialog title="商家驳回" :visible.sync="rejectFormVisible">
    	<el-row>
    		<el-col :span="18" :offset="3">
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
	import { getPartners, getPartnerTypes, updatePartType, updatePartnerStatus } from '@/api'
	export default {
		data() {
			return {
				pageNo: 1,
				pageSize: 10,
				total: 0,
				loading: false,
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
			}
		},
		methods: {
			formatStatus(row) {
				return row.isVerified === 0 ? '未审核' : '审核通过'
			},
			formatTime() {
				return this.$moment(new Date()).format('YYYY-MM-DD')
			},
			handleSizeChange(val) {
				this.pageSize = val;
				this.getPartnerList()
			},	
			handleCurrentChange(val) {
				this.pageNo = val;
				this.getPartnerList()
			},
			getPartnerList() {
				let params = {
					pageNo: this.pageNo,
					pageSize: this.pageSize,
					isVerified: 0
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
			handleDetail(row) {
				this.partInfo = row;
				this.partInfoVisible = true
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
			handlePass(row) {
				this.partInfo = row;
				this.typeList.length === 0 && this.getTypeList()
				this.typeListVisible = true
			},
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
					partnerId: this.partInfo.partnerId,
					typeId: this.typeId
				}
				updatePartType(data).then(res => {
					if(res.data.code === '0001') {
						this.$message.success(res.data.message)
						this.getPartnerList()
					} else {
						this.$message.error(res.data.message)
					}
				}).catch(err => {
					console.log(err)
					this.$catchError(err)
				})
				this.typeListVisible = false
			},
			handleReject(row) {
				this.partInfo = row
				this.rejectFormVisible = true
			},
			rejectFormSubmit() {
				this.$refs.rejectForm.validate(valid => {
					if(!valid) return;
					let data = {
						partnerId: this.partInfo.partnerId,
						rejectInfo: this.rejectForm.rejectInfo
					}
					console.log(data)
				})
			}
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