<template>
    <div>
        <Card>
            <Row>
                <Col span="12" class="left">
                    <Row>
                        <Col span="20" class="right">
                            <div><strong>商品详情展示</strong></div>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="20" class="right">
                               <Upload ref="prepareFileUpload"
                                name="UploadForm[file]"
                                :on-progress="coaProgressFile"
                                :default-file-list="formData.imgDetailHead"
                                :on-success="coaSuccess"
                                :on-remove="filePrepareRemove"
                                :on-format-error="fileFormatError"
                                :max-size="51200"
                                :on-exceeded-size="fileMaxSize"
                                type="drag"
                                :action="fileUploadURL"
                                :headers="fileUploadHeaders"
                                :before-upload="handleBeforeUpload"
                                style="display: inline-block;width:400px;height:400px">
                                    <div class="breadth addUp">
                                        <Icon type="md-add" size="20">
                                            请上传头图
                                        </Icon>

                                        <i>请上传头图片</i>
                                    </div>
                                </Upload>
                        </Col>
                        <Col span="4" class="right" style="color:red;text-align: right;line-height: 400px;">
                               <div>750*750</div>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="12" offset="4" class="right">
                            <div class="title">
                                <Row>
                                    <Col span="12" class="right">
                                        <div >
                                            统一零售价：<span v-text="'￥'+fetchData.price" style="color:rgb(255, 166, 0)"></span>
                                        </div>
                                    </Col>
                                    <Col span="12" class="right">
                                        <div >
                                            规格：<span v-text="fetchData.standard + 'g'"></span>
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span="12" class="right">
                                        <div>
                                            供货价：<span v-text="fetchData.supply_price" style="color:rgb(255, 166, 0)"> </span>
                                        </div>
                                    </Col>
                                    <Col span="12" class="right">
                                        <div>
                                            保质期：<span v-text="fetchData.shelf_life"></span>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="12" offset="4" class="right">
                            <div class="next">
                                <Row>
                                    <Col span="24">
                                        <div v-text="fetchData.name">
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="12" offset="4" class="right">
                            <Button type="primary" disabled style="margin-top:12px">继续选购</Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="12" offset="4" class="right">
                            <div>--商品信息--</div>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="20" class="right">
                            <Upload ref="prepareFileUpload"
                                name="UploadForm[file]"
                                :on-progress="coaProgressFile"
                                :default-file-list="formData.imgDetailIntroduction"
                                :on-success="exampleSuccess"
                                :on-remove="exampleRemove"
                                :on-format-error="fileFormatError"
                                :max-size="51200"
                                :on-exceeded-size="fileMaxSize"
                                type="drag"
                                :action="fileUploadURL"
                                :headers="fileUploadHeaders"
                                :before-upload="introductionBeforeUpload"
                                style="display: inline-block;width:400px">
                                    <div class="breadth exampleUP">
                                        <Icon type="md-add" size="20">

                                        </Icon>
                                        <i>请上传产品介绍图</i>
                                    </div>
                                </Upload>
                        </Col>
                        <Col span="4" class="right" style="color:red;text-align: right;line-height: 40px;">
                               <div>不限制*750</div>
                        </Col>
                    </Row>
                    <!-- <Row>
                        <Col span="12" class="right">
                            <Button type="primary" @click="continueAdd">继续添加</Button>
                            <Button type="error" @click="deleImg">删除</Button>
                        </Col>
                    </Row>  -->
                    <Row>
                        <Col span="12" style="float:right">
                            <Button type="warning" @click="preview('have')">预览</Button>
                            <Button type="info" @click="save">保存</Button>
                        </Col>
                    </Row>
                </Col>
                <Col span="12" class="right" style="height: 743px;overflow-y: overlay" v-if="isPreview">
                    <Row>
                        <Col span="20" class="right">
                            <div><strong>小程序预览</strong></div>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="20" class="right">
                            <div><strong>商品详情展示</strong></div>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="20" class="right">
                            <Carousel v-model="value" loop>
                                <CarouselItem v-for="(item, index) in formData.imgDetailHead" :key="index">
                                    <div class="demo-carousel">
                                        <img :src="baseUrl + item.url" alt="" style="width:400px;margin-top:-6px">
                                    </div>
                                </CarouselItem>
                            </Carousel>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="12" offset="4" class="right">
                            <div >
                                <Row>
                                    <Col span="12" class="right">
                                        <div >
                                            统一零售价：<span v-text="'￥'+fetchData.price" style="color:rgb(255, 166, 0)"></span>
                                        </div>
                                    </Col>
                                    <Col span="12" class="right">
                                        <div >
                                            规格：<span v-text="fetchData.standard + 'g'"></span>
                                        </div>
                                    </Col>
                                </Row>
                                <Row>
                                    <Col span="12" class="right">
                                        <div>
                                            供货价：<span v-text="fetchData.supply_price" style="color:rgb(255, 166, 0)"> </span>
                                        </div>
                                    </Col>
                                    <Col span="12" class="right">
                                        <div>
                                            保质期：<span v-text="fetchData.shelf_life + '个月'"></span>
                                        </div>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="12" offset="4" class="right">
                            <div >
                                <Row>
                                    <Col span="24">
                                    <div style="text-align:left;display: inline-block;">
                                        <strong v-text="fetchData.name" >
                                        </strong>
                                    </div>
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="12" offset="4" class="right">
                            <Button type="primary" style="margin-top:12px;width: 100px;border-radius: 15px;">继续选购</Button>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="12" offset="4" class="right">
                            <div>--商品信息--</div>
                        </Col>
                    </Row>
                    <Row>
                        <Col span="20" class= "right" >
                            <img v-for="(item, index) in formData.imgDetailIntroduction" :key="index" :src="baseUrl + item.url" alt="" style="width:400px;margin-top:-6px">
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Card>
    </div>
</template>
<script>
import Cookies from 'js-cookie'
import { SERVER_BASE_URL } from '~/api/config';
export default {
    name: '',
    data () {
        return {
            value:0,
            baseUrl:  `${SERVER_BASE_URL}/`,
            fileUploadURL: `${SERVER_BASE_URL}/v1/upload`,
            fileUploadHeaders: {
                Authorization: Cookies.get('authorization')
            },
            formData:{
                imgDetailHead:[],
                imgDetailIntroduction:[],
                imgListShow:[]
            },
            allImg:[],
            fetchData:{},
            isPreview:false
        };
    },
    methods: {
        //图片上传限制
            handleBeforeUpload (file) {
               const check = this.formData.imgDetailHead.length < 1;
                if (!check) {
                    this.$Notice.warning({
                        title: '只能上传一张头图'
                    });
                }
                return check && this.checkImageWH(file,750,750);
            },

            introductionBeforeUpload (file) {
                return this.checkImageW(file,750);
            },

            //判断 在上传之前 判断图片的宽度
            checkImageW(file, width) {
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
         // 文件上传限制
            fileMaxSize (file) {
                this.$Notice.warning({
                    title: '超出文件大小限制',
                    desc: '文件 ' + file.name + ' 太大，不能超过 50M。'
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
                    this.formData.imgDetailHead.push(data);
                }
            },
            exampleSuccess (res, file) {
                // 上传成功
                this.isShowProgress = false;
                if (res.status) {
                    let data = res.data;
                    this.formData.imgDetailIntroduction.push(data);
                }
            },
            // 移除附件文件
            filePrepareRemove (file) {
                const fileList = this.formData.imgDetailHead;
                this.imgDetailHeadfile = file
                let obj = this.formData.imgDetailHead.splice(fileList.indexOf(file), 1);
            },
            // 移除附件文件
            exampleRemove (file) {
                this.imgDetailIntroductionfie = file
                const fileList = this.formData.imgDetailIntroduction;
                let obj = this.formData.imgDetailIntroduction.splice(fileList.indexOf(file), 1);
            },
            // 删除图片
            // deleImg () {
            //     const imgDetailfileList = this.formData.imgDetailHead;
            //     const protectfileList = this.formData.imgDetailIntroduction;
            //     let obj = this.formData.imgDetailIntroduction.splice(protectfileList.indexOf(this.imgDetailIntroductionfie), 1);
            //     let objs = this.formData.imgDetailHead.splice(protectfileList.indexOf(this.imgDetailHeadfile), 1);
            // },
            // continueAdd () {
            //     let allImg = this.allImg;
            //     allImg = [
            //         {imgDetailIntroduction:this.formData.imgDetailIntroduction,
            //         imgDetailHead:this.formData.imgDetailHead}
            //     ]
            //     console.log(allImg);
            // },
            save () {
                this.$api.productDetailSetting (
                    {
                        id:this.queryId,
                        imgDetailHead:this.formData.imgDetailHead,
                        imgDetailIntroduction:this.formData.imgDetailIntroduction
                    }
                )
                .then((result) => {
                    if(result.code == 0) {
                        this.$Message.success(result.message);
                        this.$router.push({ path: '/products/product' });
                    }
                })
            },

            preview (view) {
                if (view == 'have') {
                        this.isPreview  = true;
                }
            },

            fetch (view) {
                let id = this.queryId
                this.$api.productManagementDetails(id)
                .then(res => {
                    this.fetchData = res.data;
                    if (this.fetchData.imgDetailHead.length !=0) {
                        this.formData.imgDetailHead = [
                            {
                                name:res.data.imgDetailHead[0],
                                url:res.data.imgDetailHead[0]
                            }
                        ]
                    }
                    res.data.imgDetailIntroduction.forEach((value, index) => {
                        if (this.fetchData.imgDetailIntroduction.length !=0) {
                            this.formData.imgDetailIntroduction.push(
                                {
                                    name:res.data.imgDetailIntroduction[index],
                                    url:res.data.imgDetailIntroduction[index]
                                }
                            )
                        }
                    });

                })
            }
    },
    mounted () {
        this.queryId = this.$route.query.id;
        this.fetch()
    }
};
</script>

<style lang="less">
    .left {
        border-right: 1px solid #eee;
    }
    .right {
        text-align:center;
        overflow: hidden;
    }
    .addUp {
        line-height: 400px;
        background: #eee
    }
    .exampleUP {
        line-height: 80px;
        height: 80px;
    }
    .title {
        border: 1px solid #eee;
        border-radius: 12px;
        padding: 12px;
        margin-top:10px;
    }
    .next {
        border: 1px solid #eee;
        padding: 12px;
        margin-top:10px;
    }
</style>

