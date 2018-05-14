<template>
    <my-page title="通讯录" :page="page">
        <ul class="contracts-list" v-if="contacts.length">
            <li :class="['item', selectedClass(item)]" v-for="item in contacts">
                <div class="left">
                    <ui-checkbox class="checkbox" v-model="selected" name="group" :nativeValue="item.id" label="" />
                    <ui-icon class="icon" value="account_circle" :size="36" />
                </div>
                <span class="name">{{ item.name }}</span>
            </li>
        </ul>
        <div class="empty" v-if="!contacts.length">
            <img class="img" src="/static/img/empty.png">
            <div class="text">你目前还没有联系人！</div>
            <a href="#" @click.prevent="toggleNew">添加联系人</a>
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
                    {
                        id: '1',
                        name: '陈建杭',
                        email: '1418503601@qq.com',
                        phone: '15602221234'
                    },
                    {
                        id: '2',
                        name: '陈建杭',
                        email: '1418503601@qq.com',
                        phone: '15602221234'
                    }
                ],
                newVisible: false,
                page: {
                    menu: [
                        {
                            type: 'icon',
                            icon: 'apps',
                            href: 'https://tool.yunser.com/',
                            target: '_blank',
                            title: '云设应用'
                        }
                    ]
                }
            }
        },
        mounted() {
            this.contacts = this.$storage.get('data', [])
        },
        methods: {
            selectedClass(item) {
                if (this.selected.includes(item.id)) {
                    return 'selected'
                }
                return ''
            },
            toggleNew() {
                this.newVisible = !this.newVisible
                this.contact = {
                    id: new Date().getTime(),
                    name: '',
                    email: '',
                    phone: ''
                }
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
            }
        }
    }
</script>

<style lang="scss" scoped>
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
        &:hover {
            background-color: #f1f1f1;
            .checkbox {
                display: block;
            }
            .icon {
                display: none;
            }
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
