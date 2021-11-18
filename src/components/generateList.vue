<template>
<!--    生成资格复审名单-->
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
                        if( this.unitData[i][j].qk1 === 'Q'){
                            // console.log('删除考生', this.unitData[i][j].name)
                            this.unitData[i].splice(j, 1) // 此时unitData是按照岗位划分,并且没有缺考考生的二维数组
                            j--
                        }
                    }
                }
                for (let i = 0; i < this.unitData.length; i++) {
                    if( this.unitData[i].length === 0){
                        console.log(11111, i)
                        this.unitData.splice(i, 1) // 此时unitData是按照岗位划分,并且没有缺考考生的二维数组
                    }
                }
                // 下一步,按照每个子数组第一个考生的招聘人数及比例,算出该岗位正常进面人数
                for (let i = 0; i < this.unitData.length; i++) {
                    const requireNumber = this.unitData[i][0].ratio *  this.unitData[i][0].need
                    console.log(requireNumber, this.unitData[i][0].jobCode)
                    if (requireNumber < this.unitData[i].length) {  //当总人数多余进面人数要求时,按照正常流程进行
                        // console.log(111)
                        // const gradeArr = [] // 成绩前三数组
                        let totalPeople = 0 // 设置最开始人数为0,每有一个符合条件的加1,直到不符合条件
                        for (let j = 0 ; j < this.unitData[i].length; j++) { // 遍历每一个子数组里面的内容
                            if (j === 0) { // 第一个成绩
                                totalPeople = totalPeople + 1
                            } else {
                                if (this.unitData[i][j].updategrade === this.unitData[i][j-1].updategrade) {
                                    totalPeople = totalPeople + 1
                                }
                                if (this.unitData[i][j].updategrade !== this.unitData[i][j-1].updategrade && totalPeople < requireNumber) {
                                    totalPeople = totalPeople + 1
                                }
                                if (this.unitData[i][j].updategrade !== this.unitData[i][j-1].updategrade && totalPeople >= requireNumber) { // 不满足条件,返回
                                    console.log('不满足条件', this.unitData[i][j].name)
                                    this.unitData[i] = this.unitData[i].slice(0, totalPeople)
                                    break
                                }
                                // else {
                                //     console.log('不满足条件', this.unitData[i][j].name)
                                //     this.unitData[i] = this.unitData[i].slice(0, totalPeople)
                                //     break
                                // }
                            }

                        }
                    } else { //否则全部进面
                        // console.log(222)
                    }
                }
            },
            exportList() {
                this.dataToExcel = []
                for (let i = 0; i < this.unitData.length; i++) {
                    for (let j = 0; j < this.unitData[i].length; j++) {
                        this.dataToExcel.push(this.unitData[i][j])
                    }
                }
                const { export_json_to_excel } = require('@/vendor/Export2Excel')
                // 少一个准考证号，一个报考专业代码
                const tHeader = ['准考证号\n', '身份证号\n', '姓名\n', '考试类别\n'
                    , '地市代码\n', '报考部门代码\n', '职位代码\n', '职位招考比例\n', '职位招考人数\n'
                    , '电话\n', '职测缺考标记\n', '综合缺考标记\n', '职测分数\n', '综合分数\n', '总分\n', '优惠加分\n', '加分后分数\n']
                const filterVal = ['number',	'id',	'name',	'testCode',	'cityCode',	'unitCode',	'jobCode',	'ratio',	'need',	'call',
                    'qk1',	'qk2',	'grade1',	'grade2',	'totalgrade',	'update',	'updategrade', 'codeKey']
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
