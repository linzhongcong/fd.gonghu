<template>
  <Form ref="formData" :model="formData" :rules="formRules">
    <Card>
      <Row slot="title" style="text-align:right;">
        <Button type="success" :loading="buttonLoading" @click="submitForm('formData')" :disabled="isDisabled">提交
        </Button>
      </Row>
      <Row class="card-wrap">
        <Col class="card-wrap_R" span="18">
          <Row>
            <Col :xs="24" :sm="4">
              <FormItem label="产品名称">
                <Input v-model="formData.name" clearable></Input>
              </FormItem>
              <FormItem label="单位" prop="unit">
                <Input v-model="formData.unit" clearable></Input>
              </FormItem>
              <!-- <FormItem label="备注" prop="remark">
                  <Input v-model="formData.remark" clearable></Input>
              </FormItem> -->
              <FormItem label="是否显示" prop="show_status">
                <Select v-model="formData.show_status" clearable placeholder="请选择"
                        :label="formData.label"
                >
                  <Option v-for="(item, index) in is_show" :value="item.key" :label="item.label" :key="index"></Option>
                </Select>
              </FormItem>
            </Col>
            <Col :xs="24" :sm="4">
              <FormItem label="货号" prop="item_no">
                <Input v-model="formData.item_no" clearable></Input>
              </FormItem>
              <FormItem label="零售价" prop="price">
                <Input v-model="formData.price" clearable></Input>
              </FormItem>
              <FormItem label="缺货设置" prop="shortage_status">
                <Select v-model="formData.shortage_status" clearable placeholder="请选择"
                        :label="formData.shortage_status"
                >
                  <Option v-for="item in Shortage" :value="item.key" :label="item.key" :key="item.key "></Option>
                </Select>
              </FormItem>
            </Col>
            <Col :xs="24" :sm="4">
              <FormItem label="选择类目" prop="category">
                <!-- <Select v-model="formData.category_ids" clearable placeholder="请选择"
                        :label="formData.category"
                        label-in-value
                        multiple
                        :max-tag-count="1"
                        :filterable="true"
                        @on-change="handleSelectCategory"
                        @on-query-change="queryCategoryDebonce"
                >
                  <Option v-for="item in category" :value="item.id" :label="item.name" :key="item.id"></Option>
                </Select> -->
                <Select v-model="formData.category_id" clearable placeholder="请选择"
                        :label="formData.category"
                        label-in-value
                        :max-tag-count="1"
                        :filterable="true"
                        @on-change="handleSelectCategory"
                        @on-query-change="queryCategoryDebonce"
                >
                  <Option v-for="item in category" :value="item.id" :label="item.name" :key="item.id"></Option>
                </Select>
              </FormItem>
              <FormItem label="条码" prop="barcode">
                <Input v-model="formData.barcode" clearable></Input>
              </FormItem>
              <FormItem label="保质期" prop="shelf_life">
                <Input v-model="formData.shelf_life" clearable number></Input>
              </FormItem>
            </Col>
            <Col :xs="24" :sm="4">
              <FormItem label="规格" prop="standard">
                <Input v-model="formData.standard" clearable></Input>
              </FormItem>
              <FormItem label="箱规" prop="box_standard">
                <Input v-model="formData.box_standard" clearable></Input>
              </FormItem>
              <FormItem label="供货价" prop="supply_price">
                <Input v-model="formData.supply_price" clearable></Input>
              </FormItem>

            </Col>
            <Col :xs="24" :sm="4">
              <FormItem label="所在类目排序" prop="sort_priority">
                <Input v-model="formData.sort_priority" clearable></Input>
              </FormItem>
              <FormItem label="商品属性" prop="property">
                <Select v-model="formData.property" clearable placeholder="请选择"
                >
                  <Option value="routine" label="常规货品"></Option>
                  <Option value="hot" label="爆款"></Option>
                </Select>
              </FormItem>
              <FormItem label="成本价" prop="cost_price">
                <Input v-model="formData.cost_price" clearable></Input>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col :xs="24" :sm="12">
              <FormItem label="商品描述" prop="describe">
                <Input v-model="formData.describe" clearable type="textarea"
                       :autosize="{minRows: 2,maxRows: 9}"></Input>
              </FormItem>
            </Col>
            <Col :xs="24" :sm="12">
              <FormItem label="备注" prop="remark">
                <Input v-model="formData.remark" clearable type="textarea" :autosize="{minRows: 2,maxRows: 9}"></Input>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col :xs="24" :sm="12">
              <span style="color:red">*</span>
              <FormItem label="产品封面图">
                <Upload ref="prepareFileUpload"
                        name="UploadForm[file]"
                        :on-progress="coaProgressFile"
                        :default-file-list="imgListShow"
                        :on-success="coaSuccess"
                        :on-remove="filePrepareRemove"
                        :on-format-error="fileFormatError"
                        :max-size="51200"
                        :on-exceeded-size="fileMaxSize"
                        type="drag"
                        :action="fileUploadURL"
                        :headers="fileUploadHeaders"
                        :before-upload="fileBeforeUpload"
                        style="display: inline-block">
                  <div class="breadth">
                    <Icon type="md-add" size="20"></Icon>
                  </div>
                </Upload>
              </FormItem>
            </Col>
          </Row>
          <Row>
            <Col :md="9" :xs="24">
              <span style="color:red;">备注：上传图片前确保类型和对应尺寸匹配，一次仅可上传一张</span>
            </Col>
          </Row>
          <Row style="text-align:left;border-top:1px solid #eee;padding-top:20px">
            <Col :md="6" :xs="24">
              <span style="text-align: left;">示例:</span>
            </Col>
          </Row>
          <Row>
            <Col :md="6" :xs="24">
              <div style="text-align:center;">100*100</div>
              <div style="text-align: center;">
                <img src="../../assets/images/Popup.png" alt="" style="width:100px;height:100px">
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
  </Form>
</template>
<script>
  import Cookies from 'js-cookie'
  import {SERVER_BASE_URL} from '~/api/config';

  export default {
    data() {
      // 验证排序为大于0的整数
      const validatePrice = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('该选项不能为空'));
        } else {
          if (Number(value) >= 0) {
            callback();
          } else {
            callback(new Error('请输入大于等于0的数字'));
          }
        }
      };
      const validateItemNo = (rule, value, callback) => {
        if (value === '' || !value) {
          callback(new Error('该选项不能为空'));
        } else {
          //这里做唯一性判断
          if(!this.$route.query.id){
          this.$api.productEditItemNum({name:value}).then(res => {
              if(res.code === 0){
                callback()
              }
              if(res.code === 301){
                callback(new Error(res.message));
              }
          }).catch(error => {
            callback(new Error('已存在相同命名商品货号，请检查!'));
          })
          }else{
            if(this.oldItemNo !== value){
              this.$api.productEditItemNum({name:value}).then(res => {
                if(res.code === 0){
                  callback()
                }
                if(res.code === 301){
                  callback(new Error(res.message));
                }
              })
            }else{
              callback();
            }
          }
        }
      };

      return {
        //存储旧的货号
        oldItemNo:'',
        baseUrl: `${SERVER_BASE_URL}/`,
        fileUploadURL: `${SERVER_BASE_URL}/v1/upload`,
        fileUploadHeaders: {
          Authorization: Cookies.get('authorization')
        },
        is_show: [
          {key: '显示', label: '显示'},
          {key: '隐藏', label: '隐藏'}
        ],
        Shortage: [
          {key: '是', label: '是'},
          {key: '否', label: '否'}
        ],
        isShowProgress: false,
        percentProgress: 0,
        buttonLoading: false,
        queryId: '',
        loadingVisible: false,
        formData: {},
        imgListShow: [],
        category: [],
        formRules: {
          name: [
            {required: true, message: '该选项不能为空', trigger: 'blur'}
          ],
          standard: [
            {required: true, message: '该选项不能为空', trigger: 'blur'}
          ],
          barcode: [
            {required: true, message: '该选项不能为空', trigger: 'blur'}
          ],
          remark: [
            {required: false}
          ],
          category: [
            {required: true, message: '该选项不能为空', trigger: 'blur'}
          ],
          unit: [
            {required: true, message: '该选项不能为空', trigger: 'blur'}
          ],
          box_standard: [
            {required: true, message: '该选项不能为空', trigger: 'blur'}
          ],
          item_no: [
            // {required: true, message: '该选项不能为空', trigger: 'blur'}
            {required: true,  validator: validateItemNo, trigger: 'blur'}
          ],
          price: [
            {required: true, validator: validatePrice, trigger: 'blur'}
          ],
          show_status: [
            {required: true, message: '该选项不能为空', trigger: 'blur'}
          ],
          shortage_status: [
            {required: true, message: '该选项不能为空', trigger: 'blur'}
          ],
          shelf_life: [
            {required: true, message: '该选项不能为空', trigger: 'blur', type: 'number'}
          ],
          supply_price: [
            {required: true, message: '该选项不能为空', trigger: 'blur'}
          ],
          cost_price: [
            {required: true, message: '该选项不能为空', trigger: 'blur'}
          ],
          sort_priority: [
            {required: true, message: '该选项不能为空', trigger: 'blur'}
          ],
          property: [
            {required: true, message: '该选项不能为空', trigger: 'change'}
          ]
        },
        buttonLoading: false,
        isDisabled: false,// 判断提交按钮是否为禁止状态(文件上传没有完成时)
        queryCategoryDebonce: this.$debonce(this.queryCategory, 500)
      };
    },
    methods: {
      // 获取类目
      queryCategory(e) {
        if (e) {
          let params = {
            name: e
          };
          this.$api.categoryManagementList(params)
            .then(res => {
              this.category = res.items;
            });
        } else {
          this.$api.categoryManagementList()
            .then(res => {
              this.category = res.items;
            });
        }
      },
      // 点击选择类目
      handleSelectCategory(obj) { 
        if(obj){
          let list = this.category.filter(n => {
            return obj.label === n.name;
        });
        this.formData.category = list[0].name;
        this.formData.category_id = list[0].id;
        }

        // let list = this.category.filter(n => {
        //   obj.forEach((val,index)=>{
        //     return val.label === n.name;
        //   })
        // }); 
        // if(obj[0].label){
        //   this.formData.category = obj[0].label;
        // }
        // list.forEach((val,index)=>{ 
        //   this.formData.category_ids.push(val.id);
        // })  
      },
      // 提交
      submitForm(name) {
        this.$refs[name].validate((valid) => {
          if (!valid) {
            return false;
          }
          if (this.imgListShow.length == 0) {
            this.$Message.success('请上传产品封面！！！！');
            return
          }
          ;
          let formData = this.formData;
          formData.imgListShow = this.imgListShow;
          if (this.queryId) {
            // 修改 
            formData.shelf_life = parseInt(formData.shelf_life) 
            this.$api.productManagementEdit(formData)
              .then(res => {
                this.buttonLoading = false;
                if (res.code == 0) {
                  this.$Message.success(res.message);
                  this.$router.push({path: '/products/product'});
                } else {
                  if (res.data.length > 0) {
                    for (let i in res.data) {
                      this.$Message.warning(res.data[i]);
                    }
                  } else {
                    this.$Message.error(res.message);
                  }
                }
              });
          } else {
            // 新增
            this.$api.productManagementCreate(formData)
              .then(res => {
                this.buttonLoading = false;
                if (res.code == '0') {
                  this.$Message.success(res.message);
                  this.$router.push({path: '/products/product'});
                } else {
                  if (res.data.length > 0) {
                    for (let i in res.data) {
                      this.$Message.error(res.data[i]);
                    }
                  } else {
                    this.$Message.error(res.message);
                  }
                }
              });
          }
        });
      },

      // 获取类目详情
      fetchData(id) {
        this.$api.productManagementDetails(id)
          .then(res => {
            if (res.code == 0) {
              this.formData = res.data;
              this.oldItemNo = JSON.parse(JSON.stringify(this.formData.item_no))
              this.formData.shelf_life = parseInt(this.formData.shelf_life);
              if (res.data.imgListShow.length != 0) {
                this.imgListShow = [
                  {
                    name: res.data.imgListShow[0],
                    url: this.baseUrl + res.data.imgListShow[0]
                  }
                ]
              }

            }
          });
      },
      // 文件上传限制
      fileMaxSize(file) {
        this.$Notice.warning({
          title: '超出文件大小限制',
          desc: '文件 ' + file.name + ' 太大，不能超过 50M。'
        });
      },
      // 文件格式验证失败
      fileFormatError(file) {
        this.$Notice.error({
          title: '文件格式错误',
          desc: '请上传正确的文件格式!'
        });
      },
      // 限制图片上传
      fileBeforeUpload(file) {
        const check = this.imgListShow.length < 1;
        if (!check) {
          this.$Notice.warning({
            title: '只能上传一张图片'
          });
        }
        return check && this.checkImageWH(file);
      },

      //判断 在上传之前 判断图片的高度
      checkImageWH(file, width, height) {
        let self = this;
        return new Promise(function (resolve, reject) {
          let filereader = new FileReader();
          filereader.onload = e => {
            let src = e.target.result;
            const image = new Image();
            image.onload = function () {
              if (this.width != this.height) {
                self.$Notice.error({
                  title: '宽和高不一致',
                });
                reject();
              } else {
                resolve();
              }
            };
            image.onerror = reject;
            image.src = src;
          };
          filereader.readAsDataURL(file);
        });
      },

      // 附件上传进度条
      coaProgressFile(event, file) {
        if (!event) return;
        this.isShowProgress = true;
        if (event.percent === 100) {
          this.isDisabled = false;
        } else {
          this.isDisabled = true;
        }
        // 延迟一下，接收有bug
        setTimeout(() => {
          if (file.status === 'fail') {
            this.$Notice.error({
              title: '文件上传失败!'
            });
          }
        }, 1000);
        if (file.percentage === 100) {
          this.isShowProgress = false;
        }
        this.isShowProgress = event.percent;
      },
      // 附件文件上传成功
      coaSuccess(res, file) {
        // 上传成功
        this.isShowProgress = false;
        if (res.status) {
          let data = res.data;
          this.imgListShow.push(data);
        }
      },
      // 移除附件文件
      filePrepareRemove(file) {
        const fileList = this.imgListShow;
        let obj = this.imgListShow.splice(fileList.indexOf(file), 1);
      },
    },
    mounted() {
      let id = this.$route.query.id;
      if (id) {
        this.queryId = id;
        this.fetchData(id);
      }
      // 初始化类目
      this.queryCategory();


    }
  };
</script>

<style lang="less">
  .pro-upload-list {
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
    box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
    margin-left: 4px;
  }

  .pro-upload-list img {
    width: 100%;
    height: 100%;
  }

  .pro-upload-list-cover {
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, .6);
  }

  .pro-upload-list:hover .pro-upload-list-cover {
    display: block;
  }

  .pro-upload-list-cover i {
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
  }

  .breadth {
    width: 58px;
    height: 58px;
    line-height: 58px;
  }

  .ivu-upload-list {
    display: inline-block;
  }

  .ivu-upload-drag {
    width: 58px;
    display: inline-block;
  }

  .ivu-upload-list-file {
    float: left;
    height: 58px;
  }
</style>
