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
					<el-button type="success" @click="handleUpload">上传图片</el-button>
				</el-form-item>
			</el-form>
		</el-row>
		<div class="pictrue-wrap" v-loading="loading">
			<ul class="picture-list">
				<li v-for="(pic, index) in picList" :key="index" class="pic-card" @dblclick="handlePicClick(pic)">
					<img :src="pic.fileUri">
					<!-- <span class="tag">{{pic.category}}</span> -->
					<p class="pic-intro">分辨率：{{pic.width + '*' + pic.height}}</p>
				</li>
			</ul>
		</div>
		<el-row class="toolbar">
			<el-pagination
	      @size-change="handleSizeChange"
	      @current-change="handleCurrentChange"
	      :current-page="pageNo"
	      :page-sizes="[15, 30, 45, 60]"
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
			  name="uploadFile" 
			  :data="uploadData"
			  accept="image/jpeg, image/png"
			  :action="uploadAction"
			  multiple="multiple"
			  list-type="picture-card"
			  :on-preview="handlePreview"
			  :on-remove="handleRemove"
			  :on-success="handleSuccess"
			  :file-list="fileList"
			  :auto-upload="false">
			  <i class="el-icon-plus"></i>
			  <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
			</el-upload>
			<div slot="footer">
				<el-button type="warning" @click="handleAbort">取消上传</el-button>
				<el-button type="primary" @click="submitUpload">开始上传</el-button>
				<el-button @click="uploadVisible = false">关闭</el-button>
			</div>
		</el-dialog>
		<el-dialog v-model="picPreviewVisible">
			<div class="text-center">
				<img :src="picUrl">
			</div>
		</el-dialog>
		<el-dialog v-model="pictureInfoVisible" title="图片信息">
		  <el-row>
		  	<el-col :span="22" :offset="1">
		  		<el-form class="pic-info">
		  			<el-form-item label="图片名：">
		  				<p>{{picInfo.fileRawName}}</p>
		  			</el-form-item>
		  			<el-form-item label="图片大小：">
		  				<p>{{picInfo.fileSize}}</p>
		  			</el-form-item>
		  			<el-form-item label="图片路径：">
		  				<p>{{picInfo.fileUri}}</p>
		  			</el-form-item>
		  			<el-form-item label="缩略图路径：">
		  				<p>{{picInfo.fileMiniUri}}</p>
		  			</el-form-item>
		  			<el-form-item label="上传时间：">
		  				<p>{{picInfo.fileCreateTime}}</p>
		  			</el-form-item>
		  			<el-form-item label="所属文件夹：">
		  				<p>{{picInfo.category}}</p>
		  			</el-form-item>
		  		</el-form>
		  	</el-col>
		  </el-row>
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
      	pageSize: 30,
      	total: 0,
      	beginDate: '',
      	endDate: '',
      	category: '',
      	pickerBeginDate: '',
      	pickerEndDate: '',
      	// uploadAction: '/uploadFileUrl',
				uploadAction: '/ums/baseInter/uploadFile.do',
      	uploadVisible: false,
      	picPreviewVisible: false,
      	pictureInfoVisible: false,
      	picUrl: '',
        fileList: [],
        picList: [],
        uploadCategory: '',
        picInfo: {
        	fileRawName: '',
        	fileSize: '',
        	fileUri: '',
        	fileMiniUri: '',
        	fileCreateTime: '',
        },
      };
    },
    methods: {
    	handleSizeChange(val) {
    		this.pageSize = val;
    		this.getPictureList()
    	},
    	handleCurrentChange(val) {
    		this.pageNo = val;
    		this.getPictureList()
    	},
    	handleBeginDate(val) {
    		this.beginDate = val;
    	},
    	handleEndDate(val) {
    		this.endDate = val;
    	},
    	handleUpload() {
    		this.uploadVisible = true;
    	},
      submitUpload() {
      	this.$refs.upload.submit()
      },
      handleSuccess () {
      	this.$refs.upload.clearFiles()
      	this.$message.success('上传成功')
      	this.getPictureList()
      },
      handleRemove(file, fileList) {
        console.log(file, fileList);
      },
      handlePreview(file) {
        this.picUrl = file.url;
        this.picPreviewVisible = true;
      },
      handleAbort () {
      	this.$refs.upload.abort()
      },
      handlePicClick(pic) {
      	this.picUrl = pic.fileUri;
      	this.picInfo = pic;
      	this.pictureInfoVisible = true;
      },
      getPictureList() {
      	let params = {
      		pageNo: this.pageNo,
      		pageSize: this.pageSize,
      		beginDate: this.beginDate ? this.beginDate : '',
      		endDate: this.endDate ? this.endDate : '',
      		category: this.category,
      	}
      	this.loading = true;
      	getPicList(params).then(res => {
      		this.loading = false;
      		this.picList = res.data.result.pictureList;
      		this.total = res.data.result.pageInfo.total;
      		// let categories = [];
      		this.picList.forEach(pic => {
      			let _category = pic.fileUri.split('/')[0];
      			let _fileSize = Number(pic.fileSize);
      			if((_fileSize / 1024 / 1024) >= 1) {
      				pic.fileSize = Math.round(_fileSize / 1024 / 1024 * 100) / 100 + 'MB';
      			} else if ((_fileSize / 1024) >= 1) {
      				pic.fileSize = Math.round(_fileSize / 1024 * 100) / 100 + 'KB';
      			} else {
      				pic.fileSize = Math.round(_fileSize * 100) / 100 + 'B';
      			}
      			pic.category = _category;
      			// if(categories.indexOf(_category) === -1) {
      			// 	categories.push(_category)
      			// }
      			pic.fileUri = 'http://ums.yueshijue.com/UmsUpload/' + pic.fileUri;
      		})
      	}).catch(err => {
      		this.loading = false;
      		this.$catchError(err)
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
	.pictrue-wrap {
		min-height: 200px;
	}
	.picture-list {
		display: flex;
		flex-wrap: wrap;
		margin-top: 30px;
		.pic-card {
			width: 160px;
			height: 160px;
			margin: 0 15px 15px 0;
			background: #fff;
			border: 1px solid #ccc;
			transition: all .3s;
			position: relative;
				&:hover {
					transform: scale(1.2)
				}
			img {
				width: 100%;
				height: 100%;
			}
			.pic-intro {
				position: absolute;
				bottom: 0;
				left: 0;
				width: 100%;
				padding-left: 5px;
				color: #fff;
				background: rgba(0,0,0,.5);
			}
			.tag {
				position: absolute;
				top: 0;
				right: 0;
				padding: 0 5px;
				color: rgba(100,100,200,.5);
				background: rgba(255,255,255,.5);
			}
		}
	}
	.pic-info {
		p {
			word-wrap: break-word; 
			word-break: normal; 
		}
	}
</style>