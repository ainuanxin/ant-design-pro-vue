<template>
  <a-modal
    title="编辑用户"
    :width="640"
    :visible="visible"
    :confirmLoading="confirmLoading"
    @cancel="handleCancel"
  >
    <a-form :form="form">
      <a-form-item v-show="false" >
        <a-input v-decorator="['userId']" type="hidden"/>
      </a-form-item>
      <a-form-item
        label="用户名"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input v-decorator="['username', {rules: [{required: true}]}]" />
      </a-form-item>
      <a-form-item
        label="姓名"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input v-decorator="['realName', {rules: [{required: true}]}]" />
      </a-form-item>
      <a-form-item
        label="手机号"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-input v-decorator="['phone', {rules: [{required: true, message: '请输入正确的手机号', pattern: /^1[3456789]\d{9}$/ }]}]" />
      </a-form-item>

      <a-form-item
        label="角色"
        :labelCol="labelCol"
        :wrapperCol="wrapperCol"
      >
        <a-select v-decorator="['roleIds', {rules: [{required: true,  message: '请选择角色'}]}]" mode="multiple">
          <a-select-option
            v-for="item in roleList"
            :key="item.roleId"
            :label="item.roleName"
            :value="item.roleId">{{ item.roleName }}</a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
    <template slot="footer">
      <a-button :loading="confirmLoading" type="primary" @click="save()">保存</a-button>
    </template>
  </a-modal>
</template>

<script>
import pick from 'lodash.pick'
import { updateUser } from '@/api/user'

export default {
  name: 'userUpdate',
  data () {
    return {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 }
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 13 }
      },
      visible: false,
      confirmLoading: false,
      currentStep: 0,
      mdl: {},

      form: this.$form.createForm(this)
    }
  },
  props: {
    roleList: {
      type: Array,
      default: () => ({})
    }
  },
  methods: {
    edit (record) {
      this.visible = true
      const { form: { setFieldsValue } } = this
      this.$nextTick(() => {
        setFieldsValue(pick(record, ['userId', 'username', 'realName', 'phone', 'roleIds']))
      })
    },
    save () {
      const { form: { validateFields } } = this
      this.confirmLoading = true
      validateFields((errors, values) => {
        if (!errors) {
          console.log('values:', values)
          updateUser(values)
            .then(() => {
              setTimeout(() => {
                this.visible = false
                this.confirmLoading = false
                this.$emit('ok', values)
              }, 1500)
            }).catch(() => {
              this.confirmLoading = false
            })
        } else {
          this.confirmLoading = false
        }
      })
    },
    handleCancel () {
      // clear form & currentStep
      this.visible = false
    }
  }
}
</script>
