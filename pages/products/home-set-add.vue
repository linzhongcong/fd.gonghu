<template>
    <Form ref="formData" :model="formData" :rules="formRules" label-position="top">
        <Card>
            <Row slot="title" style="text-align:right;">
                <Button type="warning" :loading="buttonLoading" @click="previewImg()" :disabled="isDisabled">预览</Button>
                <Button type="primary" :loading="buttonLoading" @click="submitForm('formData')" :disabled="isDisabled">提交</Button>
            </Row>
            <Row>
                <Col :md="4" :xs="24">
                    <FormItem label="选择类型" prop="img_type">
                        <Select v-model="formData.img_type" @on-change="selectUser">
                            <Option v-for="item in typeList" :value="item.label" :key="item.type" >{{ item.label }}</Option>
                        </Select>
                    </FormItem>
                </Col>
                <Col :md="4" :xs="24">
                    <FormItem label="排序">
                        <Input  v-model="formData.sort_priority" placeholder="默认最后"  number/>
                    </FormItem>
                </Col>
                <Col :md="4" :xs="24">
                    <FormItem label="启用状态" prop="status">
                        <Select v-model="formData.status">
                            <Option v-for="(item, index) in enableList" :value="item.label" :key="item.enable + index">{{ item.label }}</Option>
                        </Select>
                    </FormItem>
                </Col>
                <Col :md="4" :xs="24">
                    <FormItem label="跳转链接地址" prop="link">
                        <Input v-model="formData.link" placeholder="默认#及不跳转"></Input>
                    </FormItem>
                </Col>
            </Row>
            <Row>
                <Col :md="24" :xs="24">
                    <span style="color:red">*</span>
                    <FormItem label="海报封面上传">
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
                                :before-upload="handleBeforeUpload"
                                style="display: flex;">
                            <div class="breadth" style="height:80px;line-height: 80px;width:80px">
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
                <Col :md="6" :xs="24" >
                   <div style="text-align:center;">轮播图：690*320</div>
                   <div style="text-align: center;">
                       <img src="../../assets/images/banner320.png" alt="" style="width:100%">
                   </div>
                </Col>
                <Col :md="6" :xs="24">
                   <div style="text-align:center;">弹窗：512*512</div>
                   <div style="text-align: center;">
                       <img src="../../assets/images/Popup.png" alt="" style="width: 300px">
                   </div>
                </Col>
            </Row>
        </Card>
        <!-- style="z-index: 1023;display:none" -->
        <div class="ivu-modal-mask"  :style="styleObject" @click="previewback()">
            <Col :md="6" :xs="24" class="posterimg" v-if="formData.img_type == '轮播图'">
                <Row >
                    <Col :md="24" :xs="24">
                        <div style="text-align: center;">轮播海报:</div>
                    </Col>
                </Row>
                <Row>
                    <Carousel autoplay v-model="valuePlanting" loop >
                        <CarouselItem>
                            <div class="demo-carousel" v-for="(item, index) in formData.fileItems" :key="index" >
                                <img :src=" baseUrl + item.url " alt="" style="width:300px;height:200px">
                            </div>
                        </CarouselItem>
                    </Carousel>
                </Row>
            </Col>
            <Col :md="6" :xs="24" class="Popupimg" loop v-if="formData.img_type == '弹窗'">
                <Row>
                    <Col :md="24" :xs="24">
                        <div style="text-align: center;">弹窗海报:</div>
                    </Col>
                </Row>
                <Row>
                    <Carousel autoplay v-model="valuePopup" >
                        <CarouselItem>
                            <div class="demo-carousel" v-for="(item, index) in formData.fileItems" :key="index" >
                                <img :src=" baseUrl + item.url " alt="" style="width:200px;height:300px">
                            </div>
                        </CarouselItem>
                    </Carousel>
                </Row>
            </Col>
        </div>
    </Form>
</template>
<script>
import Cookies from 'js-cookie'
import { SERVER_BASE_URL } from '~/api/config';
    export default {
        data () {
            return {
                baseUrl:  `${SERVER_BASE_URL}/`,
                fileUploadURL: `${SERVER_BASE_URL}/v1/upload`,
                fileUploadHeaders: {
                    Authorization: Cookies.get('authorization')
                },
                valuePlanting: 0,
                valuePopup: 0,
                styleObject: {
                    display:'none'
                },
                queryId: '',
                modelImg:false,
                // loadingVisible: false,
                formData: {},
                addData:{},
                fileItems:[],
                typeList:[
                    { type:'0',label:'轮播图'},
                    { type:'1',label:'弹窗'}
                ],
                enableList:[
                    { enable:'0',label:'启用'},
                    { enable:'0',label:'停用'}
                ],
                formRules: {
                    status:{ required: true, message: '该选项不能为空', trigger: 'blur' },
                    img_type:{ required: true, message: '该选项不能为空', trigger: 'blur' },
                    sort_priority:{ required: true, message: '该选项不能为空', trigger: 'blur' ,type:'number'}
                },
                buttonLoading: false,
                isDisabled: false, // 判断提交按钮是否为禁止状态(文件上传没有完成时)
                imgType:''
            };
        },
        methods: {

            // 点击选择图片类型时
            selectUser (obj) {
                this.imgType = obj
                return;
            },

            // 提交
            submitForm (name) {
                this.$refs[name].validate((valid) => {
                    if (!valid) {
                        return false;
                    }
                    if (this.fileItems.length == 0){
                        this.$Message.success('请上传海报封面！！！！');
                        return;
                    };
                    if(this.queryId) {//编辑
                    let parmes = this.formData;
                        parmes.fileItems = this.fileItems
                        parmes.id = this.queryId
                        if (parmes.sort_priority == '') {
                            parmes.sort_priority == '0'
                        }
                    this.$api.appletHomeSettingUpdate(parmes)
                        .then((result) => {
                        this.$router.push({ path: '/products/home-set' });
                        })
                    } else { // 添加
                        let parmes = this.formData;
                        parmes.fileItems = this.fileItems
                        if (parmes.sort_priority == undefined) {
                            parmes.sort_priority = '0'
                        }
                        this.$api.appletHomeSettingCreate(parmes)
                            .then(res =>{
                                this.$router.push({ path: '/products/home-set' });
                            })
                    }
                })
            },

            //预览图片

            previewImg () {
                this.styleObject.display = 'block'
            },

            //轮播海报
            previewback () {
                this.styleObject.display = 'none'
            },

            //fetchdata
            fetchDate () {
                let id = this.queryId
                this.$api.appletHomeSettingView({id})
                .then(res =>{
                    this.formData = res.data;
                    if (id) {
                        this.fileItems = [
                            {
                                name:res.data.fileItems[0].title,
                                url: this.baseUrl + res.data.fileItems[0].url
                            }
                        ]
                    } else {

                    }
                })
            },

             // 文件上传限制
            fileMaxSize (file) {
                this.$Notice.warning({
                    title: '超出文件大小限制',
                    desc: '文件 ' + file.name + ' 太大，不能超过 50M。'
                });
            },

            handleBeforeUpload (file) {
               const check = this.fileItems.length < 1;
               let id = this.queryId
               if (id) {
                   const imgyppe = this.fileItems.img_type == '0'
                   if (imgyppe) {
                        this.$Notice.warning({
                            title: '在上传之前请先填写图片类型'
                        });
                        return !imgyppe
                    }
               } else {
                   const imgyppe = this.imgType.length == '0' ; //判断在上传之前是否选择了图片的类型才能判出上产的图片尺寸大小
                   if (imgyppe) {
                        this.$Notice.warning({
                            title: '在上传之前请先填写图片类型'
                        });
                        return !imgyppe
                    }
               }
                if (!check) {
                    this.$Notice.warning({
                        title: '只能上传一张图片'
                    });
                    return check;
                }

                if (this.imgType == '轮播图') {
                    return this.checkImageWH(file, 690,320) ;
                }

                if (this.imgType == '弹窗') {
                    return this.checkImageWH(file, 512,512) ;
                }


                return check && this.checkImageWH(file, 690,320);
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

            // 文件格式验证失败
            fileFormatError (file) {
                this.$Notice.error({
                    title: '文件格式错误',
                    desc: '请上传正确的文件格式!'
                });
            },

            // 附件上传进度条
            coaProgressFile (event, file) {
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
            coaSuccess (res, file) {
                // 上传成功
                this.isShowProgress = false;
                if (res.status) {
                    let data = res.data;
                    this.fileItems.push(data);
                    this.formData.fileItems = this.fileItems
                }
            },

            // 移除附件文件
            filePrepareRemove (file) {
                const fileList = this.fileItems;
                let obj = this.fileItems.splice(fileList.indexOf(file), 1);
            }

        },

        mounted () {
            this.queryId = this.$route.query.id;
            if (this.queryId) {
                this.fetchDate();
            }
            if (this.$route.query.preview == 'preview') {
                this.styleObject.display = 'block'
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
    .ivu-upload-list {
        display: flex;
    }
</style>
