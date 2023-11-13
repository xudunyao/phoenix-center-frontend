import React, { lazy } from 'react';
import { Outlet } from 'react-router-dom';
import * as Icon from '@ant-design/icons';
import { ProtectedRoute } from '@components';

const Message = lazy(() => import('./message'));
const FlowPool = lazy(() => import('./flowPool'));
const Inquire = lazy(() => import('./inquire'));
export default {
  path: 'member',
  element: <Outlet />,
  options: {
    title: '会员管理',
    key: 'menu-member',
    permissionKey: 'menu-member',
    icon: <Icon.TeamOutlined />,
    link: '/member',
  },
  children: [
    {
      path: 'message',
      element: (
        <ProtectedRoute permissionKey="menu-member_info" title="会员信息" component={<Message />} />
      ),
      options: {
        title: '会员信息',
        key: 'menu-member_info',
        permissionKey: 'menu-member_info',
        icon: null,
        link: '/member/message',
      },
    },
    {
      path: 'inquire',
      element: (
        <ProtectedRoute
          permissionKey="menu-member_hr"
          title="人资查询"
          component={<Inquire />}
        />
      ),
      options: {
        title: '人资查询',
        key: 'menu-member_hr',
        permissionKey: 'menu-member_hr',
        icon: null,
        link: '/member/inquire',
        allowAccess: true,
      },
    },
    {
      path: 'flow-pool',
      element: (
        <ProtectedRoute
          permissionKey="menu-member_flowPool"
          title="流量池"
          component={<FlowPool />}
        />
      ),
      options: {
        title: '流量池',
        key: 'menu-member_flowPool',
        permissionKey: 'menu-member_flowPool',
        icon: null,
        link: '/member/flow-pool',
      },
    },
  ],
};
