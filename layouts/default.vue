<style lang="less">
@import '~assets/main.less';
@import '~assets/common.less';
</style>

<template>
  <div class="main" :class="{ 'main-hide-text': shrink }">
    <div class="sidebar-menu-con" :style="{ width: shrink ? '60px' : '200px', overflow: shrink ? 'visible' : 'auto' }">
      <shrinkable-menu
        :shrink="shrink"
        :theme="menuTheme"
        :before-push="beforePush"
        :open-names="openedSubmenuArr"
        :menu-list="menuList"
        @on-change="handleSubmenuChange"
      >
        <div slot="top" class="logo-con">
          <img v-show="!shrink" key="max-logo" src="~assets/images/logo.png" />
          <img v-show="shrink" key="min-logo" src="~assets/images/logo-min.png" />
        </div>
      </shrinkable-menu>
    </div>
    <div class="main-header-con" :style="{ paddingLeft: shrink ? '60px' : '200px' }">
      <div class="main-header">
        <div class="navicon-con">
          <Button
            :style="{ transform: 'rotateZ(' + (shrink ? '-90' : '0') + 'deg)', padding: '5px 10px 6px', marginTop: '2px' }"
            type="text"
            @click="toggleClick"
          >
            <Icon type="md-menu" size="24" />
          </Button>
        </div>
        <div class="header-middle-con">
          <div class="main-breadcrumb">
            <breadcrumb-nav :current-path="currentPath"></breadcrumb-nav>
          </div>
        </div>
        <div class="header-avator-con">
          <div class="full-screen-btn-con" @click="handleRefresh">
            <Tooltip content="刷新" placement="bottom">
              <Icon type="md-refresh" :size="23" />
            </Tooltip>
          </div>
          <full-screen v-model="isFullScreen" @on-change="fullscreenChange"></full-screen>
          <!-- <lock-screen></lock-screen> -->
          <message-tip v-model="mesCount"></message-tip>
          <div class="user-dropdown-menu-con">
            <Row type="flex" justify="end" align="middle" class="user-dropdown-innercon">
              <Dropdown transfer trigger="click" @on-click="handleClickUserDropdown">
                <a href="javascript:void(0)">
                  <span class="main-user-name">{{ userInfo.realName }}</span>
                  <Icon type="md-arrow-dropdown" />
                </a>
                <DropdownMenu slot="list">
                  <DropdownItem name="ownSpace">个人中心</DropdownItem>
                  <DropdownItem name="loginout">退出登录</DropdownItem>
                </DropdownMenu>
              </Dropdown>
              <Avatar :src="userInfo.avatar" style="background: #619fe7;margin-left: 10px;"></Avatar>
            </Row>
          </div>
        </div>
      </div>
      <div class="tags-con">
        <tags-page-opened :page-tags-list="pageTagsList"></tags-page-opened>
      </div>
    </div>
    <div class="single-page-con" :style="{ left: shrink ? '60px' : '200px' }">
      <div class="single-page">
        <nuxt ref="viewContent" keep-alive :keepAliveProps="{ include: keepArr, max: 5 }" />
      </div>
    </div>
  </div>
</template>

<script>
import Cookies from 'js-cookie'
import routers from '~/plugins/router'
import shrinkableMenu from '~/components/shrinkable-menu/shrinkable-menu.vue'
import tagsPageOpened from '~/components/tags-page-opened.vue'
import breadcrumbNav from '~/components/breadcrumb-nav.vue'
import fullScreen from '~/components/full-screen.vue'
import footerPage from '~/components/public-footer-page.vue'
// import lockScreen from '~/components/lockscreen/lockscreen.vue'
import messageTip from '~/components/message-tip.vue'
import otherRouter from '~/plugins/other-router'
import appUtils from '~/utils/app.js'

export default {
  middleware: 'auth',
  components: {
    shrinkableMenu,
    tagsPageOpened,
    breadcrumbNav,
    fullScreen,
    footerPage,
    // lockScreen,
    messageTip,
  },
  head() {
    return {
      title: '线下供货系统_凡岛',
    }
  },
  data() {
    return {
      shrink: false,
      userInfo: {},
      isFullScreen: false,
      openedSubmenuArr: [],
      menuList: [],
      beforePush: true,
      keepArr: appUtils
        .flat([...routers, ...otherRouter])
        .filter((item) => item.keepName)
        .map((item) => item.keepName),
    }
  },
  computed: {
    pageTagsList() {
      return this.$store.state.app.pageOpenedList // 打开的页面的页面对象
      // return []
    },
    currentPath() {
      // console.log(this.$store)
      return this.$store.state.app.currentPath // 当前面包屑数组
      // return []
    },
    avatorPath() {
      // return localStorage.avatorImgPath
      return ''
    },
    menuTheme() {
      // return this.$store.state.app.menuTheme
      return 'dark'
    },
    mesCount() {
      return this.$store.state.app.messageCount
    },
  },
  mounted() {
    this.$api.getMenu().then((res) => {
      if (res.code === 0) {
        localStorage.setItem('menus', JSON.stringify(res.data))
        this.initMenu(res.data)
      }
    })
    this.$api.getPermission().then((res) => {
      if (res.code === 0) {
        localStorage.setItem('permissionList', JSON.stringify(res.data))
      }
    })
    // this.menuList = routers;
    this.userInfo = {
      realName: Cookies.get('real_name') ? Cookies.get('real_name') : '',
      userName: Cookies.get('username') ? Cookies.get('username') : '',
      avatar: 'https://oa.fandow.com/public/img/logo-min.png',
    }
    this.$store.commit('app/setMessageCount', 3)
    if (this.$route.path !== '/') {
      this.handleSubmenuChange(this.$route.name)
    }
    this.wmStyle()
    // this.menuList = router // 这行代码是开启所有路由
    // this.userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
    this.$store.commit('app/init')
    this.$store.commit('app/updateMenulist')
    if (!this.$store.state.app.routerList.length) {
      let routerList = appUtils.flat([...routers, ...otherRouter])
      this.$store.commit('app/setRouterList', [...routers, ...routerList])
    }
    this.getCurrentPath(this.$route.name)
  },
  methods: {
    initMenu() {
      let temp = []
      let menuList = this.$store.state.app.menuList
      let localMenus = JSON.parse(localStorage.getItem('menus')) || []
      localMenus.push('/v1/notebook/index')
      menuList.forEach((n, i) => {
        if (!n.children) return
        let firstMenu = {
          children: [],
          icon: n.icon,
          name: n.path,
          path: n.name,
          title: n.title,
        }
        n.children.forEach((child, j) => {
          if (localMenus.indexOf(child.path) >= 0) {
            temp[i] = firstMenu
            temp[i].children.push(child)
          }
          if (temp[i] !== undefined) {
            let secondMenu = {
              children: [],
              name: child.path,
              path: child.name,
              title: child.title,
            }
            if (child.children !== undefined) {
              child.children.forEach((thirdChild, k) => {
                temp[i].children[j] = secondMenu
                temp[i].children[j].children.push(thirdChild)
              })
            }
          }
        })
      })
      temp = temp.filter((d) => d)
      // console.log(Array.from(new Set(temp)))
      // this.menuList = Array.from(new Set(temp));
      this.menuList = Array.from(new Set(temp)).filter((item) => item)
    },
    wmStyle() {
      let style = document.createElement('style')
      style.setAttribute('type', 'text/css')
      // ivu-table-tbody
      style.innerHTML = `
        .ivu-table::before{
        box-sizing: border-box; content: '   ';
        display: block;
        width: 100%;
        height: 100%;
        pointer-events: none;
        background-color: transparent;
        filter: alpha(opacity=70);
        opacity: 0.7;
        z-index: 1000;
        background-image: url('${this.canvasWM({
          content: Cookies.get('username') + ' ' + Cookies.get('real_name'),
        })}')
        }
        .ivu-card {
        background-image: url('${this.canvasWM({
          content: Cookies.get('username') + ' ' + Cookies.get('real_name'),
          fillStyle: '#ededef',
        })}')
        }
        .ivu-modal-body::before {
        background-image: url('${this.canvasWM({
          content: Cookies.get('username') + ' ' + Cookies.get('real_name'),
          fillStyle: '#ededef',
        })}')
        }`
      document.head.appendChild(style)
    },
    canvasWM({
      container = document.body,
      width = '200px',
      height = '100px',
      textAlign = 'center',
      textBaseline = 'middle',
      font = '12px microsoft yahei',
      fillStyle = '#d6d7da',
      content = '请勿外传',
      rotate = '-10',
      zIndex = 1000,
    } = {}) {
      // var args = arguments[0];
      let canvas = document.createElement('canvas')

      canvas.setAttribute('width', width)
      canvas.setAttribute('height', height)
      let ctx = canvas.getContext('2d')

      ctx.textAlign = textAlign
      ctx.textBaseline = textBaseline
      ctx.font = font
      ctx.fillStyle = fillStyle
      ctx.rotate((Math.PI / 180) * rotate)
      ctx.fillText(content, parseFloat(width) / 2, parseFloat(height) / 2)

      let base64Url = canvas.toDataURL()
      return base64Url
    },
    toggleClick() {
      this.shrink = !this.shrink
    },
    handleRefresh() {
      // window.localStorage.removeItem('menus');
      window.location.reload()
    },
    handleClickUserDropdown(name) {
      if (name === 'ownSpace') {
        // utils.openNewPage(this, 'ownspace_index');
        this.$router.push({
          path: '/own-space/own-space',
        })
      } else if (name === 'loginout') {
        // 退出登录
        // this.$store.commit('logout', this)
        // this.$store.commit('clearOpenedSubmenu')
        Cookies.remove('authorization')
        Cookies.remove('pageInfo')
        this.$router.push({
          path: '/login',
        })
      }
    },
    handleSubmenuChange(val) {
      // console.log(val)
    },
    fullscreenChange(isFullScreen) {
      // console.log(isFullScreen);
    },
    getRouterLevel(path, pathArr) {
      let ps = []
      let len = pathArr.length - 1
      ps.push(path)
      while (len > 0) {
        len--
        path = pathArr[len - 1] ? pathArr[len - 1] + '/' + pathArr[len] : pathArr[len]
        ps.push(path)
      }
      return ps
    },
    getCurrentPath(path) {
      // console.log(path, 'path')
      if (!path) return this.$store.commit('app/setCurrentPath', [])
      let pathArr = path.split('/')
      let { routerList } = this.$store.state.app
      // let routerList = this.menuList
      let paths = this.getRouterLevel(path, pathArr)
      let routerName = []
      for (let i = 0; i < paths.length; i++) {
        for (let j = 0; j < routerList.length; j++) {
          if (routerList[j].name === paths[i]) {
            // if(routerName.length > 0 && (routerName.findIndex(items => items.title === routerList[j].title) != -1)) return
            routerName.push({
              title: routerList[j].title,
              name: routerList[j].name,
              path: i === 0 ? routerList[j].name : '',
            })
            break
          }
        }
      }
      let currentPath = routerName.reverse()
      this.$store.commit('app/setCurrentPath', currentPath)
    },
  },
  watch: {
    $route(newVal) {
      this.getCurrentPath(newVal.name)
      let tooltips = document.querySelectorAll('.ivu-tooltip-popper')
      tooltips.forEach((item) => {
        item.style.display = 'none'
      })
      // console.log("newVal:",newVal);
      this.$store.commit('app/openPage', newVal)
    },
  },
}
</script>

<style>
html {
  font-family: 'Source Sans Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

*,
*:before,
*:after {
  box-sizing: border-box;
  margin: 0;
}

h3 {
  font-size: 17px;
}
</style>
