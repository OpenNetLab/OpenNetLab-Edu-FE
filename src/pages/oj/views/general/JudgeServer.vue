<template>
    <Panel shadow>
      <div slot="title">{{$t('m.Judge_Server_List')}}</div>
      <el-table
        :data="servers"
        :default-expand-all="true"
        border fit>
        <!--
        <el-table-column
          type="expand">
          <template slot-scope="props">
            <p>{{$t('m.IP')}}:
              <el-tag type="success">{{ props.row.ip }}</el-tag>&nbsp;&nbsp;
            </p>
            <p>{{$t('m.Service_URL')}}: <code>{{ props.row.service_url }}</code></p>
            <p>{{$t('m.Last_Heartbeat')}}: {{ props.row.last_heartbeat | localtime}}</p>
            <p>{{$t('m.Create_Time')}}: {{ props.row.create_time | localtime }}</p>
          </template>
        </el-table-column>
        -->
        <el-table-column
          prop="status"
          label="Status">
          <template slot-scope="scope">
            <el-tag
              :type="scope.row.is_disabled === false ? 'success' : 'danger'">
              {{ scope.row.is_ready === true ? 'Normal' : 'Abnormal' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="cpu_core"
          label="CPU Core">
        </el-table-column>
        <el-table-column
          prop="cpu_usage"
          label="CPU Usage">
          <template slot-scope="scope">{{ scope.row.cpu_usage }}%</template>
        </el-table-column>
        <el-table-column
          prop="memory_usage"
          label="Memory Usage">
          <template slot-scope="scope">{{ scope.row.memory_usage }}%</template>
        </el-table-column>
        <el-table-column
          prop="ip"
          label="Server IP">
        </el-table-column>
        <el-table-column
          prop="location"
          label="Server Location">
        </el-table-column>        
        <el-table-column
          prop="last_heartbeat"
          label="Last Heartbeat">
          <template slot-scope="scope">{{ scope.row.last_heartbeat | localtime }}</template>          
        </el-table-column>
        <!--
        <el-table-column label="Disabled">
          <template slot-scope="{row}">
            <el-switch v-model="row.is_disabled" @change="handleDisabledSwitch(row.id, row.is_disabled)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column
          fixed="right"
          label="Options">
          <template slot-scope="scope">
            <icon-btn name="Delete" icon="trash" @click.native="deleteJudgeServer(scope.row.hostname)"></icon-btn>
          </template>
        </el-table-column>
        -->
      </el-table>
    </Panel>
</template>

<script>
  import api from '@oj/api'
  import Pagination from '@oj/components/Pagination'
  export default {
    name: 'JudgeServer',
    components: {
      Pagination
    },
    data () {
      return {
        servers: [],
        intervalId: -1
      }
    },
    mounted () {
      this.refreshJudgeServerList()
      this.intervalId = setInterval(() => {
        this.refreshJudgeServerList()
      }, 5000)
    },
    methods: {
      refreshJudgeServerList () {
        api.getJudgeServer().then(res => {
          this.servers = res.data.data.servers
        })
      }
    },
    beforeRouteLeave (to, from, next) {
      clearInterval(this.intervalId)
      next()
    }
  }
</script>
