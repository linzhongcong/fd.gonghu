<template>
  <div>
    <Card>
      <Row slot="title" type="flex" justify="end">
        <Button type="default" @click="goBack" style="margin-right: 15px">返回</Button>
        <Button type="primary" :loading="loadingButton" @click="submit('formData')">提交</Button>
      </Row>
      <Row>
        <Card>
          <div slot="title"><p>基本信息</p></div>
          <div>
            <Form ref="formData" :model="formData" :rules="formRules" label-position="right" :label-width="120">
              <Row type="flex" justify="start">
                <Col :md="8">
                  <FormItem label="公司名称：" prop="companyInfoId">
                    <Select
                      v-model="formData.companyInfoId"
                      filterable
                      remote
                      :loading="loading"
                      :remote-method="queryCompanyDeb"
                      clearable
                      @on-change="selectCompany"
                      :placeholder="formData.companyInfo.name ? formData.companyInfo.name : '请输入公司名称'"
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
                  <FormItem label="成立日期：" prop="">
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
                <Col :md="8">
                  <FormItem label="门店数量：" prop="estimateFacadeNumber">
                    <Input v-model="formData.estimateFacadeNumber" @on-change="leadsFacadeNumber"></Input>
                  </FormItem>
                </Col>
                <Col :md="8">
                  <FormItem label="客户等级：">
                    <Input :value="formData.level" disabled></Input>
                  </FormItem>
                </Col>
              </Row>
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
              <Row>
                <Col>
                  <FormItem label="备注：" prop="remark">
                    <Input type="textarea" v-model="formData.remark" placeholder="备注"></Input>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <FormItem label="上传凭证：" prop="uploadForm">
                  <div class="upload-list" v-for="item in formData.fileItems">
                    <template v-if="item.etag != ''">
                      <img :src="item.objectUrl" />
                      <div class="upload-list-cover">
                        <Icon type="ios-eye-outline" @click.native="handleViewFile(item.objectUrl)"></Icon>
                        <Icon type="ios-trash-outline" @click.native="handleRemoveFile(item)"></Icon>
                      </div>
                    </template>
                    <template v-else>
                      <Progress :stroke-width="7" :percent="99" status="active" hide-info></Progress>
                    </template>
                  </div>
                  <Upload
                    name="file"
                    :on-success="fileSuccess"
                    :on-error="fileError"
                    :format="['jpg', 'jpeg', 'png']"
                    :action="fileUploadURL"
                    :headers="fileUploadHeaders"
                    class="upload-box"
                    :on-format-error="fileFormatError"
                    :before-upload="fileBeforeUpload"
                    :show-upload-list="false"
                  >
                    <div style="width: 58px;height:58px;line-height: 58px; text-align: center">
                      <Icon type="md-add" size="20"></Icon>
                    </div>
                  </Upload>
                </FormItem>
              </Row>
            </Form>
          </div>
        </Card>
      </Row>
    </Card>
    <!-- 放大凭证 -->
    <Modal v-model="imgModal.show" footer-hide width="550">
      <!-- 占位 -->
      <div style="height:28px"></div>
      <img style="width: 100%" :src="imgModal.url" alt="" />
    </Modal>
  </div>
</template>
<script>
import Cookies from 'js-cookie'
import {SERVER_FILE_URL} from '~/api/config'
import mixin from '../mixins'
export default {
  mixins: [mixin],
  data() {
    const telNumber = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('该项目不能为空!'))
      } else if (!/^1[3456789]\d{9}$/.test(value)) {
        callback(new Error('请输入正确的手机号码!'))
      } else {
        callback()
      }
    }
    const facadeNumber = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('该项目不能为空!'))
      } else if (/^[1-9]\d{0,4}$/.test(value)) {
        callback()
      } else {
        callback(new Error('请输入1-5位数字!'))
      }
    }

    const uploadRule = (rule, value, callback) => {
      if (this.formData.fileItems.length === 0) {
        callback(new Error('该项目不能为空'))
      } else {
        callback()
      }
    }
    return {
      timer: null,
      imgModal: {
        show: false,
        url: '',
      },
      // 表单数据
      formData: {
        companyInfoId: '',
        companyInfo: {},
        leadsFacade: {},
        fileItems: [],
      },
      // 当前工商id
      curCompanyId: '',
      companyList: [],
      // 客户等级
      merchantLevel: '',
      // 文件上传
      fileUploadURL: `${SERVER_FILE_URL}/file/upload`,
      fileUploadHeaders: {
        Authorization: Cookies.get('authorization')
      },
      loading: false,
      loadingButton: false,
      formRules: {
        companyInfoId: [{ required: true, message: '该选项不能为空', trigger: 'change' }],
        'leadsFacade.address': [{ required: true, message: '长度在1-50个字符之间', trigger: 'blur', max: 50 }],
        'leadsFacade.name': [{ required: true, message: '长度在1-50个字符之间', trigger: 'blur', max: 50 }],
        merchantType: [{ required: true, message: '该选项不能为空', trigger: 'change' }],
        estimateFacadeNumber: [{ required: true, validator: facadeNumber, trigger: 'blur' }],
        contactName: [{ required: true, message: '长度在1-50个字符之间', trigger: 'blur', max: 50 }],
        contactPhone: [{ required: true, validator: telNumber, trigger: 'blur' }],
        contactJob: [{ required: true, message: '长度在1-50个字符之间',trigger: 'blur' ,max: 50 }],
        uploadForm: [{ required: true, validator: uploadRule, trigger: 'change' }],
        remark: [{ required: false, message: '备注不能超过200个字符', max: 200 }],
      },
      queryCompanyDeb: this.$debonce(this.queryCompany, 1250)
    }
  },
  methods: {
    goBack() {
      this.$router.push({
        path: '/contract/potential-customer/customer',
      })
    },
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
        this.formData.companyInfoId = 0
        this.formData.companyInfo = {}
        return
      }
      let companyList = this.companyList
      for (let company of companyList) {
        if (val === company.id) {
          this.formData.companyInfo = company
          return
        }
      }
    },
    getDetail(id) {
      this.$api.potentialCustomerDeatil({id}).then((res) => {
        if(res.code === 0) {
          let data = res.data
          data.companyInfo = data.companyInfo || {}
          data.fileItems = data.fileItems || []
          data.leadsFacade = data.leadsFacade || {}
          data.companyInfoId = data.companyInfoId === '0' ? '' : data.companyInfoId
          data.companyInfoId > 0 && this.queryCompany(data.companyInfo.name)
          this.curCompanyId = data.companyInfoId
          this.formData = data
        }
      })
    },

    // 提交
    submit(name) {
      this.loadingButton = true
      // 需要先判断 是提交还是编辑
      if (this.$route.query.id) {
        this.$refs[name].validate((valid) => {
          if(valid) {
            let params = JSON.parse(JSON.stringify(this.formData))
            params.facadeId	 = params.leadsFacade.id
            params.facadeAddress	 = params.leadsFacade.address
            params.facadeName	 = params.leadsFacade.name
            delete params.companyInfo
            delete params.leadsFacade
            this.$api.potentialCustomerUpdate(params).then((res) => {
              if(res.code === 0) {
                this.$Message.success('编辑成功')
                this.$router.push({path: '/contract/potential-customer/customer'})
              }
            })
            .catch((err) => {
              this.loadingButton = false
              this.$Notice.error({
                title: err.code,
                desc: err.message
              })
            })
          } else {
            this.$Message.error('请填写信息!')
            this.loadingButton = false
          }
        })
      } else {
        this.$refs[name].validate((valid) => {
          if (valid) {
            let params = JSON.parse(JSON.stringify(this.formData))
            params.facadeAddress	 = params.leadsFacade.address
            params.facadeName	 = params.leadsFacade.name
            delete params.companyInfo
            delete params.leadsFacade
            this.$api.potentialCustomerCreate(params).then((res) => {
              if(res.code === 0) {
                this.$Message.success('添加成功')
                this.$router.push({path: '/contract/potential-customer/customer'})
              }
            })
            .catch((err) => {
              this.loadingButton = false
              this.$Notice.error({
                title: err.code,
                desc: err.message
              })
            })
          } else {
            this.$Message.error('请填写信息!')
            this.loadingButton = false
          }
        })
      }
    },

    // 文件上传前触发
    fileBeforeUpload() {
      if (!(this.formData.fileItems.length < 5)) {
        this.$Notice.warning({
          title: '提示',
          desc: '上传文件不能超过5个!',
        })
        return false
      }
      this.formData.fileItems.push({ etag: '' })
    },

    // 文件上传成功回调
    fileSuccess(response, file, fileList) {
      if (response.code === 0) {
        this.formData.fileItems.pop()
        this.formData.fileItems.push(response.data.fileUploadVo)
      }
    },

    // 文件上传失败回调
    fileError(error, file, fileList) {
      this.formData.fileItems.pop()
      this.$Notice.error({
        title: '文件上传失败',
        desc: error,
      })
    },

    // 上传凭证格式不正确
    fileFormatError(file, fileList) {
      this.$Notice.warning({
        title: '文件格式不正确',
        desc: '请上传的图片格式必须是：jpg、jpeg、png',
      })
    },

    // 查看凭证
    handleViewFile(url) {
      this.imgModal.show = true
      this.imgModal.url = url
    },
    // 删除凭证
    handleRemoveFile(file) {
      this.formData.fileItems.splice(this.formData.fileItems.indexOf(file), 1)
    },

    // 自动填充门店数量
    leadsFacadeNumber(e) {
      let value = e.target.value.trim()
      if (value == '') {
        this.formData.level = ''
        return
      }
      value = parseInt(value)
      if (value < 5) {
        this.formData.level = 'D'
      } else if (value < 20) {
        this.formData.level = 'C'
      } else if (value < 80) {
        this.formData.level = 'B2'
      } else if (value < 100) {
        this.formData.level = 'B1'
      } else if (value < 500) {
        this.formData.level = 'A2'
      } else if (value >= 500) {
        this.formData.level = 'A1'
      }
    },
  },
  mounted() {
    let id = this.$route.query.id
    if (id) {
      this.getDetail(id)
    }
  },
  watch: {},
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
.upload-list {
  display: inline-block;
  width: 60px;
  height: 60px;
  text-align: center;
  line-height: 60px;
  border: 1px solid transparent;
  border-radius: 4px;
  overflow: hidden;
  background: #fff;
  position: relative;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  margin-right: 4px;
  img {
    width: 100%;
    height: 100%;
  }
  &:hover {
    .upload-list-cover {
      display: block;
    }
  }
}

.upload-box {
  display: inline-block;
  width: 58px;
  border: 1px solid #dcdee2;
  vertical-align: top;
  transition: border 0.2s ease-in-out, background 0.2s ease-in-out, box-shadow 0.2s ease-in-out;
  &:hover {
    cursor: pointer;
    border-color: #57a3f3;
  }
}

.upload-list-cover {
  display: none;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(0, 0, 0, 0.6);
  i {
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
  }
}

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
