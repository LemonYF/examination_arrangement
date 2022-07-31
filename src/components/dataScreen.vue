<template>
    <div>
        <p>使用说明：此功能是为了给特定表增加字段，比如考生名单表里根据另一个表的字段增加成绩</p>
        <el-input v-model="dataKey" placeholder="请输入需要对比的key（唯一指定）"></el-input>
        <p></p>
        <el-input v-model="dataValue" placeholder="请输入需要增加的对应key"></el-input>
        <p></p>
        <div style="flex: 1">
            <!-- 按钮 -->
            <el-upload
                    class="upload"
                    action=""
                    :multiple="false"
                    :show-file-list="false"
                    accept="csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    :http-request="httpRequest">
                <el-button size="small" type="primary">上传需要增加数据的数据表</el-button>
            </el-upload>
            <!-- 按钮 end -->
            <!-- 按钮 -->
            <el-upload
                    class="upload"
                    action=""
                    :multiple="false"
                    :show-file-list="false"
                    accept="csv, application/vnd.ms-excel, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                    :http-request="httpRequestSecond">
                <el-button size="small" type="primary">上传含有需增加数据的数据表</el-button>
            </el-upload>
            <!-- 按钮 end -->
        </div>
        <el-button style="margin-top: 10px" type="primary" @click="addData">添加数据</el-button>
        <el-button style="margin-bottom: 10px" type="primary" @click="exportList">导出数据添加后名单</el-button>

    </div>
</template>

<script>
    import XLSX from 'xlsx'
    export default {
        name: "dataScreen",
        data() {
            return {
                dataKey: '',
                dataValue: '',
                sourceData: [],
                tableData: [],
                result: []
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
                        alert('上传成功')
                        // document.getElementsByName('file')[0].value = '' // 根据自己需求，可重置上传value为空，允许重复上传同一文件
                    } catch (e) {
                        console.log('出错了：：')
                        return false
                    }

                }
                fileReader.readAsBinaryString(file)
            },
            httpRequestSecond(e) {
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
                        this.tableDataLength = exl.length
                        // 将 JSON 数据挂到 data 里
                        this.sourceData = exl
                        alert('上传成功')
                        // document.getElementsByName('file')[0].value = '' // 根据自己需求，可重置上传value为空，允许重复上传同一文件
                    } catch (e) {
                        console.log('出错了：：')
                        return false
                    }

                }
                fileReader.readAsBinaryString(file)
            },
            addData() {
                alert('开始增加数据')
                for (let i = 0; i < this.tableData.length; i++) {
                    let flag = 0
                    for (let j = 0; j < this.sourceData.length; j++) {
                        if(this.tableData[i].id === this.sourceData[j].id) {
                            flag = 1
                            console.log(' flag = 1  找到一个相同的', this.tableData[i].name, i+1)
                            // if (this.tableData[j] && this.tableData[j].status == '合格') {
                            //     return
                            // }
                            this.tableData[i].status = this.sourceData[j].status
                            this.tableData[i].subject1 = this.sourceData[j].subject
                            if (this.tableData[j] && this.tableData[j].status == '不合格') {
                                this.tableData[i].status = '水测成绩不合格'
                            }
                        }
                    }
                    if (!flag) {
                        console.log(' flag = 0  未找到', this.tableData[i].name, i+1)
                        this.tableData[i].status = '水测成绩查无此人'
                    }
                }
                alert('数据增加成功')
                console.log('数据增加成功', this.tableData)
            },
            exportList() {
                // this.dataToExcel = []
                // for (let i = 0; i < this.unitData.length; i++) {
                //     for (let j = 0; j < this.unitData[i].length; j++) {
                //         this.dataToExcel.push(this.unitData[i][j])
                //     }
                // }
                const { export_json_to_excel } = require('@/vendor/Export2Excel')
                // 少一个准考证号，一个报考专业代码
                const tHeader = ['序号\n', '姓名\n', '性别\n', '身份证\n', '生日\n', '单位\n', '性质\n', '学历1\n', '毕业1\n', '学历2\n', '毕业2\n', '职务\n', '专业\n',
                    '资格\n', '资格1\n', '年限\n', '职称\n', '类型\n', '继续教育\n', '2019\n', '2020\n', '年度\n', '等级\n', '电话\n', '备注\n', '水测\n', '水测专业\n']
                const filterVal = ['number', 'name', 'sex', 'id', 'birth', 'unit', 'xingzhi', 'xueli1', 'when1', 'xueli2', 'when2', 'zhiwu', 'subject',
                    'time', 'time1', 'year', 'zhicheng', 'type', 'jixu', '2019', '2020', 'year1', 'grade', 'phone', 'remark', 'status', 'subject1']
                const list = this.tableData
                const data = this.formatJson(filterVal, list)
                const timestamp = Date.parse(new Date()) 
                export_json_to_excel(tHeader, data, '终表'+ timestamp)
            },
            formatJson(filterVal, jsonData) {
                return jsonData.map(v => filterVal.map(j => v[j]))
            }
        }
    }
</script>

<style scoped lang="scss">
    .upload {
        margin-top: 10px;
    }
</style>
