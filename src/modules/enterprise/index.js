import React, { lazy } from 'react';
import { Outlet } from 'react-router-dom';
import * as Icon from '@ant-design/icons';
import { ProtectedRoute } from '@components';

const Employer = lazy(() => import('./employer'));
const LabourServices = lazy(() => import('./labourServices'));
const Details = lazy(() => import('./employer/details'));
const Edit = lazy(() => import('./labourServices/edit'));
const ServiceDetails = lazy(() => import('./labourServices/details'));
export default {
  path: 'enterprise',
  element: <Outlet />,
  options: {
    title: '企业管理',
    key: 'menu-company',
    permissionKey: 'menu-company',
    icon: <Icon.DeploymentUnitOutlined />,
    link: '/enterprise',
  },
  children: [
    {
      path: 'employer',
      element: (
        <ProtectedRoute
          permissionKey="menu-company_coreCompany"
          title="用工单位"
          component={<Employer />}
        />
      ),
      options: {
        title: '用工单位',
        key: 'menu-company_coreCompany',
        permissionKey: 'menu-company_coreCompany',
        icon: null,
        link: '/enterprise/employer',
      },
    },
    {
      path: '/enterprise/employer/:id',
      element: (
        <ProtectedRoute
          title="详情"
          permissionKey="menu-employer"
          component={<Details />}
        />
      ),
    },
    {
      path: 'labour-services',
      element: (
        <ProtectedRoute
          permissionKey="menu-company_labor"
          title="劳务公司"
          component={<LabourServices />}
        />
      ),
      options: {
        title: '劳务公司',
        key: 'menu-company_labor',
        permissionKey: 'menu-company_labor',
        icon: null,
        link: '/enterprise/labour-services',
      },
    },
    {
      path: '/enterprise/labour-services/:id',
      element: (
        <ProtectedRoute
          title="详情"
          key="menu-employer"
          component={<ServiceDetails />}
        />
      ),
    },
    {
      path: '/enterprise/labour-services/add',
      element: (
        <ProtectedRoute
          title="增加"
          key="menu-employer"
          component={<Edit />}
        />
      ),
    },
    {
      path: '/enterprise/labour-services/:id/edit',
      element: (
        <ProtectedRoute
          title="编辑"
          permissionKey="menu-employer"
          component={<Edit />}
        />
      ),
    },
  ],
};
