import Cookie from 'js-cookie'

export default {
  // 获取服务端cookie
  getCookiesInServer: (req) => {
    const serviceCookie = {}
    req &&
    req.headers.cookie &&
    req.headers.cookie.split(';').forEach((val) => {
      const parts = val.split('=')
      serviceCookie[parts[0].trim()] = (parts[1] || '').trim()
    })
    return serviceCookie
  },
  // 获取客户端cookie
  getCookiesInClient: (key) => {
    return Cookie.get(key) ? Cookie.get(key) : ''
  },
  oneOf: (ele, targetArr) => {
    if (targetArr.indexOf(ele) >= 0) {
      return true;
    } else {
      return false;
    }
  },
  showThisRoute(itAccess, currentAccess) {
    if (typeof itAccess === 'object' && Array.isArray(itAccess)) {
      return this.oneOf(currentAccess, itAccess);
    } else {
      return itAccess === currentAccess;
    }
  },

  // openNewPage(vm, name, argu, query) {
  //   let pageOpenedList = vm.$store.state.app.pageOpenedList;
  //   let openedPageLen = pageOpenedList.length;
  //   let i = 0;
  //   let tagHasOpened = false;
  //   while (i < openedPageLen) {
  //     if (name === pageOpenedList[i].name) { // 页面已经打开
  //       vm.$store.commit('pageOpenedList', {
  //         index: i,
  //         argu: argu,
  //         query: query
  //       });
  //       tagHasOpened = true;
  //       break;
  //     }
  //     i++;
  //   }
  //   if (!tagHasOpened) {
  //     let tag = vm.$store.state.app.tagsList.filter((item) => {
  //       if (item.children) {
  //         for (let i = 0; i < item.children.length; i++) {
  //           return name === item.children[i].name;
  //         }
  //       } else {
  //         return name === item.name;
  //       }
  //     });
  //     tag = tag[0];
  //     if (tag) {
  //       tag = tag.children ? tag.children[0] : tag;
  //       if (argu) {
  //         tag.argu = argu;
  //       }
  //       if (query) {
  //         tag.query = query;
  //       }
  //       // vm.$store.commit('increateTag', tag);
  //     }
  //   }
  //   // vm.$store.commit('setCurrentPageName', name);
  // }
}
