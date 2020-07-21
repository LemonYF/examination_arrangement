<template>
  <div class="main-container">
    <img alt="Vue logo" :src="picUrl">
    <h3>考场座次表生成系统</h3>
    <el-input v-model="title" placeholder="请输入标题，示例：”2020年度襄阳市市直学校公开招聘笔试座次表“"></el-input>
    <p></p>
      <el-input v-model="testPlaceName" placeholder="请输入考点名称，示例：”襄阳技师学院“"></el-input>
    <p></p>
    <el-input v-model="testSubject" placeholder="请输入考试科目，示例：”医疗卫生类（E）医学技术“"></el-input>
    <p></p>
    <el-input v-model="testDate" placeholder="请输入科目考试日期，示例：”2020年8月1日“"></el-input>
    <p></p>
    <el-input v-model="testTimeA" placeholder="请输入科目A考试时间，示例：”08：00 - 9：30“"></el-input>
    <p></p>
    <el-input v-model="testTimeB" placeholder="请输入科目B考试时间，示例：”09：30 - 11：00“"></el-input>
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
    <br />
    <el-button style="margin-bottom: 10px" type="primary" @click="assignedExamination">分配考场</el-button>
    <br />
    <el-button style="margin-bottom: 10px" type="primary" @click="exportExcel">导出excel</el-button>
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
        <span style="display: inline-block">科目： {{ testSubject }}</span>
      </p>
      <div class="container">
        <div class="item" v-for="(person, key) in item" :key="key">
          <img :src="'img/'+ person.number + '.jpg'" alt="">
          <p>姓名：{{ person.name }}</p>
          <p>证号：{{ person.id }}</p>
          <p><span>考场： {{ person.examinationRoomA || '' }}</span> <span>座位: {{ person.examinationNumberA || '' }}</span></p>
          <p class="formate"><span>进场：</span> <span class="bd-bottom">               </span></p>
          <p class="formate"><span>离场：</span> <span class="bd-bottom">               </span></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import XLSX from 'xlsx'

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
        testPlaceName: '襄阳技师学院', // 考点名称
        testDate: '2020年8月1日', // 考试日期
        title: '2020年度襄阳市市直学校公开招聘笔试座次表', // 标题
        testSubject: '医疗卫生类（E）医学技术', // 考试科目
        testTimeA: '08：00 - 9：30',
        testTimeB: '09：30 - 11：00',
        picUrl: 'logo.png',
        dataToExcel: '', // 待导出为excel的数据
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
        let arr = []
        let len = dataList.length
        for (let i = 0; i < len; i += 30) {
          arr.push(dataList.slice(i, i + 30))
        }
        return arr
      },
      clickGenerate() {
        this.hasClick = true
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
          console.log('第' + i + '个考场')
          for (let j = 0; j < this.sortData[i].length; j++) {
            console.log(this.sortData[i][j].name)
            this.$set(this.sortData[i][j], 'placeA', this.testPlaceName)
            this.$set(this.sortData[i][j], 'placeB', this.testPlaceName)
            this.$set(this.sortData[i][j], 'subjectA', this.testSubject)
            this.$set(this.sortData[i][j], 'subjectB', this.testSubject)
            this.$set(this.sortData[i][j], 'dateA', this.testDate)
            this.$set(this.sortData[i][j], 'dateB', this.testDate)
            this.$set(this.sortData[i][j], 'timeA', this.testTimeA)
            this.$set(this.sortData[i][j], 'timeB', this.testTimeB)
            this.$set(this.sortData[i][j], 'examinationRoomA', i + 1 < 10 ? '0' + (i + 1) : i + 1)
            this.$set(this.sortData[i][j], 'examinationNumberA', j + 1 < 10 ? '0' + (j + 1) : j + 1)
            this.$set(this.sortData[i][j], 'examinationRoomB', i + 1 < 10 ? '0' + (i + 1) : i + 1)
            this.$set(this.sortData[i][j], 'examinationNumberB', j + 1 < 10 ? '0' + (j + 1) : j + 1)
            // this.sortData[i][j].placeA = this.testPlaceName
            // this.sortData[i][j].placeB = this.testPlaceName
            // this.sortData[i][j].subjectA = this.testSubject
            // this.sortData[i][j].subjectB = this.testSubject
            // this.sortData[i][j].dateA = this.testDate
            // this.sortData[i][j].dateB = this.testDate
            // this.sortData[i][j].timeA = this.testTimeA
            // this.sortData[i][j].timeB = this.testTimeB
            // this.sortData[i][j].examinationRoomA = i < 10 ? '0' + i : i
            // this.sortData[i][j].examinationNumberA = i < 10 ? '0' + i : i
            // this.sortData[i][j].examinationRoomB = j < 10 ? '0' + j : j
            // this.sortData[i][j].examinationNumberB = j < 10 ? '0' + j : j
          }
        }
      },
      exportExcel() {
        console.log(222)
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
