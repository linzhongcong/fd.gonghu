<template>
    <div>
        <Card>
            <div slot="title" style="text-align: right">
                <Button type="primary" @click="goBack()">返回</Button>
            </div>
            <div>
                <Card>
                    <div slot="title"><p>基础信息</p></div>
                    <div>
                        <Form>
                            <Row>
                                <Col :md="8">
                                    <FormItem label="政策名称：">
                                        {{ detailData.policy_name }}
                                    </FormItem>
                                </Col>
                                <Col :md="8">
                                    <FormItem label="启用：">
                                        {{ detailData.is_open === '0' ? '否' : '是' }}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col :md="8">
                                    <FormItem label="创建人：">
                                        {{ detailData.created_by }}
                                    </FormItem>
                                </Col>
                                <Col :md="8">
                                    <FormItem label="创建时间：">
                                        {{ formatDate(detailData.created_at) }}
                                    </FormItem>
                                </Col>
                            </Row>
                            <Row>
                                <Col :md="8">
                                    <FormItem label="审核人：">
                                        {{ detailData.reviewer }}
                                    </FormItem>
                                </Col>
                                <Col :md="8">
                                    <FormItem label="审核时间：">
                                        {{ formatDate(detailData.audit_at) }}
                                    </FormItem>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                </Card>
                <!-- 基础折扣设置 -->
                <Card v-if="detailData.baseDiscount&&detailData.baseDiscount.length>0">
                    <div slot="title"><p>基础折扣设置</p></div>
                    <div>
                        <Form>
                            <Row v-for="(item, index) in detailData.baseDiscount" :key="'base' + index">
                                <Col :md="8">
                                    <FormItem label="梯度折扣：">
                                        {{ formatProportion(item.proportion) }}
                                    </FormItem>
                                </Col>
                                <Col :md="8">
                                    <FormItem label="应收金额：">
                                        {{ item.starting_amount }}
                                    </FormItem>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                </Card>
                <!-- 品类折扣设置 -->
                <Card v-if="detailData.categoryDiscount&&detailData.categoryDiscount.length>0">
                    <div slot="title"><p>品类折扣设置</p></div>
                    <div>
                        <Form>
                            <Row v-for="(item, index) in detailData.categoryDiscount" :key="'category' + index">
                                <Col :md="8">
                                    <FormItem label="折扣：">
                                        {{ formatProportion(item.proportion) }}
                                    </FormItem>
                                </Col>
                                <Col :md="8">
                                    <FormItem label="选择品类：">
                                        {{ item.name }}
                                    </FormItem>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                </Card>
                <!-- 产品折扣设置 -->
                <Card v-if="detailData.productDiscount&&detailData.productDiscount.length>0">
                    <div slot="title"><p>单品折扣设置</p></div>
                    <div>
                        <Form>
                            <Row v-for="(item, index) in detailData.productDiscount" :key="'product' + index">
                                <Col :md="8">
                                    <FormItem label="折扣：">
                                        {{ formatProportion(item.proportion) }}
                                    </FormItem>
                                </Col>
                                <Col :md="8">
                                    <FormItem label="选择产品：">
                                        {{ item.name }}
                                    </FormItem>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                </Card>
                <!-- 返点设置 -->
                <Card v-if="detailData.backPointDiscount&&detailData.backPointDiscount.length>0">
                    <div slot="title"><p>返点设置</p></div>
                    <div>
                        <Form>
                            <Row v-for="(item, index) in detailData.backPointDiscount" :key="'backPoint' + index">
                                <Col :md="8">
                                    <FormItem label="返点比例：">
                                        {{ formatProportion(item.proportion) }}
                                    </FormItem>
                                </Col>
                                <Col :md="8">
                                    <FormItem label="起订金额：">
                                        {{ item.starting_amount }}
                                    </FormItem>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                </Card>
                <!-- 换购设置 -->
                <Card v-if="detailData.repurchaseArr&&detailData.repurchaseArr.length>0">
                    <div slot="title"><p>换购设置</p></div>
                    <div>
                        <Form>
                            <Row v-for="(items, index) in detailData.repurchaseArr" :key="'repurchase' + index">
                                <Col :md="8">
                                    <FormItem label="满足应收金额：">
                                        {{ items.starting_amount }}
                                    </FormItem>
                                </Col>
                                <Col :md="16">
                                    <Row v-for="(item, i) in items.list" :key="'repurchaseList' + i">
                                        <Col :md="12">
                                            <FormItem label="换购产品：">
                                                {{ item.name }}
                                            </FormItem>
                                        </Col>
                                        <Col :md="12">
                                            <FormItem label="换购折扣：">
                                                {{ formatProportion(item.proportion) }}
                                            </FormItem>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                </Card>
                <!-- 配赠设置 -->
                <Card v-if="detailData.matchingArr&&detailData.matchingArr.length>0">
                    <div slot="title"><p>配赠设置</p></div>
                    <div>
                        <Form>
                            <Row v-for="(items, index) in detailData.matchingArr" :key="'matching' + index">
                                <Col :md="8">
                                    <FormItem label="配赠比例：">
                                        {{ items.matching_molecule + ':' + items.matching_denominator + '赠' }}
                                    </FormItem>
                                </Col>
                                <Col :md="16">
                                    <Row v-for="(item, i) in items.list" :key="'matchingList' + i">
                                        <Col :md="12">
                                            <FormItem label="配赠商品：">
                                                {{ item.name }}
                                            </FormItem>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                </Card>
                <!-- 满减设置 -->
                <Card v-if="detailData.reductionArr&&detailData.reductionArr.length>0">
                    <div slot="title"><p>满减设置</p></div>
                    <div>
                        <Form>
                            <Row v-for="(items, index) in detailData.reductionArr" :key="'reduction' + index">
                                <Col :md="8">
                                    <FormItem label="满足应收金额：">
                                        {{ items.starting_amount }}
                                    </FormItem>
                                </Col>
                                <Col :md="16">
                                    <Row v-for="(item, i) in items.list" :key="'reductionList' + i">
                                        <Col :md="12">
                                            <FormItem label="直接优惠金额：">
                                                {{ item.discount_amount }}
                                            </FormItem>
                                        </Col>
                                        <Col :md="12">
                                            <FormItem label="整单折扣：">
                                                {{ formatProportion(item.proportion) }}
                                            </FormItem>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                </Card>
                <!-- 满赠设置 -->
                <Card v-if="detailData.giftArr&&detailData.giftArr.length>0">
                    <div slot="title"><p>满赠设置</p></div>
                    <div>
                        <Form>
                            <Row v-for="(items, index) in detailData.giftArr" :key="'gift' + index">
                                <Col :md="8">
                                    <FormItem label="满足应收金额：">
                                        {{ items.starting_amount }}
                                    </FormItem>
                                </Col>
                                <Col :md="16">
                                    <Row v-for="(item, i) in items.list" :key="'giftList' + i">
                                        <Col :md="12">
                                            <FormItem label="赠品：">
                                                {{ item.name }}
                                            </FormItem>
                                        </Col>
                                        <Col :md="12">
                                            <FormItem label="赠送数量：">
                                                {{ item.number }}
                                            </FormItem>
                                        </Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Form>
                    </div>
                </Card>
            </div>
        </Card>
    </div>
</template>
<script>
export default {
    data () {
        return {
            detailData: {}
        }
    },
    methods: {
        // 时间转化
        formatDate (time) {
            return this.$format(time, 'yyyy-MM-dd hh:mm');
        },
        // 折扣比例转化
        formatProportion (num) {
            if(num!=''){
                return (num * 100).toFixed(2) + '%';
            } else {
                return num
            }
        },
        formatActivity(prevArr, type) {
                let result = [];
                if(type == 'matching') {
                    let arr = prevArr.sort(function (a, b) { return a.matching_molecule - b.matching_molecule; });
                    arr.forEach((item) => {
                        let findResult = result.find(resultItem => (resultItem.matching_molecule + ',' + resultItem.matching_denominator) === (item.matching_molecule + ',' + item.matching_denominator));
                        if (findResult) {
                            findResult.list.push(item);
                        } else {
                            result.push({ matching_molecule: +item.matching_molecule, matching_denominator: +item.matching_denominator, list: [item] });
                        }
                    });
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
        goBack() {
            this.$router.go(-1)
        }
    },
    mounted() {
        let id = this.$route.query.id
        this.$api.getContractPoliceDetail(id).then(res => {
            if (res.code === 0) {
                res.data.giftArr = this.formatActivity(res.data.giftDiscount, 'gift')
                res.data.repurchaseArr = this.formatActivity(res.data.repurchaseDiscount, 'repurchase')
                res.data.matchingArr = this.formatActivity(res.data.matchingDiscount, 'matching')
                res.data.reductionArr = this.formatActivity(res.data.reductionDiscount, 'reduction')
                this.detailData = res.data;
            }
        });
    }
}
</script>