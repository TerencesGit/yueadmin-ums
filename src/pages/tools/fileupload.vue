<template>
	<section>
		<el-row class="toolbar">
			<el-form inline>
				<el-form-item label="文件夹名称">
					<el-input type="text" v-model="category" placeholder="文件夹名称"></el-input>
				</el-form-item>
				<el-form-item label="上传时间">
					<el-date-picker
			      v-model="pickerBeginDate"
			      align="right"
			      type="date"
			      format="yyyy-MM-dd"
			      placeholder="开始日期"
			      @change="handleBeginDate">
			    </el-date-picker>
				</el-form-item>
				<el-form-item>
					<el-date-picker
			      v-model="pickerEndDate"
			      align="right"
			      type="date"
			      format="yyyy-MM-dd"
			      placeholder="结束日期"
			      @change="handleEndDate">
			    </el-date-picker>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="getPictureList">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="success" @click="uploadVisible = true">上传图片</el-button>
				</el-form-item>
			</el-form>
		</el-row>
		<div class="pictrue-wrap" v-loading="loading">
			<ul class="picture-list">
				<li v-for="(pic, index) in picList" :key="index">
					<img :src="pic.fileUri" alt="">
				</li>
			</ul>
		</div>
		<el-row class="toolbar">
			<el-pagination
	      @size-change="handleSizeChange"
	      @current-change="handleCurrentChange"
	      :current-page="pageNo"
	      :page-sizes="[10, 20, 30, 40]"
	      :page-size="pageSize"
	      layout="total, sizes, prev, pager, next, jumper"
	      :total="total">
	    </el-pagination>
    </el-row>
		<el-dialog v-model="uploadVisible" title="图片上传" size="large">
			<div class="upload-input">
				<label>文件夹名称</label>
				<el-input v-model="uploadCategory" style="width: 240px;" placeholder="自定义图片文件夹名称"></el-input>
			</div>
			<el-upload
			  ref="upload"
			  name="file" 
			  :data="uploadData"
			  accept="image/jpeg, image/png"
			  :action="uploadAction"
			  multiple="multiple"
			  list-type="picture-card"
			  :on-preview="handlePreview"
			  :on-remove="handleRemove"
			  :file-list="fileList"
			  :auto-upload="false">
			  <i class="el-icon-plus"></i>
			  <!-- <el-button slot="trigger" size="small" type="primary">选取文件</el-button> -->
			  <!-- <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button> -->
			  <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
			</el-upload>
			<div slot="footer">
				<el-button @click="uploadVisible = false">取消</el-button>
				<el-button type="primary" @click="submitUpload">确定</el-button>
			</div>
		</el-dialog>
		<el-dialog v-model="dialogVisible" size="tiny">
		  <img width="100%" :src="dialogImageUrl">
		</el-dialog>
	</section>
</template>
<script>
	import { getPicList } from '@/api'
	export default {
    data() {
      return {
      	loading: false,
      	pageNo: 1,
      	pageSize: 10,
      	total: 0,
      	beginDate: '',
      	endDate: '',
      	category: '',
      	pickerBeginDate: '',
      	pickerEndDate: '',
      	uploadAction: '/uploadFileUrl',
				// uploadAction: '/ums/baseInter/uploadFile.do',
      	uploadVisible: false,
      	dialogVisible: false,
      	dialogImageUrl: '',
        fileList: [],
        picList: [],
        uploadCategory: '',
      };
    },
    methods: {
    	handleSizeChange(val) {

    	},
    	handleCurrentChange(val) {

    	},
    	handleBeginDate(val) {
    		console.log(val)
    		this.beginDate = val;
    	},
    	handleEndDate(val) {
    		console.log(val)
    		this.endDate = val;
    	},
      submitUpload() {
      	this.$refs.upload.submit();
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        console.log(file);
      },
      getPictureList() {
      	let params = {
      		pageNo: this.pageNo,
      		pageSize: this.pageSize,
      		beginDate: this.beginDate,
      		endDate: this.endDate,
      		category: this.category,
      	}
      	console.log(params)
      	this.loading = true;
      	getPicList(params).then(res => {
      		this.loading = false;
      		this.picList = res.data.result.pictureList;
      		this.total = res.data.result.pageInfo.total;
      		this.picList.forEach(pic => {
      			pic.fileUri = 'http://ums.yueshijue.com/UmsUpload/' + pic.fileUri;
      		})
      	})
      }
    },
    computed: {
    	uploadData() {
    		let data = {
    			category: this.uploadCategory ? this.uploadCategory : 'resource'
    		}
    		return data;
    	},
    },
    created() {
    	this.getPictureList()
    }
  }
</script>
<style scoped lang="scss">
	.upload-input {
		margin-bottom: 30px;
		label {
			margin-right: 15px;
		}
	}
	.picture-list {
		display: flex;
		flex-wrap: wrap;
		margin-top: 30px;
		li {
			width: 160px;
			height: 160px;
			margin: 0 15px 15px 0;
			background: #fff;
			border: 1px solid #ccc;
			transition: all .3s;
				&:hover {
					transform: scale(1.2)
				}
			img {
				width: 100%;
				height: 100%;
			}
		}
	}
</style>