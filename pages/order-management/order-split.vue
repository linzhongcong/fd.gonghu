<!--订单拆分页面-->
<template>
  <Card style="padding: 0 30px 30px">
    <div slot="title" style="text-align: right">
      <Button @click="orderSplitSubmit()" type="primary">提交</Button>
    </div>
    <div class="order-info">
      <h2>订单号：{{titleInfo.order_sn}}</h2>
      <Row class-name="order-info">
        <Col span="5">创建人：{{titleInfo.created_by}}</Col>
        <Col span="5">业务员：{{titleInfo.salesman}}</Col>
        <Col span="5">下单时间：{{this.$format(titleInfo.order_time, 'yyyy-MM-dd hh:mm')}}</Col>
      </Row>
      <Row class-name="order-info">
        <Col span="5">商家名称：{{titleInfo.merchant_name}}</Col>
        <Col span="5">订单来源：{{this.formatOrigin(titleInfo.order_form)}}</Col>
        <Col span="10">备注：{{titleInfo.remark}}</Col>
      </Row>
    </div>
    <Table :columns="fatherOrderColumns" :data="fatherOrderData" class="item"></Table>
    <div class="child-info item" v-for="(item,index) in childOrderData" :key="item.id">
      <h3>子订单 {{index + 1}}</h3>
      <Row>
        <Col span="20">
          <Table :columns="item.columns" :data="item.data"
                 v-if="item.columns.toString() && item.data.toString()"></Table>
          <div v-else class="add-area" @click="openProductModal(index)">
            <Icon type="ios-add" size="20"/>
            添加货品
          </div>
        </Col>
        <Col span="2">
          <Icon type="ios-add-circle-outline" size="35" @click="addChildItem()"/>
          <Icon type="ios-close-circle-outline" size="35" @click="delChildItem(index)"
                v-if="childOrderData.length !== 1"/>
        </Col>
        <Col span="2">
          <!--这里不用全等是因为想同时判断undefined和null，而不判断0的情况，并不是规范问题-->
          <Button type="primary" @click="editProduct(index)" v-show="addProductData.editIndex !== index"
                  :disabled="addProductData.editIndex != null">编辑
          </Button>
          <Button type="primary" @click="comfirmProduct()"
                  v-show="addProductData.editIndex != null && addProductData.editIndex === index">完成
          </Button>
        </Col>
      </Row>
    </div>
    <Modal v-model="addProductData.modal" title="选择需要拆分的产品及数量" width="1000">
      <Table :columns="addProductData.columns" :data="addProductData.data" no-data-text="无可选择的商品"></Table>
      <div slot="footer">
        <Button type="primary" size="large" :loading="addProductData.btn_loading"
                @click="addProductComfirm(addProductData.addIndex)">提交
        </Button>
      </div>
    </Modal>

    <Modal v-model="submitConfirmModal.modal" title="提示" width="600">
      <div style="padding: 20px 10px">
        <Icon type="md-alert" color="#faad14" size="30" /> 请确认拆单结果再提交，尽量避免多次修改操作！
      </div>
      <div slot="footer">
        <Button type="default" size="large" @click="submitConfirmModal.modal = false">检查一下</Button>
        <Button type="primary" size="large" :loading="submitConfirmModal.btn_loading" @click="orderSplitSubmitConfirm()">确认提交</Button>
      </div>
    </Modal>
  </Card>

</template>

<script>
  export default {
    name: "order-split",
    data() {
      return {
        fatherTableLoading: true,
        titleInfo: {
          id: '',
          order_sn: '',
          created_by: '',
          salesman: '',
          order_time: '',
          merchant_name: '',
          order_form: '',
          remark: ''
        },
        originList: [
          {key: 'MiniProgram', value: '小程序'},
          {key: 'backstage', value: '后台添加'}
        ],
        fatherOrderColumns: [
          {
            type: 'index',
            title: '序号',
            width: 100,
            align: 'center'
          },
          {
            title: '产品名称',
            key: 'pro_name',
            align: 'center'
          },
          {
            title: '条码',
            key: 'barcode',
            align: 'center'
          },
          {
            title: '规格',
            key: 'standard',
            align: 'center'
          },
          {
            title: '单位',
            key: 'unit',
            align: 'center'
          },
          {
            title: '订货数量',
            key: 'number',
            align: 'center'
          },
          {
            title: '箱规',
            key: 'box_standard',
            align: 'center'
          },
          {
            title: '已拆分数量',
            key: 'had_split_number',
            align: 'center'
          }
        ],
        fatherOrderData: [],

        /**
         * 子订单数据
         */
        childOrderData: [
          {
            columns: [],
            data: [],
          }
        ],
        addProductData: {
          addIndex: Number,
          editIndex: null,
          modal: false,
          btn_loading: false,
          columns: [
            {
              title: '产品名称',
              key: 'pro_name',
              align: 'center'
            },
            {
              title: '总订货数量',
              key: 'number',
              align: 'center'
            },
            {
              title: '本次分拆数量',
              key: 'this_number',
              align: 'center',
              render: (h, params) => {
                return h('InputNumber', {
                  props: {
                    value: params.row.this_number,
                    min: 0,
                    precision: 0,
                    max: params.row.number - params.row.had_split_number,
                  },
                  on: {
                    'on-change': e => {
                      // 本次拆分量
                      this.addProductData.data[params.row._index].this_number = e;
                    },
                  },
                })
              }
            },
            {
              title: '剩余量',
              key: 'surplus_number',
              align: 'center',
              render: (h, params) => {
                return h('div', params.row.number - params.row.had_split_number - (params.row.this_number || 0))
              }
            }
          ],
          data: []
        },
        submitConfirmModal: {
          modal: false,
          btn_loading: false
        }
      }
    },
    mounted() {
      this.getOrderDetail()
    },
    methods: {
      // 获取订单详情
      getOrderDetail() {
        this.fatherTableLoading = true;
        this.$api.orderDeliverDetail({id: this.$route.query.id})
          .then((res) => {
            // 订单头部信息
            Object.keys(this.titleInfo).forEach(key => {
              if (res.data[key]) {
                this.titleInfo[key] = res.data[key];
              }
            });
            // 订单列表信息
            if (this.$route.query.type === 'add') {
              //新拆的单
              this.fatherOrderData = res.data.allProduct.reduce((total, currentValue, currentIndex) => {
                return [...total, ...[{...currentValue, ...{had_split_number: 0, currentIndex: currentIndex}}]]
              }, []);
            } else {
              //修改的单
              //默认全部拆完
              this.fatherOrderData = res.data.allProduct.reduce((total, currentValue, currentIndex) => {
                return [...total, ...[{
                  ...currentValue, ...{
                    had_split_number: Number(currentValue.number),
                    currentIndex: currentIndex
                  }
                }]]
              }, []);
              console.log('this.fatherOrderData', this.fatherOrderData)

              //补全子订单 start
              res.data.allChildrenOrders.forEach((item, index) => {
                if (index !== 0) {
                  this.childOrderData.push({
                    columns: [],
                    data: []
                  });
                }
                this.childOrderData[index].data = res.data.allChildrenOrders[index].allProduct.reduce((total, currentValue) => {
                  for (let i in this.fatherOrderData) {
                    if (this.fatherOrderData[i].id === currentValue.parent_product_id) {
                      let obj = {
                        ...currentValue, ...{
                          had_split_number: this.fatherOrderData[i].number,
                          this_number: Number(currentValue.number),
                          currentIndex: i
                        }
                      };
                      obj.number = this.fatherOrderData[i].number;
                      obj.id = this.fatherOrderData[i].id;
                      return [...total, ...[obj]]
                    }
                  }
                }, [])
              })
              this.renderTable()
              //补全子订单 end


            }
          })
          .finally(() => {
            this.fatherTableLoading = false
          })
      },
      addChildItem() {
        this.childOrderData.push({
          columns: [],
          data: []
        })
      },
      delChildItem(index) {
        this.childOrderData[index].data.forEach(item => {
          if (item.id === this.fatherOrderData[item.currentIndex].id) {
            this.fatherOrderData[item.currentIndex].had_split_number -= item.this_number;
          }
        })
        this.childOrderData.splice(index, 1)
        this.renderTable()
      },
      // 打开货品添加模态框
      openProductModal(index) {
        if (this.fatherTableLoading) {
          this.$Message.warning('数据加载中，请稍侯...')
          return false;
        }
        //将可拆分的数据过滤出来 在 加一个this_number字段
        //虽然可读性不高，但问题不大。
        let filterFatherOrderData = this.fatherOrderData.filter(item => {
          return (item.number - item.had_split_number) > 0
        }).reduce((total, currentValue) => {
          return [...total, ...[{...currentValue, ...{this_number: 0}}]]
        }, []);
        this.addProductData.data = filterFatherOrderData;
        this.addProductData.addIndex = index;
        this.addProductData.modal = true;

      },
      // 货品添加确认
      addProductComfirm(index) {
        //计算已拆分数量
        this.addProductData.data.forEach((item) => {
          if (item.id === this.fatherOrderData[item.currentIndex].id) {
            this.fatherOrderData[item.currentIndex].had_split_number += item.this_number;
          }
        });
        this.childOrderData[index].data = this.addProductData.data.filter(item => {
          return item.this_number !== 0
        });
        this.renderTable()
        this.addProductData.modal = false
      },
      // 编辑子订单
      editProduct(index) {
        this.addProductData.editIndex = index;
      },
      comfirmProduct() {
        this.addProductData.editIndex = null;
      },
      //拆单提交
      orderSplitSubmit() {
        if (this.addProductData.editIndex != null) {
          this.$Message.error('请完成编辑！');
          return;
        }
        //检查订单是否拆完
        let checkSplitOk = true;
        for (let item of this.fatherOrderData) {
          if (item.number - item.had_split_number !== 0) {
            checkSplitOk = false;
            break;
          }
        }
        if (!checkSplitOk) {
          this.$Message.error('还有未拆分的商品！');
          return;
        }

        this.submitConfirmModal.modal = true;
      },
      orderSplitSubmitConfirm() {
        let postData = {
          id: '',
          childrenOrders: []
        };
        postData.id = this.titleInfo.id;
        this.childOrderData.forEach((item, index) => {
          if (item.data.length) {
            postData.childrenOrders.push({
              productInfo: []
            });
            item.data.forEach(data => {
              postData.childrenOrders[index].productInfo.push({
                id: data.id,
                number: data.this_number
              });
            });
          }
        });
        this.submitConfirmModal.btn_loading = true;
        this.$api.separateOrder(postData)
          .then(res => {
            if (res.code === 0) {
              this.$Message.success('提交成功！');
              this.$router.go(-1)
            } else {
              this.$Message.error('提交失败！');
            }
          })
          .finally(() => {
            this.submitConfirmModal.btn_loading = false;
            this.submitConfirmModal.modal = false;
          })
      },
      // 转化订单来源
      formatOrigin(origin) {
        for (let i in this.originList) {
          if (origin === this.originList[i].key) {
            return this.originList[i].value;
          }
        }
      },
      renderTable() {
        this.childOrderData.forEach((item, index) => {
          this.childOrderData[index].columns = [
            {
              title: '产品名称',
              key: 'pro_name',
              align: 'center'
            },
            {
              title: '条码',
              key: 'barcode',
              align: 'center'
            },
            {
              title: '订货数量',
              key: 'number',
              align: 'center'
            },
            {
              title: '本次分拆数量',
              align: 'center',
              render: (h, params) => {
                let returnDOM = null;
                let recordThisNumber = params.row.this_number; //记录初始化分拆数量（params.row.this_number只会记录初始值，并不会改变）
                let recordHadSplitNumber = this.fatherOrderData[params.row.currentIndex].had_split_number; //记录已拆数量
                if (this.addProductData.editIndex != null && this.addProductData.editIndex === index) {
                  returnDOM = h('InputNumber', {
                    props: {
                      value: params.row.this_number,
                      min: 1,
                      precision: 0,
                      // 拆分数量最大值 = 订货数量 - 已拆分的数量 + 记录的初始化分拆数量
                      max: params.row.number - this.fatherOrderData[params.row.currentIndex].had_split_number + recordThisNumber,
                    },
                    on: {
                      'on-change': e => {
                        // 本次拆分量
                        this.childOrderData[index].data[params.row._index].this_number = e;
                        // 已拆分数量
                        this.fatherOrderData[params.row.currentIndex].had_split_number = recordHadSplitNumber + e - recordThisNumber;
                      },
                    },
                  })
                } else {
                  returnDOM = h('div', this.childOrderData[index].data[params.row._index].this_number);
                }
                return returnDOM;
              }
            },
          ];

        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .item {
    margin-top: 30px;
  }

  .order-info {
    margin-top: 20px;
  }

  .add-area {
    text-align: center;
    padding: 40px 0;
    border: 1px dashed #999999;
    color: #999999;
    font-size: 17px;
    cursor: pointer;
  }
  /deep/.ivu-table-overflowX{ overflow-x: hidden;}
  /deep/.ivu-table-tip{ overflow-x: hidden;}
</style>
