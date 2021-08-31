<template>
  <div id="footer-page" class="margin-top-10" >
      <div class="pages">共 {{pageProps.count}} 条</div>
      <div>
        <Page size="small"
              :total="pageProps.count"
              :current="pageProps.page"
              show-sizer show-elevator
              @on-change="changePage"
              :page-size-opts="pageArr"
              :page-size="pageProps.perPage"
              @on-page-size-change="changePageSize"></Page>
      </div>
  </div>
</template>

<script>
  import Cookies from 'js-cookie'
  export default {
    // props:['meta'],
    props:['meta'],
    name: "public-footer-page",
    data(){
      return{
        pageProps: { // 列表分页属性
          count: 0, // 数据总数
          page: 1, // 当前页码
          pageCount: 1 // 共分页总数
        },
        pageArr: [],
        pageInfo: {
          page: 1,
          perPage: 10
        }
      }
    },
    methods:{
      // 改变页数
      changePage (e) {
        // console.log('改变前的显示页数',  this.pageProps.page);
        this.pageProps.page = e;
        // console.log('改变后的显示页数', this.pageProps.page);
        // this.pageInfo.page = this.pageProps.page
        // Cookies.set('pageInfo', JSON.stringify(this.pageInfo))
      },
      // 改变显示条数
      changePageSize (e) {
        // console.log('改变前的显示条数',  this.pageProps.perPage);
        this.pageProps.perPage = e;
        // console.log('改变后的显示条数', this.pageProps.perPage);
        // this.pageInfo.perPage = this.pageProps.perPage
        // Cookies.set('pageInfo', JSON.stringify(this.pageInfo))
      },
    },
    computed:{
      perPage(){
        // console.log('computed监听perPage发生改变');
        return this.pageProps.perPage;
      },
      page(){
        // console.log('computed监听perPage发生改变');
        return this.pageProps.page;
      }
    },
    watch:{
      // 监听传过来的meta数据变化
      meta:{
        handler(newVal,oldVal){
          // console.log('meta的新值 ',newVal)
          // console.log('meta的旧值 ',oldVal)
          if(newVal != oldVal){
            // console.log('两个meta不相同！');
            let params = JSON.parse(JSON.stringify(this.meta)); // 拷贝传过来的数据
            // console.log('拷贝后的params！', this.meta)

            if(this.meta.data){
              delete params.data;
            }
            this.pageProps = params;
          }
        },
        deep:true
      },
      perPage:{
        handler(newVal,oldVal){
          // console.log('全局组件的pageProps发生变化前',oldVal);
          // console.log('全局组件的pageProps发生变化后',newVal);
          if(newVal !== oldVal){
            let params = {};
            params.page = this.pageProps.page;
            params.perPage = this.pageProps.perPage;
            if(this.meta.data){
              delete params.data;
            }
            // console.log('------perPage传输中-------',params);
            this.$emit('changePage', params);

          }
        },
        deep:true
      },

      page:{
        handler(newVal,oldVal){
          // console.log('全局组件的page发生变化前!',oldVal);
          // console.log('全局组件的page发生变化后!',newVal);
          if(newVal !== oldVal){
            let params = this.pageProps;
            if(this.meta.data){
              delete params.data;
            }
            // console.log('page改变时pamrams的数据',params)
            // console.log('------page传输中-------',params);
            this.$emit('changePage', params);
          }
        },
        deep:true
      },
    },
    created() {},
    mounted() {
      this.pageArr = [10,20,30,40]
      // let paramsPageInfo = Cookies.get('pageInfo')
      // if (paramsPageInfo) {
      //   this.$set(this.pageProps, 'page', JSON.parse(paramsPageInfo).page)
      //   this.$set(this.pageProps, 'perPage', JSON.parse(paramsPageInfo).perPage)
      // }
      // console.log('12121212121', this.pageProps);
      if(this.meta){
        // this.pageProps = this.meta;
        // this.randomNumber();
        //   console.log('全局组件挂载时的meta',this.meta);

      }
    }
  }
</script>

<style scoped>
#footer-page{
  display: flex;
  justify-content: space-between;
}
  .ivu-page.mini{
    margin-bottom: 4px;
    display: flex;
  }
</style>
