import Vue from 'vue'
import Router from 'vue-router'

const Home = resolve => require(['@/views/Home'], resolve)
const ContactsDetail = resolve => require(['@/views/ContactsDetail'], resolve)
const ContactsEdit = resolve => require(['@/views/ContactsEdit'], resolve)
const Vcf = resolve => require(['@/views/Vcf'], resolve)
const Error404 = resolve => require(['@/views/error/Error404'], resolve)
const OauthCallback = resolve => require(['@/views/oauth/Callback'], resolve)

Vue.use(Router)

let routes = [
    {
        path: '/',
        component: Home
    },
    {
        path: '/contacts/:id',
        component: ContactsDetail
    },
    {
        path: '/contacts/:id/edit',
        component: ContactsEdit
    },
    {
        path: '/contact/add',
        component: ContactsEdit
    },
    {
        path: '/vcf',
        component: Vcf
    },
    {
        path: '/oauth/callback',
        component: OauthCallback
    },
    {
        path: '*',
        component: Error404
    }
]

let router = new Router({
    mode: 'history',
    routes: routes,
    scrollBehavior (to, from, savedPosition) {
        return {
            x: 0,
            y: 0
        }
    }
})

export default router
