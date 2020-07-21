<template>
  <div class="main-container">
    <img alt="Vue logo" :src="picUrl">
    <h3>考场座次表生成系统</h3>
    <el-input v-model="title" placeholder="请输入标题，示例：”2020年度襄阳市市直学校公开招聘笔试座次表“"></el-input>
    <p></p>
      <el-input v-model="testPlaceName" placeholder="请输入考点名称，示例：”襄阳技师学院“"></el-input>
    <p></p>
    <el-input v-model="testSubject" placeholder="请输入考试科目，示例：”2019年4月27日09;00~11:00教育综合“"></el-input>
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
          <p><span>考场： {{ '01' }}</span> <span>座位: {{ '04' }}</span></p>
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
        testPlaceName: '', // 考点名称
        title: '', // 标题
        testSubject: '', // 考试科目
        picUrl: 'logo.png',
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
