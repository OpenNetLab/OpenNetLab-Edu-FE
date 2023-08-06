<template>
  <div class="view">
    <Panel :title="title">
      <el-form label-position="top">
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item :label="$t('m.ContestTitle')" required>
              <el-input v-model="contest.title" :placeholder="$t('m.ContestTitle')"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="24">
            <el-form-item :label="$t('m.ContestDescription')" required>
              <Simditor v-model="contest.description"></Simditor>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('m.Contest_Start_Time')" required>
              <el-date-picker
                v-model="contest.start_time"
                type="datetime"
                :placeholder="$t('m.Contest_Start_Time')">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="8">
            <el-form-item :label="$t('m.Contest_End_Time')" required>
              <el-date-picker
                v-model="contest.end_time"
                type="datetime"
                :placeholder="$t('m.Contest_End_Time')">
              </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item :label="$t('m.Contest_Password')">
              <el-input v-model="contest.password" :placeholder="$t('m.Contest_Password')" :span="8"></el-input>
            </el-form-item>
          </el-col>

          <el-col :span="8">
            <el-form-item :label="$t('m.Tutor')">
              <div v-for="(range, index) in contest.contest_admin" :key="index">
                <el-row :gutter="20" style="margin-bottom: 15px">
                  <el-col :span="10">
                    <el-input v-model="range.value" :placeholder="$t('m.Tutors')"></el-input>
                  </el-col>
                  <el-col :span="10">
                    <el-button plain icon="el-icon-fa-plus" @click="addTutor"></el-button>
                    <el-button plain icon="el-icon-fa-trash" @click="removeTutor(range)"></el-button>
                  </el-col>
                </el-row>
              </div>
            </el-form-item>
          </el-col>
            
          <el-col :span="24">
            <el-form-item :label="$t('m.Allowed_IP_Ranges')">
              <div v-for="(range, index) in contest.allowed_ip_ranges" :key="index">
                <el-row :gutter="20" style="margin-bottom: 15px">
                  <el-col :span="8">
                    <el-input v-model="range.value" :placeholder="$t('m.CIDR_Network')"></el-input>
                  </el-col>
                  <el-col :span="10">
                    <el-button plain icon="el-icon-fa-plus" @click="addIPRange"></el-button>
                    <el-button plain icon="el-icon-fa-trash" @click="removeIPRange(range)"></el-button>
                  </el-col>
                </el-row>
              </div>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <save @click.native="saveContest"></save>
    </Panel>
  </div>
</template>

<script>
  import api from '../../api.js'
  import Simditor from '../../components/Simditor.vue'

  export default {
    name: 'CreateContest',
    components: {
      Simditor
    },
    data () {
      return {
        title: 'Create Your Course',
        disableRuleType: false,
        contest: {
          title: '',
          description: '',
          start_time: '',
          end_time: '',
          password: '',
          real_time_rank: true,
          visible: true,
          allowed_ip_ranges: [{
            value: ''
          }],
          contest_admin: [{
            value: ''
          }]
        }
      }
    },
    methods: {
      saveContest () {
        let funcName = this.$route.name === 'edit-contest' ? 'editContest' : 'createContest'
        let data = Object.assign({}, this.contest)
        let ranges = []
        let admins = []
        for (let v of data.allowed_ip_ranges) {
          if (v.value !== '') {
            ranges.push(v.value)
          }
        }
        for (let v of data.contest_admin) {
          if (v.value !== '') {
            admins.push(v.value)
          }
        }
        data.contest_admin = admins
        data.allowed_ip_ranges = ranges
        api[funcName](data).then(res => {
          this.$router.push({name: 'contest-list', query: {refresh: 'true'}})
        }).catch(() => {
        })
      },
      addIPRange () {
        this.contest.allowed_ip_ranges.push({value: ''})
      },
      addTutor () {
        this.contest.contest_admin.push({value: ''})
      },
      removeIPRange (range) {
        let index = this.contest.allowed_ip_ranges.indexOf(range)
        let len = this.contest.allowed_ip_ranges.length
        if (len !== 1) {
          this.contest.allowed_ip_ranges.splice(index, 1)
        }
      },
      removeTutor (range) {
        let index = this.contest.contest_admin.indexOf(range)
        let len = this.contest.contest_admin.length
        if (len !== 1) {
          this.contest.contest_admin.splice(index, 1)
        }
      }
    },
    mounted () {
      if (this.$route.name === 'edit-contest') {
        this.title = 'Edit Contest'
        this.disableRuleType = true
        api.getContest(this.$route.params.contestId).then(res => {
          let data = res.data.data
          let ranges = []
          let admins = []
          for (let v of data.allowed_ip_ranges) {
            ranges.push({value: v})
          }
          if (ranges.length === 0) {
            ranges.push({value: ''})
          }
          for (let v of data.contest_admin) {
            admins.push({value: v})
          }
          if (admins.length === 0) {
            admins.push({value: ''})
          }
          data.allowed_ip_ranges = ranges
          data.contest_admin = admins
          this.contest = data
        }).catch(() => {
        })
      }
    }
  }
</script>
