<style lang="less">
  @import "./index.less";
  @import "../assets/common.less";
</style>
<template>
  <div class="home-main">
    <Row :gutter="10">
      <Col :md="24" :lg="24">
        <Row class-name="home-page-row1" :gutter="10">
          <Col :md="24" :lg="24" :style="{marginBottom: '10px'}">
            <Card>
              <p slot="title" class="card-title">
                <Icon type="android-checkbox-outline"></Icon>
                待办事项
              </p>
              <div class="rel">
                <div v-show="toDoList.length" class="to-do-list-con">
                  <Row class="to-do-list-row">
                    <Col v-for="(item, index) in toDoList" :key="'todo-item' + (toDoList.length - index)" class="to-do-item" :xs="24" :sm="12" :md="6" :lg="6">
                      <div class="to-do-list-item">
                        <a :href="item.url+(item.url.indexOf('?') != -1?'\&id_collect='+item.id_collect:'\?id_collect='+item.id_collect)" @click="readMessage(item.module_status, item.type,)">
                          <span class="wind-rc"><Icon type="ios-notifications" /></span>
                          {{ item.content }}
                          <Badge :count="item.count" overflow-count="99"></Badge>
                        </a>
                      </div>
                    </Col>
                  </Row>
                </div>
                <div v-show="!toDoList.length" class="to-do-list-con">暂无</div>
                <Spin v-show="loading" :fix="true" size="large"></Spin>
              </div>
            </Card>
          </Col>
        </Row>
        <Row class-name="home-page-row1" :gutter="10" style="display: none;">
          <Col :md="12" :lg="12" :style="{marginBottom: '10px'}">
            <Card>
              <Row type="flex" class="user-infor">
                <Col span="8">
                  <Row class-name="made-child-con-middle" type="flex" align="middle">
                    <img class="avator-img" :src="avatorPath" />
                  </Row>
                </Col>
                <Col span="16" style="padding-left:6px;">
                  <Row class-name="made-child-con-middle" type="flex" align="middle">
                    <div>
                      <b class="card-user-infor-name">Admin</b>
                      <p>super admin</p>
                    </div>
                  </Row>
                </Col>
              </Row>
              <div class="line-gray"></div>
              <Row class="margin-top-8">
                <Col span="8"><p class="notwrap">上次登录时间:</p></Col>
                <Col span="16" class="padding-left-8">2017.09.12-13:32:20</Col>
              </Row>
              <Row class="margin-top-8">
                <Col span="8"><p class="notwrap">上次登录地点:</p></Col>
                <Col span="16" class="padding-left-8">广州</Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </Col>
    </Row>
  </div>
</template>

<script>
  import Cookies from 'js-cookie'
  export default {
    name: 'home',
    data () {
      return {
        loading: false,
        toDoList: [],
        userAuthorization: {
          Authorization: Cookies.get('authorization')
        }
      };
    },
    computed: {
      avatorPath () {
        // return localStorage.avatorImgPath;
        return '';
      }
    },
    methods: {
      // 获取待办事项
      getToDoList () {
        this.$api.informationModular()
          .then(res => {
            this.toDoList = res.items;
            this.toDoList.map((item) => {
              item.count = Number(item.count);
            })
            this.loading = false;
          });
      },
      // 已读
      readMessage (status, type,id_collect) {
        if (type === 'read') {
          let params = {
            module_status: status
          };
          this.$api.informationRead(params);
        }
      }
    },
    mounted () {
      this.getToDoList();
    }
  };
</script>
