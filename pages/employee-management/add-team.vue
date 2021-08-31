<template>
  <div>
   <Card>
     <Row>
       <div class="team-title">团队信息</div>
       <Form ref="teamForm" inline :model="teamForm" :label-width="75" :rules="rules">
         <Row>
           <FormItem label="团队名称" prop="team_name">
             <Input class="width-200px" v-model="teamForm.team_name"/>
           </FormItem>
           <FormItem label="选择渠道" prop="channel">
             <Select class="width-200px" placeholder="选择渠道" v-model="teamForm.channel" @on-change="channelChange">
               <Option v-for="item in channelList" :key="item.value" :value="item.value">{{ item.label }}</Option>
             </Select>
           </FormItem>
           <FormItem label="启用/禁用" prop="team_status">
             <Select class="width-200px" v-model="teamForm.team_status">
               <Option :value="1"> 启用 </Option>
               <Option :value="0"> 禁用 </Option>
             </Select>
           </FormItem>
         </Row>
         <Row class="margin-bottom-10">
           <FormItem label="备注" >
             <Input style="width: 777px"  v-model="teamForm.team_remark"/>
           </FormItem>
         </Row>
       </Form>
     </Row>

     <Row>
       <div class="team-title">分队信息</div>
       <Form ref="unitTeamForm" inline :model="unitTeamForm" :label-width="70">
         <Row type="flex" v-for="(team, index) in unitTeamForm.teams" :key="index">
           <Row class="unit-team-items">
             <Col>
               <FormItem label="分队名称">
                 <Input style="width: 484px" v-model="team.team_name"/>
               </FormItem>
<!--               <FormItem label="选择渠道">-->
<!--                 <Select class="width-200px" placeholder="选择渠道" v-model="team.channel">-->
<!--                   <Option v-for="item in channelList" :key="item.value" :value="item.value">{{ item.label }}</Option>-->
<!--                 </Select>-->
<!--               </FormItem>-->
               <FormItem label="启用/禁用">
                 <Select class="width-200px" v-model="team.team_status">
                   <Option :value="1"> 启用 </Option>
                   <Option :value="0"> 禁用 </Option>
                 </Select>
               </FormItem>
             </Col>
             <Col>
               <FormItem label="备注">
                 <Input style="width: 769px"  v-model="team.team_remark"/>
               </FormItem>
             </Col>
           </Row>
           <Row class="padding-left-20">
             <Button @click="addUnitTeam" v-if="index === 0"><Icon type="md-add" size="18"/></Button>
             <Button @click="removeUnitTeam(index)" v-else><Icon type="md-remove" size="18"/></Button>
           </Row>
         </Row>
       </Form>

     </Row>
     <Row type="flex" justify="end" class="margin-top-10">
       <Button @click="$router.push('/employee-management/team-management')">返回</Button>
       <Button type="primary" class="margin-left-10 margin-right-10" @click="save('teamForm')" :loading="submintLodaing">保存</Button>
     </Row>
     <Spin size="large" fix v-if="spinShow"></Spin>
   </Card>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        submintLodaing: false,
        spinShow: false,
        teamForm: {
          team_name: '',
          channel: '其他',
          team_status: 1,
          team_remark: ''
        },
        unitTeamForm: {
          teams: [{
            team_name: '',
            channel: '其他',
            team_status: 0,
            team_remark: ''
          }]
        },
        rules: {
          team_name: [{required: true, message: '必填项', trigger: 'blur'}],
          channel: [{required: true, message: '必填项', trigger: 'change'}],
          team_status: [{required: true, type: 'number', message: '必填项', trigger: 'change'}]
        },
        channelList: [
          {value: 'CS', label: 'CS'},
          {value: 'KA', label: 'KA'},
          {value: 'OTC', label: 'OTC'},
          {value: '便利店', label: '便利店'},
          {value: '其他', label: '其他'}
        ],
      }
    },
    methods: {
      channelChange() {
        this.unitTeamForm.teams.map(items => {
          items.channel = this.teamForm.channel
        })
        console.log(this.unitTeamForm.teams)
      },
      addUnitTeam() {
        this.unitTeamForm.teams.push({
          team_name: '',
          channel: '其他',
          team_status: 0,
          team_remark: ''
        })
      },
      removeUnitTeam(index) {
        if(this.unitTeamForm.teams.length > 1) {
          if(this.unitTeamForm.teams[index].id) {
            this.$api.delTeamManagement({
              id: this.unitTeamForm.teams[index].id,
              uuid: this.unitTeamForm.teams[index].uuid
            }).then(() => {
              this.$Message.success('删除成功')
              this.unitTeamForm.teams.splice(index, 1)
            })
          }else {
            this.unitTeamForm.teams.splice(index, 1)
          }
        }
      },

      save(form) {
        this.$refs[form].validate(val => {
          // console.log(val)
          if (!val) return

          let apiKey = 'addTeamManagement'
          let params = JSON.parse(JSON.stringify(this.teamForm))
          params.children = JSON.parse(JSON.stringify(this.unitTeamForm.teams))

          if(params.children.length > 0) {
            let children = [...new Set(params.children.map(items => items.team_name))]
            if(children.length !== params.children.length) return this.$Message.warning('分队名称不可重复')
          }
          this.submintLodaing = true

          try {
            for(let key in params) {
              if(params[key] !== 0 && !params[key]) {
                delete params[key]
              }
            }

            if(params.children.length > 0) {
              params.children.filter(items => {
                if(!items.team_name) {
                  let index = params.children.findIndex(team => team)
                  params.children.splice(index, 1)
                }else {
                  for(let itemKey in items) {
                    if(items[itemKey] !== 0 && !items[itemKey]) {
                      if(itemKey !== 'team_remark'){
                        delete items[itemKey]
                      }
                    }
                  }
                }
              })
            }else {
              delete params.children
            }
          } catch (err) {
            console.log(err.message)
          }

          params.children && params.children.length === 0 && (delete params.children)

          // return console.log(params)
          this.uuid && (apiKey = 'editTeamManagement')

          this.$api[apiKey](params).then(res => {
            if (res.code !== 0) return
            this.$Message.success(res.message   )
            this.$router.push('/employee-management/team-management')
            this.submintLodaing = false
          })
        })
      },


      // 详情
      getTeamManagementDetail(uuid) {
        this.spinShow = true
        this.$api.getTeamManagementDetail({uuid}).then(res => {
          if (res.code !== 0) return
          this.teamForm = res.data
          this.unitTeamForm.teams = res.data.children.length === 0 ? this.unitTeamForm.teams : res.data.children
          this.spinShow = false
        })
      },
    },
    mounted() {
      this.uuid = this.$route.query.uuid || ''
      this.uuid && this.getTeamManagementDetail(this.uuid)
    }
  }
</script>

<style scoped>
  .width-200px {
    width: 200px;
  }
  .team-title {
    margin-bottom: 15px;
    font-size: 16px;
    font-weight: 700;
  }
  .unit-team-items {
    padding-top: 24px;
    margin-bottom: 15px;
    border: 1px dashed #929191;
    border-radius: 5px;
  }
</style>