
export const state = () => ({
  counter: 0,
  page: {},
})

export const mutations = {
  increment(state) {
    state.counter++
  },
  // 删除面包屑tag
  removeTag(state,routeName) {
    state.app.pageOpenedList.splice(state.app.pageOpenedList.findIndex(item => item.name === routeName ),1)
  },
}
