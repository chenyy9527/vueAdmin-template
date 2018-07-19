<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 150px;" class="filter-item" :placeholder="$t('supplier.supplierId')" v-model.trim="listQuery.supplierId">
      </el-input>
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" :placeholder="$t('supplier.supplierName')" v-model.trim="listQuery.supplierName">
      </el-input>
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" :placeholder="$t('supplier.supplierNameEn')" v-model.trim="listQuery.supplierNameEn">
      </el-input>
      <el-select clearable style="width: 120px" class="filter-item" v-model="listQuery.status" :placeholder="$t('supplier.status')">
        <el-option v-for="item in statusOptions" :key="item" :label="item | statusFilter" :value="item">
        </el-option>
      </el-select>
      <el-select clearable style="width: 120px" class="filter-item" v-model="listQuery.ruleConfigState" :placeholder="$t('supplier.ruleConfigState')">
        <el-option v-for="item in ruleConfigStateOptions" :key="item" :label="item | ruleConfigStateFilter" :value="item">
        </el-option>
      </el-select>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">{{$t('supplier.search')}}</el-button>
      <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="el-icon-edit">{{$t('supplier.add')}}</el-button>
    </div>



    <el-table :data="list" v-loading.body="listLoading" element-loading-text="给我一点时间" border fit highlight-current-row>
      <el-table-column align="center" label="供应商编号" width="95">
        <template slot-scope="scope">
          {{scope.row.supplierId}}
        </template>
      </el-table-column>
      <el-table-column label="供应商名称" align="center">
      <template slot-scope="scope">
        {{scope.row.supplierName}}
      </template>
      </el-table-column>
      <el-table-column label="供应商英文名" align="center">
        <template slot-scope="scope">
          {{scope.row.supplierNameEn}}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="渠道发布状态" width="110" align="center">
        <template slot-scope="scope">
          <el-button v-if="scope.row.ruleConfigState === 2" size="mini" type="success" @click="handleRuleStatus(scope.row,1)">{{$t('supplier.publish')}}
          </el-button>
          <el-button v-else size="mini" type="danger" @click="handleRuleStatus(scope.row,2)">{{$t('supplier.delete')}}
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="最后执行人" width="110" align="center">
        <template slot-scope="scope">
          {{scope.row.updateBy}}
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="创建时间" width="200">
        <template slot-scope="scope">
          <i class="el-icon-time"></i>
          <span>{{scope.row.createTime|timeFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('supplier.actions')" width="230" class-name="small-padding fixed-width">
        <template slot-scope="scope">
          <el-button type="primary" size="mini" @click="handleUpdate(scope.row)">{{$t('supplier.edit')}}</el-button>
          <el-button v-if="scope.row.status === 0" size="mini" type="success" @click="handleSupplierStatus(scope.row,1)">{{$t('supplier.publish')}}
          </el-button>
          <el-button v-else size="mini" type="danger" @click="handleSupplierStatus(scope.row,0)">{{$t('supplier.delete')}}
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form :rules="rules" ref="dataForm" :model="temp" label-position="left" label-width="100px" style='width: 400px; margin-left:50px;'>
        <el-form-item :label="$t('supplier.supplierName')" prop="supplierName">
          <el-input v-model="temp.supplierName"></el-input>
        </el-form-item>
        <el-form-item :label="$t('supplier.supplierNameEn')" prop="supplierNameEn">
          <el-input v-model="temp.supplierNameEn"></el-input>
        </el-form-item>
        <el-form-item :label="$t('supplier.fullName')" prop="fullName">
          <el-input v-model="temp.fullName"></el-input>
        </el-form-item>
        <el-form-item :label="$t('supplier.officeNo')" prop="officeNo">
          <el-input v-model="temp.officeNo"></el-input>
        </el-form-item>
        <el-form-item :label="$t('supplier.settlePercent')" prop="settlePercent">
          <el-input v-model="temp.settlePercent"></el-input>
        </el-form-item>
        <el-form-item :label="$t('supplier.reserveMount')" prop="reserveMount">
          <el-input v-model="temp.reserveMount"></el-input>
        </el-form-item>
        <el-form-item :label="$t('supplier.tel')" prop="tel">
          <el-input v-model="temp.tel"></el-input>
        </el-form-item>
        <el-form-item :label="$t('supplier.mail')" prop="mail">
          <el-input v-model="temp.mail"></el-input>
        </el-form-item>
        <el-form-item :label="$t('supplier.token')" prop="mail">
          <el-input v-model="temp.token"></el-input>
        </el-form-item>
        <el-form-item :label="$t('supplier.status')">
          <el-select  class="filter-item" v-model="temp.status" placeholder="Please select">
            <el-option v-for="item in statusOptions" :key="item" :label="item | statusFilter" :value="item">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="$t('supplier.supplierRemark')">
          <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="Please input" v-model="temp.supplierRemark">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t('supplier.cancel')}}</el-button>
        <el-button v-if="dialogStatus=='create'" type="primary" @click="createData">{{$t('supplier.confirm')}}</el-button>
        <el-button v-else type="primary" @click="updateData">{{$t('supplier.confirm')}}</el-button>
      </div>
    </el-dialog>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" :pager-count="pageCount" layout="total, sizes, prev, pager, next, jumper"  :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import { getList, createSupplier, updateSupplier, updateRuleStatus } from '@/api/supplier'
import { formatTimeToStr } from '@/utils/index'
import { validateLowerCase, validatPositiveInteger, validatNaturalNum } from '@/utils/validate'
import waves from '@/directive/waves' // 水波纹指令

export default {
  directives: {
    waves
  },
  data() {
    const validateSettle = (rule, value, callback) => {
      if (!validatPositiveInteger(value)) {
        callback(new Error('请输入小于100的整数'))
      } else {
        if (!(value >= 0 && value <= 100)) {
          callback(new Error('请输入小于100的整数'))
        } else {
          callback()
        }
      }
    }
    const validateEnName = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入供应商英文名'))
      }
      if (!validateLowerCase(value)) {
        callback(new Error('供应商英文名必须为小写字母'))
      } else {
        callback()
      }
    }
    const validateMoney = (rule, value, callback) => {
      if (!validatNaturalNum(value)) {
        callback(new Error('请输入正确的正整数'))
      } else {
        callback()
      }
    }
    return {
      list: null,
      listLoading: true,
      total: null,
      pageCount: null,
      listQuery: {
        pageNum: 1,
        pageSize: 20,
        supplierName: undefined,
        supplierNameEn: undefined,
        type: undefined,
        supplierId: undefined,
        status: undefined,
        ruleConfigState: undefined
      },
      statusOptions: [0, 1],
      ruleConfigStateOptions: [1, 2],
      temp: {
        id: undefined,
        remark: '',
        timestamp: new Date(),
        supplierName: '',
        supplierNameEn: '',
        fullName: '',
        officeNo: '',
        settleType: '',
        settleDay: '',
        settlePercent: '',
        reserveMount: '',
        tel: '',
        mail: '',
        token: '',
        type: '',
        supplierRemark: '',
        status: undefined
      },
      dialogFormVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      rules: {
        supplierName: [{ required: true, message: '请输入供应商名称', trigger: 'change' }],
        supplierNameEn: [{ required: true, trigger: 'blur', validator: validateEnName }],
        fullName: [{ required: true, message: '请输入供应商全名', trigger: 'blur' }],
        settlePercent: [{ required: true, message: '请输入正确的结算比例', trigger: 'blur', validator: validateSettle }],
        reserveMount: [{ required: true, message: '请输入正确的预留金', trigger: 'blur', validator: validateMoney }]
      }
    }
  },
  filters: {
    statusFilter(status) {
      const statusMap = {
        0: '开 启',
        1: '禁 用'
      }
      return statusMap[status]
    },
    ruleConfigStateFilter(status) {
      const ruleConfigStateMap = {
        1: '禁 用',
        2: '开 启'
      }
      return ruleConfigStateMap[status]
    },
    timeFilter(time) {
      const dateFormt = 'yyyy-MM-dd hh:mm:ss'
      return formatTimeToStr(new Date(time), dateFormt)
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getList(this.listQuery).then(response => {
        this.list = response.rows
        this.total = response.total
        this.pageCount = response.pages
        this.listLoading = false
      })
    },
    handleFilter() {
      this.listQuery.pageNum = 1
      this.fetchData()
    },
    handleSizeChange(val) {
      this.listQuery.pageSize = val
      this.fetchData()
    },
    handleCurrentChange(val) {
      this.listQuery.pageNum = val
      this.fetchData()
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleSupplierStatus(row, status) {
      this.$message({
        message: '操作成功',
        type: 'success'
      })
      row.status = status
    },
    handleRuleStatus(row, status) {
      row.ruleConfigState = status
      updateRuleStatus(row, status).then(() => {
        this.$message({
          message: '操作成功',
          type: 'success'
        })
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          createSupplier(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '创建成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateSupplier(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v)
                this.list.splice(index, 1, this.temp)
                break
              }
            }
            this.dialogFormVisible = false
            this.$notify({
              title: '成功',
              message: '更新成功',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        remark: '',
        timestamp: new Date(),
        supplierName: '',
        supplierNameEn: '',
        type: '',
        fullName: '',
        officeNo: '',
        settleType: '',
        settleDay: '',
        settlePercent: '',
        reserveMount: '',
        tel: '',
        token: '',
        supplierRemark: '',
        mail: '',
        status: 0
      }
    }
  }
}
</script>
