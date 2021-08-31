<template>
  <div>
    <Card>
      <Row slot="title" type="flex" justify="end">
        <Button type="default" :loading="loadingButton" @click="goBack" style="margin-right: 15px">返回</Button>
        <Button type="primary" :loading="loadingButton" @click="submit('formData')">提交</Button>
      </Row>
      <Row>
        <Card>
          <div slot="title"><p>基本信息</p></div>
          <div>
            <Form ref="formData" :model="formData" :rules="formRules" label-position="right" :label-width="120">
              <Row type="flex" justify="start">
                <Col :md="8">
                  <FormItem label="公司名称：" prop="companyInfo.name">
                    <Select
                      v-model="formData.companyInfo.name"
                      filterable
                      remote
                      :loading="loading"
                      :remote-method="queryCompany"
                      @on-change="selectCompany"
                      :placeholder="hasCompanyName ? formData.companyInfo.name : '请输入公司名称'"
                    >
                      <Option v-for="(item, index) in companyList" :key="index" :value="item.name" :label="item.name"></Option>
                    </Select>
                    <div class="business-icon">
                      <img v-if="!hasCompanyName" src="~/assets/images/company_fail.png" alt="" />
                      <img v-else src="~/assets/images/company_success.png" alt="" />
                    </div>
                  </FormItem>
                  <div v-if="hasContractor" class="tipis">该客户已存在</div>
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
                  <FormItem label="门店数量：" prop="leadsFacade.number">
                    <Input v-model="formData.leadsFacade.number"  @on-change="leadsFacadeNumber"></Input>
                  </FormItem>
                </Col>
                <Col :md="8">
                  <FormItem label="客户等级：">
                    <Input :value="formData.merchantLevel" disabled></Input>
                  </FormItem>
                </Col>
              </Row>
              <!-- 门店 start -->
              <Row>
                <Col :md="8">
                  <FormItem label="门店名称：" prop="leadsFacade.name">
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
              <!-- 联系人 start -->
              <Row>
                <Col :md="8">
                  <FormItem label="联系人姓名：" prop="contactName">
                    <Input v-model="formData.contactName"></Input>
                  </FormItem>
                </Col>
                <Col :md="8">
                  <FormItem label="联系人电话：" prop="contactPhone">
                    <Input v-model="formData.contactPhone"></Input>
                  </FormItem>
                </Col>
                <Col :md="8">
                  <FormItem label="联系人职务：" prop="contactPost">
                    <Input v-model="formData.contactPost"></Input>
                  </FormItem>
                </Col>
              </Row>
              <!-- 联系人 end -->
              <!-- 备注 start -->
              <Row>
                <Col>
                  <FormItem label="备注：">
                    <Input v-model="formData.remark" placeholder="备注"></Input>
                  </FormItem>
                </Col>
              </Row>
              <!-- 备注 end -->
              <!-- 上传 start -->
              <Row>
                <FormItem label="上传凭证：" prop="uploadForm">
                  <div class="demo-upload-list" v-for="item in uploadList">
                    <template v-if="item.status === 'finished'">
                      <img :src="item.url" />
                      <div class="demo-upload-list-cover">
                        <Icon type="ios-eye-outline" @click.native="handleView(item.name)"></Icon>
                        <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                      </div>
                    </template>
                    <template v-else>
                      <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                    </template>
                  </div>
                  <Upload
                    name="UploadForm[file]"
                    ref="upload"
                    :show-upload-list="false"
                    :default-file-list="defaultList"
                    :on-success="fileSuccess"
                    :before-upload="handleBeforeUpload"
                    multiple
                    :action="fileUploadURL"
                    :headers="fileUploadHeaders"
                    style="display: inline-block;width:58px;border: 1px solid black; vertical-align: top;"
                  >
                    <div style="width: 58px;height:58px;line-height: 58px; text-align: center">
                      <Icon type="md-add" size="20"></Icon>
                    </div>
                    <!-- <Button icon="md-add" type="dashed"></Button> -->
                  </Upload>
                </FormItem>
              </Row>
              <!-- 上传 end -->
              <!-- <Row>
                <FormItem label="上传凭证：">
                  <Upload
                    name="UploadForm[file]"
                    :action="fileUploadURL"
                    :headers="fileUploadHeaders"
                    :on-success="fileSuccess"
                    :on-remove="fileRemove"
                  >
                    <Button icon="md-add" type="dashed"></Button>
                  </Upload>
                </FormItem>
              </Row> -->
            </Form>
          </div>
        </Card>
      </Row>
    </Card>
  </div>
</template>
<script>
import Cookies from 'js-cookie'
import { SERVER_BASE_URL } from '~/api/config'
export default {
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
    return {
      // 表单数据
      formData: {
        companyInfo: {},
        leadsFacade: {},
      },
      // 远程搜索工商信息
      // companyInfo: {},
      companyList: [],
      // 客户等级
      merchantLevel: '',
      labelDiyWidth: 100,
      defaultList: [
        {
          name: 'a42bdcc1178e62b4694c830f028db5c0',
          url: 'https://img14.360buyimg.com/n0/jfs/t1/152121/6/15846/135127/600edeffEb76754f7/bf130a8681a4442b.jpg',
        },
        {
          name: 'bc7521e033abdd1e92222d733590f104',
          url: 'https://img14.360buyimg.com/n0/jfs/t1/152121/6/15846/135127/600edeffEb76754f7/bf130a8681a4442b.jpg',
        },
      ],
      imgName: '',
      visible: false,
      hasCompanyName: false,
      hasContractor: false,
      uploadList: [],
      // 文件上传
      fileUploadURL: `${SERVER_BASE_URL}/v1/upload`,
      fileUploadHeaders: {
        Authorization: Cookies.get('authorization'),
      },
      merchantTypeList: [
        { value: 'cs', label: 'CS' },
        { value: 'ka', label: 'KA' },
        { value: 'csDealers', label: 'CS经销商' },
        { value: 'kaDealers', label: 'KA经销商' },
        { value: 'store', label: '便利店' },
        { value: 'newRetailing', label: '新零售' },
        { value: 'otc', label: 'OTC' },
        { value: 'other', label: '其他' },
      ],
      detailData: {},
      userList: [],
      contractList: [],
      loading: false,
      loadingButton: false,
      formRules: {
        'companyInfo.name': [{ required: true, message: '该选项不能为空', trigger: 'change' }],
        merchantType: [{ required: true, message: '该选项不能为空', trigger: 'blur' }],
        level: [{ required: true, message: '该选项不能为空', trigger: 'blur' }],
        'leadsFacade.name': [{ required: true, message: '长度在1-50个字符之间', trigger: 'change', max: 50 }],
        'leadsFacade.address': [{ required: true, message: '长度在1-50个字符之间', trigger: 'change', max: 50 }],
        'leadsFacade.number': [{ required: true, validator: facadeNumber, trigger: 'change' }],
        contactName: [{ required: true, message: '长度在1-50个字符之间', trigger: 'change', max: 50 }],
        contactPhone: [{ required: true, validator: telNumber, trigger: 'change' }],
        contactPost: [{ required: true, message: '备注不能超过200个字符', max: 200 }],
        uploadForm: [{ required: true, message: '请上传凭证', max: 200 }],
        remark: [{ required: false, message: '备注不能超过200个字符', max: 200 }],
      },
    }
  },
  methods: {
    goBack() {
      this.$router.push({
        path: '/contract/development-partner-management/development-partner',
      })
    },
    // 转换公司类型
    changeCompanyType(type){
      if(type == 1) {return '公司'}
      else if(type == 2) {return '⾹港公司'}
      else if(type == 3) {return '社会组织'}
      else if(type == 4) {return '律所'}
      else if(type == 5) {return '事业单位'}
      else if(type == 6) {return '基金会'}
    },
    queryCompany(name) {
      this.loading = true
      this.$api
        .cuePoolGetCompanyInfo({ name })
        .then((res) => {
          let arr = res.items;
          if (arr.length == 0) {
            this.hasCompanyName = false
          } else {
            this.hasCompanyName = true
          }
          for (let i = 0, cur; i < arr.length; i++) {
            cur = arr[i].id;
            if (arr[i].contractorId > '0') {
              this.hascontractor = true;
            } else {
              this.hascontractor = false;
            }
            for (let j = i + 1; j < arr.length; ) {
              cur === arr[j].id ? arr.splice(j, 1) : j++
            }
          }
          this.companyList = arr;
        })
        .finally(() => {
          this.loading = false;
        })
    },
    selectCompany(val) {
      let companyList = this.companyList;
      for (let i = 0; i < companyList.length; i++) {
        if (val == companyList[i].name) {
          this.companyInfo = companyList[i];
          if (companyList[i].contractorId > '0') {
            this.hasContractor = true
          } else {
            this.hasContractor = false
          }
          return
        }
      }
    },
    getDetail(id) {
      this.$api.cuePoolDeatil({ id }).then((res) => {
        if (res.code === 0) {
          if (!res.data.companyInfo.name) {
            this.hasCompanyName = false
          } else {
            this.curCompanyName = res.data.companyInfo.id
            this.hasCompanyName = true
          }
          this.formData = res.data;
        }
      })
    },
    handleView(name) {
      this.imgName = name;
      this.visible = true;
    },
    handleRemove(file) {
      // const fileList = this.$refs.upload.fileList
      // this.$refs.upload.fileList.splice(fileList.indexOf(file), 1)
    },
    handleBeforeUpload() {},
    submit(name) {
      this.$refs[name].validate((valid) => {
        if (valid) {
        } else {
          this.$Message.error('请填写信息!');
        }
      })
    },
    fileSuccess(response, file, fileList) {
      // if (response.code === 0) {
      //   this.formData.fileItems.push(response.data)
      // }
    },
    fileRemove(file, fileList) {
      // this.formData.fileItems.splice(this.formData.fileItems.indexOf(file), 1)
    },
    // selectMethod(value) {
    //   if (value === 'spot_cash') {
    //     this.formRules.payment_days = [{ required: false, message: '该选项不能为空', trigger: 'change' }]
    //     this.formRules.payment_at = [{ required: false, message: '该选项不能为空', trigger: 'blur' }]
    //   }
    // },
    leadsFacadeNumber(e) {
      let value = e.target.value.trim();
      if(value == ''){
        this.formData.merchantLevel = '';
        return;
      }
      value = parseInt(value);
      if(value < 5) {
        this.formData.merchantLevel = 'D';
      } else if(value < 20) {
        this.formData.merchantLevel = 'C';
      } else if(value < 80) {
        this.formData.merchantLevel = 'B2';
      } else if(value < 100) {
        this.formData.merchantLevel = 'B1';
      } else if(value < 500) {
        this.formData.merchantLevel = 'A2';
      } else if(value >= 500) {
        this.formData.merchantLevel = 'A1';
      }
    }
  },
  mounted() {
    // this.uploadList = this.$refs.upload.fileList
    let id = this.$route.query.id;
    this.getDetail(id);
  },
  watch: {
    
  }
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
.demo-upload-list {
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
    .demo-upload-list-cover {
      display: block;
    }
  }
}

.demo-upload-list-cover {
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
