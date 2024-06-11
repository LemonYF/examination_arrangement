<template>
<!--    生成资格复审名单-->
<!--    number	id	name	testCode	unitCode	codeKey  job  ratio	need    updategrade -->
<!-- 处理逻辑为当总人数少于资格复审人数时，全部进入资格复审，如果总人数大于资格复审人数，则从招录人数*比例的人数号码开始比较每下一个成绩，成绩相同则都进入资格复审，成绩不同，则终止 -->
<!--    使用说明: 字段为以上字段,总分排序按照updategrade排序,必须要有比例和人数 codeKey在没有岗位代码的情况下为unitCod+jobCode-->
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
        <el-button style="margin-bottom: 10px" type="primary" @click="exportList">导出资格复审名单</el-button>
    </div>
</template>


<script>
    import XLSX from 'xlsx'
    export default {
        name: "generateList",
        data() {
            return {
                excelData: [], //原始数据
                excelDataLength: '', // 原始数据长度
                unitData: [], // 按照单位进行分组,去掉缺考的人,是一个二维数组
                examieeList: [], // 
                dataToExcel: [], // 生成复审名单待导出的数据
            }
        },
        methods: {
            httpRequest(e) { // 第一部上传数据,形成全部人员数据数组
                let file = e.file // 文件信息
                console.log('e: ', e)
                console.log('file: ', e.file)
                this.dataToExcel = []

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
            unitGroup() { // 按照单位进行分组,去掉缺考考生形成二维数组
                let arr1 = this.excelData
                const arr = Object.values(arr1.reduce((res, item) => {
                    res[item.codeKey] ? res[item.codeKey].push(item) : res[item.codeKey] = [item]
                        return res
                }, {}))
                // console.log(arr)
                this.unitData = arr // 生成了每个岗位单独的二维数组,下一步将缺考信息删除
                for (let i = 0; i < this.unitData.length; i++) {
                    for (let j = 0 ; j < this.unitData[i].length; j++) {
                        if( this.unitData[i][j].updategrade === 0){
                            // console.log('删除考生', this.unitData[i][j].name)
                            this.unitData[i].splice(j, 1) // 此时unitData是按照岗位划分,并且没有缺考考生的二维数组
                            j--
                        }
                    }
                }
                console.log('无缺考考生名单', this.unitData)
                // for (let i = 0; i < this.unitData.length; i++) {
                //     if( this.unitData[i].length === 0){
                //         // console.log(11111, i)
                //         this.unitData.splice(i, 1) // 此时unitData是按照岗位划分,并且没有缺考考生的二维数组
                //     }
                // }
                // 下一步,按照每个子数组第一个考生的招聘人数及比例,算出该岗位正常进面人数
                for (let i = 0; i < this.unitData.length; i++) {
                    const requireNumber = this.unitData[i][0].ratio * this.unitData[i][0].need
                    console.log(requireNumber, this.unitData[i][0].codeKey) 
                    if (requireNumber >= this.unitData[i].length) {
                        // 当总人数少于资格复审人数时，全部进入资格复审
                        for(let j = 0; j < this.unitData[i].length; j++) {
                            this.examieeList.push(this.unitData[i][j])
                        }
                    } else { // 如果总人数大于资格复审人数，则从招录人数*比例的人数号码开始比较每下一个成绩，成绩相同则都进入资格复审，成绩不同，则终止
                        console.log(this.unitData[i][0].unitCode, this.unitData[i][0].job, this.unitData[i].length)
                        for (let j = 0 ; j < this.unitData[i].length; j++) {
                            if (j < requireNumber) { // 人数没超过require人数时，直接push
                                this.examieeList.push(this.unitData[i][j])
                            } 
                            else {
                                if (this.unitData[i][j].updategrade === this.unitData[i][j-1].updategrade) {
                                    console.log("j", j)
                                    console.log(this.unitData[i][j], this.unitData[i][j-1])
                                    this.examieeList.push(this.unitData[i][j])
                                } else {
                                    break;
                                }
                            } 
                        }
                    }
                    console.log('第', i + 1, '个岗位', this.examieeList)
                }
                console.log('111111111112222222222', this.examieeList)
            },
            exportList() {
                this.dataToExcel = this.examieeList
                // for (let i = 0; i < this.unitData.length; i++) {
                //     for (let j = 0; j < this.unitData[i].length; j++) {
                //         this.dataToExcel.push(this.unitData[i][j])
                //     }
                // }
                const { export_json_to_excel } = require('@/vendor/Export2Excel')
                // 少一个准考证号，一个报考专业代码
                const tHeader = ['准考证号\n', '身份证号\n', '姓名\n', '职位代码\n', '职位招考比例\n', '职位招考人数\n', '加分后分数\n']
                const filterVal = ['testCode',	'id',	'name',	'codeKey',	'ratio',  'need',	'updategrade']
                const list = this.dataToExcel
                const data = this.formatJson(filterVal, list)
                export_json_to_excel(tHeader, data, '资格复审名单')
            },
            formatJson(filterVal, jsonData) {
                return jsonData.map(v => filterVal.map(j => v[j]))
            }
        }
    }
</script>

<style scoped>

</style>
