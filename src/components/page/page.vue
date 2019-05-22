<template>
    <ui-page :title="title || page.title" :page="page" :backable="backable" ref="page">
        <div slot="drawer">
            <div class="header">
                <img class="logo" src="/static/img/contacts.svg">
            </div>
            <!-- <ui-appbar title=""></ui-appbar> -->
            <ui-list @itemClick="toggle()">
                <ui-list-item title="联系人" to="/">
                    <ui-icon slot="left" value="contacts"/>
                </ui-list-item>
                <ui-list-item title="vcf 工具" to="/vcf">
                    <ui-icon slot="left" value="grade"/>
                </ui-list-item>
                <!-- <ui-list-item title="设置" to="/about">
                    <ui-icon slot="left" value="settings"/>
                </ui-list-item>
                <ui-list-item title="意见反馈" to="/about">
                    <ui-icon slot="left" value="feedback"/>
                </ui-list-item> -->
                <ui-list-item title="帮助" href="https://project.yunser.com/products/31126fe05c4911e888a50737631f72f2" target="_blank">
                    <ui-icon slot="left" value="help"/>
                </ui-list-item>
            </ui-list>
        </div>
        <slot></slot>
    </ui-page>
</template>

<script>
    export default {
        data() {
            return {
                open: false,
                docked: true
            }
        },
        props: {
            title: {
                type: String,
                default: ''
            },
            name: {
                type: String,
                default: 'default'
            },
            page: {
                type: Object,
                default: function () {
                    return {
                        title: '云设'
                    }
                }
            },
            backable: {
                type: Boolean,
                default: false
            }
        },
        methods: {
            toggle() {
                console.log(this.$refs.page)
            }
        }
    }
</script>

<style lang="scss" scoped>
.header {
    padding: 40px 0;
    border-bottom: 1px solid rgba(0, 0, 0, 0.12);
}
.logo {
    display: block;
    width: 80px;
    margin: 0 auto;
}
.ui-position-bottom {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
}
</style>
