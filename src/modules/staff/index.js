import React, { lazy } from 'react';
import { Outlet } from 'react-router-dom';
import * as Icon from '@ant-design/icons';
import { ProtectedRoute } from '@components';

const Job = lazy(() => import('./onTheJob'));

export default {
  path: 'staff',
  element: <Outlet />,
  options: {
    title: '员工管理',
    key: 'menu-staff',
    permissionKey: 'menu-staff',
    icon: <Icon.ContactsOutlined />,
    link: '/staff',
  },
  children: [
    {
      path: 'job',
      element: (
        <ProtectedRoute permissionKey="menu-staff_list" title="在离职" component={<Job />} />
      ),
      options: {
        title: '在离职',
        key: 'menu-staff_list',
        permissionKey: 'menu-staff_list',
        icon: null,
        link: '/staff/job',
      },
    },
  ],
};
