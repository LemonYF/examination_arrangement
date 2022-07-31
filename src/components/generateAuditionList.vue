<template>
<!--    生成资格复审名单, 后面时间安排表的人员列表，一个单元格显示多个人员名单-->
<!--    number	id	name	testCode	cityCode	unitCode	jobCode	ratio	need	call
	qk1	qk2	grade1	grade2	totalgrade	update	updategrade codeKey-->
<!--    使用说明: 字段为以上字段,总分排序按照updategrade排序,必须要有比例和人数 codeKey为unitCod+jobCode-->
    <div>
        <!-- 上传原始数据按钮 -->
        <el-upload
                class="upload"
                action=""
                :multiple="false"
                :show-file-list="false"
                accept="csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                :http-request="httpRequest">
            <el-button size="small" type="primary">上传原始资格复审名单原始数据</el-button>
        </el-upload>
        <p></p>
        <el-button style="margin-bottom: 10px" type="primary" @click="exportList">导出面试人员名单，连续的</el-button>
    </div>
</template>


<script>
    import XLSX from 'xlsx'
    export default {
        name: "generateAuditionList",
        data() {
            return {
                excelData: [], //原始数据
                excelDataLength: '', // 原始数据长度
                unitData: [], // 按照单位进行分组,去掉缺考的人,是一个二维数组
                dataToExcel: [], // 生成复审名单待导出的数据
            }
        },
        methods: {
            httpRequest(e) { // 第一部上传数据,形成全部人员数据数组
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
                        this.excelDataLength = exl.length
                        // 将 JSON 数据挂到 data 里
                        this.excelData = exl // 将上传的数据存入excel数组中
                        alert('上传成功')
                        this.unitGroup()
                        // this.sortData = this.reSetData(this.tableData)
                        // console.log(this.sortData)
                        // document.getElementsByName('file')[0].value = '' // 根据自己需求，可重置上传value为空，允许重复上传同一文件
                    } catch (e) {
                        console.log('出错了：：')
                        return false
                    }
                }
                fileReader.readAsBinaryString(file)

            },
            // handleNameList() {
               
            // },
            exportList() {
                // const totalData = this.excelData
                 // 首先读取全部数据，然后大循环
                this.dataToExcel = [] // 等待导出的总数据
                let obj = {
                    jobcode: '',
                    namelist: ''
                } // 循环中使用的temp数据
                for(let i in this.excelData) {
                    // console.log(this.excelData[i]);
                    if(i == 0) {
                        obj.jobcode = this.excelData[i].jobcode
                        obj.namelist = this.excelData[i].name
                    } else { // 如果不是第一个元素
                        if(this.excelData[i]) {
                            if(this.excelData[i-1].jobcode == this.excelData[i].jobcode) { // 如果当前项的jobcode与上一个一致，继续拼接
                                obj.namelist = obj.namelist + "、" + this.excelData[i].name
                            }
                            else { // 如果当前项的jobcode与上一个不一致，当前obj需要push到总数据里，剩下的清空，继续拼接
                                this.dataToExcel.push(obj)
                                obj = {
                                    jobcode: this.excelData[i].jobcode,
                                    namelist: this.excelData[i].name
                                }
                            }
                        }
                    } 
                }
                const { export_json_to_excel } = require('@/vendor/Export2Excel')
                // 少一个准考证号，一个报考专业代码
                const tHeader = ['岗位代码\n', '人员列表\n']
                const filterVal = ['jobcode', 'namelist']
                const list = this.dataToExcel
                const data = this.formatJson(filterVal, list)
                export_json_to_excel(tHeader, data, '人员名单')
            },
            formatJson(filterVal, jsonData) {
                return jsonData.map(v => filterVal.map(j => v[j]))
            }
        }
    }
</script>

<style scoped>

</style>
