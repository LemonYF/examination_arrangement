<!-- 生成工人技术等级证书 -->
<template>
  <div class="main-container">
    <el-upload
            class="upload header"
            action=""
            :multiple="false"
            :show-file-list="false"
            accept="csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            :http-request="httpRequest">
      <el-button size="small" type="primary">上传等级工合格列表</el-button>
    </el-upload>

      <div class="container" v-for="(item, index) in tableData" :key="index">
        <div class="left-container">
          <div class="left"></div>
          <div class="right">
            <div class="left-right-top"></div>
            <div class="left-right-bottom">
              <span style="padding-top:0px;">{{ item.name }}</span>
              <span style="padding-top:15px;">{{ item.sex }}</span>
              <span>{{ item.id }}</span>
              <span style="font-size: 20px">{{ item.subject }}</span>
              <div class="work-unit">
                <span style="font-size:19px;">{{ item.unit }}</span>
              </div>
              
              <div class="blank_space"></div>
              <span>2021年12月31日</span>
            </div>
          </div>
        </div>
        <div class="right-container">
          <div class="right-top">
            <img :src="'img/'+ item.id + '.jpg'" alt="">
          </div>
          <div class="right-bottom">
            <div class="right-bottom-top"><span  style="margin-top:-10px;">2021</span></div>
            <div class="right-bottom-center"><span>{{ item.level }}</span></div>
            <div class="right-bottom-bottom">
              <span style="padding-top:20px;padding-left:220px;"></span>
              <span class="unit">襄阳市机关事业单位工人技术等级岗位考核办公室</span>
              <span style="padding-top:20px;padding-left:220px;"></span>
              <span>{{ item.managerNumber }}</span>
              <span style="padding-top:5px;padding-left:350px;font-size:14px">湖北省襄阳市</span>
            </div>
          </div>
        </div>
      </div>
  </div>
</template>

<script>
import XLSX from 'xlsx'
export default {
  components: {},
  data() {
    return {
       tableData: [],
       tableDataLength: ''
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
            console.log(this.sortData)
            // document.getElementsByName('file')[0].value = '' // 根据自己需求，可重置上传value为空，允许重复上传同一文件
          } catch (e) {
            console.log('出错了：：')
            return false
          }

        }
        fileReader.readAsBinaryString(file)
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
  .main-container {
    margin: 0 auto;
    .header {
      margin-bottom: 30px;
      page-break-after: always;
    }
    .container {
      margin-top: 20px;
      min-width: 297mm;
      min-height: 210mm;
      max-width: 297mm;
      max-height: 210mm;
      background-color: #42b983;
      display: flex;
      flex-wrap: wrap;
      page-break-after: always;
      margin: 10px auto;
      color: #000;
      // align-items: flex-start;
      .left-container {
        min-width: 60%;
        background-color: aqua;
        display: flex;
        .left {
          min-width: 45.8%;
          background-color: rgb(49, 35, 131);
        }
        .right {
          min-width: 54.2%;
          background-color: rgb(166, 214, 208);
          .left-right-top {
            min-height: 35.3%;
            background-color: rgb(197, 211, 133);
          }
          .left-right-bottom {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            min-height: 64.7%;
            background-color: rgb(133, 211, 152);
            .work-unit {
              height: 90px;
              width: 100%;
              background-color: tan;
              span {
                align-items: flex-start;
                padding-left: 120px;
                padding-top: 12px;
                word-break: break-all;
                word-wrap: break-word;
                text-align:left;
              }
            }
            .blank_space {
              height: 67px;
              width: 100%;
              background-color: rgb(243, 171, 210);
            }
            span {
              display: block;
              padding-left: 120px;
              padding-top: 15px;
              font-family: SimSun;
              font-size: 22px;
              text-align:left;
            }
          }
        }
      }
      .right-container {
        min-width: 40%;
        background-color: rgb(111, 214, 51);
        .right-top {
          min-height: 47%;
          background-color: burlywood;
          display: flex;
          flex-direction: column-reverse;
          align-items: center;
          img {
            padding-left: 160px;
            padding-bottom: 40px;
            width: 100px;
            height: 120px;
          }
        }
        .right-bottom {
          min-height: 53%;
          width: 100%;
          display: flex;
          flex-direction: column;
          .right-bottom-top {
            min-height: 50px;
            width: 100%;
            background-color: lightsalmon;
            span {
              display: block;
              padding-left: 35px;
              font-family: SimSun;
              font-size: 22px;
            }
          }
          .right-bottom-center {
            min-height: 123px;
            width: 100%;
            background-color:steelblue;
            display: flex;
            span {
              justify-content: end;
              align-items: flex-end;
              display: block;
              font-family: SimSun;
              font-size: 20px;
              padding-left: 15px;
              padding-top: 40px;
            }
          }
          .right-bottom-bottom {
            min-height: 200px;
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            span {
              display: block;
              font-family: SimSun;
              font-size: 22px;
              padding-left: 172px;
            }
            .unit {
              display: block;
              font-family: SimSun;
              font-size: 12px;
              padding-left: 172px;
            }
          }
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
