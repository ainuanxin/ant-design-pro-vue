<template>
  <a-card :bordered="false">
    <div class="table-page-search-wrapper">
      <a-form layout="inline">
        <a-row :gutter="48">
          <a-col :md="8" :sm="24">
            <a-form-item label="关键字">
              <a-input v-model="queryParam.keyword" placeholder="请输入账户或姓名"/>
            </a-form-item>
          </a-col>
          <a-col :md="8 || 24" :sm="24">
            <span class="table-page-search-submitButtons">
              <a-button type="primary" @click="$refs.table.refresh(true)">查询</a-button>
              <a-button style="margin-left: 8px" @click="resetSearchForm">重置</a-button>
            </span>
          </a-col>
        </a-row>
      </a-form>
    </div>

    <div class="table-operator">
      <a-button type="primary" icon="plus" @click="$refs.createModal.add()">新增</a-button>
     <!-- <a-button type="dashed" @click="tableOption">{{ optionAlertShow && '关闭' || '开启' }} alert</a-button> -->
      <a-dropdown v-action:edit v-if="selectedRowKeys.length > 0">
        <a-menu slot="overlay">
          <a-popconfirm title="是否要删除所选用户？" @confirm="batchDelete()">
             <a-menu-item key="1"><a-icon type="delete" /><a>删除</a></a-menu-item>
          </a-popconfirm>
        </a-menu>
        <a-button style="margin-left: 8px">
          批量操作 <a-icon type="down" />
        </a-button>
      </a-dropdown>
    </div>

    <s-table
      ref="table"
      size="default"
      rowKey="key"
      :columns="columns"
      :data="loadData"
      :alert="options.alert"
      :rowSelection="options.rowSelection"
      showPagination="auto"
    >
      <span slot="serial" slot-scope="text, record, index">
        {{ index + 1 }}
      </span>
      <span slot="status" slot-scope="text">
        <a-badge :status="text | statusTypeFilter" :text="text | statusFilter" />
      </span>

      <span slot="action" slot-scope="text, record">
        <template>
          <a @click="handleEdit(record)">修改</a>
          <a-divider type="vertical" />
          <a-popconfirm v-if="record.status === 1" title="是否要冻结该用户？" @confirm="handleChangeStatus(record.userId, 2)">
            <a>冻结</a>
          </a-popconfirm>
          <a-popconfirm v-if="record.status === 2" title="是否要启用该用户？" @confirm="handleChangeStatus(record.userId, 1)">
            <a>启用</a>
          </a-popconfirm>
          <a-divider type="vertical" />
          <a-popconfirm title="是否要重置该用户密码？" @confirm="handleResetPwd(record.userId)">
            <a>重置密码</a>
          </a-popconfirm>
        </template>
      </span>
    </s-table>
    <create-form ref="createModal" @ok="handleOk" :roleList="roleList"/>
    <update-form ref="updateModal" @ok="handleOk" :roleList="roleList"/>
  </a-card>
</template>

<script>
import { STable, Ellipsis } from '@/components'
import UpdateForm from './modules/UpdateForm'
import CreateForm from './modules/CreateForm'
import { getUserPage, fetchUser, deleteUsers, resetUserPwd, updateUserStatus } from '@/api/user'
import { queryRole } from '@/api/role'

const statusMap = {
  1: {
    status: 'success',
    text: '正常'
  },
  2: {
    status: 'error',
    text: '冻结'
  }
}

export default {
  name: 'UserList',
  components: {
    STable,
    Ellipsis,
    CreateForm,
    UpdateForm
  },
  data () {
    return {
      mdl: {},
      // 查询参数
      queryParam: {
      },
      // 表头
      columns: [
        {
          title: '序号',
          scopedSlots: { customRender: 'serial' }
        },
        {
          title: '账号',
          dataIndex: 'username'
        },
        {
          title: '姓名',
          dataIndex: 'realName'
        },
        {
          title: '手机号',
          dataIndex: 'phone'
        },
        {
          title: '状态',
          dataIndex: 'status',
          scopedSlots: { customRender: 'status' }
        },
        {
          title: '上次登录时间',
          dataIndex: 'lastLoginTime',
          sorter: true
        },
        {
          title: '操作',
          dataIndex: 'action',
          width: '200px',
          align: 'center',
          scopedSlots: { customRender: 'action' }
        }
      ],
      // 加载数据方法 必须为 Promise 对象
      loadData: parameter => {
        console.log('loadData.parameter', parameter)
        return getUserPage(Object.assign(parameter, this.queryParam))
          .then(res => {
            return res.data
          })
      },
      selectedRowKeys: [],
      selectedRows: [],
      roleList: [],

      // custom table alert & rowSelection
      options: {
        alert: { show: true, clear: () => { this.selectedRowKeys = [] } },
        rowSelection: {
          selectedRowKeys: this.selectedRowKeys,
          onChange: this.onSelectChange
        }
      },
      optionAlertShow: false
    }
  },
  filters: {
    statusFilter (type) {
      return statusMap[type].text
    },
    statusTypeFilter (type) {
      return statusMap[type].status
    }
  },
  created () {
    this.tableOption()
    this.getRoles()
  },
  methods: {
    tableOption () {
      if (!this.optionAlertShow) {
        this.options = {
          alert: { show: true, clear: () => { this.selectedRowKeys = [] } },
          rowSelection: {
            selectedRowKeys: this.selectedRowKeys,
            onChange: this.onSelectChange,
            getCheckboxProps: record => ({
              props: {
                disabled: false, // Column configuration not to be checked
                name: record.userId
              }
            })
          }
        }
        this.optionAlertShow = true
      } else {
        this.options = {
          alert: false,
          rowSelection: null
        }
        this.optionAlertShow = false
      }
    },
    getRoles () {
      queryRole().then(res => {
        this.roleList = res.data
      })
    },
    batchDelete () {
      const length = this.selectedRows.length
      if (length === 0) {
        this.$message.info(`请选择要删除的记录`)
      } else {
        deleteUsers(this.selectedRows.map(item => item.userId)).then(res => {
          this.$message.info(`删除成功`)
          this.handleOk()
          this.$refs.table.clearSelected()
        })
      }
    },

    handleEdit (record) {
      fetchUser({ userId: record.userId }).then(res => {
        this.$refs.updateModal.edit(res.data)
      })
    },
    handleChangeStatus (userId, status) {
      updateUserStatus({
        userId: userId,
        status: status
      }).then(res => {
        this.$message.info(`操作成功`)
        this.handleOk()
      })
    },
    handleResetPwd (userId) {
      resetUserPwd({
        userId: userId,
        status: status
      }).then(res => {
        this.$message.info(res.message)
        this.handleOk()
      })
    },
    handleOk () {
      this.$refs.table.refresh()
    },
    onSelectChange (selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
    },
    resetSearchForm () {
      this.queryParam = {
      }
      this.$refs.table.refresh(true)
    }
  }
}
</script>
