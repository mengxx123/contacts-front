<template>
    <my-page title="通讯录" :page="page">
        <a href="javascript:;" v-if="!$store.state.user" @click="login">点击登陆</a>
        <div class="container" v-else>
            <ul class="group-list" v-if="contacts.length">
                <li class="group-item" v-for="group in groups">
                    <div class="group-header">
                        <div>
                        {{ group.letter }}
                        </div>
                        <!-- <div>
                            <span class="group-in" v-if="group.in">收入：{{ group.in }}</span>
                            <span class="group-in" v-if="group.out">支出：{{ group.out }}</span>
                        </div> -->
                    </div>
                    <ul class="contracts-list">
                        <li :class="['item', selectedClass(item)]" v-for="item in group.list" @click="viewItem(item)">
                            <div class="left">
                                <ui-checkbox class="checkbox" v-model="selected" name="group" :nativeValue="item.id" label="" />
                                <ui-icon class="icon" value="account_circle" :size="36" />
                            </div>
                            <span class="name">{{ item.name }}</span>
                        </li>
                    </ul>
                </li>
            </ul>
            <div class="empty" v-if="!contacts.length">
                <img class="img" src="/static/img/empty.png">
                <div class="text">你目前还没有联系人！</div>
                <a href="#" @click.prevent="toggleNew">添加联系人</a>
            </div>
        </div>
        <ui-float-button class="btn-add" icon="add" secondary @click="toggleNew" />

        <ui-drawer class="new-box" right :open="newVisible" :docked="false" @close="toggleNew()">
            <ui-appbar title="创建联系人">
                <ui-icon-button icon="close" slot="left" @click="toggleNew" />
                <ui-icon-button icon="check" slot="right" @click="save" />
            </ui-appbar>
            <div class="body">
                <ui-text-field v-model="contact.name" hintText="姓名" />
                <br>
                <ui-text-field v-model="contact.email" hintText="电子邮件" />
                <br>
                <ui-text-field v-model="contact.phone" hintText="电话" />
            </div>
        </ui-drawer>
        <ui-appbar class="multi-select" title="" v-if="selected.length">
            <ui-icon-button icon="close" slot="left" @click="selected = []" />
            <div slot="left" class="total">
                <!-- 返回 -->
                <!-- <ui-checkbox class="checkbox" v-model="selected" name="group" label="" /> -->
                已选择 {{ selected.length }} 位联系人
            </div>
            <!-- <ui-icon-button icon="more_vert" slot="right" tooltip="云设应用" /> -->
            <!-- <ui-icon-button icon="label" slot="right" tooltip="管理标签" /> -->
            <ui-icon-menu icon="more_vert" slot="right" tooltip="更多操作">
                <!-- <ui-menu-item title="导出" leftIcon="cloud_download" /> -->
                <ui-menu-item title="删除" leftIcon="delete" @click="remove" />
            </ui-icon-menu>
            <div slot="right" style="width:16px"></div>
        </ui-appbar>
    </my-page>
</template>

<script>
    /* eslint-disbale */
    import oss from '@/util/oss'
    const pydic = window.pydic
    let arr = pydic.split(',')
    let pinyinMap = {}
    for (let item of arr) {
        pinyinMap[item[0]] = item.substring(1)
    }
    // console.log(pinyinMap)

    export default {
        data () {
            return {
                selected: [],
                contact: {
                    id: new Date().getTime(),
                    name: '',
                    email: '',
                    phone: ''
                },
                contacts: [
                ],
                groups: [],
                newVisible: false,
                page: {
                    menu: [
                        // {
                        //     type: 'icon',
                        //     icon: 'apps',
                        //     href: 'https://tool.yunser.com?utm_source=contacts',
                        //     target: '_blank',
                        //     title: '云设应用'
                        // },
                        {
                            type: 'icon',
                            icon: 'apps',
                            href: 'https://tool.yunser.com?utm_source=contacts',
                            target: '_blank',
                            title: '云设应用'
                        }
                    ]
                }
            }
        },
        mounted() {
            // this.contacts = this.$storage.get('data', [])
            this.loadData()
        },
        methods: {
            loadData() {
                let user = this.$store.state.user
                if (!user) {
                    return
                }
                let { keyword } = this.$route.query
                // this.userId = this.$route.params.id
                this.keyword = keyword
                // let { date } = this.$route.query
                this.$http.get(`/life/contacts?keyword=${keyword ? encodeURIComponent(keyword) : ''}&page_size=9999`).then(
                    response => {
                        let data = response.data
                        console.log(data)
                        this.contacts = data
                        this.groups = this.group(this.contacts)
                    },
                    response => {
                        console.log('cuol')
                        if (response.code === 403) {
                            this.$store.state.user = null
                        }
                        this.loading = false
                    })
            },
            group(arr) {
                let groups = []
                for (let item of arr) {
                    let firstChar = item.name.charAt(0)
                    let letter = pinyinMap[firstChar] ? pinyinMap[firstChar].charAt(0) : '#'
                    letter = letter.toUpperCase()
                    // console.log('letter', letter)
                    let group = groups.find(item => item.letter === letter)
                    if (group) {
                        group.list.push({
                            ...item,
                        })
                    } else {
                        groups.push({
                            letter,
                            list: [
                                item
                            ]
                        })
                    }
                }
                groups = groups.sort((a, b) => {
                    return a.letter.localeCompare(b.letter)
                })
                for (let i = 0; i < groups.length; i++) {
                    groups[i].list = groups[i].list.sort((a, b) => {
                        return a.name.localeCompare(b.name)
                    })
                }
                return groups
            },
            selectedClass(item) {
                if (this.selected.includes(item.id)) {
                    return 'selected'
                }
                return ''
            },
            toggleNew() {
                // this.newVisible = !this.newVisible
                // this.contact = {
                //     id: new Date().getTime(),
                //     name: '',
                //     email: '',
                //     phone: ''
                // }
                this.$router.push('/contact/add')
            },
            save() {
                this.newVisible = false
                this.contact.id = new Date().getTime()
                this.contacts.push(this.contact)
                this.$storage.set('data', this.contacts)
            },
            remove() {
                this.contacts = this.contacts.filter(item => !this.selected.includes(item.id))
                this.$storage.set('data', this.contacts)
                this.selected = []
            },
            login() {
                location.href = oss.getOauthUrl()
            },
            viewItem(item) {
                this.$router.push(`/contacts/${item.id}`)
            }
        }
    }
</script>

<style lang="scss" scoped>
.group-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 24px;
    background-color: #f1f1f1;
    .group-in {
        margin-left: 8px;
    }
}
.container {
    width: 400px;
    max-width: 100%;
    margin: 0 auto;
}
.multi-select {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100000;
    .total {
        text-align: center;
    }
}
.contracts-list {
    .item {
        display: flex;
        align-items: center;
        height: 48px;
        padding: 0 16px;
        cursor: pointer;
        &:hover {
            background-color: #f1f1f1;
            // .checkbox {
            //     display: block;
            // }
            // .icon {
            //     display: none;
            // }
        }
        &.selected {
            background-color: #eee;
            .icon {
                display: none !important;
            }
            .checkbox {
                display: block !important;
            }
        }
    }
    .left {
        width: 56px;
    }
    .checkbox {
        display: none;
        margin-left: 4px;
    }
    .icon {
        margin-top: 4px;
    }
}
.empty {
    text-align: center;
    .img {
        display: inline-block;
        margin-bottom: 16px;
    }
    .text {
        margin-bottom: 16px;
    }
}
.btn-add {
    position: fixed;
    right: 24px;
    bottom: 24px;
}
.new-box {
    width: 100%;
    max-width: 400px;
    .body {
        padding: 16px;
    }
}
</style>
