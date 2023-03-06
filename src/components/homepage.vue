<template>
    <div class="main-container">
      <img alt="Vue logo" :src="picUrl">
      <h3>考务工具系统</h3>
      <p>
        <router-link to="/HelloWorld">编排考场</router-link>
      </p>
      <p>
        <router-link to="/seat">座次表生成</router-link>
      </p>
      <p>
        <router-link to="/doorTicket">考场门贴生成</router-link>
      </p>
      <p>
        <router-link to="/generateList">资格复审名单生成</router-link>
      </p>
      <p>
        <router-link to="/generateWorkerCert">工考证书生成</router-link>
      </p>
      <p>
        <router-link to="/generateAuditionList">不记得了</router-link>
      </p>
    </div>
  </template>
  
  <script>
    export default {
      name: 'homePage',
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
        // testApi() { // 临时用来测试接口
        //   let data = {
        //     id:2
        //   }
        //   axios({
        //     url:'http://127.0.0.1' + '/user/getUserList',
        //     method:'get',
        //     params:data
        //   }).then(res => {console.log(res)})
        // }
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
  