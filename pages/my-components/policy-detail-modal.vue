<template>
    <div>
        <Modal v-model="policyDetailList.modal" title="合同政策详情" width="900" :closable="false">
            <div class="policyDetailList-wrap">
                <div class="ivu-table-wrapper">
                    <div class="ivu-table ivu-table-small ivu-table-border">
                        <div class="ivu-table-body">
                            <table cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tbody class="ivu-table-tbody">
                                <tr class="ivu-table-row">
                                    <td class="head-bg">
                                        <div class="ivu-table-cell">政策名称</div>
                                    </td>
                                    <td colspan="3">
                                        <div class="ivu-table-cell">
                                            <span v-text="policyDetailList.data.policy_name"></span>
                                        </div>
                                    </td>
                                </tr>
                                <tr class="ivu-table-row">
                                    <td class="head-bg">
                                        <div class="ivu-table-cell">启用</div>
                                    </td>
                                    <td colspan="3">
                                        <div class="ivu-table-cell">
                                            <span v-text="policyDetailList.data.is_open == '1' ? '是': '否'"></span>
                                        </div>
                                    </td>
                                </tr>
                                <tr class="ivu-table-row">
                                    <td class="head-bg">
                                        <div class="ivu-table-cell">创建人</div>
                                    </td>
                                    <td>
                                        <div class="ivu-table-cell">
                                            <span v-text="policyDetailList.data.created_by"></span>
                                        </div>
                                    </td>
                                    <td class="head-bg">
                                        <div class="ivu-table-cell">创建时间</div>
                                    </td>
                                    <td>
                                        <div class="ivu-table-cell">
                                            <span v-text="formatDate(policyDetailList.data.created_at)"></span>
                                        </div>
                                    </td>
                                </tr>
                                <tr class="ivu-table-row">
                                    <td class="head-bg">
                                        <div class="ivu-table-cell">审核人</div>
                                    </td>
                                    <td>
                                        <div class="ivu-table-cell">
                                            <span v-text="policyDetailList.data.reviewer"></span>
                                        </div>
                                    </td>
                                    <td class="head-bg">
                                        <div class="ivu-table-cell">审核时间</div>
                                    </td>
                                    <td>
                                        <div class="ivu-table-cell">
                                            <span v-text="formatDate(policyDetailList.data.audit_at)"></span>
                                        </div>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                
                <div class="detailsList-title" v-if="policyDetailList.data.regularProductInfo.length>0">适用商品</div>
                <div class="ivu-table-wrapper" v-if="policyDetailList.data.regularProductInfo.length>0">
                    <div class="ivu-table ivu-table-small ivu-table-border">
                        <div class="ivu-table-body">
                            <table cellspacing="0" cellpadding="0" border="0" width="100%">
                              <tbody class="ivu-table-tbody">
                                <tr class="ivu-table-row">
                                    <td class="head-bg">
                                        <div class="ivu-table-cell">商品类目</div>
                                    </td>
                                    <td class="head-bg">
                                        <div class="ivu-table-cell">数量</div>
                                    </td>
                                    <td class="head-bg">
                                        <div class="ivu-table-cell">操作</div>
                                    </td>
                                </tr>
                                <tr class="ivu-table-row" v-for="(item,index) in policyDetailList.data.regularProductInfo" :key="index+'regularProductInfo'">
                                 
                                    <td>
                                        <div class="ivu-table-cell">
                                            <span v-text="item.category_name"></span>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="ivu-table-cell">
                                            <span v-text="item.count"></span>
                                        </div>
                                    </td>
                                    <td>
                                        <div class="ivu-table-cell">
                                            <span @click="seeRegularProductInfo(item.policy_id,item.category_id)" style="color:#169bd5;cursor:pointer">查看详情</span>
                                        </div>
                                    </td>
                                </tr>
                              </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div class="detailsList-title" v-if="policyDetailList.data.baseDiscount.length>0">基础折扣设置</div>
                <div class="ivu-table-wrapper" v-if="policyDetailList.data.baseDiscount.length>0">
                    <div class="ivu-table ivu-table-small ivu-table-border">
                        <div class="ivu-table-body">
                            <table cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tbody class="ivu-table-tbody">
                                <tr class="ivu-table-row" v-for="(item, index) in policyDetailList.data.baseDiscount" :key="'base' + index">
                                    <td class="head-bg">
                                        <div class="ivu-table-cell">梯度折扣</div>
                                    </td>
                                    <td>
                                        <div class="ivu-table-cell">
                                            <span v-text="formatProportion(item.proportion)"></span>
                                        </div>
                                    </td>
                                    <td class="head-bg">
                                        <div class="ivu-table-cell">应收金额</div>
                                    </td>
                                    <td>
                                        <div class="ivu-table-cell">
                                            <span v-text="item.starting_amount"></span>
                                        </div>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div class="detailsList-title" v-if="policyDetailList.data.categoryDiscount.length>0">品类折扣设置</div>
                <div class="ivu-table-wrapper" v-if="policyDetailList.data.categoryDiscount.length>0">
                    <div class="ivu-table ivu-table-small ivu-table-border">
                        <div class="ivu-table-body">
                            <table cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tbody class="ivu-table-tbody">
                                <template v-for="(item, index) in policyDetailList.data.categoryDiscount">
                                    <div :key="index">
                                    <tr class="ivu-table-row">
                                        <td class="head-bg">
                                            <div class="ivu-table-cell">折扣</div>
                                        </td>
                                        <td>
                                            <div class="ivu-table-cell">
                                                <span v-text="formatProportion(item.proportion)"></span>
                                            </div>
                                        </td>
                                        <td class="head-bg">
                                            <div class="ivu-table-cell">选择品类</div>
                                        </td>
                                        <td>
                                            <div class="ivu-table-cell">
                                                <span v-text="item.name"></span>
                                            </div>
                                        </td>
                                    </tr>
                                    </div>
                                </template>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div class="detailsList-title" v-if="policyDetailList.data.productDiscount.length>0">单品折扣设置</div>
                <div class="ivu-table-wrapper" v-if="policyDetailList.data.productDiscount.length>0">
                    <div class="ivu-table ivu-table-small ivu-table-border">
                        <div class="ivu-table-body">
                            <table cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tbody class="ivu-table-tbody">
                                <template v-for="(item, index) in policyDetailList.data.productDiscount">
                                    <div :key="index">
                                    <tr class="ivu-table-row">
                                        <td class="head-bg">
                                            <div class="ivu-table-cell">{{ item.object_name === "discount" ?"折扣":'单价'}}</div>
                                        </td>
                                        <td>
                                            <div class="ivu-table-cell">
                                                <span v-if="item.object_name === 'discount'" v-text="formatProportion(item.proportion)"></span>
                                                <span v-else v-text="(item.direct_price)"></span>
                                            </div>
                                        </td>
                                        <td class="head-bg">
                                            <div class="ivu-table-cell">选择产品</div>
                                        </td>
                                        <td>
                                            <div class="ivu-table-cell">
                                                <span v-text="item.name"></span>
                                            </div>
                                        </td>
                                    </tr>
                                    </div>
                                </template>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div class="detailsList-title" v-if="policyDetailList.data.backPointDiscount.length>0">返点设置</div>
                <div class="ivu-table-wrapper" v-if="policyDetailList.data.backPointDiscount.length>0">
                    <div class="ivu-table ivu-table-small ivu-table-border">
                        <div class="ivu-table-body">
                            <table cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tbody class="ivu-table-tbody">
                                <tr class="ivu-table-row" v-for="(item, indextop) in policyDetailList.data.backPointDiscount" :key="indextop">
                                    <td class="head-bg">
                                        <div class="ivu-table-cell">返点比例</div>
                                    </td>
                                    <td>
                                        <div class="ivu-table-cell">
                                            <span v-text="formatProportion(item.proportion)"></span>
                                        </div>
                                    </td>
                                    <td class="head-bg">
                                        <div class="ivu-table-cell">起订金额</div>
                                    </td>
                                    <td>
                                        <div class="ivu-table-cell">
                                            <span v-text="item.starting_amount"></span>
                                        </div>
                                    </td>
                                </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div class="detailsList-title" v-if="policyDetailList.data.repurchaseArr && policyDetailList.data.repurchaseArr.length>0">换购设置</div>
                <div class="ivu-table-wrapper" v-if="policyDetailList.data.repurchaseArr && policyDetailList.data.repurchaseArr.length>0">
                    <div class="ivu-table ivu-table-small ivu-table-border">
                        <div class="ivu-table-body">
                          <table cellspacing="0" cellpadding="0" border="0" width="100%">
                              <tbody v-for="(items, index) in policyDetailList.data.repurchaseArr" :key="index">
                                  <tr class="ivu-table-row">
                                      <td class="head-bg">
                                          <div class="ivu-table-cell">
                                              <span>满足应收金额</span>
                                          </div>
                                      </td>
                                      <!-- <td colspan="5"> -->
                                      <td colspan="8">
                                          <div class="ivu-table-cell">
                                              <span>{{items.starting_amount}}</span>
                                          </div>
                                      </td>
                                  </tr>
                                  <tr class="ivu-table-row" v-for="(item, i) in items.list" :key='i'>
                                      <td class="head-bg">
                                          <div class="ivu-table-cell">
                                              <span>类型</span>
                                          </div>
                                      </td>
                                      <td colspan="2">
                                          <div class="ivu-table-cell">
                                              <span>{{item.object_name==='product'?'商品':item.object_name==='category'?'类目':item.object_name}}</span>
                                          </div>
                                      </td>
                                      <td class="head-bg">
                                          <div class="ivu-table-cell">
                                              <span>换购产品</span>
                                          </div>
                                      </td>
                                      <td colspan="2">
                                          <div class="ivu-table-cell">
                                               <span>{{item.name}}</span>
                                          </div>
                                      </td>
                                      <td class="head-bg">
                                          <div class="ivu-table-cell">
                                              <span>换购折扣</span>
                                          </div>
                                      </td>
                                      <td colspan="2">
                                          <div class="ivu-table-cell">
                                               <span>{{formatProportion(item.proportion)}}</span>
                                          </div>
                                      </td>
                                  </tr>
                              </tbody>
                          </table>
                        </div>
                    </div>
                </div>
                <div class="detailsList-title" v-if="policyDetailList.data.matchingArr && policyDetailList.data.matchingArr.length>0">配赠设置</div>
                <div class="ivu-table-wrapper" v-if="policyDetailList.data.matchingArr && policyDetailList.data.matchingArr.length>0">
                    <div class="ivu-table ivu-table-small ivu-table-border">
                        <div class="ivu-table-body">
                          <table cellspacing="0" cellpadding="0" border="0" width="100%">
                              <tbody v-for="(items, index) in policyDetailList.data.matchingArr" :key="index">
                                  <tr class="ivu-table-row">
                                      <td class="head-bg">
                                          <div class="ivu-table-cell">
                                              <span>配赠应收金额</span>
                                          </div>
                                      </td>
                                      <!-- <td colspan="5"> -->
                                      <td colspan="8">
                                          <div class="ivu-table-cell">
                                              <span>{{items.starting_amount}}</span>
                                          </div>
                                      </td>
                                  </tr>
                                  <tr class="ivu-table-row" v-for="(item, i) in items.present" :key='i'>
                                      <td class="head-bg">
                                          <div class="ivu-table-cell">
                                              <span>配赠比例</span>
                                          </div>
                                      </td>
                                      <td colspan="2">
                                          <div class="ivu-table-cell">
                                              <span>{{item.matching_molecule + ':' + item.matching_denominator + '赠'}}</span>
                                          </div>
                                      </td>
                                      <td colspan="6" style="padding:0">
                                        <div  v-for="(itemk, i) in item.content" :key="itemk + i +'content'">
                                          <div class="mathch-product">
                                            <div class=" width-90 head-bg" style="">购买产品</div>
                                            <div class="product-items">{{itemk.condition_type === 'category' ? '类目':'商品'}} {{itemk.condition_name}}</div>
                                            <div class="width-90 head-bg">配赠产品</div>
                                            <div class="product-items">
                                              <span>{{itemk.object_name==='product'?'商品':itemk.object_name==='category'?'类目':itemk.object_name}}</span>
                                              <span>{{itemk.name}}</span>
                                            </div>
                                          </div>
                                        </div>
                                      </td>
                                  </tr>
                              </tbody>
                          </table>
                        </div>
                    </div>
                </div>
                <div class="detailsList-title" v-if="policyDetailList.data.reductionArr && policyDetailList.data.reductionArr.length>0">满减设置</div>
                <div class="ivu-table-wrapper" v-if="policyDetailList.data.reductionArr && policyDetailList.data.reductionArr.length>0">
                    <div class="ivu-table ivu-table-small ivu-table-border">
                        <div class="ivu-table-body">
                            <table cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tbody v-for="(items, index) in policyDetailList.data.reductionArr" :key="index">
                                    <tr class="ivu-table-row">
                                        <td class="head-bg">
                                            <div class="ivu-table-cell">
                                                <span>满足应收金额</span>
                                            </div>
                                        </td>
                                        <td colspan="5">
                                            <div class="ivu-table-cell">
                                                <span>{{items.starting_amount}}</span>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr class="ivu-table-row" v-for="(item, i) in items.list" :key='i'>
                                        <td class="head-bg">
                                            <div class="ivu-table-cell">
                                                <span>直接优惠金额</span>
                                            </div>
                                        </td>
                                        <td colspan="2">
                                            <div class="ivu-table-cell">
                                                <span>{{item.discount_amount}}</span>
                                            </div>
                                        </td>
                                        <td class="head-bg">
                                            <div class="ivu-table-cell">
                                                <span>整单折扣</span>
                                            </div>
                                        </td>
                                        <td colspan="2">
                                            <div class="ivu-table-cell">
                                                <span>{{formatProportion(item.proportion)}}</span>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div class="detailsList-title" v-if="policyDetailList.data.giftArr && policyDetailList.data.giftArr.length>0">满赠设置</div>
                <div class="ivu-table-wrapper" v-if="policyDetailList.data.giftArr && policyDetailList.data.giftArr.length>0">
                    <div class="ivu-table ivu-table-small ivu-table-border">
                        <div class="ivu-table-body">
                            <table cellspacing="0" cellpadding="0" border="0" width="100%">
                                <tbody v-for="(items, index) in policyDetailList.data.giftArr" :key="index">
                                    <tr class="ivu-table-row">
                                        <td class="head-bg">
                                            <div class="ivu-table-cell">
                                                <span>满足应收金额</span>
                                            </div>
                                        </td>
                                        <!-- <td colspan="5"> -->
                                        <td colspan="8">
                                            <div class="ivu-table-cell">
                                                <span>{{items.starting_amount}}</span>
                                            </div>
                                        </td>
                                    </tr>
                                    <tr class="ivu-table-row" v-for="(item, i) in items.list" :key='i'>
                                        <td class="head-bg">
                                            <div class="ivu-table-cell">
                                                <span>类型</span>
                                            </div>
                                        </td>
                                        <td colspan="2">
                                            <div class="ivu-table-cell">
                                                <span>{{item.object_name==='product'?'商品':item.object_name==='category'?'类目':item.object_name}}</span>
                                            </div>
                                        </td>
                                        <td class="head-bg">
                                            <div class="ivu-table-cell">
                                                <span>赠品</span>
                                            </div>
                                        </td>
                                        <td colspan="2">
                                            <div class="ivu-table-cell">
                                                <span>{{item.name}}</span>
                                            </div>
                                        </td>
                                        <td class="head-bg">
                                            <div class="ivu-table-cell">
                                                <span>赠送数量</span>
                                            </div>
                                        </td>
                                        <td colspan="2">
                                            <div class="ivu-table-cell">
                                                <span>{{item.number}}</span>
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <Spin fix v-if="agreementDetailLoading"></Spin>
            <div slot="footer">
                <Button type="primary" @click="policyDetailList.modal=false">知道了</Button>
            </div>
        </Modal>
        <!-- 适用商品的详情 -->
        <Modal v-model="regularProductInfo" title="适用商品明细" width='800' :closable="false">
          
        <Table :columns="apply.column" :data="apply.data" border ></Table>
        </Modal>
    </div>
</template>
<script>
export default {
    props: {
        id: {
            type: Number,
            default: 0
        }
    },
    data () {
        return {
            apply: {
              column: [
                { type: 'index', title: '序号', width: 65, align: 'center' },
                { key: 'product_name', title: '商品名称', minWidth: 200, align: 'center' },
                { key: 'policy_price', title: '政策价格', minWidth: 200, align: 'center' },
                { key: 'min_quantity', title: '起订量', minWidth: 100, align: 'center' },
                { key: 'is_required', title: '必选', minWidth: 100, align: 'center' , 
                    render: (h, params) => {
                      return h('div',params.row.is_required === '1' ? [h('Icon',{
                        props:{
                          type:'md-checkmark'
                        },
                        style:{
                          padding:'4px',
                          color:'#45cf2c',
                          fontSize:'18px',
                          fontWeight:700
                        }
                        })] : [h('Icon',{
                          props:{
                            type:'md-close'
                          },
                          style:{
                            padding:'4px',
                            color:'#ff5566',
                            fontSize:'18px',
                            fontWeight:700
                          }
                      })])
                    } 
                },
              ],
            },
            //s适用商品详情
            regularProductInfo: false,
            // 合同政策
            isShowAgreementDetail: false,
            agreementDetailLoading: false,
            policyDetailList: {
                modal: false,
                data: {
                    baseDiscount: [],
                    categoryDiscount: [],
                    productDiscount: [],
                    backPointDiscount: [],
                    giftDiscount: [],
                    regularProductInfo: []
                }
            }
        }
    },
    methods: {
        // 转换时间格式
        formatDate (time) {
            return this.$format(time, 'yyyy-MM-dd hh:mm');
        },
        //适用商品查看详情
        seeRegularProductInfo(id,cateId){
          this.$api.getCategoryList({id: id,categoryId:cateId}).then(res => {
              if(res){
                this.regularProductInfo = true
                let { data } = res
                this.apply.data = data
              }
            })
        },
        formatActivity(prevArr, type) {
                let result = [];
                if(type == 'matching') {
                } else {
                    let arr = prevArr.sort(function (a, b) { return a.starting_amount - b.starting_amount; });
                    arr.forEach((item) => {
                        let findResult = result.find(resultItem => resultItem.starting_amount === item.starting_amount);
                        if (findResult) {
                            findResult.list.push(item);
                        } else {
                            result.push({ starting_amount: item.starting_amount, list: [item] });
                        }
                    });
                }
                return result
        },
        // 折扣比例转化
        formatProportion (num) {
            if(num!=''){
                return (num * 100).toFixed(2) + '%';
            } else {
                return num
            }
        },
        // 获取合同政策
        getAgreeDetail (id) {
            if(!!id){
                this.policyDetailList.modal = true
                this.agreementDetailLoading = true;
                // this.$api.getContractPoliceDetail(id)
                this.$api.getContractPoliceDetailv2(id)
                .then(res => {
                    if (res.code === 0) {
                        this.isShowAgreementDetail = true
                        res.data.giftArr = this.formatActivity(res.data.giftDiscount, 'gift')
                        res.data.repurchaseArr = this.formatActivity(res.data.repurchaseDiscount, 'repurchase')
                        res.data.matchingArr = res.data.matchingDiscount

                        res.data.reductionArr = this.formatActivity(res.data.reductionDiscount, 'reduction')
                        this.policyDetailList.data = res.data;
                    }
                }).finally(() => {
                    this.agreementDetailLoading = false;
                })
            } else {
                this.$Message.warning('请先选择合同政策！')
            }
        }
    }
}
</script>
<style lang="less">
.width-90{
  width: 90px;
  height: 40px;
  line-height: 40px;
  border-right: 1px solid #e8eaec;
  border-top: 1px solid #e8eaec;
}
.detailsList-title {
    margin: 20px auto 10px;
}
.policyDetailList-wrap {
    padding: 10px 20px;
    height: 500px;
    overflow-y: scroll;
}
.policy-detail{
    cursor: pointer;
    color: #5cadff;
}
.mathch-product{
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
.product-items{
  flex: 1;
  height: 40px;
  line-height: 40px;
  border-right: 1px solid #e8eaec;
  border-top: 1px solid #e8eaec;
}
</style>