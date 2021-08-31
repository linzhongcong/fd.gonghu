<template>
  <div>
    <Card>
      <Row slot="title" type="flex" justify="space-between">
        <Col><p style="line-height: 30px;height: 30px;">填写销售单</p></Col>
        <Col>
          <Button type="success" :loading="loadingSubmit" @click="submit()">提交</Button>
        </Col>
      </Row>
      <Row v-for="(data,index) in saleLists" :key="'sale' + index">
        <Col :md="22" class="order">
          <Form label-position="right" :label-width="78">
            <Row>
              <Col :md="6">
                <FormItem label="商家名称" required>
                  <Select v-model="data.contractor_id" @on-query-change="queryContractorDebonce(...arguments, index)"
                          @on-change="selectContractor(...arguments, index)" :loading="loadingSelect" filterable
                          clearable>
                    <Option v-for="(item, key) in saleListSelect[index].contractorList" :key="'contractor'+key"
                            :value="item.id" :label="item.merchant_name"></Option>
                  </Select>
                </FormItem>
              </Col>
              <Col :md="4">
                <FormItem label="门店名称" required>
                  <Select v-model="data.facade_id" @on-change="selectFacade(...arguments, index)"
                          :loading="loadingSelect">
                    <Option v-for="(item, key) in saleListSelect[index].facadeList" :key="'facade'+key" :value="item.id"
                            :label="item.name"></Option>
                  </Select>
                </FormItem>
              </Col>
              <Col :md="14">
                <FormItem label="门店地址">
                  <Input v-model="data.facadeAddress" readonly></Input>
                </FormItem>
              </Col>
            </Row>
            <!-- 产品 start -->
            <Row v-for="(item, i) in data.items" :key="'products' + i">
              <Col :md="6">
                <FormItem label="产品名称" required>
                  <Select v-model="item.product_id" @on-query-change="queryProductDebonce(...arguments, index, i)"
                          @on-change="selectProduct(...arguments, index, i)" :loading="loadingSelect" filterable
                          clearable>
                    <Option v-for="(value, key) in saleListSelect[index].items[i].productList" :key="'product'+ key"
                            :value="value.pro_id" :label="value.pro_name"></Option>
                  </Select>
                </FormItem>
              </Col>
              <Col :md="4">
                <FormItem label="价格">
                  <Input v-model="item.retail_price" disabled></Input>
                </FormItem>
              </Col>
              <Col :md="4">
                <FormItem label="销售数量">
                  <InputNumber :min="0" v-model="item.number" style="width: 100px"
                               @on-change="getCount(...arguments, item.retail_price, index, i)"></InputNumber>
                </FormItem>
              </Col>
              <Col :md="5">
                <FormItem label="货值">
                  <Input v-model="item.value" readonly></Input>
                </FormItem>
              </Col>
              <Col :md="4" style="padding-left: 25px">
                <Button icon="md-add" v-if="i === 0" @click="addProduct(index)"></Button>
                <Button icon="md-remove" v-if="data.items.length>1" @click="removeProduct(index, i)"></Button>
              </Col>
            </Row>
            <!-- 产品 end -->
            <Row>
              <Col :md="8">
                <FormItem label="订单总货值">
                  <Input v-model="data.total_val" readonly></Input>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col :md="24">
                <FormItem label="备注">
                  <Input v-model="data.remark"></Input>
                </FormItem>
              </Col>
            </Row>
            <Row>
              <Col :md="12">
                <FormItem label="销售凭证" required>
                  <Upload name="file"
                          :action="fileUploadURL"
                          :headers="fileUploadHeaders"
                          :default-file-list="saleListSelect[0].defaultList"
                          :on-success="(response, file, fileList)=>fileSuccess(response, file, fileList,index)"
                          :on-remove="(file, fileList)=>fileRemove(file, fileList, index)">
                    <Button icon="md-add" type="dashed"></Button>
                  </Upload>
                </FormItem>
              </Col>
            </Row>
          </Form>
        </Col>
        <Col :md="2" v-if="!orderId">
          <Button icon="md-add" v-if="index === 0" @click="addSale()"></Button>
          <Button icon="md-remove" v-if="saleLists.length>1" @click="removeSale(index)"></Button>
        </Col>
      </Row>
    </Card>
  </div>
</template>
<script>
  import Cookies from 'js-cookie'
  import {SERVER_FILE_URL} from '~/api/config';

  export default {
    data() {
      return {
        // 文件上传
        fileUploadURL: `${SERVER_FILE_URL}/file/upload`,
        fileUploadHeaders: {
          Authorization: Cookies.get('authorization')
        },
        loadingSelect: false,
        loadingSubmit: false,
        orderId: '',
        saleLists: [
          {
            contractor_id: '',
            facade_id: '',
            facadeAddress: '',
            items: [{product_id: '', retail_price: '', number: 0, value: 0}],
            remark: '',
            fileItems: [],
            total_val: 0
          }
        ],
        saleListSelect: [
          {
            contractorList: [],
            facadeList: [],
            items: [{productList: []}]
          }
        ],
        // 防抖函数防止频繁搜索
        queryContractorDebonce: this.$debonce(this.queryContractor, 500),
        queryProductDebonce: this.$debonce(this.queryProduct, 500)
      }
    },
    methods: {
      // 添加产品
      addProduct(index) {
        let obj = {product_id: '', retail_price: '', number: 0, value: 0}
        let arr = {productList: []}
        this.saleLists[index].items.push(obj)
        this.saleListSelect[index].items.push(arr)
      },
      // 删除产品
      removeProduct(index, i) {
        this.saleLists[index].items.splice(i, 1)
        this.saleListSelect[index].items.splice(i, 1)
        this.calculateTotal(index)
      },
      // 获取销售数量
      getCount(num, price, index, i) {
        let retailPrice = +price.split(',').join('')
        if (!isNaN(retailPrice)) {
          this.saleLists[index].items[i].value = Math.round(num * retailPrice * 10000) / 10000
          this.saleLists[index].items[i].number = num
          // 计算总货值
          this.calculateTotal(index)
        } else {
          this.saleLists[index].items[i].value = 0
        }
      },
      // 计算总货值
      calculateTotal(index) {
        this.saleLists[index].total_val = 0
        this.saleLists[index].items.map((item) => {
          this.saleLists[index].total_val += item.value
        })
      },
      addSale() {
        let obj = {
          contractor_id: '',
          facade_id: '',
          facadeAddress: '',
          items: [{product_id: '', retail_price: '', number: 0, value: 0}],
          remark: '',
          fileItems: [],
          total_val: 0
        }
        let arr = {
          contractorList: [],
          facadeList: [],
          items: [{productList: []}]
        }
        this.saleLists.push(obj)
        this.saleListSelect.push(arr)
      },
      removeSale(index) {
        this.saleLists.splice(index, 1)
        this.saleListSelect.splice(index, 1)
      },
      submit() {
        let param = JSON.parse(JSON.stringify(this.saleLists))
        let valid = false
        param.map((item) => {
          item.items = item.items.filter((data) => { // 过滤没有填写的产品
            if (!!data.product_name) {
              console.log("TCL: submit -> data.product_name", data.product_name)
              delete data.product_name
            }
            return data.product_id
          })
          valid = false
          if (!item.contractor_id) {
            this.$Message.error('请填写商家名称');
            return
          } else if (!item.facade_id) {
            this.$Message.error('请填写门店名称');
          } else if (item.items.length == 0) {
            this.$Message.error('请填写产品名称');
          } else if (item.fileItems.length == 0) {
            this.$Message.error('请上传销售凭证');
          } else {
            valid = true
          }
        })
        if (valid) {
          this.loadingSubmit = true
          if (!!this.orderId) {
            let obj = {
              id: +this.orderId,
              params: param[0]
            }
            this.$api.salesReviewEdit(obj).then((res) => {
              if (res.code === 0) {
                this.goBack('编辑成功')
              }
            }).finally(() => {
              this.loadingSubmit = false
            })
          } else {
            this.$api.salesReviewCreate({params: param}).then((res) => {
              if (res.code === 0) {
                this.goBack('添加成功')
              }
            }).finally(() => {
              this.loadingSubmit = false
            })
          }
        }
      },
      fileSuccess(response, file, fileList, index) {
        if (response.code === 0) {
          this.saleLists[index].fileItems.push(response.data.fileUploadVo)
        }
      },
      fileRemove(file, fileList, index) {
        let fileIndex = this.saleLists[index].fileItems.findIndex((item) => {
          return file.name == item.name
        })
        this.saleLists[index].fileItems.splice(fileIndex, 1)
      },
      goBack(tip) { //返回列表页
        this.$Message.success(tip)
        this.$store.commit('removeTag', this.$route.name)
        this.$router.push({path: '/sale-order-management/sale-order-review/review'})
      },
      queryProduct(query, index, i) { // 产品查询
        this.$api.orderReviewQueryProduct({name: query}).then((res) => {
          if (res.code === 0) {
            this.saleListSelect[index].items[i].productList = res.data
          }
        })
      },
      queryContractor(query, index) {
        this.loadingSelect = true
        this.$api.orderReviewQueryContractor({name: query}).then((res) => {
          if (res.code === 0) {
            this.saleListSelect[index].contractorList = res.data
          }
        }).finally(() => {
          this.loadingSelect = false
        })
      },
      selectContractor(val, index) { // 选择商家搜索出当前商家的所用门店
        if (!!val) {
          this.loadingSelect = true
          this.$api.facadeQuery({id: val}).then((res) => {
            if (res.code === 0) {
              this.saleListSelect[index].facadeList = res.data
            }
          }).finally(() => {
            this.loadingSelect = false
          })
        } else {
          this.saleLists[index].facadeAddress = ''
          this.saleLists[index].facade_id = ''
          this.saleListSelect[index].facadeList.length = 0
        }
      },
      selectFacade(val, index) { // 选择门店获取地址
        if (this.saleListSelect[index].facadeList.length > 0) {
          this.saleListSelect[index].facadeList.map((item) => {
            if (item.id === val) {
              this.saleLists[index].facadeAddress = item.address
            }
          })
        }
      },
      selectProduct(val, index, i) {
        if (val) {
          if (this.saleListSelect[index].items[i].productList.length > 0) {
            this.saleListSelect[index].items[i].productList.map((item) => {
              if (item.pro_id === val) {
                this.saleLists[index].items[i].retail_price = item.price
                this.saleLists[index].items[i].number = 0
                this.saleLists[index].items[i].value = 0
                this.calculateTotal(index)
              }
            })
          }
        }
      }
    },
    mounted() {
      this.orderId = this.$route.query.id
      if (!!this.orderId) {
        this.$api.salesReviewDetail({id: this.orderId}).then((res) => {
          if (res.code === 0) { // 编辑只有一条商家信息
            this.saleLists.length = 0
            this.saleListSelect[0].items.length = 0
            this.saleLists.push(res.data)
            this.saleLists[0].facadeAddress = res.data.facade_address
            this.saleLists[0].total_val = +res.data.total_val.split(',').join('')
            // 产品信息
            this.saleLists[0].items.map((item) => {
              item.number = +item.number // 字符串 转 number
              item.value = +item.value.split(',').join('')
              item.retail_price = +item.retail_price.split(',').join('')
              let obj = {
                pro_id: item.product_id,
                pro_name: item.product_name
              }
              this.saleListSelect[0].items.push({productList: [obj]})
            })
            // 凭证信息
            if (this.saleLists[0].fileItems.length > 0) {
              this.saleListSelect[0].defaultList = []
              this.saleLists[0].fileItems.map((item) => {
                item.name = item.title + '.' + item.extension
                this.saleListSelect[0].defaultList.push(item)
              })
            }
            // 商家名称
            this.saleListSelect[0].contractorList.push({
              id: res.data.contractor_id,
              merchant_name: res.data.merchant_name
            })
            // 门店信息
            this.selectContractor(res.data.contractor_id, 0)
          }
        })
      }
    }
  }
</script>
<style lang="less">
  .order {
    border: 1px #dcdee2 dashed;
    padding-top: 20px;
    margin-bottom: 25px;
    border-radius: 5px;
  }
</style>