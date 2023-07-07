<template>
    <div class="main-container">
        <h3>生成座次表</h3>
        <h4>根据准考证生成对应座次表</h4>
        <p>number	name	id	testNumber	subject	place	date	time	room	seat</p>
        <el-input v-model="title" placeholder="请输入标题，示例：”襄阳市2023年专项引进紧缺人才笔试座次表“"></el-input>
        <p></p>
        <el-input v-model="testPlaceName" placeholder="请输入考点名称，示例：”襄阳技师学院（东津）“"></el-input>
        <p></p>
        <el-input v-model="testSubjectA" placeholder="请输入考试科目A，示例：”职业能力倾向测验“"></el-input>
        <p></p>
        <el-input v-model="testSubjectB" placeholder="请输入考试科目B，示例：”综合应用能力“"></el-input>
        <p></p>
        <el-upload
                class="upload"
                action=""
                :multiple="false"
                :show-file-list="false"
                accept="csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                :http-request="httpRequest">
            <el-button size="small" type="primary">上传考场名单表</el-button>
        </el-upload>
        <p style="page-break-after: always;"></p>
<!--        <div class="header">-->
<!--            <br />-->
<!--            <span v-if="tableDataLength">共有数据 {{ tableDataLength }} 条</span>-->
<!--        </div>-->
        <div v-for="(item, index) in sortData" :key="index">
            <h4 style="margin: 0 auto">{{ title }}   {{ item[0].room}} 考场</h4>
            <p style="display: flex; justify-content: space-between">
                <span style="display: inline-block">考点： {{ testPlaceName }}</span>
                <span v-if="testSubjectB !== ''" style="display: inline-block">科目： {{ testSubjectA }} / {{ testSubjectB }} </span>
                <span v-else style="display: inline-block">科目： {{ testSubjectA }} </span>
            </p>
            <div class="container">
                <div class="item" v-for="(person, key) in item" :key="key">
                    <!-- 针对只有人员编号的照片 -->
                    <!-- <img :src="'img/'+ person.number + '.jpg'" alt=""> -->
                    <!-- 针对只有人员ID的照片 -->
                    <!-- <img :src="'img/'+ person.id +'.jpg'" alt=""> -->
                    <!-- 针对人员姓名+ID的照片 -->
                    <!-- <img :src="'img/'+ person.name + person.id + '.jpg'" alt=""> -->
                    <!-- 针对人员姓名的照片 -->
                    <img :src="'img/'+ person.name + '.jpg'" alt="">
                    <p>姓名：{{ person.name }}</p>
                    <p>身份证号：</p>
                    <p>{{ person.id }}</p>
                    <p><span style="margin-right: 5px">考场： {{ person.room || '' }}</span> <span>座位: {{ person.seat || '' }}</span></p>
                    <p class="formate"><span>进场：</span> <span class="bd-bottom">               </span></p>
                    <p class="formate"><span>离场：</span> <span class="bd-bottom">               </span></p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import XLSX from "xlsx"

    export default {
        name: "SeatMap",
        data () {
            return {
                tableData: [],
                tableDataLength: '',
                hasClick: false,
                testPlaceName: '', // 考点名称
                testDate: '2020年8月9日', // 考试日期
                title: '笔试座次表', // 标题
                testSubjectA: '综合能力知识', // 考试科目
                testSubjectB: '', // 考试科目
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
                        document.getElementsByName('file')[0].value = '' // 根据自己需求，可重置上传value为空，允许重复上传同一文件
                    } catch (e) {
                        console.log('出错了：：')
                        return false
                    }

                }
                fileReader.readAsBinaryString(file)
            },
            reSetData(dataList) {
                // for (let i = 0 ; i < dataList.length; i++) {
                //     dataList[i].testNumber = dataList[i].testNumber.replace("l","")
                // }
                let arrayTwo = Object.values(dataList.reduce((res, item) => {
                    res[item.room] ? res[item.room].push(item) : res[item.room] = [item]
                    return res
                }, {}))
                return arrayTwo
            },
        }
    }
</script>

<style scoped lang="scss">
    .main-container {
        margin: 0 auto;
        width: 220mm;
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
                width: 36.3mm;
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
