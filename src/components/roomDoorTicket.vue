<template>
    <div class="main-container">
        <h3>生成教育水平能力测试门贴</h3>
        <h4>根据准考证生成对应门贴</h4>
        <p>number	name	id	testNumber	subject	place	date	time	room	seat</p>
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

        <div v-for="(item, index) in doorTicket" :key="index">
            <div class="container">
                <h1>2021年度襄阳东津新区（经开区）六两河街道所属事业单位公开招聘工作人员笔试</h1>
                <!-- <h1>公开招聘工作人员笔试</h1> -->
                <!-- <p> 襄阳职业技术学院智造工业中心B栋</p> -->
                <p>  </p>
                <p> 第<span :style="{'font-weight': 'bold', 'font-size': '80px'}">{{ item.room }}</span>考场</p>
                <!-- <p style="font-weight: 700">{{item.subject}}({{ item.count }})人</p> -->
                <p style="font-weight: 700">({{ item.count }})人</p>
                <p> {{ item.minNumber }} - {{ item.maxNumber }}</p>
                <div class="line"></div>
                <p></p>
                <p></p>
                <p></p>
                <p>2021年11月13日上午</p>
                <p> 08:30-12:00 </p>
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
                picUrl: 'logo.png',
                doorTicket: [],
                maxNumber: 0,

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
                        this.creatDoorTicketArray(this.sortData)
                        document.getElementsByName('file')[0].value = '' // 根据自己需求，可重置上传value为空，允许重复上传同一文件
                    } catch (e) {
                        console.log('出错了：：')
                        return false
                    }

                }
                fileReader.readAsBinaryString(file)
            },
            reSetData(dataList) {
                let arrayTwo = Object.values(dataList.reduce((res, item) => {
                    res[item.room] ? res[item.room].push(item) : res[item.room] = [item]
                    return res
                }, {}))
                return arrayTwo
            },
            creatDoorTicketArray(data) {
                let arr = []
                let len = data.length
                for (let i = 0; i < len; i += 1) {
                    let obj = {
                        count: 0,
                        minNumber: 0,
                        maxNumber: 0,
                        people: 0,
                        subject: ''
                    }
                    obj.count = data[i].length
                    const length = data[i].length - 1
                    let item =  data[i]
                    obj.minNumber = item[0].testNumber
                    obj.maxNumber = item[length].testNumber
                    obj.subject = item[0].subject
                    obj.room = item[0].room
                    obj.people = length + 1
                    arr.push(obj)
                }
                this.doorTicket = arr
                console.log(this.doorTicket)
            }
        }
    }
</script>

<style scoped lang="scss">
    .main-container {
        margin: 0 auto;
        width: 320mm;

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
            width: 100%;
            margin-top: 20px;
            display: flex;
            flex-wrap: wrap;
            page-break-after: always;
            align-items: flex-start;
            h1 {
                width: 100%;
                font-size: 64px;
                color: black;
                margin-top: 10px;
                margin-bottom: 10px;
                font-weight: bold;
                font-family: "SimHei"
            }
            h2 {
                width: 100%;
                font-size: 66px;
                color: black;
                margin-top: 10px;
                margin-bottom: 10px;
                font-family: "FangSong"
            }
            p {
                width: 100%;
                font-size: 66px;
                color: black;
                margin-top: 10px;
                margin-bottom: 10px;
                font-family: "FangSong"
            }
            .line {
                width: 80%;
                border-top: 1px solid dodgerblue;
                margin: 10px auto 0;
            }
        }
    }

</style>
