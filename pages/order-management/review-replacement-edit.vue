<template>
  <div>
    <Card>
      <Row>
        <Card>
          <div slot="title"><p>{{ !formData.id ? '订单基础信息' : `补发订单编号：${formData.order_sn}`}}</p></div>
          <div>
            <Row class="margin-bottom-10">
              <Col :md="5">{{ !formData.id ? '' : '原'}}订单编号：<a @click="goOrderDetail">{{ orderMsg.order_sn }}</a></Col>
              <Col :md="5">商家名称：{{ orderMsg.merchant_name }}</Col>
              <Col :md="5">系统/门店：{{ orderMsg.system_name }}</Col>
              <Col :md="5">下单时间：{{ formatDate(orderMsg.order_time) }}</Col>
              <Col :md="4">业务员：{{ orderMsg.salesman }}</Col>
            </Row>
            <Row class="margin-bottom-10">
              <Col :md="5">付款方式：{{ paymentMethodList[orderMsg.payment_method] }}</Col>
              <Col :md="5">订单总应收：{{ orderMsg.total_order_amount }}</Col>
              <Col :md="5">供货政策：<a @click="openPolicyDetail()">{{ orderMsg.contract_policy_name }}</a></Col>
              <Col :md="5">审核通过时间：{{ orderMsg.createdAt }}</Col>
            </Row>
          </div>
        </Card>
        <Card>
          <div slot="title"><p>{{ !formData.id ? '添加' : '编辑'}}补发清单</p></div>
          <div>
            <Form ref="formData" :model="formData" :rules="formRule" label-position="right" :label-width="100">
              <Row>
                <Col :md="8">
                  <FormItem label="补发原因：" prop="reason">
                    <Select v-model="formData.reason" placeholder="请选择补发理由">
                      <Option v-for="(item, index) in reasonList" :key="'reason' + index" :value="item.value"
                              :label="item.label"></Option>
                    </Select>
                  </FormItem>
                </Col>
                <Col :md="8">
                  <FormItem label="发货方式：" prop="delivery_mode">
                    <Select v-model="formData.delivery_mode" placeholder="请选择发货方式">
                      <Option v-for="(item, index) in wayList" :key="'way' + index" :value="item.value"
                              :label="item.label"></Option>
                    </Select>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col :md="16">
                  <FormItem label="收货地址：" prop="contractor_addr_id">
                    <Select v-model="formData.contractor_addr_id" filterable placeholder="请选择收货地址" @on-change="handleAddressOnChange">
                      <Option v-for="(item, index) in addressList" :key="'address' + index" :value="item.value"
                              :label="item.label"></Option>
                    </Select>
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col :md="8">
                  <FormItem label="联系人：">{{ formData.contactNameText }}</FormItem>
                </Col>
                <Col :md="8">
                  <FormItem label="联系方式：">{{ formData.contactPhoneText }}</FormItem>
                </Col>
              </Row>
              <Row>
                <Col :md="24">
                  <FormItem label="补发凭证：">
                    <Upload name="UploadForm[file]"
                            :action="fileUploadURL"
                            :headers="fileUploadHeaders"
                            :default-file-list="defaultList"
                            :on-success="fileSuccess"
                            :on-remove="fileRemove">
                      <Button icon="md-add" type="dashed"></Button>
                    </Upload>

                  </FormItem>
                </Col>
              </Row>
              <Row class="order-title"><p>原订单未发清单</p></Row>
              <!-- 原订单-产品名称 -->
              <Row  style="font-size: 12px">
                <Col>
                  <Row type="flex" justify="space-around">
                    <Col :md="1"></Col>
                    <Col :md="4">产品名称</Col>
                    <Col :md="2">规格</Col>
                    <Col :md="2">单位</Col>
                    <Col :md="2">零售价</Col>
                    <Col :md="2">折扣</Col>
                    <Col :md="2">未发数量</Col>
                    <Col :md="2">货值</Col>
                    <Col :md="2">未发应收金额</Col>
                    <Col :md="2">箱规</Col>
                    <Col :md="1"></Col>
                  </Row>
                  <Row class="margin-top-10 margin-bottom-10 " type="flex" justify="space-around"
                       v-for="(items, index) in originalProductList" :key="'original' + index">
                    <Col :md="1">
                      <Button icon="md-add" v-if="index === 0" @click="addOriginalProduct(index)"></Button>
                      <Button icon="md-remove" v-else @click="removeOriginalProduct(index)"></Button>
                    </Col>
                    <Col :md="4">
                      <Select v-model="items.data.pro_id" @on-change="selectOriginalProduct(...arguments, index)">
                        <Option v-for="(item, i) in items.orderProduct" :key="'product' + i" :value="item.pro_id"
                                :label="item.pro_name"></Option>
                      </Select>
                    </Col>
                    <Col :md="2">
                      <Input v-model="items.data.standard" disabled/>
                    </Col>
                    <Col :md="2">
                      <Input v-model="items.data.unit" disabled/>
                    </Col>
                    <Col :md="2">
                      <Input v-model="items.data.price" disabled/>
                    </Col>
                    <Col :md="2">
                      <Input v-model="items.data.discount" disabled/>
                    </Col>
                    <Col :md="2">
                      <InputNumber :min="0" v-model="items.number"
                                   @on-change="changeNumber(...arguments, index, 'original')"></InputNumber>
                    </Col>
                    <Col :md="2">
                      <Input :value="$toFixed(items.not_total_value, 4)" disabled/>
                    </Col>
                    <Col :md="2">
                      <Input :value="$toFixed(items.not_total_price, 4)" disabled/>
                    </Col>
                    <Col :md="2">
                      <Input v-model="items.data.box_standard" disabled/>
                    </Col>
                    <Col :md="1">
                      <Button type="primary" @click="resetOriginalProduct(index)">重置</Button>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <!-- 原订单-附加产品 additionalProduct-->
              <Row v-for="(data, key) in additionalProduct" :key="key"  style="font-size: 12px">
                <Col v-if="data.length && hasAdditProduct[key]">
                  <Row type="flex" justify="space-around">
                    <Col :md="1"></Col>
                    <Col :md="4">{{key}}</Col>
                    <Col :md="2">规格</Col>
                    <Col :md="2">单位</Col>
                    <Col :md="2">零售价</Col>
                    <Col :md="2">折扣</Col>
                    <Col :md="2">未发数量</Col>
                    <Col :md="2">货值</Col>
                    <Col :md="2" v-if="key === '换购产品'">未发应收金额</Col>
                    <Col :md="2">箱规</Col>
                    <Col :md="key === '换购产品'? 1: 3"></Col>
                  </Row>
                  <Row class="margin-top-10 margin-bottom-10" type="flex" justify="space-around"
                       v-for="(items, index) in data" :key="'original-additionalProduct' + index">
                    <Col :md="1">
                      <Button icon="md-add" v-if="index === 0" @click="handleAdditProduct(key, index, 'add')"></Button>
                      <Button icon="md-remove" v-else @click="handleAdditProduct(key, index, 'remove')"></Button>
                    </Col>
                    <Col :md="4">
                      <Select v-model="items.data.pro_id" @on-change="selectAdditProduct(...arguments, index, key)">
                        <Option v-for="(item, i) in items.orderProduct" :key="'product' + i" :value="item.pro_id"
                                :label="item.pro_name"></Option>
                      </Select>
                    </Col>
                    <Col :md="2">
                      <Input v-model="items.data.standard" disabled/>
                    </Col>
                    <Col :md="2">
                      <Input v-model="items.data.unit" disabled/>
                    </Col>
                    <Col :md="2">
                      <Input v-model="items.data.price" disabled/>
                    </Col>
                    <Col :md="2">
                      <Input v-model="items.data.discount" disabled/>
                    </Col>
                    <Col :md="2">
                      <InputNumber :min="0" v-model="items.not_number"
                                   @on-change="changeAdditNumber(...arguments, key, index, 'original')"></InputNumber>
                    </Col>
                    <Col :md="2">
                      <Input :value="$toFixed(items.not_total_value, 4)" disabled/>
                    </Col>
                    <Col :md="2" v-if="key == '换购产品'">
                      <Input :value="$toFixed(items.not_total_price, 4)" disabled/>
                    </Col>
                    <Col :md="2">
                      <Input v-model="items.data.box_standard" disabled/>
                    </Col>
                    <Col :md="key === '换购产品'? 1: 3">
                      <Button type="primary" @click="handleAdditProduct(key, index, 'reset')">重置</Button>
                    </Col>
                  </Row>
                </Col>
              </Row>

              <Row class="order-title"><p>补发订单清单</p></Row>
              <!-- 补发-产品名称 -->
              <Row  style="font-size: 12px">
                <Col>
                  <Row type="flex" justify="space-around">
                    <Col :md="1"></Col>
                    <Col :md="4" class="necessary">产品名称</Col>
                    <Col :md="2">规格</Col>
                    <Col :md="2">单位</Col>
                    <Col :md="2">零售价</Col>
                    <Col :md="2">折扣</Col>
                    <Col :md="2" class="necessary">补发数量</Col>
                    <Col :md="2">货值</Col>
                    <Col :md="2">补发应收金额</Col>
                    <Col :md="2">箱规</Col>
                    <Col :md="1"></Col>
                  </Row>
                  <Row class="margin-top-10 margin-bottom-10" type="flex" justify="space-around"
                       v-for="(items, index) in reissueProductList" :key="'reissue' + index">
                    <Col :md="1">
                      <Button icon="md-add" v-if="index === 0" @click="handleProduct(index, 'add')"></Button>
                      <Button icon="md-remove" v-else @click="handleProduct(index, 'remove')"></Button>
                    </Col>
                    <Col :md="4">
                      <Select v-model="items.data.pro_id" filterable @on-query-change="queryProductDebonce(...arguments, index)" @on-change="selectProduct(...arguments, index)">
<!--                      <Select v-model="items.data.pro_id" filterable-->
<!--                              @on-query-change="queryProduct(...arguments, index)"-->
<!--                              @on-change="selectProduct(...arguments, index)">-->
                        <Option v-for="(item, i) in items.orderProduct" :key="'product' + i" :value="item.pro_id"
                                :label="item.pro_name"></Option>
                      </Select>
                    </Col>
                    <Col :md="2">
                      <Input v-model="items.data.standard" disabled/>
                    </Col>
                    <Col :md="2">
                      <Input v-model="items.data.unit" disabled/>
                    </Col>
                    <Col :md="2">
                      <Input v-model="items.data.price" disabled/>
                    </Col>
                    <Col :md="2">
                      <Input v-model="items.discount" disabled/>
                    </Col>
                    <Col :md="2">
                      <InputNumber :min="0" v-model="items.number"
                                   @on-change="changeNumber(...arguments, index, 'reissue')"></InputNumber>
                    </Col>
                    <Col :md="2">
                      <Input :value="$toFixed(items.total_value, 4)" disabled/>
                    </Col>
                    <Col :md="2">
                      <Input :value="$toFixed(items.total_price, 4)" disabled/>
                    </Col>
                    <Col :md="2">
                      <Input v-model="items.data.box_standard" disabled/>
                    </Col>
                    <Col :md="1">
                      <Button type="primary" @click="handleProduct(index, 'reset')">重置</Button>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <!-- 补发-附加产品 additionalProduct-->
              <Row v-for="(data, key) in additionalProduct" :key="`reissue-${key}`"  style="font-size: 12px">
                <Col v-if="hasRessAdditProduct[key]">
                  <Row type="flex" justify="space-around">
                    <Col :md="1"></Col>
                    <Col :md="4">{{key}}</Col>
                    <Col :md="2">规格</Col>
                    <Col :md="2">单位</Col>
                    <Col :md="2">零售价</Col>
                    <Col :md="2">折扣</Col>
                    <Col :md="2" class="necessary">补发数量</Col>
                    <Col :md="2">货值</Col>
                    <Col :md="2" v-if="key === '换购产品'">补发应收金额</Col>
                    <Col :md="2">箱规</Col>
                    <Col :md="key === '换购产品'? 1: 3"></Col>
                  </Row>
                  <Row else-v-if="items.data.pro_id" class="margin-top-10 margin-bottom-10" type="flex"
                       justify="space-around" v-for="(items, index) in data" :key="'reissue-additionalProduct' + index">
                    <Col :md="1"></Col>
                    <Col :md="4">
                      <Select disabled v-model="items.data.pro_id">
                        <Option v-for="(item, i) in items.orderProduct" :key="'product' + i" :value="item.pro_id"
                                :label="item.pro_name"></Option>
                      </Select>
                    </Col>
                    <Col :md="2">
                      <Input v-model="items.data.standard" disabled/>
                    </Col>
                    <Col :md="2">
                      <Input v-model="items.data.unit" disabled/>
                    </Col>
                    <Col :md="2">
                      <Input v-model="items.data.price" disabled/>
                    </Col>
                    <Col :md="2">
                      <Input v-model="items.data.discount" disabled/>
                    </Col>
                    <Col :md="2">
                      <InputNumber :min="0" v-model="items.number"
                                   @on-change="changeAdditNumber(...arguments, key, index, 'reissue')"></InputNumber>
                    </Col>
                    <Col :md="2">
                      <Input :value="$toFixed(items.total_value, 4)" disabled/>
                    </Col>
                    <Col :md="2" v-if="key == '换购产品'">
                      <Input :value="$toFixed(items.total_price, 4)" disabled/>
                    </Col>
                    <Col :md="2">
                      <Input v-model="items.data.box_standard" disabled/>
                    </Col>
                    <Col :md="key === '换购产品'? 1: 3">
                      <Button type="primary" @click="handleAdditProduct(key, index, 'reissue-reset')">重置</Button>
                    </Col>
                  </Row>
                </Col>
              </Row>

            </Form>
          </div>
        </Card>
        <Card>
          <div slot="title"><p>补发订单应收合计</p></div>
          <div>
            <Row type="flex" class="margin-top-10" justify="space-around">
              <Col :md="6">未发应收金额</Col>
              <Col :md="6">补发应收金额</Col>
              <Col :md="6">实际订单应收金额</Col>
              <Col :md="6">补发订单货值</Col>
            </Row>
            <Row class="margin-top-10" type="flex" justify="space-around">
              <Col :md="6">
                <Input :value="noAmountReceivable" disabled/>
              </Col>
              <Col :md="6">
                <Input :value="reissueAmountReceivable" disabled/>
              </Col>
              <Col :md="6">
                <Input v-model="amountReceivable" disabled/>
              </Col>
              <Col :md="6">
                <Input v-model="reissueValue" disabled/>
              </Col>
            </Row>
            <Row class="remark-title">
              <Col :md="24">补发订单备注</Col>
            </Row>
            <Row>
              <Col :md='24'>
                <Input v-model="formData.remark" type="textarea" :rows="5" placeholder="备注"/>
              </Col>
            </Row>
          </div>
        </Card>
      </Row>
      <Row type="flex" justify="end" class="margin-top-10 margin-right-10">
        <Col>
          <Button @click="$router.go(-1)">返回</Button>
        </Col>
        <!-- <Col >
          <Button type="warning" :loading="submitLoading" @click="save('formData')">存草稿</Button>
        </Col> -->
        <Col>
          <Button type="primary" :loading="submitLoading" @click="submit('formData')">提交</Button>
        </Col>
      </Row>
      <Spin size="large" fix v-if="spinShow"></Spin>
    </Card>

    <!-- 政策详情 start -->
    <PolicyDetailModal ref="policyDetailModal"></PolicyDetailModal>
    <!-- 政策详情 end -->
  </div>
</template>
<script>
  import Cookies from 'js-cookie'
  import { SERVER_BASE_URL } from '~/api/config';
  import PolicyDetailModal from '@/components/policy/policy-detail-modal.vue';

  export default {
    components: {
      PolicyDetailModal
    },
    data() {
      return {
        spinShow: false,
        fileUploadURL: `${SERVER_BASE_URL}/v1/upload`, // 文件上传
        fileUploadHeaders: {
          Authorization: Cookies.get('authorization')
        },
        submitLoading: false,
        orderMsg: {
          createdAt: '',
          paymentMethod: ''
        },
        // 付款方式
        paymentMethodList: {
          monthly: '月结',
          spot_cash: '现款现货',
          spotCash: '现款现货',
          real_sale: '实销实结',
          realSale: '实销实结',
        },
        reasonList: [
          {value: '漏发产品', label: '漏发产品'},
          {value: '退回重发', label: '退回重发'},
          {value: '产品破损', label: '产品破损'},
          {value: '产品质量', label: '产品质量'},
          {value: '快递丢件', label: '快递丢件'},
          {value: '地址不详被退回', label: '地址不详被退回'},
          {value: '快件被查扣退回', label: '快件被查扣退回'},
          {value: '客服未添加赠品', label: '客服未添加赠品'},
          {value: '产品缺货', label: '产品缺货'},
          {value: '发错产品', label: '发错产品'},
          {value: '特殊物流发货', label: '特殊物流发货'}
        ],
        wayList: [
          {value: 'express', label: '快递'},
          {value: 'logistics', label: '物流'}
        ],
        addressList: [],
        originalProductList: [
          {
            data: {
              pro_id: '',
              standard: '',
              unit: '',
              price: 0,
              discount: 0,
              box_standard: ''
            },
            number: 1,
            not_total_price: 0,
            not_total_value: 0,
            orderProduct: []
          }
        ], // 原订单未发清单
        hasAdditProduct: {
          '换购产品': false,
          '配赠产品': false,
          '返点产品': false,
          '赠品': false,
        },
        hasRessAdditProduct: {
          '换购产品': false,
          '配赠产品': false,
          '返点产品': false,
          '赠品': false,
        },
        additionalProduct: {
          '换购产品': [{
            data: {
              pro_id: '',
              standard: '',
              unit: '',
              price: 0,
              discount: 0,
              box_standard: ''
            },
            number: 1,
            not_number: 1,
            not_total_price: 0,
            not_total_value: 0,
            total_value: 0,
            total_price: 0,
            orderProduct: []
          }],
          '配赠产品': [{
            data: {
              pro_id: '',
              standard: '',
              unit: '',
              price: 0,
              discount: 0,
              box_standard: ''
            },
            number: 1,
            not_number: 1,
            not_total_price: 0,
            not_total_value: 0,
            total_value: 0,
            total_price: 0,
            orderProduct: []
          }],
          '返点产品': [{
            data: {
              pro_id: '',
              standard: '',
              unit: '',
              price: 0,
              discount: 0,
              box_standard: ''
            },
            number: 1,
            not_number: 1,
            not_total_price: 0,
            not_total_value: 0,
            total_value: 0,
            total_price: 0,
            orderProduct: []
          }],
          '赠品': [{
            data: {
              pro_id: '',
              standard: '',
              unit: '',
              price: 0,
              discount: 0,
              box_standard: ''
            },
            number: 1,
            not_number: 1,
            not_total_price: 0,
            not_total_value: 0,
            total_value: 0,
            total_price: 0,
            orderProduct: []
          }]
        }, // 额外产品
        reissueProductList: [
          {
            data: {
              pro_id: '',
              standard: '',
              unit: '',
              price: 0,
              box_standard: ''
            },
            discount: 0,
            number: 1,
            total_price: 0,
            total_value: 0,
            orderProduct: []
          }
        ], // 补发订单
        formData: {
          unissuedList: {},
          reissueList: {},
          fileItems: [],
          remark: ''
        },
        formRule: {
          reason: [{required: true, message: '请选择补发理由', trigger: 'change'}],
          delivery_mode: [{required: true, message: '请选择发货方式', trigger: 'change'}],
          contractor_addr_id: [{required: true, message: '请选择收货地址', trigger: 'change'}]
        },
        
        discountDate: [],
        defaultList: [],
        origin_id: '',
        queryProductDebonce: this.$debonce(this.queryProduct,500)
      }
    },
    methods: {
      handleAdditProduct(key, index, type) { // 附加产品的 add remove reset 操作
        let additionProduct = this.additionalProduct[key]
        let additProduct = {
          data: {
            pro_id: '',
            standard: '',
            unit: '',
            price: 0,
            discount: 0,
            box_standard: ''
          },
          number: 1,
          not_number: 1,
          not_total_price: 0,
          not_total_value: 0,
          total_value: 0,
          total_price: 0,
          orderProduct: []
        }
        if (type === 'add') {
          let orderLen = this[key].length
          let additLen = additionProduct.length
          if (orderLen <= additLen) return
          let arr = JSON.parse(JSON.stringify(this[key]))
          // 遍历 所有行的已选中的下拉选项
          additionProduct.map(item => {
            // 选中
            if (!!item.data.pro_id) {
              let arrIndex = arr.findIndex(pro => item.data.pro_id == pro.pro_id)
              if (arrIndex != -1) {
                // 去除已选中的
                arr.splice(arrIndex, 1)
              }
            }
          })
          additProduct.orderProduct = arr
          additionProduct.push(additProduct)
        } else if (type === 'remove') {
          // 判断当前行是否已选，如果有将选项放回兄弟行
          // debugger
          if (!!additionProduct[index].data.pro_id) {
            let removeData = additionProduct.splice(index, 1)[0]
            removeData.orderProduct.map((items) => {
              if (items.pro_id == removeData.data.pro_id) {
                additionProduct.map((item, i) => {
                  let isHas = item.orderProduct.find((has) => { // 该产品是否已存在
                    return has.pro_id == items.pro_id
                  })
                  if (!isHas) {
                    item.orderProduct.push(items)
                  }
                })
              }
            })
          } else {
            // 没有选中 直接删除
            additionProduct.splice(index, 1)
          }
        } else if (type === 'reset') {
          // 保留当前行
          let resetProduct = additionProduct[index]
          additProduct.orderProduct = resetProduct.orderProduct
          // console.log(this[key], 'this[key]reset');
          // 清空当前行
          additionProduct.splice(index, 1, additProduct)
          // 当前行是否选中
          if (!!resetProduct.data.pro_id) {
            // 把当前行的 下拉选项 添加到其他行
            resetProduct.orderProduct.map(item => {
              additionProduct.map(pro => {
                // 判断其他行的下拉选项是否已有 避免重复
                let proIndex = pro.orderProduct.findIndex(orderP => item.pro_id == orderP.pro_id)
                if (proIndex === -1) {
                  pro.orderProduct.push(item)
                }
              })
            })
          }
          let isHas = additionProduct.some(item => {
            return item.data.pro_id
          })
          if (isHas) {
            this.hasRessAdditProduct[key] = true
          } else {
            this.hasRessAdditProduct[key] = false
          }
        } else if (type === 'reissue-reset') {
          // 补发的附加产品只重置补发数量
          additionProduct[index].number = 1
        }
      },
      selectAdditProduct(val, index, key) { // 选择 附加产品
        if (!val) return
        let additionProduct = this.additionalProduct[key]
        let isHas = additionProduct.some(item => {
          return item.data.pro_id
        })
        if (isHas) { // 是否显示补发中的附加产品
          this.hasRessAdditProduct[key] = true
        }
        let orderProduct = additionProduct[index].orderProduct
        orderProduct.map(product => {
          if (product.pro_id == val) { // 当前行选中项
            additionProduct[index].data = JSON.parse(JSON.stringify(product))
            additionProduct[index].number = 1
          }
        })
        this.calculPrice(additionProduct[index], 1, 'original')
        // 从当前 orderProduct 过滤选中
        let filterProduct = orderProduct.filter(item => {
          return item.pro_id != val
        })
        // 如果有 把剩余的 filterProduct 添加到其他行的 orderProduct
        if (filterProduct.length > 0) {
          filterProduct.map(filterP => {
            additionProduct.map((additP, index) => {
              let sameProduct = additP.orderProduct.find(orderP => filterP.pro_id == orderP.pro_id)
              if (!sameProduct) {
                additionProduct[index].orderProduct.push(filterP)
              }
            })
          })
        }

        // 将当行选择的产品从其兄弟行选项中移除
        if (additionProduct.length > 1) {
          additionProduct.map((items, i) => {
            if (index != i) { // 获取兄弟行
              additionProduct[i].orderProduct.map((item, indx) => {
                if (item.pro_id == val) {
                  additionProduct[i].orderProduct.splice(indx, 1)
                }
              })
            }
          })
        }
      },
      formatPayment(key) {
        switch (key) {
          case 'monthly':
            return '月结'
          case 'spot_cash':
            return '现货现款'
          case 'real_sale':
            return '实销实结'
          default:
            break;
        }
      },
      formatDate(time) {  // 时间格式化
        return this.$format(time, 'yyyy-MM-dd hh:mm:ss')
      },
      /* 原订单未发清单 start */
      selectOriginalProduct(val, index) {  // 选中当前项
        // console.log(val, index)
        this.originalProductList[index].orderProduct.map((item, i) => {
          if (item.pro_id == val) {
            this.originalProductList[index].data = JSON.parse(JSON.stringify(item))
            this.originalProductList[index].number = 1
            this.originalProductList[index].not_total_price = 0
            this.originalProductList[index].not_total_value = 0
          }
        })
        // 将当行选择的产品从其兄弟行选项中移除
        if (this.originalProductList.length > 1) {
          this.originalProductList.map((items, i) => {
            if (index != i) { // 获取兄弟行
              this.originalProductList[i].orderProduct.map((item, key) => {
                if (item.pro_id == val) {
                  this.originalProductList[i].orderProduct.splice(key, 1)
                }
              })
            }
          })
        }
      },
      addOriginalProduct(index) { // 添加行
        if (this.orderMsg.orderProduct.length > this.originalProductList.length) { // 未发产品不能超过原订单的产品
          let arr = JSON.parse(JSON.stringify(this.orderMsg.orderProduct))
          let obj = {
            data: {
              pro_id: '',
              standard: '',
              unit: '',
              price: 0,
              discount: 0,
              box_standard: ''
            },
            number: 1,
            not_total_price: 0,
            not_total_value: 0,
            orderProduct: arr
          }
          this.originalProductList.push(obj)
          // 过滤已经被选择的产品
          this.originalProductList.map((item) => {
            if (item.data.pro_id != '') {
              let arrIndex = arr.findIndex((elememt) => {
                return elememt.pro_id == item.data.pro_id
              })
              if (arrIndex != -1) {
                arr.splice(arrIndex, 1)
              }
            }
          })
        }
      },
      removeOriginalProduct(index) { // 移除行
        // 判断当前行是否已选，如果有将选项放回兄弟行
        if (!!this.originalProductList[index].data.pro_id) {
          let removeData = this.originalProductList.splice(index, 1)[0]
          removeData.orderProduct.map((items) => {
            if (items.pro_id == removeData.data.pro_id) {
              this.originalProductList.map((item, i) => {
                let isHas = item.orderProduct.find((has) => { // 该产品是否已存在
                  return has.pro_id == items.pro_id
                })
                if (!isHas) {
                  item.orderProduct.push(items)
                }
              })
            }
          })
        } else {
          this.originalProductList.splice(index, 1)
        }
      },
      resetOriginalProduct(index) { // 重置
        let obj = {
          data: {
            pro_id: '',
            standard: '',
            unit: '',
            price: 0,
            box_standard: '',
            discount: 0,
          },
          number: 1,
          not_total_price: 0,
          not_total_value: 0,
          orderProduct: []
        }
        let arr = this.originalProductList.splice(index, 1, obj) // 清空当前行
        obj.orderProduct = arr[0].orderProduct // 当前行的可选项
        arr[0].orderProduct.map((items) => {
          if (arr[0].data.pro_id == items.pro_id) { // 取出当前行的已选的产品，放入兄弟行的可选项中
            this.originalProductList.map((item) => {
              let isHas = item.orderProduct.find((has) => { // 过滤掉当前行，防止数据重复放入
                return has.pro_id == arr[0].data.pro_id
              })
              if (!isHas) {
                item.orderProduct.push(items)
              }
            })
          }
        })
      },
      /* 原订单未发清单 end */
      changeNumber(num, index, type) {
        if (type === 'original') {
          this.$set(this.originalProductList[index], 'number', num)
          let total = num * this.originalProductList[index].data.price
          let discount = this.originalProductList[index].data.discount
          let price = (discount == 0 ? total : discount * total)
          this.$set(this.originalProductList[index], 'not_total_value', total)
          this.$set(this.originalProductList[index], 'not_total_price', price)
        } else {
          let oriOrderProduct = this.orderMsg.orderProduct
          let oriProduct = oriOrderProduct.find(ori => ori.pro_id == this.reissueProductList[index].data.pro_id)
          if (!oriProduct) { // 补发产品与原订单不一致 调折扣接口
            this.queryProductDiscount(index)
          }
        }
      },
      changeAdditNumber(num, key, index, type) { // 附加产品的数量改变
        this.calculPrice(this.additionalProduct[key][index], num, type)
      },
      calculPrice(data, num, type) { // 附加产品的货值，金额计算
        let total = num * data.data.price
        let discount = data.data.discount
        let price = (discount == 0 ? total : discount * total)
        this.$set(data, 'number', num)
        this.$set(data, 'total_value', total)
        this.$set(data, 'total_price', price)
        if (type === 'original') {
          this.$set(data, 'not_number', num)
          this.$set(data, 'not_total_value', total)
          this.$set(data, 'not_total_price', price)
        }
      },
      queryProductDiscount(index) {
        if (!!this.reissueProductList[index].data.pro_id) {
          const productList = this.reissueProductList.map(item => {
            return { id: item.data.pro_id, number: item.number }
          })
          const params = {
            productList,
            contractPolicyId: this.orderMsg.contract_policy_id
          }
          this.$api.orderReviewQueryProductDiscount(params).then((res) => {
            if (res.code === 0) {
              let resData = res.data.productList; // 产品信息(折扣、数量、价格、id)
              for (let i in this.reissueProductList) {
                let orderProduct = this.reissueProductList[i];
                resData.forEach(item => {
                  if (item.id === orderProduct.data.pro_id) {
                    orderProduct.discount = item.discount;
                    orderProduct.total_value = item.productAmount;
                    orderProduct.total_price = item.totalPrice;
                  }
                })
                this.$set(this.reissueProductList, i, orderProduct);
              }
            }
          })
        }
      },
      queryProduct(query, index) {
        this.$api.orderReviewQueryProduct({name: query}).then((res) => {
          if (res.code === 0) {
            this.reissueProductList[index].orderProduct = res.data
          }
        })
      },
      selectProduct(val, index) { // 选择补发产品
        // console.log(val, index)
        let oriOrderProduct = this.orderMsg.orderProduct
        this.reissueProductList[index].orderProduct.map((item, i) => {
          if (item.pro_id == val) {
            this.reissueProductList[index].data = JSON.parse(JSON.stringify(item))
            this.reissueProductList[index].number = 1
            this.reissueProductList[index].not_total_price = 0
            this.reissueProductList[index].not_total_value = 0

            let oriProduct = oriOrderProduct.find(ori => ori.pro_id == item.pro_id)
            if (oriProduct) { // 如果和原订单产品一致 继承折扣
              // console.log(oriProduct.discount,'继承',this.reissueProductList[index].data.pro_id)
              this.reissueProductList[index].discount = oriProduct.discount;
            } else {
              this.changeNumber(0, index, 'reissue')
            }
          }
        })
      },
      handleProduct(index, type) { // 补发清单的产品，行添加、重置、删除
        let obj = {
          data: {
            pro_id: '',
            standard: '',
            unit: '',
            price: 0,
            box_standard: ''
          },
          discount: 0,
          number: 1,
          total_price: 0,
          total_value: 0,
          orderProduct: []
        }
        if (type === 'reset') {
          this.reissueProductList.splice(index, 1, obj)
        } else if (type === 'add') {
          this.reissueProductList.push(obj)
        } else if (type === 'remove') {
          this.reissueProductList.splice(index, 1)
        }
      },
      switchProName(proName) { // 获取附加产品名字对应字段
        let key
        switch (proName) {
          case '换购产品' :
            key = 'repurchase';
            break;
          case '配赠产品' :
            key = 'matching';
            break;
          case '返点产品' :
            key = 'backPoint';
            break;
          case '赠品' :
            key = 'gift';
            break;
        }
        return key
      },
      submit(name) { // 提交
        this.$refs[name].validate((valid) => {
          if (valid) {
            let params = JSON.parse(JSON.stringify(this.formData))
            params.unissuedList = {
              order: [],
              repurchase: [],
              matching: [],
              backPoint: [],
              gift: [],
            }
            params.reissueList = {
              order: [],
              repurchase: [],
              matching: [],
              backPoint: [],
              gift: [],
            }
            // 获取附加产品
            Object.keys(this.additionalProduct).forEach(productNmame => {
              this.additionalProduct[productNmame].map(product => {
                if (!!product.data.pro_id) {
                  let key = this.switchProName(productNmame)
                  let unIssueBbj = {
                    pro_id: product.data.pro_id,
                    number: product.not_number
                  }
                  let reissueBbj = {
                    pro_id: product.data.pro_id,
                    number: product.number
                  }
                  params.unissuedList[key].push(unIssueBbj)
                  params.reissueList[key].push(reissueBbj)
                }
              })
            })
            this.originalProductList.map((item) => { // 原订单
              if (!!item.data.pro_id) {
                let obj = {
                  pro_id: item.data.pro_id,
                  number: item.number
                }
                params.unissuedList.order.push(obj)
              }
            })
            this.reissueProductList.map((item) => { // 补发产品
              if (!!item.data.pro_id) {
                let obj = {
                  pro_id: item.data.pro_id,
                  number: item.number
                }
                params.reissueList.order.push(obj)
              }
            })
            // return console.log(params, 'params')
            this.submitLoading = true
            if (this.formData.id) { // 修改
              let param = {
                origin_id: this.origin_id,
                unissuedList: params.unissuedList,
                reissueList: params.reissueList,
                fileItems: params.fileItems,
                remark: params.remark,
                reason: params.reason,
                id: params.id,
                delivery_mode: params.delivery_mode,
                contractor_addr_id: params.contractor_addr_id
              }
              // console.log(param)
              this.$api.reissueEdit(param).then((res) => {
                if (res.code == 0) {
                  this.$Message.success('编辑成功');
                  this.$store.commit('removeTag', 'replacement-edit');
                  this.$router.push({
                    path: '/replacement-management/replacement-order-review/review'
                  })
                }
              }).finally(() => {
                this.submitLoading = false
              })
            } else {
              params.origin_id = this.origin_id
              this.$api.reissueAdd(params).then((res) => { // 添加
                if (res.code === 0) {
                  this.$Message.success('添加成功');
                  this.$store.commit('removeTag', 'replacement-edit');
                  this.$router.push({
                    path: '/replacement-management/replacement-order-review/review'
                  })
                }
              }).finally(() => {
                this.submitLoading = false
              })
            }
          } else {
            this.$Message.error('请填写信息!');
          }
        })

      },
      formatDate(time) { // 时间格式化
        return this.$format(time, 'yyyy-MM-dd hh:mm:ss');
      },
      fileSuccess(response, file, fileList) { // 文件上传
        if (response.code === 0) {
          this.formData.fileItems.push(response.data)
        }
      },
      fileRemove(file, fileList) { // 移除文件
        this.formData.fileItems.splice(this.formData.fileItems.indexOf(file), 1);
      },
      goOrderDetail() {
        this.$router.push({
          path: '/order-management/review-details',
          query: {
            id: this.orderMsg.id
          }
        })
      },
      openPolicyDetail() {
        const id = this.orderMsg.contract_policy_id;
        this.$refs.policyDetailModal.initModal({ id });
      },
      isHasAdditProduct(repurchaseProduct, matchingProduct, backPoint, giftProduct) {
        if (repurchaseProduct.length > 0) {
          this.hasAdditProduct['换购产品'] = true
        }
        if (matchingProduct.length > 0) {
          this.hasAdditProduct['配赠产品'] = true
        }
        if (backPoint.length > 0) {
          this.hasAdditProduct['返点产品'] = true
        }
        if (giftProduct.length > 0) {
          this.hasAdditProduct['赠品'] = true
        }
      },
      initAdditOrderPorduct(repurchaseProduct, matchingProduct, backPoint, giftProduct) {
        this.additionalProduct['换购产品'][0].orderProduct = JSON.parse(JSON.stringify(repurchaseProduct))
        this.additionalProduct['配赠产品'][0].orderProduct = JSON.parse(JSON.stringify(matchingProduct))
        this.additionalProduct['返点产品'][0].orderProduct = JSON.parse(JSON.stringify(backPoint))
        this.additionalProduct['赠品'][0].orderProduct = JSON.parse(JSON.stringify(giftProduct))
      },
      // 收货地址变化事件
      handleAddressOnChange(val) {
        const addressInfo = this.addressList.find(item => item.value === val);
        ['contactNameText', 'contactPhoneText'].forEach(key => this.formData[key] = addressInfo[key]);
      },
    },
    mounted() {
      this.origin_id = this.$route.query.origin_id
      this.formData.id = this.$route.query.id
      // console.log(this.formData.id)
      if (this.origin_id) { // 原订单的详情
        this.spinShow = true
        this.$api.orderReviewDetails(this.origin_id).then((res) => { // 获取详情
          if (res.code === 0) {
            // console.log(res, 'orderReviewDetails')
            let {repurchaseProduct, matchingProduct, backPoint, giftProduct, contractorReceivingAddrGroup = []} = res.data
            this.orderMsg = res.data
            this.orderMsg.orderProduct = res.data.orderProduct
            this.originalProductList[0].orderProduct = JSON.parse(JSON.stringify(this.orderMsg.orderProduct)) // 初始化 获取所有原订单产品
            // this.orderMsg.createdAt = this.formatDate(this.orderMsg.auditLogItems[this.orderMsg.auditLogItems.length - 1].created_at)
            this.orderMsg.paymentMethod = this.formatPayment(this.orderMsg.payment_method)
            let merchantId = res.data.merchant_id
            // 保留附加产品
            this['换购产品'] = repurchaseProduct
            this['配赠产品'] = matchingProduct
            this['返点产品'] = backPoint
            this['赠品'] = giftProduct
            this.isHasAdditProduct(repurchaseProduct, matchingProduct, backPoint, giftProduct)
            this.initAdditOrderPorduct(repurchaseProduct, matchingProduct, backPoint, giftProduct)
            // 获取收货地址
            this.addressList = contractorReceivingAddrGroup.map(item => {
              const obj = {
                value: item.id,
                label: item.province + item.city + item.county + item.receiving_address,
                contactNameText: item.contact,
                contactPhoneText: item.contact_information,
              }
              return obj;
            })
            if (this.formData.id) { //补发订单编辑的详情信息
              this.$api.reissueDetail(this.formData.id).then((res) => {
                this.formData = res.data
                this.formData.fileItems = this.formData.files
                this.formData.contractor_addr_id = this.formData.contractor_receiving_addr_group_id
                this.formData.files.map((item) => {  // 凭证文件
                  let obj = {
                    name: item.title + '.' + item.extension,
                    url: item.url
                  }
                  this.defaultList.push(obj)
                })

                let originalP = this.formData.unissuedProducts.find(item => item.type === 'order')
                this.originalProductList = originalP ? [] : [
                  {
                    data: {
                      pro_id: '',
                      standard: '',
                      unit: '',
                      price: 0,
                      discount: 0,
                      box_standard: ''
                    },
                    number: 1,
                    not_total_price: 0,
                    not_total_value: 0,
                    orderProduct: []
                  }
                ]

                let arr = JSON.parse(JSON.stringify(this.orderMsg.orderProduct))
                let repurchaseArr = JSON.parse(JSON.stringify(this['换购产品']))
                let backPointArr = JSON.parse(JSON.stringify(this['返点产品']))
                let giftArr = JSON.parse(JSON.stringify(this['赠品']))
                let matchingArr = JSON.parse(JSON.stringify(this['配赠产品']))

                let additArr = [
                  { name: '换购产品', orderPro: repurchaseArr, field: 'repurchase' },
                  { name: '返点产品', orderPro: backPointArr, field: 'backPoint' },
                  { name: '赠品', orderPro: giftArr, field: 'gift' },
                  { name: '配赠产品', orderPro: matchingArr, field: 'matching' },
                ]
                //aaa
                // console.log(giftArr, 'giftArr')
                // let adP = this.formData.unissuedProducts.find(item => item.type === 'order')
                additArr.forEach(pro => {
                  let adP = this.formData.unissuedProducts.find(item => item.type === pro.field)
                  this.additionalProduct[pro.name] = !pro.orderPro.length || adP ? [] : [
                    {
                      data: {
                        pro_id: '',
                        standard: '',
                        unit: '',
                        price: 0,
                        discount: 0,
                        box_standard: ''
                      },
                      number: 1,
                      not_number: 1,
                      not_total_price: 0,
                      not_total_value: 0,
                      total_value: 0,
                      total_price: 0,
                      orderProduct: []
                    }
                  ]
                })

                this.formData.unissuedProducts.map((item, index) => {  // 未发清单
                  if(item.type === 'order') {
                    let obj = {
                      data: item,
                      number: +item.number,
                      not_total_price: item.total_price,
                      not_total_value: +item.number * item.price,
                      orderProduct: [JSON.parse(JSON.stringify(item))]
                    }
                    this.originalProductList.push(obj)
                    let arrIndex = arr.findIndex((items) => {
                      return items.pro_id == item.pro_id
                    })
                    arr.splice(arrIndex, 1) // 过滤已选项
                  }else if(item.type === 'repurchase') {
                    let repurchase = {
                      data: item,
                      number: 1,
                      total_price: 0,
                      total_value: 0,
                      not_number: +item.number,
                      not_total_price: item.total_price,
                      not_total_value: +item.number * item.price,
                      orderProduct: [JSON.parse(JSON.stringify(item))]
                    }
                    this.additionalProduct['换购产品'].push(repurchase)
                    let arrIndex = repurchaseArr.findIndex((items) => {
                      return items.pro_id == item.pro_id
                    })
                    repurchaseArr.splice(arrIndex, 1) // 过滤已选项
                  }else if(item.type === 'gift') {
                    let gift = {
                      data: item,
                      number: 1,
                      total_price: 0,
                      total_value: 0,
                      not_number: +item.number,
                      not_total_price: item.total_price,
                      not_total_value: +item.number * item.price,
                      orderProduct: [JSON.parse(JSON.stringify(item))]
                    }
                    this.additionalProduct['赠品'].push(gift)
                    let arrIndex = giftArr.findIndex((items) => {
                      return items.pro_id == item.pro_id
                    })
                    giftArr.splice(arrIndex, 1) // 过滤已选项
                  }else if(item.type === 'backPoint') {
                    let backPoint = {
                      data: item,
                      number: 1,
                      total_price: 0,
                      total_value: 0,
                      not_number: +item.number,
                      not_total_price: item.total_price,
                      not_total_value: +item.number * item.price,
                      orderProduct: [JSON.parse(JSON.stringify(item))]
                    }
                    this.additionalProduct['返点产品'].push(backPoint)
                    let arrIndex = backPointArr.findIndex((items) => {
                      return items.pro_id == item.pro_id
                    })
                    backPointArr.splice(arrIndex, 1) // 过滤已选项
                  }else if(item.type === 'matching') {
                    let matching = {
                      data: item,
                      number: 1,
                      total_price: 0,
                      total_value: 0,
                      not_number: +item.number,
                      not_total_price: item.total_price,
                      not_total_value: +item.number * item.price,
                      orderProduct: [JSON.parse(JSON.stringify(item))]
                    }
                    this.additionalProduct['配赠产品'].push(matching)
                    let arrIndex = matchingArr.findIndex((items) => {
                      return items.pro_id == item.pro_id
                    })
                    matchingArr.splice(arrIndex, 1) // 过滤已选项
                  }
                })
                this.originalProductList.map((items) => {
                  items.orderProduct = items.orderProduct.concat(arr)
                })



                additArr.forEach(pro => {
                  this.additionalProduct[pro.name].map((items) => {
                    items.orderProduct = items.orderProduct.concat(pro.orderPro)
                  })
                })

                // -------------- reissueProductList -------------------
                let reissueP = this.formData.reissueProducts.find(item => item.type === 'order')
                this.reissueProductList = reissueP ? [] : [
                  {
                    data: {
                      pro_id: '',
                      standard: '',
                      unit: '',
                      price: 0,
                      box_standard: ''
                    },
                    discount: 0,
                    number: 1,
                    total_price: 0,
                    total_value: 0,
                    orderProduct: []
                  }
                ]

                this.formData.reissueProducts.map((item) => {
                  // console.log(item.type)
                  if(item.type === 'order') {
                    let obj = {
                      data: item,
                      number: +item.number,
                      total_price: item.total_price,
                      total_value: +item.number * item.price,
                      discount: item.discount,
                      orderProduct: [JSON.parse(JSON.stringify(item))]
                    }
                    this.reissueProductList.push(obj)
                  }else {
                    let pro = additArr.find(pro => pro.field === item.type)
                    let index =  this.additionalProduct[pro.name].findIndex(product => product.data.pro_id === item.pro_id )
                    this.additionalProduct[pro.name][index].number = +item.number
                    this.additionalProduct[pro.name][index].total_price = item.total_price
                    this.additionalProduct[pro.name][index].total_value = +item.number * item.price
                    this.hasRessAdditProduct[pro.name] = true
                  }

                })
              })
            }
          }
        }).finally(() => {
          this.spinShow = false
        })
      }
    },
    computed: {
      noAmountReceivable: function () {
        let list = this.originalProductList.map((item) => {
          return +item.not_total_price
        })
        let repurchaseList = this.additionalProduct['换购产品'].map((item) => {
          return +item.not_total_price
        })
        let total = list.reduce(function (prev, cur) {
          return prev + cur
        }, 0)
        let repurchaseTotal = repurchaseList.reduce(function (prev, cur) {
          return prev + cur
        }, 0)
        return this.$toFixed(total + repurchaseTotal, 4)
      },
      reissueAmountReceivable: function () {
        let list = this.reissueProductList.map((item) => {
          return +item.total_price
        })
        let repurchaseList = this.additionalProduct['换购产品'].map((item) => {
          return +item.total_price
        })
        let total = list.reduce(function (prev, cur) {
          return prev + cur
        }, 0)
        let repurchaseTotal = repurchaseList.reduce(function (prev, cur) {
          return prev + cur
        }, 0)
        return this.$toFixed(total + repurchaseTotal, 4)
      },
      amountReceivable: function () { // 实际应收金额 = 补发应收金额 - 未发应收金额 ，计算结果为复数，显示为0；计算结果四舍五入保留两位小数
        let total = this.reissueAmountReceivable - this.noAmountReceivable
        if (total < 0) {
          total = 0
        }
        return this.$toFixed(total, 4)
      },
      reissueValue: function () {
        let list = this.reissueProductList.map((item) => {
          return +item.total_value
        })
        let total = list.reduce(function (prev, cur) {
          return prev + cur
        }, 0)
        return this.$toFixed(total, 4)
      }
    }
  }
</script>
<style lang="less" scoped>
  .order-title {
    font-weight: 600;
    margin: 30px 0 15px 0;
  }

  .remark-title {
    margin: 30px 0 10px 0;
  }

  .necessary:before {
    content: "*";
    display: inline-block;
    margin-right: 4px;
    line-height: 1;
    font-family: SimSun;
    font-size: 12px;
    color: #ed4014;
  }

</style>
