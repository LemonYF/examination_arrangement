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
        name: "addKeyItem",
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
                for (let i = 0; i < this.tableData.length; i++) {
                    for (let j = 0; j < this.sourceData.length; j++) {
                        if(this.tableData[i].id == this.sourceData[j].id) {
                            this.tableData[i].grade = this.sourceData[j].grade
                        }
                        // if (this.tableData[i].name === this.sourceData[j].name && this.tableData[i].id === this.sourceData[j].id) {
                        //     this.result.push('第'+ j + '条数据' + this.tableData[i].name + '已找到')
                        // }
                    }
                }
                console.log(this.tableData)
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
                const tHeader = ['身份证号\n', '分数\n']
                const filterVal = ['id', 'grade']
                const list = this.tableData
                const data = this.formatJson(filterVal, list)
                export_json_to_excel(tHeader, data, '终表')
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