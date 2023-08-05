<template>
  <div>

  <Row type="flex" justify="space-around">
    <Col :span="24" id="status">
      <Alert :type="status.type" showIcon>
        <span class="title">{{$t(status.statusName)}}</span>
        <div slot="desc" class="content">
          <template v-if="isCE">
            <pre>{{submission.display_info}}</pre>
          </template>
          <template v-else>
            <span>{{$t('m.Problem')}}: {{submission.problem}}</span>
            <span>{{$t('m.Lang')}}: {{submission.language}}</span>
            <span>{{$t('m.Author')}}: {{submission.username}}</span>
            <span>{{$t('m.Score')}}: {{submission_score}}</span>
          </template>
        </div>
        <div slot="desc" class="content">
          <span>{{this.display_message}}</span>
        </div>
      </Alert>
    </Col>
  </Row>

  <Row>
    <Col v-if="submission.info && !isCE" :span="24">
      <Table stripe :loading="loading" :disabled-hover="true" :columns="columns" :data="submission_list">
      </Table>
    </Col>
  </Row>


  <!-- <div v-for="(err_info, index) in failed_info" :key="'error-info'+ index"> -->
  <!--   <el-col v-if="err_info" :span="24"> -->
  <!--     <Highlight  :code="err_info.log" :language="txt" :border-color="status.color"></Highlight> -->
  <!--   </el-col> -->
  <!-- </div> -->
  
  <!-- 显示failed info， 折叠， 固定高度 -->
<div class="manualCollapse">
  <el-collapse v-if="failed_info.length > 0" v-model="activeName" @change="handleChange">
    <el-collapse-item  v-for="(err_info, index) in failed_info" :key="index"  
    :name=index  :title="'test case  ' + err_info.testcase_index">
    <!-- :title="'test case  ' + index"  -->
      <p>  Testcase:</p>
      <Highlight :code="JSON.stringify(err_info.testcase)" :language="'language-python'" :border-color="status.color"></Highlight>
      <p>  Testcase Config:</p>
      <Highlight :code="JSON.stringify(err_info.config)" :language="'language-python'" :border-color="status.color"></Highlight>
      <p>  Program Log:</p>
      <Highlight :code="err_info.log" :language="'language-python'" :border-color="status.color"></Highlight>
    </el-collapse-item>
  </el-collapse>
</div>

  <div v-for="(t_code, index) in submission.code_list" :key=index>
    <el-col :span="24">
      <Highlight :code="t_code" :language="submission.language" :border-color="status.color" ></Highlight>
    </el-col>
  </div>

  </div>

</template>

<script>
  import api from '@oj/api'
  import {JUDGE_STATUS} from '@/utils/constants'
  import utils from '@/utils/utils'
  import Highlight from '@/pages/oj/components/Highlight'
  // import { ElCollapse, ElCollapseItem, Row } from 'element-ui'
  
  // import 'element-ui/lib/theme-chalk/index.css'

  export default {
    name: 'submissionDetails',
    components: {
      Highlight
    },
    data () {
      return {
        columns: [
          {
            title: this.$i18n.t('m.ID'),
            align: 'center',
            render: (h, params) => {
              return h('span', {
                style: {
                  color: '#57a3f3',
                  cursor: 'pointer'
                }
              }, params.row.id)
            }
          },
          {
            title: this.$i18n.t('m.Status'),
            align: 'center',
            render: (h, params) => {
              return h('Tag', {
                props: {
                  color: JUDGE_STATUS[params.row.result].color
                }
              }, this.$i18n.t('m.' + JUDGE_STATUS[params.row.result].name.replace(/ /g, '_')))
            }
          }
        ],
        submission: {
          display_info: 'unset',
          problem: '',
          username: '',
          result: '0',
          code_list: [],
          server_list: [],
          language: [],
          info: {},
          id: ''
        },
        submission_list: [],
        isConcat: false,
        loading: false,
        submission_score: 0,
        failed_info: [],
        display_message: '',
        activeName: [],
        itemMaxHeight: 100
        // activeNames: ['1']
      }
    },
    mounted () {
      // setTimeout(() => {
      //   this.itemMaxHeight = this.computedItemHeight()
      //   Array.from(document.querySelectorAll('.el-collapse-item__wrap'))
      //     .forEach((el) => {
      //       el.style.maxHeight = this.itemMaxHeight + 'px'
      //     })
      // }, 1000)
      // this.itemMaxHeight = this.computedItemHeight()
      this.getSubmission()
    },
    methods: {
      handleChange (val) {
        console.log(val)
      },
      // computedItemHeight () {
      //   return window.innerHeight - Array.from(document.querySelectorAll('.el-collapse-item'))
      //     .reduce((s, el) => {
      //       return s + el.children[0].offsetHeight
      //     }, 0)
      // },
      // 更改： 将info字段中的错误信息显示
      getSubmission () {
        this.loading = false
        api.getSubmission(this.$route.params.id).then(res => {
          this.loading = false
          let data = res.data.data
          console.log('Get Submit Detail:')
          console.log(data)
          this.submission.result = data.result
          this.submission.language = data.language
          this.submission.username = data.username
          this.submission.code_list = data.code_list
          this.submission.problem = data.problem
          this.submission_score = data.grade
          if (data.grade > 0) {
            this.failed_info = data.failed_info
          }
          this.submission = data
          this.submission_list.push(this.submission)
          if (data.grade === 100) {
            this.display_message = 'You have passed all the tests'
          } else if (data.grade === 0) {
            this.display_message = 'You haven\'t passed any testcase, '
            if (data.result === 5) {
              // ALL FAILED
              this.display_message += 'check the lab manual site to seek for the correct logic'
            } else {
              // TIMEOUT
              this.display_message += 'check if you have infinite loop in your code'
            }
          } else {
            this.display_message = 'You haven\'t passed testcase'
            let temp = ''
            for (let i = 0; i < data.failed_info.length; i++) {
              if (i > 0) {
                temp += ','
              }
              temp += ' '
              temp += data.failed_info[i].testcase_index
            }
            this.display_message += temp
          }
          console.log(this.display_message)
        }, () => {
          this.loading = false
        })
      },
      shareSubmission (shared) {
        let data = {id: this.submission.id, shared: shared}
        api.updateSubmission(data).then(res => {
          this.getSubmission()
          this.$success(this.$i18n.t('m.Succeeded'))
        }, () => {
        })
      }
    },
    computed: {
      status () {
        return {
          type: JUDGE_STATUS[this.submission.result].type,
          statusName: JUDGE_STATUS[this.submission.result].name,
          color: JUDGE_STATUS[this.submission.result].color
        }
      },
      isCE () {
        return this.submission.result === -2
      },
      isAdminRole () {
        return this.$store.getters.isAdminRole
      }
    }
  }
</script>

<style scoped lang="less">
  #status {
    .title {
      font-size: 20px;
    }
    .content {
      margin-top: 10px;
      font-size: 14px;
      span {
        margin-right: 10px;
      }
      pre {
        white-space: pre-wrap;
        word-wrap: break-word;
        word-break: break-all;
      }
    }
  }

  .admin-info {
    margin: 5px 0;
    &-content {
      font-size: 16px;
      padding: 10px;
    }
  }

  #share-btn {
    float: right;
    margin-top: 5px;
    margin-right: 10px;
  }

  pre {
    border: none;
    background: none;
  }

  .title {
    font-size: 10px;
    font-family: Microsoft YaHei;
    font-weight: bold;
    color: #303133;
  }

  .manualCollapse {
    /deep/ .el-collapse-item__header {
      font-family: "Times New Roman";
      height: 60px;
      padding-left: 60px;
      font-size: 24px;
      font-weight: 700;
    }
    /deep/ .el-collapse-item__content {
      height: 600px;
      overflow: auto;
    }
  }

</style>
