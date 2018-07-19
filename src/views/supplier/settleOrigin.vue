<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input @keyup.enter.native="handleFilter" style="width: 150px;" class="filter-item" :placeholder="$t('settleOrigin.orderId')" v-model.trim="listQuery.orderId">
      </el-input>
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" :placeholder="$t('settleOrigin.supplyOrderId')" v-model.trim="listQuery.supplyOrderId">
      </el-input>
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" :placeholder="$t('settleOrigin.supplierId')" v-model.trim="listQuery.supplierId">
      </el-input>
      <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" :placeholder="$t('settleOrigin.ticketDate')" v-model.trim="listQuery.ticketDate">
      </el-input>
      <el-select clearable style="width: 120px" class="filter-item" v-model="listQuery.status" :placeholder="$t('settleOrigin.status')">
        <el-option v-for="item in statusOptions" :key="item" :label="item | statusFilter" :value="item">
        </el-option>
      </el-select>
      <el-button class="filter-item" type="primary" v-waves icon="el-icon-search" @click="handleFilter">{{$t('settleOrigin.search')}}</el-button>
    </div>

    <el-table :data="list" v-loading.body="listLoading" element-loading-text="给我一点时间" style="width: 100%" border fit highlight-current-row>
      <el-table-column align="center" :label="$t('settleOrigin.orderId')"  width="200">
        <template slot-scope="scope">
          {{scope.row.orderId}}
        </template>
      </el-table-column>
      <el-table-column label="外部订单号" align="center" width="200">
        <template slot-scope="scope">
          {{scope.row.supplyOrderId}}
        </template>
      </el-table-column>
      <el-table-column label="供应商" align="center" width="120">
        <template slot-scope="scope">
          {{scope.row.supplierId|supplierFilter}}
        </template>
      </el-table-column>
      <el-table-column  label="冻结金额" width="110" align="center">
        <template slot-scope="scope">
          {{scope.row.settlePrice}}
        </template>
      </el-table-column>
      <el-table-column label="冻结状态" width="50" align="center">
        <template slot-scope="scope">
          {{scope.row.status}}
        </template>
      </el-table-column>
      <el-table-column label="飞行日期" width="160" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.flyDate|timeFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="created_at" label="冻结时间" width="160">
        <template slot-scope="scope">
          <span>{{scope.row.createTime|timeFilter}}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" :label="$t('settleOrigin.actions')" width="140"  fixed="right"  class-name="fixed-width">
        <template slot-scope="scope">
          <el-button type="primary"  @click="handleUpdate(scope.row)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form  ref="dataForm" :model="temp" label-position="left" label-width="100px" style='width: 400px; margin-left:50px;'>
        <el-form-item :label="$t('settleOrigin.originId')" prop="supplierName">
          {{temp.originId}}
        </el-form-item>
        <el-form-item :label="$t('settleOrigin.token')" prop="supplierNameEn">
          {{temp.token}}
        </el-form-item>
        <el-form-item :label="$t('settleOrigin.orderId')" prop="fullName">
          {{temp.orderId}}
        </el-form-item>
        <el-form-item :label="$t('settleOrigin.supplyOrderId')" prop="officeNo">
          {{temp.supplyOrderId}}
        </el-form-item>
        <el-form-item :label="$t('settleOrigin.tradeType')" prop="settlePercent">
          {{temp.tradeType}}
        </el-form-item>
        <el-form-item :label="$t('settleOrigin.supplierId')" prop="reserveMount">
          {{temp.supplierId}}
        </el-form-item>
        <el-form-item :label="$t('settleOrigin.intFlag')" prop="tel">
          {{temp.intFlag}}
        </el-form-item>
        <el-form-item :label="$t('settleOrigin.rechargeType')" prop="mail">
          {{temp.rechargeType}}
        </el-form-item>
        <el-form-item :label="$t('settleOrigin.passengerName')" prop="mail">
          {{temp.passengerName}}
        </el-form-item>
        <el-form-item :label="$t('settleOrigin.passengerType')">
          {{temp.passengerType}}
        </el-form-item>
        <el-form-item :label="$t('settleOrigin.tradeRemark')">
          <el-input type="textarea" readonly :autosize="{ minRows: 2, maxRows: 4}" placeholder="Please input" v-model="temp.tradeRemark">
          </el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">{{$t('settleOrigin.cancel')}}</el-button>
      </div>
    </el-dialog>

    <div class="pagination-container">
      <el-pagination background @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.pageNum" :page-sizes="[10,20,30, 50]" :page-size="listQuery.pageSize" :pager-count="pageCount" layout="total, sizes, prev, pager, next, jumper"  :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import { getOriginList } from '@/api/supplier'
  import { formatTimeToStr } from '@/utils/index'
  import { validateLowerCase, validatPositiveInteger, validatNaturalNum } from '@/utils/validate'
  import waves from '@/directive/waves' // 水波纹指令
  import store from '@/store'

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
          originId: undefined,
          token: undefined,
          orderId: undefined,
          supplyOrderId: undefined,
          tradeType: undefined,
          supplierId: undefined,
          intFlag: undefined,
          passengerName: undefined,
          status: undefined,
          flyDate: undefined,
          ticketDate: undefined,
          unfreezeDate: undefined,
          createTime: undefined,
          updateTime: undefined,
          updtaeUser: undefined
        },
        statusOptions: [1, 2, 3],
        ruleConfigStateOptions: [1, 2],
        supplierCache: new Map(),
        temp: {
          originId: undefined,
          token: undefined,
          orderId: undefined,
          supplyOrderId: undefined,
          tradeType: undefined,
          supplierId: undefined,
          intFlag: undefined,
          rechargeType: undefined,
          tradeRemark: undefined,
          passengerName: undefined,
          passengerType: undefined,
          cardType: undefined,
          salePrice: undefined,
          settlePrice: undefined,
          freezeRate: undefined,
          freezePrice: undefined,
          status: undefined,
          flyDate: undefined,
          ticketDate: undefined,
          unfreezeDate: undefined,
          onlyRecord: undefined,
          createTime: undefined,
          updateTime: undefined,
          updtaeUser: undefined
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
          1: '已冻结',
          2: '已解冻',
          3: '无需冻结'
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
      },
      supplierFilter(supplierId) {
        const cache = store.getters.supplierCache
        if (cache.get(supplierId)) {
          return cache.get(supplierId)
        } else {
          return supplierId
        }
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      fetchData() {
        this.listLoading = true
        getOriginList(this.listQuery).then(response => {
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
      handleUpdate(row) {
        console.log(row)
        this.temp = Object.assign({}, row) // copy obj
        this.temp.timestamp = new Date(this.temp.timestamp)
        this.dialogStatus = 'update'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            const tempData = Object.assign({}, this.temp)
            tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
            getOriginList(tempData).then(() => {
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
      }
    }
  }
</script>
