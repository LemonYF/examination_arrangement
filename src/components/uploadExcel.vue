<template>
    <div>
        <!-- 按钮 -->
        <el-upload
                class="upload"
                action=""
                :multiple="false"
                :show-file-list="false"
                accept="csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                :http-request="httpRequest">
            <el-button size="small" type="primary">上传原始excel数据</el-button>
        </el-upload>
        <p></p>
        <el-upload
                class="upload"
                action=""
                :multiple="false"
                :show-file-list="false"
                accept="csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                :http-request="httpRequest">
            <el-button size="small" type="primary">上传对比excel数据</el-button>
        </el-upload>
        <p></p>
        <el-button style="margin-bottom: 10px" type="primary" @click="generateExcel()">生成对比数据excel</el-button>
        <p></p>
        <el-button style="margin-bottom: 10px" type="primary" @click="exportRoomExcel">导出考场安排excel</el-button>
    </div>
</template>

<script>
    import XLSX from 'xlsx'
    export default {
        name: "uploadExcel",
        data() {
            return {
                excelData: [],
                excelDataLength: '',
                dataToExcel: [], // 待导出的数据
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
                        this.excelDataLength = exl.length
                        // 将 JSON 数据挂到 data 里
                        this.excelData.push(exl) // 将上传的数据存入excel数组中
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
            // 注释，对比关键字为key
            generateExcel() {
                console.log(111)
                let excelData1 = this.excelData[0]
                let excelData2 = this.excelData[1]
                for (let i = 0 ; i < excelData1.length; i++) {
                    for (let j = 0; j < excelData2.length; j++) {
                        // console.log(111, Number(excelData1[i].key))
                        // console.log(222, Number(excelData2[j].key))
                        if (Number(excelData1[i].key) === Number(excelData2[j].key)) {
                            this.dataToExcel.push(excelData2[j])
                            console.log('找到了！！！！！')
                        }
                    }
                }
            },
            exportRoomExcel() {
                const { export_json_to_excel } = require('@/vendor/Export2Excel')
                const tHeader = ['姓名', '工作单位', '报名序号', '报名点'
                    , '身份证号', '性别', '准考证号', '证书编号']
                const filterVal = ['name', 'unit', 'key', 'place',
                    'id',  'sex',  'number', 'code']
                const list = this.dataToExcel
                const data = this.formatJson(filterVal, list)
                export_json_to_excel(tHeader, data, '合格考生信息表')
            },
            formatJson(filterVal, jsonData) {
                return jsonData.map(v => filterVal.map(j => v[j]))
            }
        }
    }

</script>

<style scoped>

</style>
