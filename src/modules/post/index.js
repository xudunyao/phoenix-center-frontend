import React, { lazy } from 'react';
import { Outlet } from 'react-router-dom';
import * as Icon from '@ant-design/icons';
import { ProtectedRoute } from '@components';

const List = lazy(() => import('./list'));

export default {
  path: 'post',
  element: <Outlet />,
  options: {
    title: '岗位管理',
    permissionKey: 'menu-position',
    key: 'post',
    icon: <Icon.FlagOutlined />,
    link: '/post',
  },
  children: [
    {
      path: 'list',
      element: (
        <ProtectedRoute permissionKey="menu-position_list" title="岗位列表" component={<List />} />
      ),
      options: {
        title: '岗位列表',
        key: 'menu-position_list',
        permissionKey: 'menu-position_list',
        icon: null,
        link: '/post/list',
      },
    },
  ],
};
