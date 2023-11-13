import React, { lazy } from 'react';
import { Outlet } from 'react-router-dom';
import * as Icon from '@ant-design/icons';
import { ProtectedRoute } from '@components';

const Account = lazy(() => import('./account'));
const Jurisdiction = lazy(() => import('./jurisdiction'));
const Edit = lazy(() => import('./jurisdiction/edit'));

export default {
  path: 'setting',
  element: <Outlet />,
  options: {
    title: '设置',
    key: 'menu-setting',
    permissionKey: 'menu-setting',
    icon: <Icon.SettingOutlined />,
    link: '/setting',
  },
  children: [
    {
      path: 'account',
      element: (
        <ProtectedRoute
          permissionKey="menu-setting_user"
          title="账号管理"
          component={<Account />}
        />
      ),
      options: {
        title: '账号管理',
        key: 'menu-setting_user',
        permissionKey: 'menu-setting_user',
        icon: null,
        link: '/setting/account',
      },
    },
    {
      path: 'jurisdiction',
      element: (
        <ProtectedRoute
          permissionKey="menu-setting_permission"
          title="权限管理"
          component={<Jurisdiction />}
        />
      ),
      options: {
        title: '权限管理',
        key: 'menu-setting_permission',
        permissionKey: 'menu-setting_permission',
        icon: null,
        link: '/setting/jurisdiction',
      },
    },
    {
      path: '/setting/jurisdiction/:id/edit',
      element: (
        <ProtectedRoute
          title="编辑"
          permissionKey="menu-employer"
          component={<Edit />}
        />
      ),
    },
    {
      path: '/setting/jurisdiction/add',
      element: (
        <ProtectedRoute
          title="新增"
          permissionKey="menu-employer"
          component={<Edit />}
        />
      ),
    },
  ],
};
