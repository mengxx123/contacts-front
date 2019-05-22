
<template>
    <my-page :title="title" :page="page" backable>
        <div class="container">
            <ui-text-field class="input" v-model="myObject.name" label="姓名" />

            <!-- <br>
            <ui-text-field class="input" type="number" v-model.number="myObject.number" label="数量" /> -->

            <ui-select-field v-model="myObject.gender" label="性别">
                <ui-menu-item :value="item.value" :title="item.label" v-for="item in genders" :key="item.value" />
            </ui-select-field>

            <br>
            <ui-text-field class="input" v-model.number="myObject.phone" label="电话" />

            <br>
            <ui-text-field class="input" v-model.number="myObject.email" label="邮箱" />

            <br>
            <ui-text-field v-model="myObject.address" label="地址" multiLine :rows="3" :rowsMax="6"/>

            <br>
            <ui-text-field v-model="myObject.note" label="备注" multiLine :rows="3" :rowsMax="6"/>

            <!-- <ui-text-field class="input" v-model="myObject.note" label="备注" /> -->

            <!-- <div v-if="editType === 'update'">
                <br>
                <ui-text-field class="input" v-model="myObject.buyTime" label="购买时间" />
            </div> -->
        </div>
    </my-page>
</template>

<script>
    const moment = window.moment

    export default {
        data () {
            return {
                positions: [],
                editType: 'create',
                title: '',
                myObject: {
                    content: '',
                    note: '',
                    buyTime: '',
                    positionId: '',
                    gender: '0'
                },
                genders: [
                    {
                        label: '男',
                        value: '1'
                    },
                    {
                        label: '女',
                        value: '2'
                    },
                    {
                        label: '其他',
                        value: '3'
                    }
                ],
                minute: null,
                endTime: '',
                page: {
                    menu: [
                        {
                            type: 'icon',
                            icon: 'check',
                            click: this.finish,
                            title: '保存'
                        }
                    ]
                }
            }
        },
        mounted() {
            let id = this.$route.params.id
            if (id) {
                this.editType = 'update'
                this.title = '修改联系人'
                this.$http.get(`/life/contacts/${id}`).then(
                    response => {
                        let data = response.data
                        console.log(data)
                        this.myObject = data
                        this.myObject.gender = '' + data.gender
                        // this.myObject.buyTime = moment(this.myObject.buyTime).format('YYYY-MM-DD HH:mm:ss')
                    },
                    response => {
                        console.log(response)
                        this.loading = false
                    })
            } else {
                this.title = '添加联系人'
                // if (this.$route.query.positionId) {
                //     this.myObject.positionId = this.$route.query.positionId
                // }
            }

            document.addEventListener('keydown', this._onKeyDown = e => {
                console.log(e, e.keyCode)
                if (e.ctrlKey && e.keyCode === 83) {
                    this.finish()
                    return false
                }
            })
        },
        destroyed() {
            clearInterval(this.timer)
            document.removeEventListener('keydown', this._onKeyDown)
        },
        methods: {
            finish() {
                if (!this.myObject.name) {
                    this.$message({
                        type: 'danger',
                        text: '请输入姓名'
                    })
                    return
                }
                if (this.editType === 'update') {
                    this.$http.put(`/life/contacts/${this.myObject.id}`, {
                        ...this.myObject
                        // content: this.content
                    }).then(
                        response => {
                            let data = response.data
                            console.log(data)
                            this.$router.go(-1)
                        },
                        response => {
                            console.log(response)
                            this.loading = false
                        })
                } else {
                    this.$http.post(`/life/contacts`, {
                        ...this.myObject,
                        // objectId: this.$route.query.objectId,
                        // content: this.content
                    }).then(
                        response => {
                            let data = response.data
                            console.log(data)
                            this.$router.go(-1)
                        },
                        response => {
                            console.log(response)
                            this.loading = false
                        })
                }
            },
            endNow() {
                this.record.endTime = moment().format('YYYY-MM-DD HH:mm:ss')
                this.record.duration = (moment(this.record.endTime).toDate().getTime() - moment(this.record.startTime).toDate().getTime()) / 1000
            },
            quickSetting() {
                if (!this.minute && this.minute !== 0) {
                    this.$message({
                        type: 'danger',
                        text: '请输入分钟'
                    })
                    return
                }
                this.record.duration = this.minute * 60
                this.record.endTime = moment(this.record.startTime).add(this.record.duration, 's').format('YYYY-MM-DD HH:mm:ss')
            },
            quickSetting2() {
                if (!this.endTime) {
                    this.$message({
                        type: 'danger',
                        text: '请输入结束时间'
                    })
                    return
                }
                this.record.endTime = this.endTime
                this.record.duration = (moment(this.record.endTime).toDate().getTime() - moment(this.record.startTime).toDate().getTime()) / 1000
                // this.record.endTime = moment(this.record.startTime).add(this.record.duration, 's').format('YYYY-MM-DD HH:mm:ss')
            },
            stat() {
                this.$router.push(`/record/stat?content=${this.record.content}`)
            },
            prev() {
                this.$http.get(`/records/${this.record.id}/prev`).then(
                    response => {
                        let data = response.data
                        console.log('上一个', data)
                        if (!data) {
                            if (!this.endTime) {
                                this.$message({
                                    type: 'danger',
                                    text: '没有上一个记录'
                                })
                                return
                            }
                            return
                        }
                        // this.$router.go(-1)
                        this.record.startTime = moment(data.endTime).format('YYYY-MM-DD HH:mm:ss')
                        this.record.duration = (moment(this.record.endTime).toDate().getTime() - moment(this.record.startTime).toDate().getTime()) / 1000
                    },
                    response => {
                        console.log(response)
                        this.loading = false
                    })
            },
            next() {
                this.$http.get(`/records/${this.record.id}/next`).then(
                    response => {
                        let data = response.data
                        console.log('上一个', data)
                        if (!data) {
                            if (!this.endTime) {
                                this.$message({
                                    type: 'danger',
                                    text: '没有下一个记录'
                                })
                                return
                            }
                            return
                        }
                        // this.$router.go(-1)
                        this.record.endTime = moment(data.startTime).format('YYYY-MM-DD HH:mm:ss')
                        this.record.duration = (moment(this.record.endTime).toDate().getTime() - moment(this.record.startTime).toDate().getTime()) / 1000
                    },
                    response => {
                        console.log(response)
                        this.loading = false
                    })
            }
        }
    }
</script>

<style lang="scss" scoped>
.container {
    width: 400px;
    max-width: 100%;
    margin: 0 auto;
}
.record-list {
    .item {
        display: flex;
        justify-content: space-between;
        max-width: 400px;
        margin: 0 auto;
        padding: 16px 0;
        border-bottom: 1px solid rgba(0, 0, 0, .12);
    }
    .title {
        font-size: 16px;
        font-weight: bold;
    }
    .times {
        color: #666;
    }
}
.float-button {
    position: fixed;
    right: 24px;
    bottom: 24px;
}
</style>
