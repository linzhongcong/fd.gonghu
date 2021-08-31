<template>
  <Form ref="formData" :model="addData" :rules="formRules" label-position="top">
    <Card>
      <Row slot="title" style="text-align:right;">
        <Button type="primary" :loading="buttonLoading" @click="submitForm('formData')" :disabled="isDisabled">提交
        </Button>
      </Row>
      <Row>
        <Col :md="4" :xs="24">
          <FormItem label="活动名称" prop="name">
            <Input type="text" v-model="addData.name"/>
          </FormItem>
        </Col>
        <Col :md="4" :xs="24">
          <FormItem label="排序" prop="sort_priority">
            <Input v-model="addData.sort_priority" number/>
          </FormItem>
        </Col>
        <Col :md="4" :xs="24">
          <FormItem label="是否显示" prop="status">
            <Select v-model="addData.status">
              <Option v-for="(item, index) in enableList" :value="item.label" :key="item.enable + index">{{ item.label }}</Option>
            </Select>
          </FormItem>
        </Col>
        <Col :md="4" :xs="24">
          <FormItem label="活动链接" prop="link">
            <Input type="text" v-model="addData.link"/>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col :md="24" :xs="24">
          <FormItem label="活动描述" prop="describe">
            <Input type="text" v-model="addData.describe" placeholder=""/>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col :md="4" :xs="24">
          <span style="color:red">*</span>
          <FormItem label="活动封面" prop="poster">
            <div class="demo-upload-list" v-for="(item, index) in uploadList" :key="index">
              <template>
                <img :src="baseUrl + item.url" class="imgUpload" :hide="hidden">
                <div class="demo-upload-list-cover">
                  <Icon type="ios-trash-outline" @click.native="handleRemove(item)"></Icon>
                </div>
              </template>
            </div>
            <Upload ref="prepareFileUpload"
                    name="UploadForm[file]"
                    :on-progress="coaProgressFile"
                    :default-file-list="fileItems"
                    :on-success="coaSuccess"
                    :on-remove="filePrepareRemove"
                    :on-format-error="fileFormatError"
                    :max-size="51200"
                    :on-exceeded-size="fileMaxSize"
                    type="drag"
                    :action="fileUploadURL"
                    :headers="fileUploadHeaders"
                    :before-upload="fileBeforeUpload"
                    :show-upload-list="false"
                    style="display: inline-block">
              <div class="breadth" style="width:59px;line-height:59px">
                <Icon type="md-add" size="20"></Icon>
              </div>
            </Upload>
          </FormItem>
        </Col>
      </Row>
      <Row>
        <Col :md="6" :xs="24">
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
          <div style="text-align:center;">轮播图：333*400</div>
          <div style="text-align: center;">
            <img src="../../assets/images/active.png" alt="" style="width:333px;height:400px">
          </div>
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
      return {
        fileUploadURL: `${SERVER_BASE_URL}/v1/upload`,
        fileUploadHeaders: {
          Authorization: Cookies.get('authorization')
        },
        styleObject: {
          display: 'none'
        },
        baseUrl: `${SERVER_BASE_URL}/`,
        uploadList: [],
        queryId: '',
        modelImg: false,
        // loadingVisible: false,
        formData: {},
        addData: {},
        fileItems: [],
        hidden: true,
        typeList: [
          {type: '0', label: '轮播图'},
          {type: '1', label: '弹窗'}
        ],
        enableList: [
          {enable: '隐藏', label: '隐藏'},
          {enable: '显示', label: '显示'}
        ],
        formRules: {
          name: {required: true, message: '该选项不能为空', trigger: 'blur'},
          status: {required: true, message: '该选项不能为空', trigger: 'blur'},
          link: {required: true, message: '该选项不能为空', trigger: 'blur'},
          sort_priority: {required: true, message: '该选项不能为空', trigger: 'blur', type: 'number'}
        },
        buttonLoading: false,
        isDisabled: false, // 判断提交按钮是否为禁止状态(文件上传没有完成时)
      };
    },
    methods: {
      // 提交
      submitForm(name) {
        this.$refs[name].validate((valid) => {
          if (!valid) {
            return false;
          }
          if (this.queryId) {//编辑
            let parmes = this.addData;
            parmes.fileItems = this.uploadList
            if (parmes.fileItems.length == 0) {
              this.$Notice.warning({
                title: '请上传图片'
              });
              return
            }
            parmes.id = this.queryId
            this.$api.merchantActivityListUpdate(parmes)
              .then((result) => {
                this.$router.push({path: '/products/active-list'});
              })
          } else { // 添加
            let parmes = this.addData;
            parmes.fileItems = this.uploadList
            if (parmes.fileItems.length == 0) {
              this.$Notice.warning({
                title: '请上传图片'
              });
              return
            }
            this.$api.merchantActivityListCreate(parmes)
              .then(res => {
                this.$router.push({path: '/products/active-list'});
              })
          }
        })
      },

      //getlist
      fetchDate() {
        let id = this.queryId
        this.$api.merchantActivityListView({id})
          .then(res => {
            this.addData = res.data
            if (res.data.fileItems.length != 0) {
              this.uploadList = this.fileItems = [
                {
                  name: res.data.fileItems[0].title,
                  url: res.data.fileItems[0].url
                }
              ]
            }
          })
      },

      handleRemove(file) {
        const fileList = this.uploadList;
        let obj = this.uploadList.splice(fileList.indexOf(file), 1);
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
          // this.fileItems.push(data);
          this.uploadList.push(data);
        }
      },
      fileBeforeUpload(file) {
        const check = this.uploadList.length < 1;
        if (!check) {
          this.$Notice.warning({
            title: '只能上传一张图片'
          });
        }
        return check && this.checkImageWH(file, 333, 400);
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
              if (width && this.width != width) {
                self.$Notice.error({
                  title: '请上传宽为' + width + "的图片",
                });
                reject();
              } else if (height && this.height != height) {
                self.$Notice.error({
                  title: '请上传高为' + height + "的图片",
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
      // 移除附件文件
      filePrepareRemove(file) {
        const fileList = this.fileItems;
        const fileListAfter = this.uploadList
        let obj = this.fileItems.splice(fileList.indexOf(file), 1);
        let objs = this.uploadList.splice(fileListAfter.indexOf(file), 1);
      },
    },
    mounted() {
      this.queryId = this.$route.query.id;
      if (this.queryId) {
        this.fetchDate();
      }
    }
  };
</script>

<style lang="less">
  .posterimg {
    position: absolute;
    top: 30%;
    z-index: 2021;
    left: 20%;
    width: 300px;
    height: 200px;
    color: #fff;
    font-size: 1.5rem;
  }

  .Popupimg {
    position: absolute;
    top: 30%;
    z-index: 2021;
    right: 20%;
    width: 200px;
    height: 300px;
    color: #fff;
    font-size: 1.5rem;
  }

  .ivu-carousel-dots li button {
    border: 0;
    cursor: pointer;
    background: #ffff;
    opacity: .3;
    display: block;
    width: 15px;
    height: 15px;
    border-radius: 50px;
    outline: 0;
    font-size: 0;
    color: transparent;
    transition: all .5s;
  }

  .ivu-carousel-dots-inside {
    display: block;
    position: absolute;
    bottom: -6px;
  }

  .ivu-upload-drag {
    width: 61px;
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
    box-shadow: 0 1px 1px rgba(0, 0, 0, .2);
    margin-right: 4px;
  }

  .demo-upload-list img {
    width: 100%;
    height: 100%;
  }

  .demo-upload-list-cover {
    display: none;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, .6);
  }

  .demo-upload-list:hover .demo-upload-list-cover {
    display: block;
  }

  .demo-upload-list-cover i {
    color: #fff;
    font-size: 20px;
    cursor: pointer;
    margin: 0 2px;
  }

  .upload /deep/ .ivu-form-item-content {
    display: flex
  }
</style>
