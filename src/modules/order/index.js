import React, { lazy } from 'react';
import { Outlet } from 'react-router-dom';
import * as Icon from '@ant-design/icons';
import { ProtectedRoute } from '@components';

const All = lazy(() => import('./all'));
const SignUp = lazy(() => import('./signUp'));
const Interview = lazy(() => import('./interview'));
const Employed = lazy(() => import('./employed'));
const ToEmployed = lazy(() => import('./toEmployed'));

export default {
  path: 'order',
  element: <Outlet />,
  options: {
    title: '订单管理',
    key: 'menu-order',
    permissionKey: 'menu-order',
    icon: <Icon.FileTextOutlined />,
    link: '/order',
  },
  children: [
    {
      path: 'all',
      element: (
        <ProtectedRoute permissionKey="menu-order_latest" title="最新状态" component={<All />} />
      ),
      options: {
        title: '最新状态',
        key: 'menu-order_latest',
        permissionKey: 'menu-order_latest',
        icon: null,
        link: '/order/all',
      },
    },
    {
      path: 'sign-up',
      element: (
        <ProtectedRoute permissionKey="menu-order_signUp" title="已报名" component={<SignUp />} />
      ),
      options: {
        title: '已报名',
        key: 'order-signUp',
        permissionKey: 'menu-order_signUp',
        icon: null,
        link: '/order/sign-up',
      },
    },
    {
      path: 'interview',
      element: (
        <ProtectedRoute
          permissionKey="menu-order_interview"
          title="面试订单"
          component={<Interview />}
        />
      ),
      options: {
        title: '面试订单',
        key: 'menu-order_interview',
        permissionKey: 'menu-order_interview',
        icon: null,
        link: '/order/interview',
      },
    },
    {
      path: 'on-boarding',
      element: (
        <ProtectedRoute
          permissionKey="menu-order_employment"
          title="待入职订单"
          component={<ToEmployed />}
        />
      ),
      options: {
        title: '待入职订单',
        key: 'menu-order_employment',
        permissionKey: 'menu-order_employment',
        icon: null,
        link: '/order/on-boarding',
      },
    },
    {
      path: 'employed',
      element: (
        <ProtectedRoute
          permissionKey="menu-order_joined"
          title="已入职订单"
          component={<Employed />}
        />
      ),
      options: {
        title: '已入职订单',
        key: 'menu-order_joined',
        permissionKey: 'menu-order_joined',
        icon: null,
        link: '/order/employed',
      },
    },
  ],
};
