<template>
  <div>
    <Form ref="formData" :model="formData" :rules="formRules" label-position="left">
      <Card>
        <Row slot="title">
          基础信息
          <Button type="success" style="float:right;" @click="addContractPolice" :loading="createLoading">提交</Button>
          <Button type="warning" style="float:right;margin-right:10px;" @click="openDraft">保存为草稿</Button>
        </Row>
        <Row>
          <Col span="5">
            <FormItem label="政策名称:" prop="policy_name" :rules="Rules.string">
              <Input placeholder="请输入" v-model="formData.policy_name" clearable style="width: 200px" />
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem label="政策类型:" prop="policy_type" :rules="Rules.string">
              <RadioGroup v-model="formData.policy_type" @on-change="onSwitch">
                <Radio label="no">
                  <span>非活动</span>
                </Radio>
                <Radio label="yes">
                  <span>活动</span>
                </Radio>
              </RadioGroup>
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem label="政策有效期:" prop="policy_validity" :rules="Rules.string">
              <RadioGroup v-model="formData.policy_validity" @on-change="onValty">
                <Radio label="no" :disabled="formData.policy_type === 'yes'">
                  <span>无限期</span>
                </Radio>
                <Radio label="yes">
                  <span>有限期</span>
                </Radio>
              </RadioGroup>
            </FormItem>
          </Col>
          <Col span="4">
            <FormItem>
              <DatePicker
                v-model="formData.deadlineAt"
                type="date"
                placeholder="请输入截至日期"
                style="width: 200px"
                @on-change="getDeadline"
                :disabled="formData.policy_validity==='no'"
              ></DatePicker>
            </FormItem>
          </Col>
        </Row>
      </Card>
      </Form>
      <Form ref="shopFrom" :model="formData" :rules="formRules" label-position="left">
      <!-- 适用商品 -->
      <Card>
        <p slot="title" class="activity">适用商品</p>
        <Row>
          <Col>
            <FormItem label="最低商品种类数:" label-position="left">
              <Input style="width:200px" v-model="formData.react_product_number"></Input>
            </FormItem>
          </Col>
          <Col span="5">
            <FormItem label="商品类目:" label-position="left">
              <Select
                v-model="searchApply.category_id"
                filterable
                remote
                @on-query-change="applyqueryCategoryDebonce($event)"
                @on-change="selectCategoryApply($event)"
                label-in-value
                clearable
                :loading="categoryLoading"
                placeholder="请输入"
                style="width: 200px;"
              >
                <Option
                  v-for="(option,index) in apply.applyCategoryList"
                  :key="'user' + index+option.id"
                  :value="option.id"
                  :label="option.name"
                ></Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="9">
            <FormItem label="商品名称:" label-position="left">
              <Input style="width:200px" v-model="searchApply.product_name" clearable></Input>
              <Button type="primary" @click="searchApplyData">搜索</Button>
            </FormItem>
          </Col>
          <Col span="10" style="text-align:right;">
            <Button type="primary" @click="activeShop('add')">添加</Button>
            <Button type="warning" @click="activeShop('edit')">修改</Button>
            <Button type="error" @click="activeShop('del')">删除</Button>
          </Col>
        </Row>
        <Row>
          <Table :columns="apply.column" :data="apply.data" border @on-selection-change="handleSelectOut" @on-select-all-cancel='cancelAll'>
          </Table>
        </Row>
        <Row  style="margin-top:5px;text-align:right">
            <Page :total="pageProps.totalCount" :current="pageProps.page" 
                    show-elevator show-sizer
                    show-total
                    :page-size="pageProps.perPage"
                    @on-change="changePage"
                    @on-page-size-change="changePageSize"></Page>
        </Row>
      </Card>
      <!-- 适用商品-end -->
      <Card>
        <Row slot="title">
          基础折扣
        </Row>
        <Row v-for="(item, index) in formData.base" :key="'discount' + index">
          <Col span="6">
            <FormItem label="应收金额:" :prop="'base.' + index + '.starting_amount'" :rules="Rules.number">
              <Input placeholder="请输入" v-model="formData.base[index].starting_amount" clearable style="width: 200px" number />
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="折扣:" :prop="'base.' + index + '.proportion'" :rules="[Rules.string, Rules.per]">
              <Input placeholder="请输入" v-model="formData.base[index].proportion" clearable style="width: 200px" />
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="货值:">
              <Input v-model="formData.base[index].product_amount" :value="goodsValue(index)" style="width: 200px" readonly />
              <Button :icon="index === 0 ? 'md-add' : 'md-remove'" @click="discountClick(index)"></Button>
            </FormItem>
          </Col>
          <Col span="6">
            <Button type="primary" @click="resetClick(index, 'discount')">重 置</Button>
          </Col>
        </Row>
      </Card>
      <Card>
        <Row slot="title">
          品类折扣
        </Row>
        <Row v-for="(item, index) in formData.category" :key="'category' + index">
          <Col span="6">
            <FormItem label="选择品类:" :prop="'category.' + index + '.id'" :rules="Rules.string">
              <Select
                :label="formData.category[index].name"
                v-model="formData.category[index].id"
                filterable
                remote
                @on-query-change="queryCategoryDebonce($event, index)"
                @on-change="selectCategory($event, index)"
                label-in-value
                clearable
                :loading="categoryLoading"
                placeholder="请输入"
                style="width: 200px;"
              >
                <Option
                  v-for="(option,index) in categoryLists[index]"
                  :key="'user' +index+ option.id"
                  :value="option.id"
                  :label="option.name"
                ></Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="折扣:" :prop="'category.' + index + '.proportion'" :rules="[Rules.string, Rules.per]">
              <Input placeholder="请输入" v-model="formData.category[index].proportion" clearable style="width: 200px" />
            </FormItem>
          </Col>
          <Col span="1">
            <FormItem :label-width="0">
              <Button :icon="index === 0 ? 'md-add' : 'md-remove'" @click="categoryClick(index)"></Button>
            </FormItem>
          </Col>
          <Col span="3">
            <Button type="primary" @click="resetClick(index, 'category')">重 置</Button>
          </Col>
        </Row>
      </Card>
      <Card>
        <Row slot="title">
          单品折扣
        </Row>
        <Row v-for="(item, index) in formData.product" :key="'single' + index">
          <Col span="6">
            <FormItem label="选择产品:" :rules="Rules.string" :prop="'product.' + index + '.id'">
              <Select
                :label="formData.product[index].name"
                v-model="formData.product[index].id"
                filterable
                clearable
                remote
                @on-query-change="queryProductDebonce($event, index)"
                @on-change="selectProduct($event, index)"
                label-in-value
                :loading="productLoading"
                placeholder="请输入"
                style="width: 200px;"
              >
                <Option
                  v-for="(option,index) in productLists[index]"
                  :key="'user' +index+ option.id"
                  :value="option.id"
                  :label="option.name"
                ></Option>
              </Select>
            </FormItem>
          </Col>
          <Col span="6">
            <!-- 折扣/单价 -->
            <Col :span="6">
              <Select v-model="formData.product[index].object_name" placeholder="折扣" style="width:100px" >
                <Option v-for="item in object_name" :value="item.value" :key="item.value">{{ item.label }}</Option>
              </Select>
            </Col>
            <Col :span="12">
              <FormItem
                v-if="formData.product[index].object_name === 'discount'"
                label=""
                :label-width="0"
                :prop="'product.' + index + '.proportion'"
                :rules="formData.product[index].object_name === 'discount' ? [Rules.string, Rules.per]: [Rules.string] "
              >
                <Input placeholder="请输入"  v-model=" formData.product[index].proportion" clearable style="width: 200px" />
              </FormItem>
              <FormItem
              v-else
                label=""
                :label-width="0"
                :prop="'product.' + index + '.direct_price'"
                :rules="formData.product[index].object_name === 'discount' ? [Rules.string, Rules.per]: [Rules.string] "
              >
                <Input placeholder="请输入"  v-model="formData.product[index].direct_price" clearable style="width: 200px" />
              </FormItem>
            </Col>
          </Col>
          <Col span="1">
            <FormItem :label-width="0">
              <Button :icon="index === 0 ? 'md-add' : 'md-remove'" @click="singleClick(index)"></Button>
            </FormItem>
          </Col>
          <Col span="3">
            <Button type="primary" @click="resetClick(index, 'product')">重 置</Button>
          </Col>
        </Row>
      </Card>
      <Card>
        <Row slot="title">
          返点设置
        </Row>
        <Row v-for="(item, index) in formData.back_point" :key="'returnPoint' + index">
          <Col span="6">
            <FormItem label="返点应收金额:" :prop="'back_point.' + index + '.starting_amount'" :rules="Rules.string">
              <Input placeholder="请输入" v-model="item.starting_amount" clearable style="width: 200px" />
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="返点比例:" :prop="'back_point.' + index + '.proportion'" :rules="[Rules.string, Rules.perType]">
              <Input placeholder="请输入" v-model="item.proportion" clearable style="width: 200px" />
            </FormItem>
          </Col>
          <Col span="1">
            <FormItem :label-width="0">
              <Button :icon="index === 0 ? 'md-add' : 'md-remove'" @click="returnPointClick(index)"></Button>
            </FormItem>
          </Col>
          <Col span="3">
            <Button type="primary" @click="resetClick(index, 'back_point')">重 置</Button>
          </Col>
        </Row>
      </Card>
    </Form>
    <Form ref="policFrom" :model="formData" :rules="formRules" label-position="left">
      <!-- 满赠活动 -->
      <div class="activity">活动设置</div>
      <Card>
        <Row slot="title">
          满赠活动
        </Row>
        <Row v-for="(item, index) in formData.activity" :key="'activity' + index">
          <Col span="6">
            <FormItem label="满赠应收金额:" :prop="'activity.' + index + '.starting_amount'" :rules="Rules.string">
              <Input placeholder="请输入" v-model="formData.activity[index].starting_amount" clearable style="width: 180px" />
              <Button :icon="index === 0 ? 'md-add' : 'md-remove'" @click="activityFirstClick(index, 'activity')"></Button>
            </FormItem>
          </Col>
          <Col span="18">
            <Row v-for="(item, i) in item.content" :key="'activityC' + i">
              <Col span="11">
                <FormItem label="选择赠品:" :prop="'activity.' + index + '.content.' + i + '.id'" :rules="Rules.string">
                  <!-- 新增类目选择 -->
                  <Select v-model="formData.activity[index].content[i].object_name" placeholder="类目" style="width:80px">
                    <Option v-for="item in categoryList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                  </Select>
                  <!-- 新增类目选择end -->
                  <Select
                    :label="formData.activity[index].content[i].name"
                    v-model="formData.activity[index].content[i].id"
                    filterable
                    clearable
                    remote
                    @on-query-change="
                      (event) => {
                        queryGiftDebonce(event, 'activity', index, i, void 0, formData.activity[index].content[i].object_name)
                      }
                    "
                    @on-change="
                      (event) => {
                        selectGift(event, 'activity', index, i)
                      }
                    "
                    label-in-value
                    :loading="productLoading"
                    placeholder="请输入"
                    style="width: 160px;"
                  >
                    <Option
                      v-for="(option,index) in giftLists[index][i]"
                      :key="'user' +index + i+ option.id"
                      :value="option.id"
                      :label="option.name"
                    ></Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span="10">
                <FormItem label="数量:" :prop="'activity.' + index + '.content.' + i + '.number'" :rules="Rules.string">
                  <Input
                    placeholder="请输入"
                    v-model="formData.activity[index].content[i].number"
                    clearable
                    style="width: 200px"
                  />
                  <Button :icon="i === 0 ? 'md-add' : 'md-remove'" @click="activitySecondClick(index, i, 'activity')"></Button>
                </FormItem>
              </Col>
              <Col span="3">
                <Button type="primary" @click="resetClick(index, 'activityC', i)">重 置</Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>
      <!-- 换购活动 -->
      <Card>
        <Row slot="title">
          换购活动
        </Row>
        <Row v-for="(items, index) in formData.exchange" :key="'exchange' + index">
          <Col span="6">
            <FormItem label="换购应收金额:" :prop="'exchange.' + index + '.starting_amount'" :rules="Rules.string">
              <Input placeholder="请输入" v-model="formData.exchange[index].starting_amount" clearable style="width: 180px" />
              <Button :icon="index === 0 ? 'md-add' : 'md-remove'" @click="activityFirstClick(index, 'exchange')"></Button>
            </FormItem>
          </Col>
          <Col span="18">
            <Row v-for="(item, i) in items.content" :key="'exchangeC' + i">
              <Col span="11">
                <FormItem
                  label="选择可换购商品:"
                  :prop="'exchange.' + index + '.content.' + i + '.id'"
                  :rules="Rules.string"
                  :label-width="120"
                >
                  <!-- 新增类目选择 -->
                  <Select v-model="formData.exchange[index].content[i].object_name" placeholder="类目" style="width:80px">
                    <Option v-for="item in categoryList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                  </Select>
                  <!-- 新增类目选择end -->
                  <Select
                    :label="formData.exchange[index].content[i].name"
                    v-model="formData.exchange[index].content[i].id"
                    filterable
                    remote
                    clearable
                    @on-query-change="
                      (event) => {
                        queryGiftDebonce(event, 'exchange', index, i, void 0, formData.exchange[index].content[i].object_name)
                      }
                    "
                    @on-change="
                      (event) => {
                        selectGift(event, 'exchange', index, i)
                      }
                    "
                    label-in-value
                    :loading="productLoading"
                    placeholder="请输入"
                    style="width: 160px;"
                  >
                    <Option
                      v-for="option in exchangeLists[index][i]"
                      :key="'exchange' + option.id"
                      :value="option.id"
                      :label="option.name"
                    ></Option>
                  </Select>
                </FormItem>
              </Col>
              <Col span="10">
                <FormItem
                  label="换购折扣:"
                  :prop="'exchange.' + index + '.content.' + i + '.proportion'"
                  :rules="[Rules.string, Rules.per]"
                >
                  <Input
                    placeholder="请输入"
                    v-model="formData.exchange[index].content[i].proportion"
                    clearable
                    style="width: 200px"
                  />
                  <Button :icon="i === 0 ? 'md-add' : 'md-remove'" @click="activitySecondClick(index, i, 'exchange')"></Button>
                </FormItem>
              </Col>
              <Col span="3">
                <Button type="primary" @click="resetClick(index, 'exchangeC', i)">重 置</Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>
      <!-- 配赠活动 -->
      <Card>
        <Row slot="title">
          配赠活动
        </Row>
        <Row v-for="(value, k) in formData.matching" :key="'m' + k">
          <Col span="6">
            <FormItem label="配赠应收金额:" :prop="'matching.' + k + '.starting_amount'" :rules="Rules.string">
              <Input placeholder="请输入" v-model="value.starting_amount" clearable style="max-width: 180px" />
              <Button :icon="k === 0 ? 'md-add' : 'md-remove'" @click="activityFirstClick(k, 'matching')"></Button>
            </FormItem>
          </Col>
          <Col span="18">
            <Row v-for="(itemA, index) in value.present" :key="'present' + index">
              <Col span="9">
                <FormItem label="配赠比例：">
                  <InputNumber :min="1" v-model="itemA.matching_molecule"></InputNumber>
                  <span style="padding: 0 3px">比</span>
                  <InputNumber :min="1" v-model="itemA.matching_denominator"></InputNumber>
                  <span style="padding: 0 10px 0 3px">赠</span>
                  <Button :icon="index === 0 ? 'md-add' : 'md-remove'" @click="activityFirstClick(index, 'present', k)"></Button>
                </FormItem>
              </Col>
              <Col span="24" class="transform-33">
                <Row v-for="(itemB, i) in itemA.content" :key="'presentC' + i">
                  <Col span="8">
                    <FormItem
                      label="购买商品:"
                      :prop="'matching.' + k + '.present.' + index + '.content.' + i + '.condition_id'"
                      :rules="Rules.string"
                    >
                      <Select v-model="itemB.condition_type" placeholder="类目" style="max-width:80px">
                        <Option v-for="itemCate in categoryListCondition" :value="itemCate.value" :key="itemCate.value">{{ itemCate.label }}</Option>
                      </Select>
                      <Select
                        :label="itemB.condition_name"
                        v-model="itemB.condition_id "
                        filterable
                        clearable
                        remote
                        @on-query-change="
                          (event) => {
                            queryGiftDebonce(event, 'presentC', index, i, k, itemB.condition_type)
                          }
                        "
                        @on-change="
                          (event) => {
                            selectGift(event, 'presentC', index, i, k)
                          }
                        "
                        label-in-value
                        :loading="productLoading"
                        placeholder="请输入"
                        style="max-width: 200px;"
                      >
                        <Option
                          v-for="(option,indexC) in presentListsPro[k][index][i]"
                          :key="'user'+ indexC + i+ option.condition_id"
                          :value="option.condition_id"
                          :label="option.condition_name"
                        ></Option>
                      </Select>
                    </FormItem>
                  </Col>
                  <Col span="10" >
                    <FormItem
                      label="可配赠商品:"
                      :prop="'matching.' + k + '.present.' + index + '.content.' + i + '.id'"
                      :rules="Rules.string"
                    >
                      <Select v-model="value.present[index].content[i].object_name" placeholder="类目" style="max-width:80px">
                        <Option v-for="item in categoryList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                      </Select>
                      <Select
                        :label="value.present[index].content[i].name"
                        v-model="value.present[index].content[i].object_id"
                        filterable
                        remote
                        clearable
                        @on-query-change="
                          (event) => {
                            queryGiftDebonce(event, 'present', index, i, k, value.present[index].content[i].object_name)
                          }
                        "
                        @on-change="
                          (event) => {
                            selectGift(event, 'present', index, i, k)
                          }
                        "
                        label-in-value
                        :loading="productLoading"
                        placeholder="请输入"
                        style="max-width: 200px;"
                      >
                        <Option
                          v-for="(option,index) in presentLists[k][index][i]"
                          :key="'user' + index +option.id"
                          :value="option.id"
                          :label="option.name"
                        ></Option>
                      </Select>
                      <Button
                        :icon="i === 0 ? 'md-add' : 'md-remove'"
                        @click="activitySecondClick(index, i, 'present', k)"
                      ></Button>
                    </FormItem>
                  </Col>
                  <Col span="2">
                    <Button type="primary" @click="resetClick(index, 'presentC', i, item, k)">重 置</Button>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
        </Row>
      </Card>
      <!-- 满减活动 -->
      <!-- v-if="this.formData.policyPass == 'yes'" -->
      <Card>
        <Row slot="title">
          满减活动
        </Row>
        <Row v-for="(item, index) in formData.moneyOff" :key="'moneyOff' + index">
          <Col span="6">
            <FormItem label="满减应收金额:" :prop="'moneyOff.' + index + '.starting_amount'" :rules="Rules.string">
              <Input placeholder="请输入" v-model="formData.moneyOff[index].starting_amount" clearable style="width: 180px" />
            </FormItem>
          </Col>
          <Col span="7">
            <FormItem label="直接优惠金额：" :prop="'moneyOff.' + index + '.discount_amount'" :rules="Rules.string">
              <Input placeholder="请输入" v-model="formData.moneyOff[index].discount_amount" clearable style="width: 200px" />
            </FormItem>
          </Col>
          <Col span="6">
            <FormItem label="整单折扣：" :prop="'moneyOff.' + index + '.proportion'" :rules="[Rules.string, Rules.per]">
              <Input placeholder="可以为0" v-model="formData.moneyOff[index].proportion" clearable style="width: 200px" />
            </FormItem>
          </Col>
          <Col span="1">
            <FormItem :label-width="0">
              <Button :icon="index === 0 ? 'md-add' : 'md-remove'" @click="activityFirstClick(index, 'moneyOff')"></Button>
            </FormItem>
          </Col>
          <Col span="3">
            <Button type="primary" @click="resetClick(index, 'moneyOff')">重 置</Button>
          </Col>
        </Row>
      </Card>
    </Form>
    <!-- 草稿 -->
    <Modal v-model="draftModal" width="360">
      <p slot="header" style="color:#f60;text-align:center">
        <Icon type="ios-information-circle"></Icon>
        <span>是否存为草稿</span>
      </p>
      <div style="text-align:center">
        <p>存为草稿将在政策草稿列表生成一条数据</p>
      </div>
      <div slot="footer">
        <Button :loading="draftBtnModal" @click="keepDraft('continue')">保存并继续</Button>
        <Button :loading="draftBtnModal" @click="keepDraft('exit')">保存并退出</Button>
      </div>
    </Modal>
    <!-- 适用商品弹窗 -->
    <Modal v-model="apply.modelShow" :title="apply.modelTitle" width="70" :closable="false">
      <Select multiple filterable :loading="apply.searchLoading" @on-change='changeProduct' v-model='apply.chooseProduct' v-if="apply.type !== 'edit'">
        <Option v-for="(option) in apply.searchList" :value="option.id" :key="option.id">{{ option.name }}</Option>
      </Select>
      <div></div>
      <div class="searchTable">
        <Table :columns="apply.type === 'add' ?apply.searchColumn:apply.searchColumn2" :data="apply.searchTabData" border max-height="600"
                @on-selection-change="handleSelect" 
          >
          <template slot-scope="{ row,index }" slot="policy_price">
            <Input placeholder="政策价格" v-model="row.policy_price" @on-change="(val)=>changeTable(val,row,index,'policy_price')"></Input>
          </template>
          <template slot-scope="{ row,index }" slot="min_quantity">
            <Input placeholder="起订量" v-model="row.min_quantity" @on-change="(val)=>changeTable(val,row,index,'min_quantity')"></Input>
          </template>
          <template slot-scope="{ row,index }" slot="is_required">
            <Checkbox v-model="row.is_required" @on-change="(val)=>changeTable(val,row,index,'is_required')"></Checkbox>
          </template>
        </Table>
      </div>
      <div slot="footer" class="modal-footer">
        <Button  @click="onCancelRegularProduct" class="footer-btn">取消</Button>
        <Button  @click="submitRegularProduct" :loading='loadingBox.sureLoading' class="footer-btn">确定</Button>
      </div>
    </Modal>
    <!-- 页面loading -->
    <Spin size="large" fix v-if="spinShow"></Spin>
  </div>
</template>

<script>
export default {
  data() {
    return {
      //loading
      loadingBox:{
        sureLoading: false,
      },
      formData: {
        react_product_number:'',
        base: [{ proportion: '', starting_amount: '' }],
        category: [{ proportion: '', id: '' }],
        product: [{ proportion: '', id: '', object_name: 'price' ,direct_price:''}],
        back_point: [{ proportion: '', starting_amount: '' }],
        activity: [{ content: [{ id: '', number: '', object_name: 'category' }], starting_amount: '' }],
        exchange: [{ content: [{ id: '', proportion: '', object_name: 'category' }], starting_amount: '' }],
        matching: [
          {
            present: [
              {
                content: [{ id: '', object_name: 'category',condition_type:'category', condition_id :'',condition_name :''}],
                matching_molecule: 0,
                matching_denominator: 0,
              },
            ],
            starting_amount: null,
          },
        ],
        moneyOff: [{ proportion: '', starting_amount: '', discount_amount: '' }],
        policy_name: '',
        policy_type: '',
        policy_validity: '',
      },
      formRules: {},
      categoryLoading: false,
      productLoading: false,
      categoryLists: [
        { label: '类目', value: 'category' },
        { label: '商品', value: 'product' }
      ],
      categoryListCondition:[
        { label: '类目', value: 'category' },
        { label: '商品', value: 'product' }
      ],
      productLists: [],
      giftLists: [[[]]],
      // 类目选择:
      categoryList: [
        { label: '类目', value: 'category' },
        { label: '商品', value: 'product' },
      ],
      // 折扣选择
      object_name: [
        { label: '折扣', value: 'discount' },
        { label: '单价', value: 'price' },
      ],
      //分页
      pageProps:{
        totalCount:0, //总数
        currentPage:1, //当前页
        page:1,
        perPage:10,
      },
      exchangeLists: [[[]]],
      presentLists: [[[]]],
      presentListsPro: [[[]]],
      type: '',
      editType: '', //编辑类型  添加或草稿
      canNotAdd: true,
      draftModal: false, //草稿弹窗
      draftBtnModal: false,
      draftTurn: false, //保存草稿是否跳转
      draftId: '', //是否继续编辑草稿
      queryCategoryDebonce: this.$debonce(this.queryCategory, 500),
      //适用商品
      applyqueryCategoryDebonce: this.$debonce(this.applyqueryCategory, 500),
      queryProductDebonce: this.$debonce(this.queryProduct, 500),
      queryGiftDebonce: this.$debonce(this.queryGift, 500),
      createLoading: false,
      // 页面loading
      spinShow: false,
      // 校验规则
      Rules: {
        string: { required: true, message: '此项不能为空！', trigger: 'blur' },
        number: { required: true, message: '此项不能为空！', trigger: 'blur', type: 'number' },
        numChan: { required: true, message: '此项不能为空！', trigger: 'change', type: 'number' },
        date: { required: true, message: '此项不能为空！', trigger: 'blur', type: 'date' },
        per: {
          required: false,
          message: '请填写正确的格式（0% ~ 100%）',
          pattern: /^(100|[1-9]?\d(\.\d\d?)?)%$/,
          trigger: 'blur',
        },
        perType: {
          required: false,
          message: '请填写数字+%',
          pattern: /\d%$/,
          trigger: 'blur',
        },
      },
      
      categoryLists: [],
      // 适用商品表格
      apply: {
        column: [
          { type: 'selection', width: 60, align: 'center' },
          { type: 'index', title: '序号', width: 65, align: 'center' },
          { key: 'category_name', title: '商品类目', minWidth: 100, align: 'center' },
          { key: 'product_name', title: '商品名称', minWidth: 200, align: 'center' },
          { key: 'policy_price', title: '政策价格', minWidth: 100, align: 'center' },
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
        data: [],
        modelShow: false, // 弹窗是否显示,
        modelTitle: '选择货号', // 弹窗标题
        // 模糊搜索对应数组
        searchList: [],
        // 搜索loading
        searchLoading: false,
        searchPro: false,
        // 搜索弹窗表格数据
        searchColumn: [
          {
            type: 'selection',
            width: 60,
            align: 'center',
          },
          {
            key: 'category_name',
            title: '商品类目',
            align: 'center',
          },
          {
            key: 'product_name',
            title: '商品名称',
            align: 'center',
          },
          {
            slot: 'policy_price',
            title: '政策价格',
            align: 'center',
          },
          {
            slot: 'min_quantity',
            title: '起订量',
            align: 'center',
          },
          {
            slot: 'is_required',
            title: '必选',
            align: 'center',
          },
        ], // 搜索弹窗表格数据
        searchColumn2: [
          {
            key: 'category_name',
            title: '商品类目',
            align: 'center',
          },
          {
            key: 'product_name',
            title: '商品名称',
            align: 'center',
          },
          {
            slot: 'policy_price',
            title: '政策价格',
            align: 'center',
          },
          {
            slot: 'min_quantity',
            title: '起订量',
            align: 'center',
          },
          {
            slot: 'is_required',
            title: '必选',
            align: 'center',
          },
        ],
        // 搜索表格数据存储
        searchTabData: [],
        regularProductInfo:[],//适用商品商品选中商品
        batchNumber:'',//批次号
        policyId:'',//政策id
        chooseProductList:[],//适用商品表格选中
        chooseProduct:[],//适用商品的弹窗类目
        delProduct:[],//适用商品的弹窗类目
        type:'add', //点击的类型
        isFirst: true,//是否第一次进入
      },
      searchApply:{
        category_id:'',
        product_name:'',
      },
      renderId: 0
    }
  },
  watch:{
    'apply.modelShow': {
      deep:true,
      handler: function(newVal,oldVal){
        if(!newVal){
          this.apply.searchTabData = []
          this.apply.chooseProduct = []
          this.apply.regularProductInfo = []
          this.apply.chooseProductList = []
          this.cancelAll()
        }
      }
    }
  },
  methods: {
    // 重置当行数据
    resetClick(index, type, childIndex, sign, k) {
      if (type === 'discount') {
        this.$set(this.formData.base, index, { proportion: '', starting_amount: '' })
      } else if (type === 'category') {
        this.$set(this.formData.category, index, { proportion: '', id: '' })
        this.categoryLists = []
      } else if (type === 'product') {
        this.$set(this.formData.product, index, { proportion: '', id: '', object_name: 'price' ,direct_price:'' })
        this.productLists = []
      } else if (type === 'back_point') {
        this.$set(this.formData.back_point, index, { proportion: '', starting_amount: '' })
      } else if (type === 'activityC') {
        this.$set(this.formData.activity[index].content, childIndex, { number: '', id: '' })
        this.giftLists[index][childIndex].length = 0
      } else if (type === 'exchangeC') {
        this.$set(this.formData.exchange[index].content, childIndex, { proportion: '', id: '' })
        this.exchangeLists[index][childIndex].length = 0
      } else if (type === 'presentC') {
        //配赠
        this.$set(this.formData.matching[k].present[index].content, childIndex, { id: '', object_name: 'category', condition_type: 'category', condition_id: '', condition_name: '', name: ''})
        this.presentLists[index][childIndex].length = 0
        this.presentListsPro[index][childIndex].length = 0
      } else if (type === 'moneyOff') {
        this.$set(this.formData.moneyOff, index, { proportion: '', starting_amount: '', discount_amount: '' })
      }
    },
    // 活动切换
    onSwitch(data) {
      if (data === 'yes') {
        this.formData.policy_validity = 'yes'
      }
    },
    //适用商品的添加编辑删除事件
   async activeShop(type) {
      switch (type) {
        case 'add':
          this.apply.modelShow = true
          this.apply.type = type
          this.applyRemoteMethod()
          break
        case 'edit':
          this.apply.isFirst = false
          if(this.apply.chooseProductList.length === 0) return this.$Notice.warning({title:'提示',desc:'请选择商品'})
          //赋值
          this.apply.type = type
          let selectBox = JSON.parse(JSON.stringify(this.apply.chooseProductList))
          this.apply.searchTabData = selectBox
          await this.applyRemoteMethod()
          this.apply.chooseProduct = selectBox.map(item => {
                return item.category_id
          })
          this.apply.modelShow = true
          break
        case 'del':
          if(this.apply.chooseProductList.length === 0) return this.$Notice.warning({title:'提示',desc:'请选择商品'})
          let ids = this.apply.chooseProductList.map(item => item.id)
          this.apply.delProduct = JSON.parse(JSON.stringify(ids))
          let del = {ids}
          this.$api.nodelRegularProductList(del).then(res => {
            if(res.code == 0){
              this.apply.data = this.apply.data.filter((item,index) => {
                  return !ids.includes(item.id)
              })
              let produceData = {
                batch_number:this.apply.batchNumber ? this.apply.batchNumber :'',
                policy_id:this.apply.policyId,
              }
              this.getProductList(produceData)
            }else{
              this.apply.chooseProductList = []
              this.apply.delProduct = []
              this.$Notice.error({
                title:'提示',
                desc:'删除失败'
              })
            }
          }).catch(err => {
              this.apply.chooseProductList = []
              this.apply.delProduct = []
              this.$Notice.error({
                title:'提示',
                desc:'删除失败'
              })

          })
          break
      }
    },
    // //适用商品原价
    // changePrice(row){
    //   let data = JSON.parse(JSON.stringify(row))
    //   return data
    // },
    // 基础折扣点击事件
    discountClick(index) {
      if (index === 0) {
        // 添加
        let obj = {}
        obj.proportion = ''
        obj.starting_amount = ''

        this.formData.base.push(obj)
      } else {
        // 删除
        this.formData.base.splice(index, 1)
      }
    },
    goodsValue(index) {
      let base = this.formData.base[index]
      let isPercent = new RegExp(/^(100|[1-9]?\d(\.\d\d?)?)%$/)
      if (
        base.proportion == '' ||
        base.starting_amount == '' ||
        typeof base.starting_amount == 'string' ||
        !isPercent.test(base.proportion)
      ) {
        this.formData.base[index].product_amount = 0
      } else {
        let num = base.proportion.replace('%', '') / 100
        // 保留4位小数
        this.formData.base[index].product_amount = Number(String(base.starting_amount / num).replace(/^(.*\..{4}).*$/, '$1'))
      }
    },
    // 品类折扣点击事件
    categoryClick(index) {
      if (index === 0) {
        // 添加
        let obj = {}
        obj.proportion = ''
        obj.id = ''
        this.formData.category.push(obj)
      } else {
        // 删除
        this.formData.category.splice(index, 1)
      }
    },
    singleClick(index) {
      if (index === 0) {
        // 添加
        let obj = {}
        obj.proportion = ''
        obj.id = ''
        this.formData.product.push(obj)
      } else {
        // 删除
        this.formData.product.splice(index, 1)
      }
    },
    // 返点设置点击事件
    returnPointClick(index) {
      if (index === 0) {
        // 添加
        let obj = {}
        obj.proportion = ''
        obj.starting_amount = ''
        this.formData.back_point.push(obj)
      } else {
        // 删除
        this.formData.back_point.splice(index, 1)
      }
    },
    // 活动设置父级点击事件
    activityFirstClick(index, type, sign) {
      if (type == 'activity') {
        if (index === 0) {
          // 添加
          let obj = {
            starting_amount: '',
            content: [{ id: '', number: '' }]
          }
          this.formData.activity.push(obj)
          this.giftLists.push([[]])
        } else {
          // 删除
          this.formData.activity.splice(index, 1)
        }
      } else if (type == 'exchange') {
        if (index === 0) {
          // 添加
          let obj = {
            starting_amount: '',
            content: [{ id: '', proportion: '' }]
          }
          this.formData.exchange.push(obj)
          this.exchangeLists.push([[]])
        } else {
          // 删除
          this.formData.exchange.splice(index, 1)
        }
      } else if (type == 'present') {
        if (index === 0) {
          // 添加
          let obj = {
            matching_molecule: 0,
            matching_denominator: 0,
            content: [{ id: '', object_name: 'category',condition_type:'category', condition_id :'',condition_name :'' }]
          }
          this.presentLists[sign].push([[]])
          this.presentListsPro[sign].push([[]])
          this.formData.matching[sign].present.push(obj)
        } else {
          // 删除
          this.formData.matching[sign].present.splice(index, 1)
        }
      } else if (type == 'moneyOff') {
        if (index === 0) {
          // 添加
          let obj = { proportion: '', discount_amount: '', starting_amount: '' }
          this.formData.moneyOff.push(obj)
        } else {
          // 删除
          this.formData.moneyOff.splice(index, 1)
        }
      } 
      else if (type === 'matching') {
        //这是应收金额的
        if (index === 0) {
          // 添加
          this.presentLists.push([[]])
          this.presentListsPro.push([[]])
          this.formData.matching.push(
            {
              present: [
                {
                  content: [{ id: '', object_name: 'category',condition_type:'category', condition_id : '',condition_name : ''}],
                  matching_molecule: 0,
                  matching_denominator: 0
                },
              ],
              starting_amount: null
            })
        } 
        else {
          this.formData.matching.splice(index, 1)
        }
      }
    },
    // 活动设置子级点击事件
    activitySecondClick(parentIndex, index, type, sign) {
      if (type == 'activity') {
        if (index === 0) {
          // 添加
          let obj = {id: '', number: '', object_name: 'category' }
          this.formData.activity[parentIndex].content.push(obj)
        } else {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           
          // 删除
          this.formData.activity[parentIndex].content.splice(index, 1)
        }
      } else if (type == 'exchange') {
        if (index === 0) {
          // 添加
          let obj = {id: '', proportion: '', object_name: 'category'}
          this.formData.exchange[parentIndex].content.push(obj)
        } else {
          // 删除
          this.formData.exchange[parentIndex].content.splice(index, 1)
        }
      } else if (type == 'present') {
        if (index === 0) {
          // 添加
          let obj = {id: '', condition_type:'category', object_name: 'category', condition_id :'', condition_name :''}
          this.formData.matching[sign].present[parentIndex].content.push(obj)
        } else {
          // 删除
          this.formData.matching[sign].present[parentIndex].content.splice(index, 1)
          this.presentLists[sign][parentIndex].splice(index, 1)
          this.presentListsPro[sign][parentIndex].splice(index, 1)
        }
      }
    },
    // 获取截止日期
    getDeadline(date) {
      this.formData.deadline_at = new Date(date).getTime() / 1000
    },
    // 模糊查询品类
    queryCategory(value, index) {
      this.categoryLoading = true
      this.$api.getCategoryData({ name: value }).then((res) => {
        this.categoryLoading = false
        if (res.data.length !== 0) {
          this.categoryLists[index] = res.data
        }
      })
    },
    
    // 模糊查询品类-适用商品
    applyqueryCategory(value) {
      this.categoryLoading = true
      this.$api.getCategoryData({ name: value }).then((res) => {
        this.categoryLoading = false
        if (res.data.length !== 0) {
          this.apply.applyCategoryList = res.data
        }
      })
    },
    // 选择品类-适用商品
    selectCategoryApply(obj) {
      if (!!obj) {
        let list =  this.apply.applyCategoryList.filter((n) => {
          return obj.label === n.name && obj.value === n.id
        })
        this.searchApply.category_id = list[0].id
      }
    },
    // 选择品类
    selectCategory(obj, index) {
      if (!!obj) {
        let list = this.categoryLists[index].filter((n) => {
          return obj.label === n.name && obj.value === n.id
        })
        this.formData.category[index].id = list[0].id
      }
    },
    // 模糊查询产品
    queryProduct(value, index) {
      this.productLoading = true
      this.$api.getProductData({ name: value }).then((res) => {
        this.productLoading = false
        if (res.data.length !== 0) {
          this.productLists[index] = res.data
        }
      })
    },
    // 选择产品
    selectProduct(obj, index) {
      if (!!obj) {
        let list = this.productLists[index].filter((n) => {
          return obj.label === n.name && obj.value === n.id
        })
        this.formData.product[index].id = list[0].id
      }
    },
    // 模糊查询赠品
    queryGift(value, type, index, i, k, types) {
      this.productLoading = true
      i = +i
      index = +index
      k = +k
      if (types === 'category') {
        this.$api
          .getCategoryData({ name: value })
          .then((res) => {
            if (res.data.length !== 0) {
              if (type == 'activity') {
                this.giftLists[index][i] = res.data
              } else if (type === 'exchange') {
                this.exchangeLists[index][i] = res.data
              } else if (type === 'present') {
                this.presentLists[k][index][i] = res.data
              } else if (type === 'presentC') {
                this.presentListsPro[k][index][i] = res.data.map(item => {
                  item.condition_id = item.id
                  item.condition_name = item.name
                  return item
                })
              }
            }
          })
          .finally(() => {
            this.productLoading = false
          })
      } else {
        this.$api
          .getProductData({ name: value })
          .then((res) => {
            if (res.data.length !== 0) {
              if (type == 'activity') {
                this.giftLists[index][i] = res.data
              } else if (type === 'exchange') {
                this.exchangeLists[index][i] = res.data
              } else if (type === 'present') {
                this.presentLists[k][index][i] = res.data
              } else if (type === 'presentC') {
                this.presentListsPro[k][index][i] = res.data
                this.presentListsPro[k][index][i] = res.data.map(item => {
                  item.condition_id = item.id
                  item.condition_name = item.name
                  return item
                })
              } 
            }
          })
          .finally(() => {
            this.productLoading = false
          })
      }
    },
    // 选择赠品
    selectGift(obj, type, index, i, sign) {
      if (obj) {
        if (type == 'activity') {
          let list = this.giftLists[index][i].filter((n) => {
            return obj.label === n.name && obj.value === n.id
          })
          this.formData.activity[index].content[i].id = list[0].id
        } else if (type === 'exchange') {
          let list = this.exchangeLists[index][i].filter((n) => {
            return obj.label === n.name && obj.value === n.id
          })
          this.formData.exchange[index].content[i].id = list[0].id
        } else if (type === 'present') {
          let list = this.presentLists[sign][index][i].filter((n) => {
            return obj.label === n.name && obj.value === n.id
          })
          this.formData.matching[sign].present[index].content[i].id = list[0].id
          this.formData.matching[sign].present[index].content[i].name = list[0].name
        } else if (type === 'presentC') {
          let list = this.presentListsPro[sign][index][i].filter((n) => {
            return obj.label === n.name && obj.value === n.id
          })
          this.formData.matching[sign].present[index].content[i].condition_id  = list[0].id
          this.formData.matching[sign].present[index].content[i].condition_name  = list[0].name
        } 
      }
    },
    
    // 分页
    changePage (value) { 
      this.pageProps.page = value
      let params = {
        page: value,
        perPage: this.pageProps.perPage
      } 
      if(this.apply.batchNumber) params.batch_number = this.apply.batchNumber
      if(this.apply.policyId) params.policy_id = this.apply.policyId
      if(!params.batch_number && !params.policy_id) return this.$Notice.error({title:'提示',desc:'无商品可查'})
      if(JSON.stringify(params) == "{}")return
      this.getProductList(params)
    },

    // 切换页数
    changePageSize (value) {
      this.pageProps.perPage = value
      let params = {
        page: this.pageProps.page,
        perPage: value
      } 
      if(this.apply.batchNumber) params.batch_number = this.apply.batchNumber
      if(this.apply.policyId) params.policy_id = this.apply.policyId
      if(!params.batch_number && !params.policy_id) return this.$Notice.error({title:'提示',desc:'无商品可查'})
      if(JSON.stringify(params) == "{}")return
      this.getProductList(params)
    },
    // 提交
    addContractPolice() {
      let is = true
      this.$refs.formData.validate((valid) => {
        !valid && (is = false)
      })
      if (!is) return
      this.canNotAdd = true
      let params = JSON.parse(JSON.stringify(this.formData))
      //将数据为空的参数清除-这里仅做空字符串
      Object.keys(params).forEach(key => {
        if(params[key] === ''){
          delete params[key]
        }
      })
      if(this.apply.batchNumber)params.regularProductBatchNumber = this.apply.batchNumber
      // if(this.apply.policyId)params.policyId = this.apply.policyId
      params.full_reduction = params.moneyOff
      params.gift = []
      params.repurchase = []
      this.formatDiscount(params.full_reduction, '满减活动')
      this.formatActivity(params.activity, params.gift, '活动设置')
      this.formatActivity(params.exchange, params.repurchase, '活动设置')
      // 单独处理配赠活动
      let matching = [
        {
          present: [
            {
              content: [{ id: '', object_name: 'category',condition_type:'category', condition_id :'',condition_name :''}],
              matching_molecule: 0,
              matching_denominator: 0,
            },
          ],
          starting_amount: null,
        },
      ]
      params.deadline_at = this.formData.deadlineAt?Date.parse(this.formData.deadlineAt)/1000:''
      delete params.deadlineAt
      if (JSON.stringify(params.matching) === JSON.stringify(matching)) {
        params.matching = []
      } else {
        // 0107迭代-结构需将三维数据扁平为二维传输给后端
        let matching = []
        this.formData.matching.forEach((item, index) => {
          item.discount_info = JSON.parse(JSON.stringify(item.present))
          let arr = []
          item.discount_info.forEach((value,j) => {
            value.content.forEach((data,k) => {
              let obj = {...data}
              obj.matching_molecule = value.matching_molecule
              obj.matching_denominator = value.matching_denominator
              arr.push(obj)
            })
          })
          item.discount_info = arr
          matching.push({ starting_amount: item.starting_amount, discount_info: item.discount_info })
        })
        params.matching = matching
      }
      this.formatDiscountis(params,'基础折扣')
      this.formatDiscountis(params,'品类折扣')
      this.formatDiscountis(params,'单品折扣')
      if(params.base.length<1&&params.category.length<1&&params.product.length<1){
        return this.$Message.warning('三个折扣至少选一个！')
      }
      this.formatDiscount(params.back_point, '返点设置')
      if (!this.canNotAdd) {
        return this.canNotAdd
      }
      this.draftTurn = true
      if (this.editType == 'draft') {
        //草稿提交
        if (!params.id) {
          params.id = this.draftId
        }
        this.$api.policyDraftSubmit(params).then((res) => {
          if (res.code === 0) {
            //确认删除
            this.sureDelProduct()
            this.$Message.success(res.message)
            this.$store.commit('removeTag', this.$route.name)
            this.$router.push({ path: '/policy/policy-management' })
          } else {
            this.$Message.error(res.message)
          }
        })
        return
      }
      params.product.forEach((item) => {
        if(item.object_name === 'discount') {
          delete item.direct_price
        }else if(item.object_name === 'price') {
          delete item.proportion
        }
      })
      // 新增
      if (this.type !== 'edit') {
        this.createLoading = true
        this.$api
          .addContractPolicev2(params)
          .then((res) => {
            this.createLoading = false
            //确认删除
            this.sureDelProduct()
            if (res.code === 0) {
              this.$Message.success(res.message)
              this.$store.commit('removeTag', this.$route.name)
              this.$router.push({ path: '/policy/policy-management' })
            } else {
              this.$Message.error(res.message)
            }
          })
          .catch((err) => {
            this.createLoading = false
          })
      } else if (this.type == 'edit') {
        // 修改
        this.createLoading = true
        this.$api
          .contractPoliceEditv2(params, params.id)
          .then((res) => {
            //确认删除
            this.sureDelProduct()
            this.createLoading = false
            if (res.code === 0) {
              this.$Message.success(res.message)
              this.$store.commit('removeTag', this.$route.name)
              this.$router.push({ path: '/policy/policy-management' })
            } else {
              this.$Message.error(res.message)
            }
          })
          .catch((err) => {
            this.createLoading = false
          })
      }
    },
    // 检测基础折扣、品类折扣、单品折扣，是否为空/漏填
    formatDiscount(arr, tip) {
      let isNull = ''
      let count = 0
      arr.map((items, index) => {
        isNull = Object.values(items).every((item) => {
          return item == ''
        })
        if (isNull) {
          arr.splice(index, 1)
        } else {
          count++
        }
      })
      if (count > 0 && !!tip) {
        this.formatLack(arr, tip)
      }
    },
    formatDiscountis(params) {
      let base = [{"proportion":"","starting_amount":"","product_amount":0}]
      let category = [{"proportion":"","id":""}]
      //笨方法判断是否与原来的属性相同
      let product = [{"proportion":"","id":"","object_name":"price",'direct_price':""}] 
      let discount =  [{"proportion":"","id":"","object_name":"discount",'direct_price':""}]
      let product2 = [{"proportion":"","object_name":"price",'direct_price':""}] 
      let discount2 =  [{"proportion":"","object_name":"discount",'direct_price':""}]
      if(JSON.stringify(params.base)==JSON.stringify(base)){
        params.base = []
      }
      if(JSON.stringify(params.category)==JSON.stringify(category)){
        params.category = []
      }
      if(JSON.stringify(params.product)==JSON.stringify(product)){
        params.product = []
      }
      if(JSON.stringify(params.product)==JSON.stringify(discount)){
        params.product = []
      }
      if(JSON.stringify(params.product)==JSON.stringify(product2)){
        params.product = []
      }
      if(JSON.stringify(params.product)==JSON.stringify(discount2)){
        params.product = []
      }
    },
    // 检测基础折扣、品类折扣、单品折扣梯度/商品是否重复
    formatRepeat(arr, tip) {
      let isRepeated = []
      let checkRepeated = []
      arr.map((items) => {
        if (tip == '基础折扣' || tip == '返点设置' || tip == '满减活动') {
          isRepeated.push(items.starting_amount)
        } else if (tip == '品类折扣') {
          isRepeated.push(items.id)
        } else if (tip == '单品折扣') {
          isRepeated.push(items.id)
        }
      })
      if (isRepeated.length > 0) {
        checkRepeated = [...new Set(isRepeated)]
      }
      if (isRepeated.length != checkRepeated.length) {
        this.$Message.error(tip + '不能重复')
        this.canNotAdd = false
      }
    },
    formatLack(arr, tip) {
      // 判断是否漏填
      let arrLack = []
      let isLacked = true
      if (tip != '满减活动') {
        arr.map((items) => {
          let isLack = Object.values(items).every((item) => {
            return item != ''
          })
          arrLack.push(isLack)
        })
        isLacked = arrLack.every((items) => {
          return items == true
        })
      }
      if (!isLacked) {
        this.$Message.error(tip + '信息请填写完整')
        this.canNotAdd = false
      } else {
        this.formatRepeat(arr, tip)
      }
    },
    // 活动政策
    formatActivity(prevArr, newArr, tip) {
      let isRepeated = []
      let checkRepeated = []
      prevArr.map((items) => {
        if (tip != '配赠活动') {
          if (items.starting_amount != '') {
            isRepeated.push(items.starting_amount)
            items.content.map((item) => {
              let obj = {
                starting_amount: items.starting_amount,
                ...item,
              }
              newArr.push(obj)
            })
          }
        } else {
          if (items.matching_molecule != 0 && items.matching_molecule != 0) {
            let num = items.matching_molecule.toString() + ',' + items.matching_denominator.toString()
            isRepeated.push(num)
            items.content.map((item) => {
              if (!!item.id) {
                let obj = {
                  matching_molecule: items.matching_molecule,
                  matching_denominator: items.matching_denominator,
                  id: item.id,
                }
                newArr.push(obj)
              }
            })
          }
        }
      })
      if (isRepeated.length > 0) {
        checkRepeated = [...new Set(isRepeated)]
      }
      if (isRepeated.length != checkRepeated.length) {
        this.$Message.error(tip + '不能重复')
        this.canNotAdd = false
      }
    },
    // 是否存为草稿
    openDraft() {
      let is = true
      this.$refs.formData.validate((valid) => {
        !valid && (is = false)
      })
      if (!is) return
      if (!!this.formData.policy_name) {
        this.draftModal = true
      } else {
        this.$Message.error('请填写政策名称')
      }
    },
    // 传参数--选择是否存为草稿并继续填写/退出,无参数--被动保存：唯一条件，是否填写政策名称
    keepDraft(remark) {
      // this.formData.policy_type = this.formData.policyPass;
      // this.formData.policy_validity = this.formData.policyPass;
      let params = JSON.parse(JSON.stringify(this.formData))
      if (!!this.draftId) {
        //选择继续编辑
        this.editType = 'draft'
        params.id = this.draftId
      }
      // if (this.formData.policyPass == 'yes') {
      params.full_reduction = params.moneyOff // 满减活动
      params.gift = []
      params.repurchase = []
      params.matching = []
      params.activity.map((items) => {
        // 活动设置
        items.content.map((item) => {
          if (items.starting_amount !== '' || item.id !== '' || item.number !== '') {
            let obj = {
              starting_amount: items.starting_amount,
              ...item,
            }
            params.gift.push(obj)
          }
        })
      })
      params.exchange.map((items) => {
        // 换购活动
        items.content.map((item) => {
          if (items.starting_amount !== '' || item.id !== '' || item.proportion !== '') {
            let obj = {
              starting_amount: items.starting_amount,
              ...item,
            }
            params.repurchase.push(obj)
          }
        })
      })
      // 单独处理配赠活动
      let matching = []
      this.formData.matching.forEach((item, index) => {
        item.discount_info = JSON.parse(JSON.stringify(item.present))
        let arr = []
        item.discount_info.forEach((value) => {
          value.content.forEach((data) => {
            let obj = {}
            obj.matching_molecule = value.matching_molecule
            obj.matching_denominator = value.matching_denominator
            obj.id = data.id
            obj.object_name = data.object_name
            Object.keys(data).forEach(key => {
              obj[key] = data[key]
            })
            arr.push(obj)
          })
        })
        item.discount_info = arr
        // item.discount_info = JSON.parse(JSON.stringify(item.present))
        matching.push({ starting_amount: item.starting_amount, discount_info: item.discount_info })
      })
      params.matching = matching
      this.formatDiscount(params.full_reduction)
      // }else {
      //     delete params.deadline_at;
      //     delete params.matching;
      // }
      this.formatDiscount(params.base)
      this.formatDiscount(params.category)
      this.formatDiscount(params.product)
      this.formatDiscount(params.back_point)
      this.draftBtnModal = true
      if (this.editType == 'draft') {
        //修改
        this.$api
          .policyDraftUpdatev2(params)
          .then((res) => {
            if (res.code === 0) {
              if (!!remark) {
                // 是否为被动保存
                this.$Message.success('保存成功')
              }
              if (remark == 'exit') {
                this.$store.commit('removeTag', this.$route.name)
                this.$router.push({ path: '/policy/policy-draft' })
                this.draftTurn = true
              } else if (remark == 'continue') {
                this.draftModal = false
              }
            } else {
              this.$Message.error(res.message)
            }
          })
          .finally(() => {
            this.draftBtnModal = false
          })
      } else {
        this.$api
          .policyDraftAddv2(params)
          .then((res) => {
            // 添加
            if (res.code === 0) {
              if (!!remark) {
                this.$Message.success('保存成功')
              }
              if (remark == 'exit') {
                this.$router.push({ path: '/policy/policy-draft' })
                this.draftTurn = true
              } else if (remark == 'continue') {
                this.draftModal = false
                this.draftId = res.data
                this.editType == 'draft'
              }
            } else {
              this.$Message.error(res.message)
            }
          })
          .finally(() => {
            this.draftBtnModal = false
          })
      }
    },
    //适用商品-弹窗-确认
    submitRegularProduct(){
      let params = {}
      if(this.apply.batchNumber) params.batchNumber = this.apply.batchNumber
      if(this.apply.policyId) params.policyId = this.apply.policyId
      this.loadingBox.sureLoading = true
      switch(this.apply.type){
        case 'add':
        params.regularProductInfo = JSON.parse(JSON.stringify(this.apply.regularProductInfo))
        if(params.regularProductInfo.lenght ===0)return this.$Notice.error({title:'警告',desc:'请选择商品'})
        params.regularProductInfo = params.regularProductInfo.map(item => {
          Object.keys(item).forEach(key => {
            if(key === 'is_required'){
              if(item)
              item[key] ? item[key] = '1': item[key] = '2'
            }
          })
          return item
        })
          this.$api.addRegularProductList(params).then(res => {
            this.loadingBox.sureLoading = false
            if(res.code === 0){
              let {batchNumber,policyId} = res.data 
              batchNumber?this.apply.batchNumber = batchNumber:''
              policyId?this.apply.policyId = policyId:''
              this.apply.modelShow = false
              let produceData = {
                batch_number:this.apply.batchNumber,
                policy_id:this.apply.policyId,
              }
              this.getProductList(produceData)
            }
          })
          break;
        case'edit':
        
          params.regularProductInfo = JSON.parse(JSON.stringify(this.apply.searchTabData))
          params.regularProductInfo = params.regularProductInfo.map(item => {
            Object.keys(item).forEach(key => {
              if(key === 'is_required'){
                if(item)
                item[key] ? item[key] = '1': item[key] = '2'
              }
            })
            return item
          })
          this.$api.editRegularProductList(params).then(res => {
             this.loadingBox.sureLoading = false
            if(res.code === 0){
              let {batchNumber,policyId} = res.data 
              batchNumber ? this.apply.batchNumber = batchNumber :''
              policyId ? this.apply.policyId = policyId : ''
              let produceData = {
                batch_number:this.apply.batchNumber,
                policy_id:this.apply.policyId,
              }
              this.getProductList(produceData)
              this.apply.modelShow = false
            }
          })
          break
      }
    },
    //适用商品的确认删除
    sureDelProduct(){
      if(this.apply.delProduct.length !== 0){
        //进入确认删除
        let del =this.apply.delProduct.map(item => item.id)
        let params = {
          ids:del
        }
        this.$api.delRegularProductList(params).then(res => {
          // if(res.code == 0){
            this.apply.delProduct = []

          // }
        })
      }
    },
    //适用商品-弹窗-取消
    onCancelRegularProduct(){
      this.apply.modelShow = false
      let params = {}
      if(this.apply.batchNumber) params.batch_number = this.apply.batchNumber
      if(this.apply.policyId) params.policy_id = this.apply.policyId
      if(JSON.stringify(params) == "{}")return
      this.getProductList(params)
    },
    //适用商品-列表
    getProductList(data){
      this.$api.getRegularProductList(data).then(res => {
          if(res){
            let { items,_meta} = res
            if(items.length === 0){
              this.apply.data = items
              return
            }
            this.apply.data = items
            items[0].react_product_number ? this.formData.react_product_number = items[0].react_product_number : this.formData.react_product_number =''
            if(_meta){
              this.pageProps.page = _meta.currentPage
              this.pageProps.perPage = _meta.perPage
              this.pageProps.totalCount = _meta.totalCount
            }
          }
        })
    },
    //适用商品选择类目
    changeProduct(val){
      if(!this.apply.isFirst) return this.apply.isFirst = true
      if(val.length !== 0){
        let data = {
          ids: val,
        }
      if(this.apply.policyId)data.policyId = this.apply.policyId
        this.$api.getProductCategoryList(data).then(res => {
          if(res.code === 0){
            let { data } =res
            this.apply.searchTabData = data.map(item => {
                item.min_quantity? item.min_quantity = item.min_quantity :item.min_quantity = ''
                item.is_required?item.is_required = item.is_required : item.is_required = false
                item.min_quantity = 0
                return item
            })
          }
        })
      }
    },
    //搜索适用商品-类目
    searchApplyCategory(val){
      let params = {
        name: val
      }
      this.$api.getProductList(params).then(res => {
        if(res.code === 0){
          this.$nextTick(()=>{
            this.apply.applyCategoryList = res.data
          })

        }
      })
    },
    //搜索主页-适用商品列表
    searchApplyData(){
      let params = {}
       if(this.apply.batchNumber)params.batch_number = this.apply.batchNumber
      if(this.apply.policyId)params.policy_id = this.apply.policyId
      if(this.searchApply.category_id)params.category_id = this.searchApply.category_id
      if(this.searchApply.product_name)params.product_name = this.searchApply.product_name
      if(!params.batch_number && !params.policy_id )return this.$Notice.warning({title:'提示',desc:'无数据查询'})
      this.getProductList(params)
    },
    //选中的--适用商品内
		handleSelect(status) {
      this.$nextTick(()=>{
        this.apply.regularProductInfo = status
      })
		},
    //选中的--适用商品外
		handleSelectOut(status) {
      this.$nextTick(()=>{
        this.apply.chooseProductList = status.map(item => {
          Object.keys(item).forEach(key => {
            if(key === 'is_required'){
              item[key] === '1' ? item[key] = true : item[key] = false
            }
          })
          return item
        })
      })
		},
    //适用商品-所选择类目
   async applyRemoteMethod(query) {
        this.apply.searchLoading = true
       await this.getApply(query)
    },
    // 模糊搜索商品数据
    async  getApply(data) {
      this.apply.searchLoading = false
      await this.$api.getProductList().then(res => {
        if(res.code === 0){
          this.apply.searchList = res.data
        }
      })
    },
    //适用商品列表-外-清空选择
    cancelAll(status){
      this.apply.chooseProductList = []

    },
    //适用商品的数据改变
    changeTable(e,row,index,key){
      const checkArr = JSON.stringify(this.apply.regularProductInfo)
      if(this.apply.regularProductInfo.length > 0){
        //有选中的
        this.apply.regularProductInfo.forEach(item => {
          if(item.product_id === row.product_id && item.category_id === row.category_id ){
            //修改的与选中的一致
            this.apply.searchTabData[index]._checked = true
          }
        })
      }
      if(key === 'is_required'){
        this.apply.searchTabData[index][key] = e
      }else{
        this.apply.searchTabData[index][key] = e.target.value;
      }
    },
    onValty(data){
      if(data==='no'){
        this.formData.deadlineAt=''
      }
    }
  },
  mounted() {
    let id = this.$route.query.id
    this.apply.policyId = this.$route.query.id
    let type = this.$route.query.type
    if (id) {
      if (!!type) {
        this.editType = 'draft'
      } else {
        this.draftTurn = true
      }
      this.type = 'edit'
      this.spinShow = true
      // 适用商品

      this.getProductList({policy_id:id})
      //详情
      this.$api
        .getContractPoliceDetailv2(id)
        .then((res) => {
          this.spinShow = false
          if (res.code === 0) {
            let formData = JSON.parse(JSON.stringify(this.formData))

            formData.id = id
            formData.policy_name = res.data.policy_name
            res.data.react_product_number ? formData.react_product_number = res.data.react_product_number :  formData.react_product_number =''
            formData.policy_type = res.data.policy_type
            // this.formData.policy_type = res.data.policy_type === '活动' ? 'yes' : 'no'
            formData.policy_validity = res.data.policy_validity === '有限期' ? 'yes' : 'no'
            if (formData.policyPass == 'yes') {
              res.data.deadline_at?formData.deadlineAt = this.$format(res.data.deadline_at, 'yyyy-MM-dd'):''
              formData.deadline_at = res.data.deadline_at
            }
            if (res.data.baseDiscount.length != 0) {
              // 基础折扣
              formData.base = res.data.baseDiscount
              formData.base.map((items) => {
                  items.proportion = (Number(items.proportion) * 100).toFixed(0) + '%';
                  items.starting_amount = Number(items.starting_amount);
              })
            }
            if (res.data.categoryDiscount.length != 0) {
              formData.category = res.data.categoryDiscount
              formData.category.map((items) => {
                items.proportion = (Number(items.proportion) * 100).toFixed(0) + '%';
                this.categoryLists.push([items])
              })
            }
            if (res.data.productDiscount.length != 0) {
              formData.product = res.data.productDiscount
              formData.product.map((items) => {
                items.proportion = (Number(items.proportion) * 100).toFixed(0) + '%';
                this.productLists.push([items])
              })
            }
            if (res.data.backPointDiscount.length != 0) {
              // 返点
              formData.back_point = res.data.backPointDiscount
              formData.back_point.map((items) => {
                  items.proportion = (Number(items.proportion) * 100).toFixed(0) + '%';
              })
            }
            if (res.data.giftDiscount.length != 0) {
              // 活动设置
              let giftArr = res.data.giftDiscount.sort(function(a, b) {
                return a.starting_amount - b.starting_amount
              })
              let result = []
              this.giftLists.length = 0
              giftArr.forEach((item) => {
                let findResult = result.find((resultItem) => resultItem.starting_amount === item.starting_amount)
                if (findResult) {
                  findResult.content.push({ id: item.object_id, number: item.number, object_name: item.object_name })
                  this.giftLists[this.giftLists.length - 1].push([
                    { name: item.name, id: item.object_id, object_name: item.object_name },
                  ])
                } else {
                  result.push({
                    starting_amount: item.starting_amount,
                    content: [{ id: item.object_id, number: item.number, object_name: item.object_name }],
                  })
                  this.giftLists[this.giftLists.length] = []
                  this.giftLists[this.giftLists.length - 1].push([
                    { name: item.name, id: item.object_id, object_name: item.object_name },
                  ])
                }
              })
              formData.activity = result
            }
            if (res.data.repurchaseDiscount.length != 0) {
              // 换购活动
              let exchangeArr = res.data.repurchaseDiscount.sort(function(a, b) {
                return a.starting_amount - b.starting_amount
              })
              let result = []
              this.exchangeLists.length = 0
              exchangeArr.forEach((item) => {
                let findResult = result.find((resultItem) => resultItem.starting_amount === item.starting_amount)
                if (findResult) {
                  findResult.content.push({
                    id: item.object_id,
                    proportion: item.proportion * 100 + '%',
                    object_name: item.object_name,
                  })
                  this.exchangeLists[this.exchangeLists.length - 1].push([
                    { name: item.name, id: item.object_id, object_name: item.object_name },
                  ])
                } else {
                  result.push({
                    starting_amount: item.starting_amount,
                    content: [{ id: item.object_id, proportion: item.proportion * 100 + '%', object_name: item.object_name }],
                  })
                  this.exchangeLists[this.exchangeLists.length] = []
                  this.exchangeLists[this.exchangeLists.length - 1].push([
                    { name: item.name, id: item.object_id, object_name: item.object_name },
                  ])
                }
              })
              formData.exchange = result
            }
            if (res.data.matchingDiscount.length != 0) {
              formData.matching = JSON.parse(JSON.stringify(res.data.matchingDiscount))
              this.presentLists = []
              this.presentListsPro = []
              //深度循环----监听对应的模糊搜索-四维-继-叶大佬后-再次裂开-迭代需小心
              formData.matching.forEach((item,index)=>{
                    this.presentLists.push([])
                    this.presentListsPro.push([])
                    item.present.forEach((value, i) => {

                      this.presentLists[index].push([])
                      this.presentListsPro[index].push([])

                      value.content.forEach((data, k) => {

                        this.presentLists[index][i].push([{ name: data.name, id: data.object_id ,object_name: data.object_name,object_id: data.object_id}])
                        this.presentListsPro[index][i].push([{ condition_name: data.condition_name, condition_id: data.condition_id ,object_name: data.object_name,}])
                      })
                    })
                    
              })
            }
            if (res.data.reductionDiscount.length != 0) {
              // 满减活动
              // 返点
              formData.moneyOff = res.data.reductionDiscount
              formData.moneyOff.map((items) => {
                items.proportion = items.proportion * 100 + '%'
              })
            }
            formData.deadlineAt = this.$format(res.data.deadline_at,'yyyy-MM-dd')
            this.formData = formData
          }
        })
        .catch((error) => {
          this.spinShow = false
        })
    }
  },
  beforeDestroy() {
    if (!this.draftTurn) {
      //跳转、提交、没填写政策名称不用被动保存
      if (!!this.formData.policy_name) {
        this.keepDraft() // 被动保存
        //确认删除
        this.sureDelProduct()
      }
    }
  },
}
</script>

<style>
.transform-33 {
  transform: translateX(-33.3%);
}
.transform-66 {
  transform: translateX(-66%);
}
.ivu-table-tip {
  overflow-x: hidden;
}
.searchTable {
  padding-top: 2rem;
}

.searchTable .ivu-table-overflowX {
  overflow-x: hidden;
}
.activity {
  margin: 1rem 0;
  position: relative;
  padding-left: 1rem;
}
.activity::after {
  content: '';
  position: absolute;
  left: 0;
  top: 0;
  width: 8px;
  height: 100%;
  background-color: rgb(128, 179, 255);
}
</style>
