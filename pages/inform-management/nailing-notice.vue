<template>
    <div class="nailing-page">
        <card>
            <Row>
                <Col :sm="24">
                  <Form ref="search" :model="search" class="search">
                      <Row>
                          <Col :sm="20">
                            <FormItem prop="notice_title">
                                <Input v-model="search.notice_title" placeholder="通知标题" clearable style="width: 200px" @keydown.native.enter.prevent="selectinform" />
                            </FormItem>
                            <FormItem prop="notice_type">
                                <Select clearable v-model="search.notice_type" style="width:200px" placeholder="通知类型">
                                    <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                            </FormItem>
                            <FormItem prop="notice_status">
                                <Select clearable v-model="search.notice_status" style="width:200px" placeholder="通知状态">
                                    <Option v-for="item in cityList2" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                            </FormItem>
                            <FormItem>
                                <Button type="primary" icon="md-search" style="padding: 5px 15px" @click="selectinform">查询</Button>
                            </FormItem>
                          </Col>
                      </Row>
                      <Row>
                          <Col>
                            <Button type="primary" @click="addnewInform">新增通知</Button>
                          </Col>
                      </Row>
                  </Form>
                </Col>
            </Row>
            <Row class="margin-top-10">
                <Table minwidth="1100"  
                      class="review-list" 
                      border 
                      highlight-row 
                     :columns="serviceColumns" 
                     :data="serviceTableData"  :loading="loading" size="small">
                    <!-- 操作 -->
                    <template slot-scope="{ row }" slot="action">
                        <Tooltip placement="top" content="编辑" transfer>
                            <Button type="primary" size="small" @click="handleEdit(row.uuid, row)">
                                <Icon type="md-create" />
                            </Button>
                        </Tooltip>
                        <Poptip confirm title="您确认删除这条内容吗？"  @on-ok="handleDelete(row.uuid)" transfer>
                            <Button size="small">
                                <Icon type="md-trash" />
                            </Button>
                        </Poptip>
                    </template>
                </Table>
                <div style="margin: 10px;overflow: hidden">
                    <div class="pages-L">共{{pageProps.totalCount}}条</div>
                    <div style="float: right;">
                        <Page :total="pageProps.totalCount" 
                        size="small" :current="pageProps.currentPage"
                        :page-size-opts="perPageSize"
                         show-sizer show-elevator @on-change="changePage"  @on-page-size-change="changePageSize"></Page>
                    </div>
                </div>
            </Row>
        </card>
        <Modal
           v-model="modeal"
           title="编辑通知"
           width="800">
             <div class="notice-content">
              <Form class="formNotice" ref="formNotice" :rules="rulesForm" :model="formNotice" label-position="right" :label-width="100">
                <Row style="margin-top:10px">
                    <Col span="10">
                        <FormItem label="开始时间:" prop="begin_at">
                            <DatePicker v-model="formNotice.begin_at" type="datetime" format="yyyy-MM-dd HH:mm" placeholder="选择开始时间" 
                            style="width: 200px"  :options="dataNotime"  ></DatePicker>
                        </FormItem>
                    </Col>
                    <Col span="10">
                        <FormItem label="结束时间:" prop="end_at">
                            <DatePicker v-model="formNotice.end_at" type="datetime" format="yyyy-MM-dd HH:mm" placeholder="选择结束时间" 
                            style="width: 200px" :options="dataHightime" ></DatePicker>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="10">
                        <FormItem label="通知标题:" prop="notice_title">
                            <Input v-model="formNotice.notice_title" placeholder="输入标题" style="width: 200px" />
                        </FormItem>
                    </Col>
                    <Col span="10">
                        <FormItem label="通知类型:" prop="notice_type">
                            <Select v-model="formNotice.notice_type" style="width:200px" placeholder="通知类型">
                                <Option v-for="item in cityList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                            </Select>
                        </FormItem>
                    </Col>
                </Row>
                <Row>
                    <Col span="10">
                            <FormItem label="提醒设置:" prop="remind_pattern">
                                <Select v-model="formNotice.remind_pattern" style="width:200px" placeholder="提醒设置">
                                    <Option v-for="item in informList" :value="item.value" :key="item.value">{{ item.label }}</Option>
                                </Select>
                            </FormItem>
                    </Col> 
                </Row>
                <Row>
                    <Col span="20">
                    <div class="icon">
                        <Poptip title="提示" content="请使用“；”换行" placement="bottom" v-model="visoShow" trigger="hover">
                            <div slot="title">
                                <Icon type="md-alert" color="rgb(255, 170, 43)" /> 提示
                            </div>
                <Icon type="md-alert" color="rgb(87, 163, 243)" size="20"/>
                        </Poptip>
                                
                            </div>
                        <FormItem label="内容:" prop="notice_content">
                            <Input class="textcont" v-model="formNotice.notice_content" type="textarea" :autosize="{minRows:7}"></Input>
                        </FormItem>
                    </Col>
                </Row>
            </Form>
           </div>
           <div slot="footer">
               <Button type="primary" size="large" @click="modeal = false;visoShow = false">取消</Button>
               <Button type="primary" size="large" style="padding:5px 15px" @click="informsave('formNotice')">保存</Button>
           </div>
        </Modal>
    </div>
</template>
<script>
export default {
    name:"nailing-notice",
    data(){
        return{
            modeal:false,
            search:{
                notice_title:"", //通知标题
                notice_type:"", //通知类型
                notice_status:"",//有效通知
            },
            model1:"",
            cityList: [
                {
                    value: '弹窗通知',
                    label: '弹窗通知'
                },
                {
                    value: '注意事项',
                    label: '注意事项'
                }
            ],
            model2:"",
            cityList2:[
                {
                    value:'有效',
                    label:'有效'
                },
                {
                    value:'过期',
                    label:'过期'
                },
                {
                    value:'待定',
                    label:'待定'
                }
            ],
            serviceTableData:[
              
            ],
            // 列表表格
            serviceColumns:[
                {
                    title:'序号',
                    key:'num',
                    width: 70,
                    align: 'center',
                },
                {
                    title: '通知标题',
                    key: 'notice_title',
                    minWidth:150,
                    align: 'center'
                },
                {
                    title:'通知内容',
                    key:'notice_content',
                    minWidth: 230, 
                    align: 'center'
                    
                },
                {
                    title:'通知类型',
                    key:'notice_type',
                    minWidth:100,
                    align: 'center'
                },
                {
                    title:'开始时间',
                    key:'begin_at',
                    minWidth:150,
                    align: 'center'
                },
                {
                    title:'结束时间',
                    key:'end_at',
                    minWidth:150,
                    align: 'center'
                },
                {
                    title:'提醒设置',
                    key:'remind_pattern',
                    minWidth:120,
                    align: 'center'
                },
                {
                    title:'状态',
                    key:'status',
                    minWidth:120,
                    align: 'center'
                },
                {
                    title:'操作',
                    key:'action',
                    minWidth:100,
                    slot:'action',
                    align: 'center'
                }
            ],
            loading: false,
            // 列表分页属性
            pageProps: {
                page: 1,
                perPage: 10,
                currentPage: 1,
                totalCount: 0,
                pageSize:10,
            },
            perPageSize: [10], //每页条数切换的配置
            formNotice:{
               begin_at:"", //开始时间
               end_at:"", //结束时间
               notice_content:"",  //编辑通知内容
               remind_pattern:"", //提醒设置
               notice_type:"", //通知类型
               notice_title:"",//通知标题
               uuid:""
           }, 
           
            informList: [
                {
                    value: '首次登录',
                    label: '首次登录'
                },
                {
                    value: '每次登录',
                    label: '每次登录'
                },
                {
                    value: '一周首次',
                    label: '一周首次'
                },
            ],
            //提示的气泡显示控制
            visoShow:false,
             // 校检规则
            rulesForm:{
                begin_at:[{required:true,type:'date',message:'请选择开始日期'}],
                end_at:[{required:true,type:'date',message:'请选择结束时间'}],
                notice_title:[{required: true, message: '通知标题不能为空', trigger: 'blur'}],
                notice_type:[{required: true, message: '请选择通知类型', trigger: 'change'}],
                remind_pattern:[{required: true, message: '请选择提醒设置', trigger: 'change'}],
                notice_content:[
                    { required: true, message: '请输入通知内容', trigger: 'blur' }
                ]
            },
            dataNotime: {
                    disabledDate (date) {
                        return date && date.valueOf() < Date.now() - 86400000;
                    }
            },
            dataHightime: {
                    disabledDate (date) {
                        return date && date.valueOf() < Date.now() - 86400000;
                    }
            },
        }
    },
    mounted(){
       this.tabledraw();
       
    },
    methods:{
        // 列表的渲染
        tabledraw(){
          let params = this.search;
          params.pageSize = this.pageProps.pageSize;
          params.page = this.pageProps.page;
          this.$api.nailingListShow(params).then(res => {
              let num = 1; 
            //   给渲染表添加一个属性
              for(let i = 0;i < res.items.length;i++){
                  res.items[i].num = num++; 
              }
              this.serviceTableData = res.items;
              this.pageProps.currentPage = res._meta.currentPage;
              this.pageProps.totalCount = res._meta.totalCount;
          })
        },
        // 新增通知按钮
        addnewInform(){
            this.modeal = true;
            this.$refs["formNotice"].resetFields();
            this.formNotice.uuid = "";
            // this.visoShow=true
            // setTimeout(() => {
            //     this.visoShow=true
            // }, 1000);
        },
        // 新增通知-保存
        informsave(name){
            this.visoShow = false
             this.$refs[name].validate(vaild => {
                if(vaild){
                     // 数据处理
                    let params = {};
                    params.begin_at = this.formatDate(this.formNotice.begin_at); //开始时间
                    params.end_at = this.formatDate(this.formNotice.end_at); //结束时间
                    params.notice_title = this.formNotice.notice_title; //通知标题
                    params.notice_content = this.formNotice.notice_content; //通知内容
                    params.remind_pattern = this.formNotice.remind_pattern; //提醒设置
                    params.notice_type = this.formNotice.notice_type; //通知类型
                     if(params.begin_at >= params.end_at){
                         this.$Message.error("开始日期不能大于结束日期或者相同哦")
                     }
                     else{
                        if(this.formNotice.uuid){
                        // 编辑
                        let uuid = this.formNotice.uuid;
                        this.$api.nailingListUpdate({params,uuid}).then(res => {
                            if(res.code === 0){
                                this.$Message.success(res.message);
                                this.modeal = false;
                                this.tabledraw();
                            }
                        })
                        }
                        else{
                            // 添加
                            this.$api.nailingListAdd(params).then(res => {
                                if(res.code === 0){
                                    this.modeal = false;
                                    this.$Message.success(res.message);  
                                    this.tabledraw();
                                }
                            })
                                
                            
                        }
                     }
                    
                }
                else{
                     this.$Message.error("信息填写不完整哦");
                }
             })
        },
        // 编辑操作
        handleEdit(uuid,row){
            this.modeal = true;
            let obj = {};
            obj = JSON.parse(JSON.stringify(row));
            obj.begin_at = new Date(obj.begin_at);
            obj.end_at = new Date(obj.end_at);
            this.formNotice = obj;
        },
        // 删除操作
        handleDelete(uuid){
           this.$api.nailingListDel({uuid}).then(res => {
               if(res.code === 0){
                   this.$Message.success(res.message);
                   this.tabledraw();
               }
           })
        },
        // 页码
        changePage(e){
            this.pageProps.page = e;
            this.tabledraw()
        },
        // 输入数字改变页码
        changePageSize(e){
            this.pageProps.page = e;
            this.tabledraw()
        },
        // 查询
        selectinform(){
            // 获取通知标题
            if(this.search.notice_type === undefined || this.search.notice_status === undefined){
                this.search.notice_type = "";
                this.search.notice_status = "";
            }
            this.tabledraw();
            
        },
        // 日期格式转换
        formatDate(date){
            date = new Date(date);
            var y=date.getFullYear();
            var m=date.getMonth()+1;
            var d=date.getDate();
            var h = date.getHours();
            var mint = date.getMinutes();
            m = m<10?("0"+m):m;
            d = d<10?("0"+d):d;
            h = h<10?("0"+h):h;
            mint = mint<10?("0"+mint):mint;
            return y+"-"+m+"-"+d+" "+h+":"+mint;
       },
        
    },
    watch: {
        modeal:{
            handler(news,old){
                setTimeout(() => {
                    this.visoShow = news
                }, 500);
                
            }
        }
  }
}
</script>
<style scoped>
    .icon{
        position: absolute;
        left: 1rem;
        top: 6px;
    }
</style>