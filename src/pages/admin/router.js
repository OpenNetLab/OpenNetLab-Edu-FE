import Vue from 'vue'
import VueRouter from 'vue-router'
// 引入 view 组件
import { Announcement, Conf, Contest, ContestList, Home, JudgeServer, Login,
  Problem, ProblemList, User, PruneTestCase, Dashboard, ProblemImportOrExport } from './views'
Vue.use(VueRouter)

export default new VueRouter({
  mode: 'history',
  base: '/admin/',
  scrollBehavior: () => ({y: 0}),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/',
      component: Home,
      children: [
        {
          path: '',
          name: 'dashboard',
          component: Dashboard
        },
        {
          path: '/announcement',
          name: 'announcement',
          component: Announcement
        },
        {
          path: '/user',
          name: 'user',
          component: User
        },
        {
          path: '/conf',
          name: 'conf',
          component: Conf
        },
        {
          path: '/judge-server',
          name: 'judge-server',
          component: JudgeServer
        },
        {
          path: '/prune-test-case',
          name: 'prune-test-case',
          component: PruneTestCase
        },
        {
          path: '/topics',
          name: 'problem-list',
          component: ProblemList
        },
        {
          path: '/topic/create',
          name: 'create-problem',
          component: Problem
        },
        {
          path: '/topic/edit/:problemId',
          name: 'edit-problem',
          component: Problem
        },
        {
          path: '/topic/batch_ops',
          name: 'problem_batch_ops',
          component: ProblemImportOrExport
        },
        {
          path: '/lab/create',
          name: 'create-contest',
          component: Contest
        },
        {
          path: '/lab',
          name: 'contest-list',
          component: ContestList
        },
        {
          path: '/lab/:contestId/edit',
          name: 'edit-contest',
          component: Contest
        },
        {
          path: '/lab/:contestId/announcement',
          name: 'contest-announcement',
          component: Announcement
        },
        {
          path: '/lab/:contestId/topics',
          name: 'contest-problem-list',
          component: ProblemList
        },
        {
          path: '/lab/:contestId/topic/create',
          name: 'create-contest-problem',
          component: Problem
        },
        {
          path: '/lab/:contestId/topic/:problemId/edit',
          name: 'edit-contest-problem',
          component: Problem
        }
      ]
    },
    {
      path: '*', redirect: '/login'
    }
  ]
})
