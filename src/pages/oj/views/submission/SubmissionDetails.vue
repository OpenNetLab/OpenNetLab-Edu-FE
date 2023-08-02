<template>
  <div>
  <Row type="flex" justify="space-around">
    <Col :span="24" id="status">
      <Alert :type="status.type" showIcon>
        <span class="title">{{$t('m.' + status.statusName.replace(/ /g, "_"))}}</span>
        <div slot="desc" class="content">
          <template v-if="isCE">
            <pre>{{submission.statistic_info.err_info}}</pre>
          </template>
          <template v-else>
            <span>{{$t('m.Problem')}}: {{submission.problem}}</span>
            <span>{{$t('m.Lang')}}: {{submission.language}}</span>
            <span>{{$t('m.Author')}}: {{submission.username}}</span>
          </template>
        </div>
      </Alert>
    </Col>

    <!--后台返info就显示出来， 权限控制放后台 v-if="submission.info && !isCE"-->
  </Row>
  <Row>
    <Col v-if="submission.info && !isCE" :span="24">
      <Table stripe :loading="loading" :disabled-hover="true" :columns="columns" :data="submission_list">
      </Table>
    </Col>
  </Row>
  <div v-for="(err_info, index) in error_info" :key="'error-info'+ index">
    <el-col v-if="err_info" :span="24">
      <Highlight  :code="err_info" :border-color="status.color"></Highlight>
    </el-col>
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
        error_info: []
      }
    },
    mounted () {
      this.getSubmission()
    },
    methods: {
      // 更改： 将info字段中的错误信息显示
      getSubmission () {
        this.loading = false
        api.getSubmission(this.$route.params.id).then(res => {
          this.loading = false
          let data = res.data.data
          console.log('SubmissionDetail的getSubmission获得的信息：')
          console.log(data)
          // data应该是一个Submission的信息，包含info：{'score':score,'error_info':[]}
          // submission_score应该是这个submission的分数
          this.submission_score = data.info.score
          // error_info是错误信息的列表
          this.error_info = data.info.error_info
          console.log(this.error_info)
          // 下面的内容应该用不到
          // if (data.info && data.info.data && !this.isConcat) {
          //   // score exist means the submission is OI problem submission
          //   if (data.info.data[0].score !== undefined) {
          //     this.isConcat = true
          //     const scoreColumn = {
          //       title: this.$i18n.t('m.Score'),
          //       align: 'center',
          //       key: 'score'
          //     }
          //     this.columns.push(scoreColumn)
          //     this.loadingTable = false
          //   }
          //   if (this.isAdminRole) {
          //     this.isConcat = true
          //     const adminColumn = [
          //       {
          //         title: this.$i18n.t('m.Real_Time'),
          //         align: 'center',
          //         render: (h, params) => {
          //           return h('span', utils.submissionTimeFormat(params.row.real_time))
          //         }
          //       },
          //       {
          //         title: this.$i18n.t('m.Signal'),
          //         align: 'center',
          //         key: 'signal'
          //       }
          //     ]
          //     this.columns = this.columns.concat(adminColumn)
          //   }
          // }
          this.submission = data
          console.log(this.submission.id)
          this.submission_list.push(this.submission)
          console.log(this.submission_list)
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
</style>
