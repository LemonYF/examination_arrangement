<template>



    <div>
        <el-button style="margin-bottom: 10px" type="primary" @click="uploadExcel">分配考场</el-button>
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
                        this.excelData = exl
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
            // reSetData(dataList) {
            //     let arr = []
            //     let len = dataList.length
            //     for (let i = 0; i < len; i += 30) {
            //         arr.push(dataList.slice(i, i + 30))
            //     }
            //     return arr
            // },
        }
    }

</script>

<style scoped>

</style>
