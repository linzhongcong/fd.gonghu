<template>
  <Card>
    <Row slot="title" type="flex" justify="end">
      <Button class="title-btn" @click="goBack">返回</Button>
      <Button type="primary" class="title-btn" :loading="submitLoading" @click="submit('facade')">提交</Button>
    </Row>
    <Card>
      <div slot="title"><p>门店信息</p></div>
      <div>
        <Form ref="facade" :model="formData" :rules="formRules" :label-width="120">
          <Row>
            <Col :md="16">
              <FormItem label="公司名称：" prop="contractorId">
                <Select
                  filterable
                  v-model="formData.contractorId"
                  :remote-method="debQueryCompany"
                  :loading="remoteLoading"
                  @on-change="(value) => selectOption(value, 'company')"
                  :placeholder="formData.merchantName || '请输入公司名称'"
                >
                  <Option v-for="(item, index) in companyList" :value="item.id" :label="item.merchantName" :key="index"></Option>
                </Select>
              </FormItem>
            </Col>
           </Row>
           <Row>
            <Col :md="8">
              <FormItem label="系统/门店名称：" prop="systemInfoId">
                <Select
                  filterable
                  v-model="formData.systemInfoId"
                  :remote-method="debQuerySystemInfo"
                  :loading="remoteLoading"
                  :placeholder="formData.systemInfo.name || '请选择系统/门店名称'"
                >
                  <Option v-for="(item, index) in systemInfoList" :value="item.id" :label="item.name" :key="index"></Option>
                </Select>
              </FormItem>
            </Col>
            <Col :md="8">
              <FormItem label="客户类型：">
                <Input :value="formatMerchantType(formData.merchantType)" disabled/>
              </FormItem>
            </Col>
           </Row>
           <Row>
            <Col :md="8">
              <FormItem label="门店名称：" prop="name">
                <Input v-model="formData.name" @on-change="() => facadeNameFlag = false" placeholder="请输入门店名称"/>
                <div v-show="facadeNameFlag" class="ivu-form-item-error-tip">门店名称已存在</div>
              </FormItem>
            </Col>
            <Col :md="8">
              <FormItem label="进驻品牌：" prop="inBrands">
                <Select v-model="formData.inBrands" placeholder="请选择进驻品牌" multiple>
                  <Option v-for="item in inBrandsList" :value="item.value" :key="item.value" :label="item.label"></Option>
                </Select>
              </FormItem>
            </Col>
            <Col :md="8">
              <FormItem label="经营状态" prop="manageStatus">
                <Select v-model="formData.manageStatus" placeholder="请选择">
                  <Option v-for="item in manageStatusOption" :value="item.value" :key="item.value" :label="item.label"></Option>
                </Select>
              </FormItem>
            </Col>
           </Row>
           <Row>
            <Col :md="8">
              <FormItem label="门店地区：" prop="area">
                <Cascader v-model="formData.area" :data="area" @on-change="selectArea" placeholder="省/市/区"></Cascader>
              </FormItem>
            </Col>
            <Col :md="16">
              <FormItem label="门店地址：" prop="address">
                <Input v-model="formData.address" placeholder="请输入门店详细地址"/>
              </FormItem>
            </Col>
           </Row>
           <Row>
            <Col :md="8">
              <FormItem label="门店类型：" prop="type">
                <Select v-model="formData.type">
                  <Option v-for="(item, index) in typeOption" :value="item.value" :label="item.label" :key="index"></Option>
                </Select>
              </FormItem>
            </Col>
            <Col :md="8">
              <FormItem label="门店规模：" prop="size">
                <Select v-model="formData.size">
                  <Option v-for="(item, index) in sizeOption" :value="item.value" :label="item.label" :key="index"></Option>
                </Select>
              </FormItem>
            </Col>
            <Col :md="8">
              <FormItem label="门店商品类型：" prop="goodsType">
                <Select v-model="formData.goodsType">
                  <Option v-for="(item, index) in goodsTypeOption" :value="item.value" :label="item.label" :key="index"></Option>
                </Select>
              </FormItem>
            </Col>
           </Row>
           <Row>
            <Col :md="8">
              <FormItem label="BA情况：" prop="hasBa">
                <Select v-model="formData.hasBa">
                  <Option v-for="(item, index) in hasBaOption" :value="item.value" :label="item.label" :key="index"></Option>
                </Select>
              </FormItem>
            </Col>
            <Col :md="8">
              <FormItem label="门店商圈：" prop="tradeArea">
                <Select v-model="formData.tradeArea">
                  <Option v-for="(item, index) in tradeAreaOption" :value="item.value" :label="item.label" :key="index"></Option>
                </Select>
              </FormItem>
            </Col>
            <Col :md="8">
              <FormItem label="商圈级别：" prop="tradeAreaLevel">
                <Select v-model="formData.tradeAreaLevel">
                  <Option v-for="(item, index) in tradeAreaLevelOption" :value="item.value" :label="item.label" :key="index"></Option>
                </Select>
              </FormItem>
            </Col>
           </Row>
           <Row>
            <Col :md="8">
              <FormItem label="零售负责人" prop="followIds">
                <Select 
                  v-model="formData.followIds"
                  multiple
                  filterable
                  :remote-method="debQueryWorker"
                  :loading="remoteLoading"
                  @on-change="(value) => selectOption(value, 'worker')"
                  :placeholder="formData.followBy || '请输入员工姓名/工号'"
                >
                  <Option v-for="(item, index) in workerList" :value="item.id" :label="item.fullName || item.full_name" :key="index"></Option>
                </Select>
              </FormItem>
            </Col>
           </Row>
        </Form>
      </div>
    </Card>
    <Spin fix v-if="spinShow"></Spin>
  </Card>
</template>

<script>
import area from '~/plugins/area.js'
import mixin from '../mixins'
export default {
  mixins: [mixin],
  data () {
    return {
      area: [],
      id: this.$route.query.id,
      spinShow: false,
      facadeNameFlag: false, // 门店名称是否存在标志
      formData: {
        contractorId: '',
        followIds: [],
        systemInfo: {}
      },
      inBrandsList: [
        { value: 'wis', label: 'WIS' },
        { value: 'kono', label: 'KONO' },
      ],
      typeOption: [
        { value: 'singleStore', label: '单体店'},
        { value: 'regionalChain', label: '区域性连锁'},
        { value: 'topChain', label: '百强连锁'},
      ],
      sizeOption: [
        { value: 's', label: '小店'},
        { value: 'm', label: '中店'},
        { value: 'l', label: '大店'},
        { value: 'xl', label: '特大店'},
      ],
      goodsTypeOption: [
        { value: 'importBase', label: '进口品为主'},
        { value: 'homeBase', label: '国产品为主'},
        { value: 'ownBase', label: '自有品为主'},
        { value: 'hotBase', label: '网红品为主'},
        { value: 'mixSale', label: '混合销售'},
      ],
      hasBaOption: [
        { value: '1', label: '有BA'},
        { value: '0', label: '无BA'},
      ],
      tradeAreaOption: [
        { value: 'shoppingCenter', label: '购物中心'},
        { value: 'businessStreet', label: '商业街'},
        { value: 'pedestrianStreet', label: '步行街'},
        { value: 'communityStore', label: '社区店'},
        { value: 'countryStore', label: '乡镇店'},
      ],
      tradeAreaLevelOption: [
        { value: '1', label: '一级商圈'},
        { value: '2', label: '二级商圈'},
        { value: '3', label: '三级商圈'},
      ],
      manageStatusOption: [
        { value: 'open', label: '在业'},
        { value: 'close', label: '停业'},
      ],
      formRules: {
        contractorId: [{required: true, message: '该项目不能为空', trigger: 'change'}],
        systemInfoId: [{required: true, message: '该项目不能为空', trigger: 'change'}],
        name: [{required: true, message: '请输入1-50个字符', trigger: 'blur', max: 50}],
        inBrands: [{required: true, message: '该项目不能为空', trigger: 'change', type: 'array'}],
        area: [{required: true, message: '该项目不能为空', trigger: 'change', type: 'array'}],
        address: [{required: true, message: '请输入1-50个字符', trigger: 'blur', max: 50}],
        manageStatus: [{required: true, message: '该项目不能为空', trigger: 'change'}],
        type: [{required: true, message: '该项目不能为空', trigger: 'change'}],
        size: [{required: true, message: '该项目不能为空', trigger: 'change'}],
        goodsType: [{required: true, message: '该项目不能为空', trigger: 'change'}],
        hasBa: [{required: true, message: '该项目不能为空', trigger: 'change'}],
        tradeArea: [{required: true, message: '该项目不能为空', trigger: 'change'}],
        tradeAreaLevel: [{required: true, message: '该项目不能为空', trigger: 'change'}],
        followIds: [{type: 'array', required: true, message: '该项目不能为空', trigger: 'change'}],
      },
      workerList: [],
      companyList: [],
      systemInfoList: [],
      remoteLoading: false,
      companyLoading: false,
      workerLoading: false,
      submitLoading: false,
      debQueryCompany: this.$debonce(this.queryCompany, 500),
      debQueryWorker: this.$debonce(this.queryWorker, 500),
      debQuerySystemInfo: this.$debonce(this.querySystemInfo, 500),
    }
  },
  methods: {
    /**
     * 提交状态模式
     * @param {String} state: add-添加 edit-编辑
     * @param {Object} params: 请求参数
     */
    submitForm(state, params) {
      const obj = {
        status: '',
        state: {
          add: async (params) => {
            let res
            this.submitLoading = true
            try {
              res = await this.$api.contractorAddShopInfo(params)
              res.code === 0 && this.$Message.success('添加成功') && this.$router.push('/contract/facade/list')
              this.submitLoading = false
            } catch (error) {
              error.message === '门店名称已存在' && (this.facadeNameFlag = true) // 次判断内容需要与后端保持同步，一端修改及时通知另一端
              this.$Notice.error({
                title: error.code,
                desc: error.message
              })
              this.submitLoading = false
            }
          },
          edit: async (params) => {
            let res
            this.submitLoading = true
            try {
              res = await this.$api.contractorEditShopInfo(params)
              res.code === 0 && this.$Message.success('添加成功') && this.$router.push('/contract/facade/list')
              this.submitLoading = false
            } catch (error) {
              error.message === '门店名称已存在' && (this.facadeNameFlag = true) // 次判断内容需要与后端保持同步，一端修改及时通知另一端
              this.$Notice.error({
                title: error.code,
                desc: error.message
              })
              this.submitLoading = false
            }
          }
        },
        start: () => {
          return obj.state[obj.status](params)
        }
      }
      obj.status = state
      return obj
    },

    /**
     * 提交表单数据
     * @param {String} name: 注册的引用信息-ref
     */
    submit(name) {
      this.$refs[name].validate((valid) => {
        if(valid) {
          let params = JSON.parse(JSON.stringify(this.formData))
          params.version = 'v2'
          params.inBrands = params.inBrands && params.inBrands.join(',')
          delete params.area
          delete params.merchantType
          if(!this.id) {
            this.submitForm('add', params).start()
          } else {
            params.id = this.id
            this.submitForm('edit', params).start()
          }
        }
      })
    },

    /**
     * 远程查询公司名称
     * @param {String} name: 输入的文本
     */
    async queryCompany(name) {
      if (!name.trim()) return
      let res
      this.remoteLoading = true
      try {
        res = await this.$api.cooperativeCustomerSearchPartner({name})
        if(res.code === 0) {
          this.remoteLoading = false
          res.data.length != 0 ? this.companyList = res.data : ''
        }
      } catch (error) {
        this.remoteLoading = false
      }
    },

    /**
     * 远程查询员工信息
     * @param {String} name: 输入的文本
     */
    async queryWorker(name) {
      let res, username = name.split('/')[1] || name
      this.remoteLoading = true
      try {
        res = await this.$api.user({username})
        const workerList = this.workerList,
          selectedIds = [ ...new Set(workerList.map((item) => item.selected ? item.id : null)) ] // 已选中的选项的id
        this.workerList = [ ...this.workerList.filter(item => selectedIds.includes(item.id)), ...res.items.filter(item => !selectedIds.includes(item.id)) ]
        this.remoteLoading = false
      } catch(error) {
        this.remoteLoading = false
      }
    },

    /**
     * 远程查询系统/门店名称
     */
    async querySystemInfo(name) {
      let res, params = {name, contractorId: this.formData.contractorId, version: 'v2'}
      this.remoteLoading = true
      try {
        res = await this.$api.getSystemInfo(params)
        if (res.code === 0) {
          this.systemInfoList = res.data
        }
        this.remoteLoading = false
      } catch(error) {
        this.remoteLoading = false
      }
    },

    /**
     * 远程搜索下拉框选中某一项
     * @param {String|Array} value: 返回的选中项
     * @param {String} type: 哪一个下拉框选中 company-公司 worker-负责人
     */
    selectOption(value, type) {
      switch (type) {
        case 'company':
          let tempObj = this.companyList.find(item => item.id === value)
          this.formData.merchantType = tempObj.merchantType || ''
          break;
        case 'worker':
          this.workerList.forEach((item) => item.selected = value.includes(item.id))
          break;
        default:
          break;
      }
    },

    /**
     * 获取详情
     * @param {String | Number} id: 需要查询的id
     */
    async getDetail(id) {
      let res
      this.spinShow = true
      try {
        res = await this.$api.contractorFacadeDetail({id, version: 'v2'})
        if(res.code === 0) {
          let data = res.data
          data.systemInfo = data.systemInfo || {}
          data.inBrands = data.inBrands && data.inBrands.split(',') || ''
          data.systemInfoId = +data.systemInfoId && data.systemInfoId || ''
          data.contractorId = +data.contractorId && data.contractorId || ''
          if(+data.provinceId && +data.cityId && +data.countyId) data.area = [data.provinceId, data.cityId, data.countyId]
          data.followIds = data.followInfo.ids
          this.workerList = data.followInfo.userInfo
          this.formData = data
          data.merchantName && this.queryCompany(data.merchantName)
          data.systemInfo.name && this.querySystemInfo(data.systemInfo.name)
        }
        this.spinShow = false
      } catch (error) {
        this.spinShow = false
      }
    },

    /**
     * 级联选择器选中项
     * @param {String} value: 根据设置返回label或者value
     * @param {Array} selectedData: 选中的整个数据信息
     */ 
    selectArea(value, selectedData ) {
      this.formData.provinceId = selectedData[0] && selectedData[0].value || undefined
      this.formData.province = selectedData[0] && selectedData[0].label || undefined
      this.formData.cityId = selectedData[1] && selectedData[1].value || undefined
      this.formData.city = selectedData[1] && selectedData[1].label || undefined
      this.formData.countyId = selectedData[2] && selectedData[2].value || undefined
      this.formData.county = selectedData[2] && selectedData[2].label || undefined
    },

    goBack() {
      this.$router.push('/contract/facade/list')
    },
  },
  mounted() {
    this.id && this.getDetail(this.id)
    setTimeout(() => this.area = area, 0)
  }
}

</script>
<style lang='less' scoped>
.ivu-card {
  margin-bottom: 10px;
  p {
    font-weight: bolder;
  }
}
.title-btn {
  margin-left: 10px;
}
</style>