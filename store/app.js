import menuRouter from '~/plugins/router'
import otherRouter from '~/plugins/other-router'
import Util from '~/utils/app.js'
import utils from '~/utils/utils.js'
import Cookies from 'js-cookie'

export const state = () => {
  let routers = Util.flat(menuRouter)
  return {
    pageOpenedList: [
      {
        title: '首页',
        path: '',
        name: 'index'
      }
    ],
    searchList: {
      name: '',
      query: {}
    },
    routers: [...routers, ...otherRouter],
    routerList: [],
    menuList: [],
    currentPath: [],
    messageCount: 0,
  }
}
export const mutations = {
  // 打开页面
  openPage (state, newRoute) {
    let name = newRoute.name
    // 判断当前小窗口里是否有该页面
    let isHas = state.pageOpenedList.find(item => item.name === name)
    if (isHas) {
      isHas.query = newRoute.query
      // 已有
    } else {
      // 新页面
      let item = state.routers.find(item => item.name === name)
      if (item) {
        state.pageOpenedList.push({
          title: item.title,
          path: '',
          query: newRoute.query,
          name: name
        })
      } else {
        state.pageOpenedList.push({
          title: '未定义页面',
          path: '',
          query: newRoute.query,
          name: name
        })
      }
    }
    this.commit('app/setTabLocal')
  },
  // 关闭某个页面
  closeTag (state, name) {
    let index = null;
    state.pageOpenedList.find((item, i) => {
      if (item.name === name) {
        index = i
      }
      return item.name === name
    })
    state.pageOpenedList.splice(index, 1)
    this.commit('app/setTabLocal')
  },
  // 关闭所有页面
  clearAllTags (state) {
    state.pageOpenedList = [
      {
        title: '首页',
        path: '',
        name: 'index'
      }
    ]
    this.commit('app/setTabLocal')
  },
  // 关闭其他页面
  clearOtherTags (state, name) {
    let keepItem = null
    let result = [
      {
        title: '首页',
        path: '',
        name: 'index'
      }
    ]
    if (name !== 'index') {
      keepItem = state.pageOpenedList.find(item => item.name === name)
    }
    if (keepItem) {
      result.push(keepItem)
    }
    state.pageOpenedList = result
    this.commit('app/setTabLocal')
  },
  // 保存打开页面栈道
  setTabLocal (state) {
    // console.log("setTabLocal:",state);
    let tapArr = state.pageOpenedList.map(item => {
      return item.title && item.title !== '未定义页面' && item.name !== 'index' ? item : null
    })
    tapArr = tapArr.filter(item => item)
    localStorage.setItem('inventory_tag', JSON.stringify(tapArr))
  },
  init (state) {
    let selectTag = JSON.parse(localStorage.getItem('inventory_tag')) || []
    state.pageOpenedList = [
      {
        title: '首页',
        path: '',
        name: 'index'
      },
      ...selectTag
    ]
  },
  updateMenulist (state) {
    let accessCode = parseInt(Cookies.get('access'));
    let menuList = [];
    menuRouter.forEach((item, index) => {
      if (item.access !== undefined) {
        if (utils.showThisRoute(item.access, accessCode)) {
          if (item.children.length === 1) {
            menuList.push(item);
          } else {
            let len = menuList.push(item);
            let childrenArr = [];
            childrenArr = item.children.filter(child => {
              if (child.access !== undefined) {
                if (child.access === accessCode) {
                  return child;
                }
              } else {
                return child;
              }
            });
            menuList[len - 1].children = childrenArr;
          }
        }
      } else {
        if (item.children.length === 1) {
          menuList.push(item);
        } else {
          let len = menuList.push(item);
          let childrenArr = [];
          childrenArr = item.children.filter(child => {
            if (child.access !== undefined) {
              if (Util.showThisRoute(child.access, accessCode)) {
                return child;
              }
            } else {
              return child;
            }
          });
          if (childrenArr === undefined || childrenArr.length === 0) {
            menuList.splice(len - 1, 1);
          } else {
            let handledItem = JSON.parse(JSON.stringify(menuList[len - 1]));
            handledItem.children = childrenArr;
            menuList.splice(len - 1, 1, handledItem);
          }
        }
      }
    });
    state.menuList = menuList;
  },
  setSearchList(state, payload) {
    state.SearchList = payload
  },
  setCurrentPath(state, payload) {
    state.currentPath = [
      {
        title: '首页',
        name: '/',
        path: '/'
      },
      ...payload
    ]

  },
  setRouterList(state, payload){
    state.routerList = payload
  },
  setMessageCount (state, count) {
    state.messageCount = count;
  },
  removeTag(state,newRoute) {
    console.log("removeTag",state);
  },
}
