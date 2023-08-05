<template>
  <div class="problem">

    <Panel :title="title">
      <el-form ref="form" :model="problem" :rules="rules" label-position="top" label-width="70px">
        <el-row :gutter="20">
          <el-col :span="6">
            <el-form-item prop="_id" :label="$t('m.Display_ID')"
                          :required="this.routeName === 'create-contest-problem' || this.routeName === 'edit-contest-problem'">
              <el-input :placeholder="$t('m.Display_ID')" v-model="problem._id"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="18">
            <el-form-item prop="title" :label="$t('m.Title')" required>
              <el-input :placeholder="$t('m.Title')" v-model="problem.title"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="20">
          <el-col :span="24">
            <el-form-item prop="description" :label="$t('m.Description')" required>
              <Simditor v-model="problem.description"></Simditor>
            </el-form-item>
          </el-col>
        </el-row>
      
        <el-row :gutter="20">
          <!-- <el-col :span="4">
            <el-form-item :label="$t('m.Visible')">
              <el-switch
                v-model="problem.visible"
                active-text=""
                inactive-text="">
              </el-switch>
            </el-form-item>
          </el-col> -->

          <el-col :span="6">
            <el-form-item :label="$t('m.Tag')" :error="error.tags" required>
              <span class="tags">
                <el-tag
                  v-for="tag in problem.tags"
                  :closable="true"
                  :close-transition="false"
                  :key="tag"
                  type="success"
                  @close="closeTag(tag)"
                >{{tag}}</el-tag>
              </span>
              <el-autocomplete
                v-if="inputVisible"
                size="mini"
                class="input-new-tag"
                popper-class="problem-tag-poper"
                v-model="tagInput"
                :trigger-on-focus="false"
                @keyup.enter.native="addTag"
                @select="addTag"
                :fetch-suggestions="querySearch">
              </el-autocomplete>
              <el-button class="button-new-tag" v-else size="small" @click="inputVisible = true">+ {{$t('m.New_Tag')}}</el-button>
            </el-form-item>
          </el-col>
          <!-- <el-col :span="4">
            <el-form-item prop="restriction" :label="$t('m.Restriction')" required>
              <el-input  v-model.number="problem.restriction" :placeholder="$t('m.RestrictionNote')"></el-input>
            </el-form-item>          
          </el-col> -->

          <!-- <el-col :span="10">
            <el-form-item :label="$t('m.Languages')" :error="error.languages" required>
              <el-checkbox-group v-model="problem.languages">
                <el-tooltip class="spj-radio" v-for="lang in allLanguage.languages" :key="'spj'+lang.name" effect="dark"
                            :content="lang.description" placement="top-start">
                  <el-checkbox :label="lang.name"></el-checkbox>
                </el-tooltip>
              </el-checkbox-group>
            </el-form-item>
          </el-col> -->
        </el-row>


        <!-- <el-row>
        <el-col :span="12">
          <el-form-item :label="$t('m.Servers')" required>
              <el-row :gutter="8" style="margin-bottom: 15px">
                <el-col :span="3" >
                <el-tag type="success">
                  <el-form-item :label="$t('VM num: ')"></el-form-item>
                </el-tag>
                </el-col>
                  <el-col :span="4">
                <el-input v-model.number="problem.vm_num" type="number" :placeholder="$t('m.description')"
                @click.native="clickVM" ></el-input>
              </el-col>
              </el-row>
            <div v-for="(range, index) in problem.port_num" :key=index>
              <el-row :gutter="8" style="margin-bottom: 15px">
                <el-col :span="7">
                  <el-tag type="success">
                  <el-form-item :label="$t('m.Portshint') + ' ' + (index + 1) +' ports number'"></el-form-item>
                  </el-tag>
                </el-col>
                <el-col :span="5">
                  <el-input v-model.number="range.value" type="number" :placeholder="$t('m.Ports')"></el-input>
                </el-col>
                  <el-col :span="8">
                  <el-button plain icon="el-icon-fa-plus" @click="addVM"></el-button>
                  <el-button plain icon="el-icon-fa-trash" @click="removeVM(range)"></el-button>
                  </el-col>
              </el-row>
            </div>
          </el-form-item>
        </el-col>

        <el-col :span="10">
            <el-form-item :label="$t('m.Lab_config')" required>
            <div v-for="(range, index) in problem.lab_conf" :key=index>
              <el-row :gutter="8" style="margin-bottom: 15px">
              <el-col :span="3" >
                <el-tag type="success">Parameter: </el-tag>
              </el-col>
              <el-col :span="5">
                <el-input v-model="range.key" :placeholder="$t('m.param')"></el-input>
              </el-col> 
              <el-col :span="3.5" >
                <el-tag type="success">Default Value: </el-tag>
              </el-col>
              <el-col :span="5">
                <el-input v-model="range.value" :placeholder="$t('m.value')"></el-input>
              </el-col>
              <el-col :span="6.5">
                  <el-button plain icon="el-icon-fa-plus" @click="addParam"></el-button>
                  <el-button plain icon="el-icon-fa-trash" @click="removeParam(range)"></el-button>
              </el-col>
              </el-row>
            </div>
          </el-form-item>
        </el-col>
        </el-row> -->
        
        <el-row>
          <el-col :span="20"> 
          <el-form-item :label="$t('m.Code_segment')" required>
              <el-row :gutter="8" style="margin-bottom: 15px">
                <el-col :span="4" >
                <el-tag type="success">
                  <el-form-item :label="$t('Code segment num: ')"></el-form-item>
                </el-tag>
              </el-col>
              <el-col :span="4">
                <el-input v-model.number="problem.code_num" type="number" :placeholder="$t('m.description')"
                @click.native="clickCodeN" ></el-input>
              </el-col>
              </el-row>
              <div v-for="(range, index) in problem.code_names" :key=index>
              <el-row :gutter="8" style="margin-bottom: 15px">
              <el-col :span="4" >
                <el-tag type="success">
                  <el-form-item :label="$t('Code segment ' + (index + 1) + ' filename: ')"></el-form-item>
                  </el-tag>
              </el-col>
              <el-col :span="9">
                <el-input v-model="range.value" :placeholder="$t('m.description') + ' ' + (index + 1)" ></el-input>
              </el-col>
              <el-col :span="8">
                  <el-button plain icon="el-icon-fa-plus" @click="addCodeD"></el-button>
                  <el-button plain icon="el-icon-fa-trash" @click="removeCodeD(range)"></el-button>
              </el-col>
              </el-row>
            </div>
          </el-form-item>
          </el-col>
        </el-row>
        <!--上传文件的功能，待完
        <el-row>
          <el-col :span="6">
          <el-form-item :label="$t('m.DockerFileUPDATE')" required>
            <el-upload
              ref="FPS"
              action="/api/admin/import_fps"
              name="file"
              :file-list="fileList2"
              :show-file-list="true"
              :with-credentials="true"
              :limit="3"
              :on-change="onFile2Change"
              :auto-upload="false"
              :on-success="uploadSucceeded"
              :on-error="uploadFailed">
              <el-button size="small" type="primary" icon="el-icon-fa-upload" slot="trigger">Choose File</el-button>
              <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload('FPS')">Upload</el-button>
            </el-upload>
            </el-form-item>
          </el-col>

          <el-col :span="10">
          <el-form-item :label="$t('m.ExcutionBashUpload')" required>
            <el-upload
              ref="FPS"
              action="/api/admin/import_fps"
              name="file"
              :file-list="fileList2"
              :show-file-list="true"
              :with-credentials="true"
              :limit="3"
              :on-change="onFile2Change"
              :auto-upload="false"
              :on-success="uploadSucceeded"
              :on-error="uploadFailed">
              <el-button size="small" type="primary" icon="el-icon-fa-upload" slot="trigger">Choose File</el-button>
              <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload('FPS')">Upload</el-button>
            </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        -->
        <!--上传文件，开发中-->
        <el-row>
          <el-col :span="6">
            <el-form-item :label="$t('m.DockerFileUPDATE')" required>
              <el-upload action accept=".zip" :before-upload="beforeUpload" :limit="1" :auto-upload="false" 
              :show-file-list="true" :on-change="handleZipChange">
                <el-button size="small" type="primary" icon="el-icon-fa-upload" slot="trigger">Choose File</el-button>
              </el-upload>

              <!-- 进度显示 
              <div>
                <span>Uploading: {{ percent.toFixed() }}%</span>
                <el-button type="primary" size="mini" @click="handleClickBtn">{{ upload | btnTextFilter}}</el-button>
              </div>
              -->
            </el-form-item>
          </el-col> 

          <!-- <el-col :span="6">
            <el-form-item :label="$t('m.ExcutionBashUpload')" required>
              <el-upload action :limit="1" :auto-upload="false" :show-file-list="true" :on-change="handleCmdChange">
                <el-button size="small" type="primary" icon="el-icon-fa-upload" slot="trigger">Choose File</el-button>
              </el-upload>
            </el-form-item>
          </el-col>            -->
        </el-row>
  
        <!-- <el-form-item style="margin-top: 20px" :label="$t('m.Log_judge')">
          <code-mirror v-model="problem.log_judge_code" placeholder=""></code-mirror>
        </el-form-item> -->
        <!-- <el-form-item style="margin-top: 20px" :label="$t('m.Hint')">
          <Simditor v-model="problem.hint" placeholder=""></Simditor>
        </el-form-item> -->
        <!-- <el-form-item :label="$t('m.Code_Template')">
          <el-row>
            <el-col :span="24" v-for="(v, k) in emplate" t:key="'template'+k">
              <el-form-item>
                <el-checkbox v-model="v.checked">{{ k }}</el-checkbox>
                <div v-if="v.checked">
                  <code-mirror v-model="v.code" :mode="v.mode"></code-mirror>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form-item> -->
        <!-- <el-form-item :label="$t('m.Source')">
          <el-input :placeholder="$t('m.Source')" v-model="problem.source"></el-input>
        </el-form-item> -->
        <save @click.native="submit()">Save</save>
      </el-form>
    </Panel>
  </div>
</template>

<script>
  import Simditor from '../../components/Simditor'
  import Accordion from '../../components/Accordion'
  import CodeMirror from '../../components/CodeMirror'
  import api from '../../api'
  import SparkMD5 from 'spark-md5'
  import axios from 'axios'
  export default {
    name: 'Problem',
    components: {
      Simditor,
      Accordion,
      CodeMirror
    },
    filters: {
      btnTextFilter (val) {
        return val ? 'Pause' : 'Continue'
      }
    },
    data () {
      return {
        rules: {
          _id: {required: true, message: 'Display ID is required', trigger: 'blur'},
          title: {required: true, message: 'Title is required', trigger: 'blur'}
          // restriction: [
          //   {required: true, message: 'Set the maximum number of submission times', trigger: 'blur'},
          //   {type: 'number', message: 'The context in this field should be numbers'}
          // ]
        },
        loadingCompile: false,
        mode: '',
        contest: {},
        problem: {
          is_public: true,
          vm_num: 1,
          port_num: [{
            value: 0
          }],
          lab_conf: [{
            value: '',
            key: ''
          }],
          code_names: [{
            value: ''
          }],
          code_num: 1,
          total_score: 100,
          _id: '',
          title: '',
          description: '',
          restriction: 0,
          visible: true,
          log_judge_code: '',
          log_judge: false,
          share_submission: false,
          tags: [],
          languages: [],
          template: {},
          hint: '',
          source: '',
          hash: '',
          chunkList: [],
          fileHash: ''
        },
        allLanguage: {},
        inputVisible: false,
        tagInput: '',
        template: {},
        title: '',
        disableRuleType: false,
        routeName: '',
        error: {
          tags: '',
          spj: '',
          languages: '',
          testCase: '',
          restriction: ''
        },
        percent: 0,
        videoUrl: '',
        upload: true,
        percentCount: 0,
        fileObject: null,
        fileHash: ''
        // chunkList: [],
        // hash: ''
      }
    },
    mounted () {
      this.routeName = this.$route.name
      if (this.routeName === 'edit-problem' || this.routeName === 'edit-contest-problem') {
        this.mode = 'edit'
      } else {
        this.mode = 'add'
      }
      api.getLanguages().then(res => {
        this.problem = this.reProblem = {
          is_public: true,
          vm_num: 1,
          port_num: [{
            value: 0
          }],
          lab_conf: [{
            value: '',
            key: ''
          }],
          code_names: [{
            value: ''
          }],
          code_num: 1,
          total_score: 100,
          _id: '',
          title: '',
          description: '',
          restriction: 0,
          visible: true,
          log_judge_code: '',
          log_judge: false,
          share_submission: false,
          tags: [],
          languages: [],
          template: {},
          hint: '',
          source: '',
          hash: '',
          chunkList: [],
          fileHash: ''
        }
        let contestID = this.$route.params.contestId
        if (contestID) {
          this.problem.contest_id = this.reProblem.contest_id = contestID
          this.disableRuleType = true
          api.getContest(contestID).then(res => {
            this.contest = res.data.data
          })
        }
        let allLanguage = res.data.data
        this.allLanguage = allLanguage

        // get problem after getting languages list to avoid find undefined value in `watch problem.languages`
        if (this.mode === 'edit') {
          this.title = this.$i18n.t('m.Edit_Problem')
          let funcName = {'edit-problem': 'getProblem', 'edit-contest-problem': 'getContestProblem'}[this.routeName]
          api[funcName](this.$route.params.problemId).then(problemRes => {
            let data = problemRes.data.data
            console.log(data)
            let ranges = []
            let confs = []
            let codes = []
            for (let v of data.port_num) {
              ranges.push({value: v})
            }
            if (ranges.length === 0) {
              ranges.push({value: 0})
            }
            for (var key in data.lab_conf) {
              confs.push({key: key, value: data.lab_conf[key]})
            }
            if (confs.length === 0) {
              confs.push({key: '', value: ''})
            }
            for (let v of data.code_names) {
              codes.push({value: v})
            }
            for (var i = 0; i < (data.code_num - codes.length); i++) {
              codes.push({value: ''})
            }
            // for (let index of (data.code_num - codes.length)) {
            //   codes.push({value: ''})
            // }
            data.port_num = ranges
            data.lab_conf = confs
            data.code_names = codes
            this.problem = data
          })
        } else {
          this.title = this.$i18n.t('m.Add_Problem')
        // for (let item of allLanguage.languages) {
        //    this.problem.languages.push(item.name)
        // }
          let ranges = []
          ranges.push({value: 0})
        }
      })
    },
    watch: {
      '$route' () {
        this.$refs.form.resetFields()
        this.problem = this.reProblem
      },
      // 'problem.languages' (newVal) {
      //   let data = {}
      //   // use deep copy to avoid infinite loop
      //   let languages = JSON.parse(JSON.stringify(newVal)).sort()
      //   for (let item of languages) {
      //     if (this.template[item] === undefined) {
      //       let langConfig = this.allLanguage.languages.find(lang => {
      //         return lang.name === item
      //       })
      //       if (this.problem.template[item] === undefined) {
      //         data[item] = {checked: false, code: langConfig.config.template, mode: langConfig.content_type}
      //       } else {
      //         data[item] = {checked: true, code: this.problem.template[item], mode: langConfig.content_type}
      //       }
      //     } else {
      //       data[item] = this.template[item]
      //     }
      //   }
      //   this.template = data
      // },
      'problem.spj_language' (newVal) {
        this.spjMode = this.allLanguage.spj_languages.find(item => {
          return item.name === this.problem.spj_language
        }).content_type
      }
    },
    methods: {
      beforeUpload (file) {
        const fileSuffix = file.name.substring(file.name.lastIndexOf('.') + 1)
        const whiteList = ['.zip']
        if (whiteList.indexOf(fileSuffix) === -1) {
          this.$message.error('上传文件只能是zip格式')
          return false
        }
        // 最大文件大小20M
        let MAX_FILE_SIZE = 10
        const isLimit20M = file.size / 1024 / 1024 < MAX_FILE_SIZE
        if (!isLimit20M) {
          this.$message.error('文件大小限制为小于' + MAX_FILE_SIZE + 'MB')
          return false
        }
      },
      handleZipChange (file) {
        if (!file) return
        const fileObj = file.raw
        let buffer = this.fileToBuffer(fileObj)
        const suffix = /\.([0-9A-z]+)$/.exec(fileObj.name)[1]// 文件后缀名
        // 根据文件内容生成 hash 值
        const spark = new SparkMD5.ArrayBuffer()
        spark.append(buffer)
        const hash = spark.end()
        this.fileHash = `${hash}.${suffix}`
        this.fileObject = fileObj
      },
      async handleImageChange (file) {
        if (!file) return
        this.percent = 0
        this.videoUrl = ''
        // 获取文件并转成 ArrayBuffer对象
        const fileObj = file.raw
        console.log(typeof fileObj)
        let buffer
        try {
          buffer = await this.fileToBuffer(fileObj)
        } catch (e) {
          console.log(e)
        }
        // 将文件按固定大小（2M）进行切片，注意此处同时声明了多个常量
        const chunkSize = 2097152
        const chunkList = []// 保存所有切片的数组
        const chunkListLength = Math.ceil(fileObj.size / chunkSize)// 计算总共多个切片
        const suffix = /\.([0-9A-z]+)$/.exec(fileObj.name)[1]// 文件后缀名
        // 根据文件内容生成 hash 值
        const spark = new SparkMD5.ArrayBuffer()
        spark.append(buffer)
        const hash = spark.end()
        // 生成切片，这里后端要求传递的参数为字节数据块（chunk）和每个数据块的文件名（fileName）
        let curChunk = 0 // 切片时的初始位置
        for (let i = 0; i < chunkListLength; i++) {
          const item = {
            chunk: fileObj.slice(curChunk, curChunk + chunkSize),
            fileName: `${hash}_${i}.${suffix}` // 文件名规则按照 hash_1.jpg 命名
          }
          curChunk += chunkSize
          chunkList.push(item)
        }
        this.imageChunkList = chunkList // sendRequest 要用到
        this.ImageHash = hash // sendRequest 要用到
        // this.sendRequest()
        console.log(this.imageChunkList)
        console.log(this.ImageHash)
      },
      async handleCmdChange (file) {
        if (!file) return
        this.percent = 0
        this.videoUrl = ''
        // 获取文件并转成 ArrayBuffer对象
        const fileObj = file.raw
        console.log(typeof fileObj)
        let buffer
        try {
          buffer = await this.fileToBuffer(fileObj)
        } catch (e) {
          console.log(e)
        }
        // 将文件按固定大小（2M）进行切片，注意此处同时声明了多个常量
        const chunkSize = 2097152
        const chunkList = []// 保存所有切片的数组
        console.log(fileObj.size)
        const chunkListLength = Math.ceil(fileObj.size / chunkSize)// 计算总共多个切片
        console.log(chunkListLength)
        const suffix = /\.([0-9A-z]+)$/.exec(fileObj.name)[1]// 文件后缀名
        // 根据文件内容生成 hash 值
        const spark = new SparkMD5.ArrayBuffer()
        spark.append(buffer)
        const hash = spark.end()
        // 生成切片，这里后端要求传递的参数为字节数据块（chunk）和每个数据块的文件名（fileName）
        let curChunk = 0 // 切片时的初始位置
        for (let i = 0; i < chunkListLength; i++) {
          const item = {
            chunk: fileObj.slice(curChunk, curChunk + chunkSize),
            fileName: `${hash}_${i}.${suffix}` // 文件名规则按照 hash_1.jpg 命名
          }
          curChunk += chunkSize
          chunkList.push(item)
        }
        this.cmdChunkList = chunkList // sendRequest 要用到
        this.CmdHash = hash // sendRequest 要用到
        // this.sendRequest()
        console.log(this.cmdChunkList)
        console.log(this.CmdHash)
      },
      sendRequest (id, fileContent) {
        const requestList = [] // 请求集合
        const FormData = require('form-data')
        let curHash = ''
        if (fileContent === 'image') {
          console.log('image-> ')
          console.log(this.imageChunkList)
          curHash = this.ImageHash
          this.imageChunkList.forEach((item, index) => {
            const fn = () => {
              const formData = new FormData()
              formData.append('id', id)
              formData.append('chunk', item.chunk)
              formData.append('filename', item.fileName)
              console.log('image axios发送前')
              return axios({
                url: 'admin/upload',
                method: 'post',
                headers: { 'Content-Type': 'multipart/form-data' },
                data: formData
              }).then(res => {
                console.log('发送image')
                if (res.data.code === 0) { // 成功
                  if (this.percentCount === 0) { // 避免上传成功后会删除切片改变 chunkList 的长度影响到 percentCount 的值
                    this.percentCount = 100 / this.imageChunkList.length
                  }
                  this.percent += this.percentCount // 改变进度
                  this.imageChunkList.splice(index, 1) // 一旦上传成功就删除这一个 chunk，方便断点续传
                }
              })
            }
            requestList.push(fn)
          })
        } else {
          console.log('cmd-> ')
          console.log(this.cmdChunkList)
          curHash = this.CmdHash
          this.cmdChunkList.forEach((item, index) => {
            const fn = () => {
              const formData = new FormData()
              formData.append('id', id)
              formData.append('chunk', item.chunk)
              formData.append('filename', item.fileName)
              console.log('cmd axios发送前')
              return axios({
                url: 'admin/upload',
                method: 'post',
                headers: { 'Content-Type': 'multipart/form-data' },
                data: formData
              }).then(res => {
                console.log('发送cmd')
                if (res.data.code === 0) { // 成功
                  if (this.percentCount === 0) { // 避免上传成功后会删除切片改变 chunkList 的长度影响到 percentCount 的值
                    this.percentCount = 100 / this.cmdChunkList.length
                  }
                  this.percent += this.percentCount // 改变进度
                  this.cmdChunkList.splice(index, 1) // 一旦上传成功就删除这一个 chunk，方便断点续传
                }
              })
            }
            requestList.push(fn)
          })
          console.log('输出requestList')
          console.log(requestList)
        }
        console.log('准备计数i')
        let i = 0 // 记录发送的请求个数
        // 文件切片全部发送完毕后，需要请求 '/admin/upload' 接口，把文件的 hash 传递给服务器
        const complete = () => {
          axios({
            url: 'admin/upload',
            method: 'get',
            params: {
              hash: curHash,
              id: id,
              filecontent: fileContent
            }
          }).then(res => {
            if (res.data.code === 0) { // 请求发送成功
              // this.videoUrl = res.data.path
            }
          })
        }
        const send = async () => {
          if (!this.upload) return
          if (i >= requestList.length) {
            // 发送完毕
            complete()
            return
          }
          await requestList[i]()
          console.log('i++前: ')
          console.log(i)
          i++
          console.log('i++且准备send')
          console.log(i)
          send()
        }
        console.log('准备send')
        send() // 发送请求
      },
      // 按下暂停按钮
      handleClickBtn () {
        this.upload = !this.upload
        // 如果不暂停则继续上传
        if (this.upload) this.sendRequest()
      },
      // 将 File 对象转为 ArrayBuffer
      fileToBuffer (file) {
        return new Promise((resolve, reject) => {
          const fr = new window.FileReader()
          fr.onload = e => {
            resolve(e.target.result)
          }
          fr.readAsArrayBuffer(file)
          fr.onerror = () => {
            reject(new Error('FORMAT ERROR'))
          }
        })
      },
      querySearch (queryString, cb) {
        api.getProblemTagList({ keyword: queryString }).then(res => {
          let tagList = []
          for (let tag of res.data.data) {
            tagList.push({value: tag.name})
          }
          cb(tagList)
        }).catch(() => {
        })
      },
      addTag () {
        let inputValue = this.tagInput
        if (inputValue) {
          this.problem.tags.push(inputValue)
        }
        this.inputVisible = false
        this.tagInput = ''
      },
      addVM () {
        this.problem.port_num.push({value: 0})
        this.problem.vm_num = this.problem.port_num.length
      },
      removeVM (ranges) {
        let index = this.problem.port_num.indexOf(ranges)
        let len = this.problem.port_num.length
        if (len !== 1) {
          this.problem.port_num.splice(index, 1)
        }
        this.problem.vm_num = this.problem.port_num.length
      },
      addParam () {
        this.problem.lab_conf.push({value: '', key: ''})
      },
      removeParam (range) {
        let index = this.problem.lab_conf.indexOf(range)
        let len = this.problem.lab_conf.length
        if (len !== 1) {
          this.problem.lab_conf.splice(index, 1)
        }
      },
      addCodeD () {
        this.problem.code_names.push({value: ''})
        this.problem.code_num = this.problem.code_names.length
      },
      removeCodeD (range) {
        let index = this.problem.code_names.indexOf(range)
        let len = this.problem.code_names.length
        if (len !== 1) {
          this.problem.code_names.splice(index, 1)
        }
        this.problem.code_num = this.problem.code_names.length
      },
      clickCodeN () {
        let dslen = this.problem.code_names.length
        if (this.problem.code_num < this.problem.code_names.length) {
          this.problem.code_names.splice(this.problem.code_num, (this.problem.code_names.length - this.problem.code_num))
        } else {
          for (var i = 0; i < (this.problem.code_num - dslen); i++) {
            this.problem.code_names.push({value: ''})
          }
        }
      },
      clickVM () {
        let dslen = this.problem.port_num.length
        if (this.problem.vm_num < this.problem.port_num.length) {
          this.problem.port_num.splice(this.problem.vm_num, (this.problem.port_num.length - this.problem.code_num))
        } else {
          for (var i = 0; i < (this.problem.vm_num - dslen); i++) {
            this.problem.port_num.push({value: ''})
          }
        }
      },
      closeTag (tag) {
        this.problem.tags.splice(this.problem.tags.indexOf(tag), 1)
      },
      submit () {
        if (!this.problem.tags.length) {
          this.error.tags = 'Please add at least one tag'
          this.$error(this.error.tags)
          return
        }
        const FormData = require('form-data')
        const formData = new FormData()
        formData.append('_id', this.problem._id)
        formData.append('title', this.problem.title)
        formData.append('description', this.problem.description)
        formData.append('code_num', this.problem.code_num)
        formData.append('is_public', this.problem.is_public)
        formData.append('vm_num', this.problem.vm_num)
        formData.append('total_score', this.problem.total_score)
        formData.append('visible', this.problem.visible)
        formData.append('share_submission', this.problem.share_submission)
        for (let k in this.problem.tags) {
          formData.append('tags', this.problem.tags[k])
        }
        // setting languages as python only
        this.problem.languages = ['python']
        // if (!this.problem.languages.length) {
        //   this.error.languages = 'Please choose at least one language for problem'
        //   this.$error(this.error.languages)
        //   return
        // }
        // console.log(this.problem.restriction)
        // if (this.problem.restriction < 1 || this.problem.restriction > 999) {
        //   this.error.restriction = 'Please reset the submission restriction'
        //   this.$error(this.error.restriction)
        //   return
        // }
        this.problem.languages = this.problem.languages.sort()
        for (let k in this.problem.languages) {
          formData.append('languages', this.problem.languages[k])
        }
        this.problem.template = {}
        for (let k in this.template) {
          if (this.template[k].checked) {
            this.problem.template[k] = this.template[k].code
            formData.append('template', this.template[k].code)
          }
        }
        let configs = {}
        for (let v of this.problem.lab_conf) {
          if (v.key !== '') {
            configs[v.key] = v.value
          }
        }
        let ports = []
        for (let v of this.problem.port_num) {
          ports.push(v.value)
        }
        let cds = []
        for (let v of this.problem.code_names) {
          cds.push(v.value)
        }
        this.problem.code_names = cds
        for (let k in this.problem.code_names) {
          formData.append('code_names', this.problem.code_names[k])
        }
        this.problem.port_num = ports
        for (let k in ports) {
          formData.append('port_num', this.problem.port_num[k])
        }
        this.problem.lab_config = configs
        // for (let k in this.problem.lab_config) {
        //   formData.append('lab_config', this.problem.lab_config[k])
        // }
        if (this.problem.log_judge_code === '') {
          this.problem.log_judge = false
        } else {
          this.problem.log_judge = true
        }
        // 对文件计算的hash值放到problem信息中
        // this.problem.imagehash = this.ImageHash
        // this.problem.cmdhash = this.CmdHash
        // 添加文件相关
        this.problem.fileHash = this.fileHash
        formData.append('fileHash', this.problem.fileHash)
        formData.append('file', this.fileObject)
        // const FormData = require('form-data')
        // const formData = new FormData()
        // formData.append('file', this.fileObject)
        // this.problem.file = this.fileObject
        // 选择api
        let funcName = {
          'create-problem': 'createProblem',
          'edit-problem': 'editProblem',
          'create-contest-problem': 'createContestProblem',
          'edit-contest-problem': 'editContestProblem'
        }[this.routeName]
        // edit contest problem 时, contest_id会被后来的请求覆盖掉
        if (funcName === 'editContestProblem') {
          this.problem.contest_id = this.contest.id
          formData.append('contest_id', this.problem.contest_id)
        }
        // let cmdfile = 'cmd'
        // let imagefile = 'image'
        // this.problem.chunkList = this.imageChunkList
        // console.log(this.problem)
        // console.log(formData.getAll('code_names'))
        api[funcName](formData).then(res => {
          console.log(res.data.data['id'])
          // this.sendRequest(res.data.data['id'], cmdfile)
          // this.sendRequest(res.data.data['id'], imagefile)
          if (this.routeName === 'create-contest-problem' || this.routeName === 'edit-contest-problem') {
            // 跳转，如果是创建或者编辑contest的problem，跳转的参数是这个这个contestId，形式是: /contest/:contestId/problems
            this.$router.push({name: 'contest-problem-list', params: {contestId: this.$route.params.contestId}})
          } else {
            this.$router.push({name: 'problem-list'})
          }
        }).catch(() => {
        })
      }
    }
  }
</script>

<style lang="less" scoped>
  .problem {
    .difficulty-select {
      width: 120px;
    }
    .spj-radio {
      margin-left: 10px;
      &:last-child {
        margin-right: 20px;
      }
    }
    .input-new-tag {
      width: 78px;
    }
    .button-new-tag {
      height: 24px;
      line-height: 22px;
      padding-top: 0;
      padding-bottom: 0;
    }
    .tags {
      .el-tag {
        margin-right: 10px;
      }
    }
    .accordion {
      margin-bottom: 10px;
    }
    .add-samples {
      width: 100%;
      background-color: #fff;
      border: 1px dashed #aaa;
      outline: none;
      cursor: pointer;
      color: #666;
      height: 35px;
      font-size: 14px;
      &:hover {
        background-color: #f9fafc;
      }
      i {
        margin-right: 10px;
      }
    }
    .add-sample-btn {
      margin-bottom: 10px;
    }

  }
</style>

<style>
  .problem-tag-poper {
    width: 200px !important;
  }
  .dialog-compile-error {
    width: auto;
    max-width: 80%;
    overflow-x: scroll;
  }
</style>

