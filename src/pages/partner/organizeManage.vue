<template>
	<section>
		<el-card class="card-primary">
			<div slot="header">
				组织部门管理
			</div>
			<el-row :gutter="15">
				<el-col :span="6" class="tree">
					<el-tree 
						:data="organizeTree" 
						:props="defaultProps"
						empty-text="暂无部门"
						highlight-current
						default-expand-all
						:expand-on-click-node="false"
						@node-click="handleNodeClick">
					</el-tree>
				</el-col>
				<el-col :span="18" v-if="organizeTree.length !== 0">
					<el-row class="toolbar">
						<el-button type="success" @click="handleAdd">
							<i class="fa fa-plus-square"></i>
							新增
						</el-button>
						<el-button type="warning" @click="handleAdd">
							<i class="fa fa-edit"></i>
							编辑
						</el-button>
						<el-button type="danger" @click="handleAdd">
							<i class="el-icon-delete"></i>
							删除
						</el-button>
						<el-button type="primary" icon="setting" @click="handleAdd">
						权限
						</el-button>
						<el-button type="info" @click="handleAdd">
							<i class="fa fa-unlock"></i>
							启用 
						</el-button>
						<el-button plain type="danger" @click="handleAdd">
							<i class="fa fa-ban"></i>
							禁用 
						</el-button>
						<el-button type="success" @click="handleAdd">
							<i class="fa fa-user"></i>
							注册员工 
						</el-button>
					</el-row>
					<h3 class="page-header">
						员工列表
					</h3>
					<el-table
						border
			      :data="tableData"
			      style="width: 100%">
			      <el-table-column type="index" width="60"></el-table-column>
			      <el-table-column prop="name" label="姓名" width="180"></el-table-column>
			      <el-table-column prop="date" label="注册时间" width="180"></el-table-column>
			      <el-table-column prop="address" label="地址"></el-table-column>
			    </el-table>
				</el-col>
			</el-row>
		</el-card>
		<el-dialog :visible.sync="orgFormVisible" title="新增部门">
			<el-row>
				<el-col :span="18" :offset="3">
					<el-form :model="organizeForm" ref="organizeForm" label-width="120px">
						<el-form-item label="部门名称">
							<el-input v-model="organizeForm.name" placeholder="请输入部门名称"></el-input>
						</el-form-item>
						<el-form-item label="部门简介">
							<el-input v-model="organizeForm.note" placeholder="请输入部门简介"></el-input>
						</el-form-item>
					</el-form>
				</el-col>
			</el-row>
			<div slot="footer">
				<el-button @click="orgFormVisible = false">取消</el-button>
				<el-button type="primary" @click="orgFormVisible = false">确定</el-button>
			</div>
		</el-dialog>
	</section>
</template>
<script>
	export default {
		data() {
			return {
				organizeTree: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        tableData: [],
	      checkedNode: null,
	      orgFormVisible: false,
	      organizeForm: {
	      	name: '',
	      	note: ''
	      }
			}
		},
		methods: {
			handleNodeClick(data) {
        this.checkedNode = Object.assign({}, data)
        console.log(this.checkedNode);
      },
      handleAdd() {
      	if (!this.checkedNode) {
      		return this.$notify.warning({title: '提示', message: '请选择部门'})
      	}
      	this.orgFormVisible = true
      }
		}
	}
</script>
<style scoped lang="scss">
	.el-card {
		min-height: 500px
	}
	.el-tree {
		min-height: 400px;
		max-height: 600px;
		overflow-y: auto;
		&::-webkit-scrollbar {
      width: 4px;
      border-radius: 5px;
      background: #bbb
    }
	}
	.toolbar {
		padding: 10px 20px;
		margin-bottom: 20px;
		box-shadow: 1px 1px 1px 1px #ddd;
		background: #fff;
	}
</style>