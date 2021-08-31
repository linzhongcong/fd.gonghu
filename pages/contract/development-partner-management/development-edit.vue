<template>
  <div>
    <Card>
      <Row slot="title" type="flex" justify="end">
        <Button type="primary" @click="goBack" style="margin-right: 15px">返回</Button>
        <Button type="primary" :loading="loadingButton" @click="submit('formData')">提交</Button>
      </Row>
      <Row>
        <Card>
          <div slot="title"><p>在线编辑</p></div>
          <div>
            <Form ref="formData" :model="formData" :rules="formRules" label-position="right" :label-width="120">
              <Row type="flex" justify="start">
                <Col :md="8">
                  <FormItem label="公司名称：">
                    <Select
                      v-model="formData.companyInfoId"
                      filterable
                      :loading="loading"
                      :remote-method="queryCompanyDeb"
                      clearable
                      @on-change="selectCompany"
                      :placeholder="+formData.companyInfoId ? formData.companyInfo.name : '请输入公司名称'"
                    >
                      <Option v-for="(item, index) in companyList" :key="index" :value="item.id" :label="item.name"></Option>
                    </Select>
                    <div class="business-icon">
                      <img v-if="!(+formData.companyInfoId)" src="~/assets/images/company_fail.png" alt="" />
                      <img v-else src="~/assets/images/company_success.png" alt="" />
                    </div>
                  </FormItem>
                  <div v-if="formData.companyInfo.contractorId > 0 && curCompanyId !== formData.companyInfoId" class="tipis">该客户已存在</div>
                </Col>
                <Col :md="8">
                  <FormItem label="省份：">
                    <Input :value="formData.companyInfo.base" disabled></Input>
                  </FormItem>
                </Col>
                <Col :md="8">
                  <FormItem label="成立日期：">
                    <Input :value="formData.companyInfo.establishTime" disabled></Input>
                  </FormItem>
                </Col>
              </Row>
              <Row type="flex" justify="start">
                <Col :md="8">
                  <FormItem label="公司类型：">
                    <Input :value="changeCompanyType(formData.companyInfo.companyType)" disabled></Input>
                  </FormItem>
                </Col>
                <Col :md="8">
                  <FormItem label="注册资本：">
                    <Input :value="formData.companyInfo.regCapital" disabled></Input>
                  </FormItem>
                </Col>
                <Col :md="8">
                  <FormItem label="法人：">
                    <Input :value="formData.companyInfo.legalPersonName" disabled></Input>
                  </FormItem>
                </Col>
              </Row>
              <Row type="flex" justify="start">
                <Col :md="8">
                  <FormItem label="经营状态：">
                    <Input :value="formData.companyInfo.regStatus" disabled></Input>
                  </FormItem>
                </Col>
                <Col :md="8">
                  <FormItem label="统一社会信用代码：">
                    <Input :value="formData.companyInfo.creditCode" disabled></Input>
                  </FormItem>
                </Col>
                <Col :md="8">
                  <FormItem label="组织机构代码：">
                    <Input :value="formData.companyInfo.orgNumber" disabled></Input>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col :md="8">
                  <FormItem label="客户类型：" prop="merchantType">
                    <Select v-model="formData.merchantType" placeholder="请选择">
                      <Option v-for="item in merchantTypeList" :value="item.value" :key="item.value" :label="item.label"></Option>
                    </Select>
                  </FormItem>
                </Col>
              </Row>
              <!-- 门店 start -->
              <Row>
                <Col :md="8">
                  <FormItem label="系统/门店名称：" prop="leadsFacade.name">
                    <Input v-model="formData.leadsFacade.name"></Input>
                  </FormItem>
                </Col>
                <Col :md="16">
                  <FormItem label="门店地址：" prop="leadsFacade.address">
                    <Input v-model="formData.leadsFacade.address"></Input>
                  </FormItem>
                </Col>
              </Row>
              <!-- 门店 end -->
              <!-- 备注 start -->
              <Row>
                <Col>
                  <FormItem label="备注：" prop="remark">
                    <Input type="textarea" v-model="formData.remark" placeholder="备注"></Input>
                  </FormItem>
                </Col>
              </Row>
              <!-- 备注 end -->
            </Form>
          </div>
        </Card>
      </Row>
    </Card>
  </div>
</template>
<script>
import mixin from '../mixins'
export default {
  mixins: [mixin],
  data() {
    return {
      // 记录当前工商名
      curCompanyId: '0',
      formData: {
        companyInfo: {},
        leadsFacade: {},
      },
      loading: false,
      loadingButton: false,
      companyList: [],
      formRules: {
        merchantType: [{ required: true, message: '该选项不能为空', trigger: 'blur' }],
        level: [{ required: true, message: '该选项不能为空', trigger: 'blur' }],
        'leadsFacade.name': [{ required: true, message: '长度在1-50个字符之间', trigger: 'change', max: 50 }],
        'leadsFacade.address': [{ required: true, message: '长度在1-50个字符之间', trigger: 'change', max: 50 }],
        remark: [{ required: false, message: '备注不能超过200个字符', max: 200 }],
      },
      queryCompanyDeb: this.$debonce(this.queryCompany, 1250)
    }
  },
  methods: {
    // 转换公司类型
    changeCompanyType(type) {
      if (type == 1) {
        return '公司'
      } else if (type == 2) {
        return '⾹港公司'
      } else if (type == 3) {
        return '社会组织'
      } else if (type == 4) {
        return '律所'
      } else if (type == 5) {
        return '事业单位'
      } else if (type == 6) {
        return '基金会'
      }
    },
    // 返回
    goBack() {
      this.$router.push({
        path: '/contract/development-partner-management/development-partner',
      })
    },
    getDetail(id) {
      this.$api.cuePoolDeatil({ id }).then((res) => {
        if (res.code === 0) {
          let data = res.data
          data.companyInfo = data.companyInfo || {}
          data.leadsFacade = data.leadsFacade || {}
          data.companyInfoId = data.companyInfoId === '0' ? '' : data.companyInfoId
          data.companyInfoId > 0 && this.queryCompany(data.companyInfo.name)
          this.curCompanyId = data.companyInfoId
          this.formData = data
        }
      })
    },

    queryCompany(name) {
      if(!name.trim()) return
      this.loading = true
        this.$api
        .cuePoolGetCompanyInfo({ name })
        .then((res) => {
          let arr = res.items
          for (let i = 0, cur; i < arr.length; i++) {
            cur = arr[i].id
            for (let j = i + 1; j < arr.length; ) {
              cur === arr[j].id ? arr.splice(j, 1) : j++
            }
          }
          this.companyList = arr
        })
        .finally(() => {
          this.loading = false
        })
    },

    selectCompany(val) {
      // 清空工商信息
      if (typeof val === 'undefined') {
        this.formData.companyInfoId = ''
        this.formData.companyInfo = {}
        return;
      }
      let companyList = this.companyList
      for (let company of companyList) {
        if (val === company.id) {
          this.formData.companyInfoId = val
          this.formData.companyInfo = company
          return
        }
      }
    },

    submit(name) {
      this.loadingButton = true
      this.$refs[name].validate((valid) => {
        if (valid) {
          let params = JSON.parse(JSON.stringify(this.formData))
          params.facadeId = this.formData.leadsFacade.id
          params.facadeName = this.formData.leadsFacade.name
          params.facadeAddress = this.formData.leadsFacade.address
          params.companyInfoId = params.companyInfoId || '0'
          delete params.companyInfo
          delete params.leadsFacade
          this.$api
            .cuePoolUpdateCompanyInfo(params)
            .then((res) => {
              if (res.code === 0) {
                this.$router.push({ path: '/contract/development-partner-management/development-partner' })
              }
            })
            .catch((err) => {
              this.$Notice.error({
                title: '错误编码:' + err.code,
                desc: err.message,
              })
              this.loadingButton = false
            })
        } else {
          this.$Message.error('请填写信息!')
          this.loadingButton = false
        }
      })
    },
  },
  mounted() {
    let id = this.$route.query.id
    this.getDetail(id)
  },
}
</script>
<style lang="less" scoped>
.item-style {
  border: 1px rgb(221, 222, 225) dashed;
  border-radius: 5px;
  padding: 16px 15px 13px 3px;
  margin-bottom: 30px;
}
/deep/ .ivu-form .ivu-form-item-label {
  padding-right: 0;
}

// /deep/ .ivu-select-input {
//   padding-right: 8px;
// }

.business-icon {
  position: absolute;
  width: 20px;
  height: 20px;
  top: 6px;
  right: -25px;
  img {
    width: 100%;
  }
}

.tipis {
  position: absolute;
  bottom: 3px;
  left: 125px;
  color: red;
  font-size: 12px;
}
</style>
