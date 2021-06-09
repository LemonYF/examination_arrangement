<template>
  <div class="main-container">
    <img alt="Vue logo" :src="picUrl">
    <h3>考场座次表生成系统</h3>
    <el-input v-model="title" placeholder="请输入标题，示例：”2020年度襄阳市市直学校公开招聘笔试座次表“"></el-input>
    <p></p>
      <el-input v-model="testPlaceName" placeholder="请输入考点名称，示例：”襄阳技师学院（东津）“"></el-input>
    <p></p>
    <el-input v-model="testSubjectA" placeholder="请输入考试科目A，示例：”职业能力倾向测验“"></el-input>
    <p></p>
    <el-input v-model="testSubjectB" placeholder="请输入考试科目B，示例：”综合应用能力“"></el-input>
    <p></p>
    <el-input v-model="testDate" placeholder="请输入科目考试日期，示例：”2020年8月1日“"></el-input>
    <p></p>
    <el-input v-model="testTimeA" placeholder="请输入科目A考试时间，示例：”8:00 - 9:30“"></el-input>
    <p></p>
    <el-input v-model="testTimeB" placeholder="请输入科目B考试时间，示例：”9：30 - 11：00“"></el-input>
    <p></p>
    <el-input v-model="roomNo" placeholder="请输入考场起始序号，只能为数字"></el-input>
    <p></p>
    <el-input v-model="testNumber" placeholder="请输入考生起始准考证号"></el-input>
    <p></p>

    <!-- 按钮 -->
    <el-upload
            class="upload"
            action=""
            :multiple="false"
            :show-file-list="false"
            accept="csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            :http-request="httpRequest">
      <el-button size="small" type="primary">上传考场名单表</el-button>
    </el-upload>
    <div class="button-group">
      <el-button style="margin-bottom: 10px" type="primary" @click="assignedExamination">分配考场</el-button>
      <el-button style="margin-bottom: 10px" type="primary" @click="exportEducationExcel">导出准考证excel</el-button>
      <el-button style="margin-bottom: 10px" type="primary" @click="exportRoomExcel">导出考场安排excel</el-button>
      <el-button style="margin-bottom: 10px" type="primary" @click="resetData">重置所有数据</el-button>
      <el-button style="margin-bottom: 10px" type="primary" @click="testApi">接口测试</el-button>

    </div>
    <!-- 按钮 end -->

    <div class="header">
      <br />
      <p v-if="tableDataLength">考试科目为 <span style="color: red">{{ sortData[0][0].subject }}</span></p>
      <span v-if="tableDataLength">共有数据 {{ tableDataLength }} 条</span>
    </div>
    <div v-for="(item, index) in sortData" :key="index">
      <h4 style="margin: 0 auto">{{ title }}</h4>
      <p style="display: flex; justify-content: space-between">
        <span style="display: inline-block">考点： {{ testPlaceName }}</span>
        <span v-if="testSubjectB !== ''" style="display: inline-block">科目： {{ testSubjectA }} / {{ testSubjectB }} </span>
        <span v-else style="display: inline-block">科目： {{ testSubjectA }} </span>
      </p>
      <div class="container">
        <div class="item" v-for="(person, key) in item" :key="key">
          <img :src="'img/'+ person.number + '.jpg'" alt="">
          <p>姓名：{{ person.name }}</p>
          <p>证号：{{ person.testNumber }}</p>
          <p><span style="margin-right: 5px">考场： {{ person.examinationRoomA || '' }}</span> <span>座位: {{ person.examinationNumberA || '' }}</span></p>
          <p class="formate"><span>进场：</span> <span class="bd-bottom">               </span></p>
          <p class="formate"><span>离场：</span> <span class="bd-bottom">               </span></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import XLSX from 'xlsx'
  import axios from 'axios'

  export default {
    name: 'HelloWorld',
    props: {
      msg: String
    },
    data () {
      return {
        tableData: [],
        tableDataLength: '',
        hasClick: false,
        testPlaceName: '襄阳技师学院（东津）', // 考点名称
        testDate: '2020年8月9日', // 考试日期
        title: '2020年度襄阳市市直学校公开招聘笔试座次表', // 标题
        testSubjectA: '职业能力倾向测验', // 考试科目
        testSubjectB: '综合应用能力', // 考试科目
        testTimeA: '8:30 - 10:00',
        testTimeB: '10:00 - 12:00',
        picUrl: 'logo.png',
        roomNo: null, // 考场起始序号， 用来处理几个分类考试在同一时间同一个考点进行考试的情况
        testNumber: null, // 考生准考证起始序号
        dataToExcel: [], // 待导出为准考证excel的数据
        dataToRoomSetExcel: [], // 待导出为考场安排excel，为重置数据前的所有数据
        roomExcel: [],
        sortData: [] // 处理后的数据，每30个为一个数组
      }
    },
    methods: {
      httpRequest(e) {
        let file = e.file // 文件信息
        console.log('e: ', e)
        console.log('file: ', e.file)

        if (!file) {
          // 没有文件
          return false
        } else if (!/\.(xls|xlsx)$/.test(file.name.toLowerCase())) {
          // 格式根据自己需求定义
          this.$message.error('上传格式不正确，请上传xls或者xlsx格式')
          return false
        }

        const fileReader = new FileReader()
        fileReader.onload = (ev) => {
          try {
            const data = ev.target.result
            const workbook = XLSX.read(data, {
              type: 'binary' // 以字符编码的方式解析
            })
            const exlname = workbook.SheetNames[0] // 取第一张表
            const exl = XLSX.utils.sheet_to_json(workbook.Sheets[exlname]) // 生成json表格内容
            console.log(exl, exl.length)
            this.tableDataLength = exl.length
            // 将 JSON 数据挂到 data 里
            this.tableData = exl
            this.sortData = this.reSetData(this.tableData)
            console.log(this.sortData)
            // document.getElementsByName('file')[0].value = '' // 根据自己需求，可重置上传value为空，允许重复上传同一文件
          } catch (e) {
            console.log('出错了：：')
            return false
          }

        }
        fileReader.readAsBinaryString(file)
      },
      reSetData(dataList) {
        console.log('datalist', dataList)
        let arr = []
        let len = dataList.length
        for (let i = 0; i < len; i += 30) {
          if (dataList[i] && dataList[i].examinationNumberA === (i + 1)) {
            arr.push(dataList.slice(i, i + 30))
          }
        }
        return arr
      },
      /**
       * subject 科目
       * place 考试地点
       * date 考试日期
       * time 考试时间
       * examinationRoom 考场号
       * examinationNumber 座位号
       * highestgreer 最高学历
       * **/
      assignedExamination() { // 分配考场
        for(let i = 0; i < this.sortData.length; i++) {
          if (this.roomNo) { // 如果有上一场考场号，那么继续增加
            this.roomNo = this.roomNo + 1
          } else { // 否则从1开始
            this.roomNo = 1
          }
          console.log('第' + i + '个考场')
          for (let j = 0; j < this.sortData[i].length; j++) {
            console.log(this.sortData[i][j].name, i + 1, j + 1)
            this.$set(this.sortData[i][j], 'subjectA', this.testSubjectA)
            // this.$set(this.sortData[i][j], 'subjectB', this.testSubjectB)
            this.$set(this.sortData[i][j], 'dateA', this.testDate)
            // this.$set(this.sortData[i][j], 'dateB', this.testDate)
            this.$set(this.sortData[i][j], 'timeA', this.testTimeA)
            // this.$set(this.sortData[i][j], 'timeB', this.testTimeB)
            let currentRoom = this.roomNo - 70 // 计算第二考场的序号，为currentRoom
            if (this.roomNo <= 70) {
              this.$set(this.sortData[i][j], 'examinationRoomName', '技师学院1号楼')
              this.$set(this.sortData[i][j], 'placeA', this.testPlaceName + '1号楼')
              if (this.roomNo < 10) {
                this.$set(this.sortData[i][j], 'examinationRoomA', '0' + this.roomNo.toString())
                // this.$set(this.sortData[i][j], 'examinationRoomB', '0' + this.roomNo.toString())
              } else {
                this.$set(this.sortData[i][j], 'examinationRoomA', this.roomNo.toString())
                // this.$set(this.sortData[i][j], 'examinationRoomB', this.roomNo.toString())
              }
            } else {
              this.$set(this.sortData[i][j], 'examinationRoomName', '技师学院2号楼')
              this.$set(this.sortData[i][j], 'placeA', this.testPlaceName + '2号楼')
              if (currentRoom < 10) {
                this.$set(this.sortData[i][j], 'examinationRoomA', '0' + currentRoom.toString())
                // this.$set(this.sortData[i][j], 'examinationRoomB', '0' + currentRoom.toString())
              } else {
                this.$set(this.sortData[i][j], 'examinationRoomA', currentRoom.toString())
                // this.$set(this.sortData[i][j], 'examinationRoomB', currentRoom.toString())
              }
            }

            this.$set(this.sortData[i][j], 'examinationNumberA', j + 1 < 10 ? '0' + (j + 1) : (j + 1).toString())
            // this.$set(this.sortData[i][j], 'examinationNumberB', j + 1 < 10 ? '0' + (j + 1) : (j + 1).toString())
            // 水测生成准考证号
            this.$set(this.sortData[i][j], 'testNumber', this.createEducationNumber(this.sortData[i][j].subject, this.sortData[i][j].examinationRoomName, this.sortData[i][j].examinationRoomA, this.sortData[i][j].examinationNumberA))
            // 事业单位准考证号
            // this.$set(this.sortData[i][j], 'testNumber', this.createTestNumber(this.sortData[i][j].subject, this.sortData[i][j].examinationRoomName, this.sortData[i][j].examinationRoomA, this.sortData[i][j].examinationNumberA))
          }
          this.dataToExcel = this.dataToExcel.concat(this.sortData[i])
        }
        this.dataToRoomSetExcel = this.dataToRoomSetExcel.concat(this.sortData) // 重置前每次点击分配考场，都把数据塞到这个待导出全部的数组中
      },
      transformData() { // 将分配考场数据重新转化为可导出excel的全部数据
        console.log(this.dataToExcel)
      },
      formatJson(filterVal, jsonData) {
        return jsonData.map(v => filterVal.map(j => v[j]))
      },
      createTestNumber(subject, examinationRoomName, roomNo, examinationNumberA) { // 事业单位生成准考证号
        console.log(roomNo, examinationNumberA)
        if (examinationRoomName === '技师学院2号楼') {
          switch (subject) {
            case '综合管理类（A）':
              return '200102' + roomNo + examinationNumberA
            case '社会科学专技类（B）':
              return '200202' + roomNo + examinationNumberA
            case '自然科学专技类（C）':
              return '200302' + roomNo + examinationNumberA
            case '中小学教师类（D）小学教师':
              return '200402' + roomNo + examinationNumberA
            case '中小学教师类（D）中学教师':
              return '200502' + roomNo + examinationNumberA
            case '医疗卫生类（E）中医临床':
              return '200602' + roomNo + examinationNumberA
            case '医疗卫生类（E）西医临床':
              return '200702' + roomNo + examinationNumberA
            case '医疗卫生类（E）药剂':
              return '200802' + roomNo + examinationNumberA
            case '医疗卫生类（E）护理':
              return '200902' + roomNo + examinationNumberA
            case '医疗卫生类（E）医学技术':
              return '201002' + roomNo + examinationNumberA
            case '医疗卫生类（E）公共卫生管理':
              return '201102' + roomNo + examinationNumberA
          }
        } else {
          switch (subject) {
            // case '综合管理类（A）':
            //   return '200101' + roomNo + examinationNumberA
            // case '社会科学专技类（B）':
            //   return '200201' + roomNo + examinationNumberA
            // case '自然科学专技类（C）':
            //   return '200301' + roomNo + examinationNumberA
            // case '中小学教师类（D）小学教师':
            //   return '200401' + roomNo + examinationNumberA
            // case '中小学教师类（D）中学教师':
            //   return '200501' + roomNo + examinationNumberA
            // case '医疗卫生类（E）中医临床':
            //   return '200601' + roomNo + examinationNumberA
            // case '医疗卫生类（E）西医临床':
            //   return '200701' + roomNo + examinationNumberA
            // case '医疗卫生类（E）药剂':
            //   return '200801' + roomNo + examinationNumberA
            // case '医疗卫生类（E）护理':
            //   return '200901' + roomNo + examinationNumberA
            // case '医疗卫生类（E）医学技术':
            //   return '201001' + roomNo + examinationNumberA
            // case '医疗卫生类（E）公共卫生管理':
            //   return '201101' + roomNo + examinationNumberA
            case '高中语文':
              return '20200201' + roomNo + examinationNumberA
            case '高中地理':
              return '20200202' + roomNo + examinationNumberA
            case '高中数学':
              return '20200203' + roomNo + examinationNumberA
            case '高中政治':
              return '20200204' + roomNo + examinationNumberA
            case '高中英语':
              return '20200205' + roomNo + examinationNumberA
            case '特殊教育（培智）':
              return '20200206' + roomNo + examinationNumberA
            case '高中物理':
              return '20200207' + roomNo + examinationNumberA
            case '高中生物':
              return '20200208' + roomNo + examinationNumberA
            case '高中化学':
              return '20200209' + roomNo + examinationNumberA
            case '高中信息技术':
              return '20200210' + roomNo + examinationNumberA
            case '高中历史':
              return '20200211' + roomNo + examinationNumberA
              case '特殊教育（盲聋哑）':
              return '20200212' + roomNo + examinationNumberA
            case '高中音乐':
              return '20200213' + roomNo + examinationNumberA
            case '日语':
              return '20200214' + roomNo + examinationNumberA
            case '中职旅游':
              return '20200215' + roomNo + examinationNumberA
            case '意大利语':
              return '20200216' + roomNo + examinationNumberA
            case '高中心理健康':
              return '20200217' + roomNo + examinationNumberA
            case '高中体育':
              return '20200218' + roomNo + examinationNumberA
            case '书法':
              return '20200219' + roomNo + examinationNumberA
            case '舞蹈':
              return '20200220' + roomNo + examinationNumberA
          }
        }
      },
      createEducationNumber(subject, examinationRoomName, roomNo, examinationNumberA) { // 教育水测生成准考证号
        console.log(roomNo, examinationNumberA)
        switch (subject) {
          case '幼教':
            return '20200301' + roomNo + examinationNumberA
          case '小学':
            return '20200302' + roomNo + examinationNumberA
          case '初中':
            return '20200303' + roomNo + examinationNumberA
          case '高中（含职业高中）':
            return '20200304' + roomNo + examinationNumberA
        }
      },
      exportExcel() { // 导出事业单位excel
        this.transformData()
        const { export_json_to_excel } = require('@/vendor/Export2Excel')
        // 少一个准考证号，一个报考专业代码
        const tHeader = ['报考单位', '考试科目', '报考岗位', '报考专业'
          , '报名序号', '姓名', '身份证号', '考试科目A'
          , '考试地点A', '考试日期A', '考试时间A', '考场号A', '座位号A'
          , '考试科目B', '考试地点B', '考试日期B', '考试时间B', '考场号B', '座位号B',
          '最高学历', '准考证号', '报考专业代码']
        const filterVal = ['unit', 'subject', 'job', 'subject',
          'number', 'name',  'id',
          'subjectA', 'placeA', 'dateA', 'timeA',
          'examinationRoomA', 'examinationNumberA','subjectB', 'placeB', 'dateB', 'timeB',
          'examinationRoomB', 'examinationNumberB', 'testNumber ', 'testNumber']
        const list = this.dataToExcel
        const data = this.formatJson(filterVal, list)
        export_json_to_excel(tHeader, data, this.dataToExcel[0].subject)
      },
      exportEducationExcel() { // 导出教育水测excel
        this.transformData()
        const { export_json_to_excel } = require('@/vendor/Export2Excel')
        // 少一个准考证号，一个报考专业代码
        const tHeader = ['报名序号', '姓名', '身份证号', '准考证号', '报考专业',
          '考试地点', '考试日期', '考试时间', '考场号', '座位号']
        const filterVal = ['number', 'name', 'id', 'testNumber',
          'subject', 'placeA',  'dateA', 'timeA',
          'examinationRoomA', 'examinationNumberA']
        const list = this.dataToExcel
        const data = this.formatJson(filterVal, list)
        export_json_to_excel(tHeader, data, this.dataToExcel[0].subject)
      },
      exportRoomExcel() {
        this.roomExcel = []
        for (let i = 0; i < this.dataToRoomSetExcel.length; i++) {
          const str = this.dataToRoomSetExcel[i][0].testNumber + '~' + this.dataToRoomSetExcel[i][this.dataToRoomSetExcel[i].length - 1].testNumber
          const obj = {
            numberInterregional: str,
            place: this.dataToRoomSetExcel[i][0].placeA,
            subject: this.dataToRoomSetExcel[i][0].subject,
            examinationRoom: this.dataToRoomSetExcel[i][0].examinationRoomA,
            number: this.dataToRoomSetExcel[i].length

          }
          this.roomExcel.push(obj)
        }
        const { export_json_to_excel } = require('@/vendor/Export2Excel')
        // 少一个准考证号，一个报考专业代码
        const tHeader = ['报名序号', '考点', '考试类别', '考场号'
          , '人数', '具体教室']
        const filterVal = ['numberInterregional', 'place', 'subject', 'examinationRoom',
          'number',  'id ']
        const list = this.roomExcel
        const data = this.formatJson(filterVal, list)
        export_json_to_excel(tHeader, data, this.testDate + '考场安排表')
      },
      resetData() { // 重置所有上传的数据
        this.roomNo = null
        this.testNumber = null
        this.dataToExcel = []
        this.dataToRoomSetExcel = []
        this.sortData = []
      },
      testApi() { // 临时用来测试接口
        let data = {
          id:2
        }
        axios({
          url:'http://127.0.0.1' + '/user/getUserList',
          method:'get',
          params:data
        }).then(res => {console.log(res)})
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .main-container {
    margin: 0 auto;
    width: 210mm;
    .header {
      margin-bottom: 30px;
      page-break-after: always;
    }
    .button-group {
      margin-top: 10px;
      display: flex;
      justify-content: flex-start;
    }
    .container {
      margin-top: 20px;
      display: flex;
      flex-wrap: wrap;
      page-break-after: always;
      align-items: flex-start;
      .item {
        font-size: 8px;
        width: 34.4mm;
        height: 55mm;
        border: 1px solid gray;
        margin: 0 -1px -1px 0;
        p {
          text-align: left;
          margin: 2px 0 0 5px;
          span {
            display: inline-block;
          }
          .bd-bottom {
            display: block;
            min-width: 65%;
            border-bottom: 1px solid black;
            margin-right: 7px;
          }
        }
        .formate {
          display: flex;
          justify-content: space-between;
        }
        img {
          margin-top: 2px;
          width: 20mm;
          height: 24mm;
        }
      }
    }
    .hello {
      margin: 0 auto;
      min-height: 1200px;
      max-height: 1200px;
      width: 1100px;
      background-color: #42b983;
    }
  }

</style>
