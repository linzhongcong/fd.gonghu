<style lang="less">
@import './login.less';
</style>

<template>
  <div class="login" @keydown.enter="handleSubmit">
    <div class="login-con">
      <Card :bordered="false">
        <div class="header">
          <img src="../assets/images/logo.png" class="logo" />
        </div>
        <div class="welcome">
          <img src="../assets/images/login-title2.png" />
        </div>
        <div class="body form-con">
          <Form ref="loginForm" :model="form" :rules="rules">
            <FormItem prop="username">
              <Input v-model="form.username" placeholder="Username" @on-change="changeUser">
                <span slot="prepend">
                  <img src="../assets/images/login-icon_people.png" />
                </span>
              </Input>
            </FormItem>
            <FormItem prop="password">
              <Input
                v-model="form.password"
                type="password"
                placeholder="Password"
              >
                <span slot="prepend">
                  <img src="../assets/images/login-icon_lock.png" />
                </span>
              </Input>
            </FormItem>
            <FormItem
              prop="captcha"
              style="display: flex; height: 30px;"
              v-if="showCaptcha"
            >
              <Input
                v-model="form.captcha"
                placeholder="验证码"
                prop="captcha"
                style="width: 50%; border: 1px solid #dddee1"
              />
              <Button
                type="primary"
                style="flex: 1"
                @click="getCaptcha"
                :disabled="!canGetCaptcha"
                >获取验证码</Button
              >
            </FormItem>
            <FormItem>
              <Button
                type="primary"
                long
                :loading="loading"
                @click="handleSubmit"
              >
                登录
              </Button>
            </FormItem>
          </Form>
        </div>
      </Card>
      <div class="swiper">
        <Carousel autoplay>
          <Carousel-item>
            <div class="demo-carousel">
              <img src="../assets/images/login_swiper_01.jpg" />
            </div>
          </Carousel-item>
          <Carousel-item>
            <div class="demo-carousel">
              <img src="../assets/images/login_swiper_02.jpg" />
            </div>
          </Carousel-item>
          <Carousel-item>
            <div class="demo-carousel">
              <img src="../assets/images/login_swiper_03.jpg" />
            </div>
          </Carousel-item>
        </Carousel>
      </div>
    </div>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import { FILE_BASE_URL } from '../api/config'

export default {
  layout: 'full',
  data() {
    return {
      loading: false,
      form: {},
      rules: {
        username: [
          { required: true, message: '账号不能为空', trigger: 'blur' },
        ],
        password: [
          { required: true, message: '密码不能为空', trigger: 'blur' },
        ],
      },
      showCaptcha: false,
      canGetCaptcha: true,
    }
  },
  destroyed() {
    this.timer && clearInterval(this.timer)
  },
  methods: {
    handleSubmit() {
      this.$refs.loginForm.validate((valid) => {
        if (valid) {
          this.loading = true
          window.localStorage.removeItem('menus')
          window.localStorage.removeItem('permissionList')
          this.$api
            .login(this.form)
            .then((res) => {
              if (res.code === 400) {
                this.showCaptcha = true
              } else if (res.code === 200) {
                this.$Message.success('登录成功') 
                this.$store.commit('app/clearAllTags')
                function randomNum(minNum,maxNum){ 
                  switch(arguments.length){ 
                    case 1: 
                      return parseInt(Math.random()*minNum+1,10); 
                      break; 
                    case 2: 
                      return parseInt(Math.random()*(maxNum-minNum+1)+minNum,10); 
                      break; 
                    default: 
                      return 0; 
                    break; 
                  }
                }
                Cookies.set('user', this.form.username, { expires: 1 })
                Cookies.set('authorization', res.data.authorization, {
                  expires: 1,
                })
                Cookies.set('real_name', res.data.real_name, { expires: 1 })
                Cookies.set('username', res.data.username, { expires: 1 })
                this.$router.push({ path: '/' })
              }
            })
            .finally(() => {
              this.loading = false
            })
        }
      })
    },
    getCaptcha() {
      this.canGetCaptcha = false
      let firstTime = Date.now()
      this.timer = setInterval(() => {
        let diff = Date.now() - firstTime
        if(diff >= 300000) { // 验证码5分钟失效
          this.canGetCaptcha = true
          clearInterval(this.timer)
        }
      }, 1000)
      this.$api.getCaptcha({jobnum: this.form.username}).then(res => {
        if(res.code !== 200) return
        this.$Message.success(res.message)
      })
    },
    changeUser () {
      this.showCaptcha = false;
      this.canGetCaptcha = true
      clearInterval(this.timer)
    }
  },
}
</script>
