import React, { lazy } from 'react';
import { Outlet } from 'react-router-dom';
import * as Icon from '@ant-design/icons';
import { ProtectedRoute } from '@components';

const PageAnalysis = lazy(() => import('./pageAnalysis'));
export default {
  path: 'statistics',
  element: <Outlet />,
  options: {
    title: '统计分析',
    key: 'menu-statistics',
    permissionKey: 'menu-statistics',
    icon: <Icon.PieChartOutlined />,
    link: '/statistics',
  },
  children: [
    {
      path: 'pageAnalysis',
      element: (
        <ProtectedRoute permissionKey="menu-statistics_website" title="页面分析" component={<PageAnalysis />} />
      ),
      options: {
        title: '页面分析',
        key: 'menu-statistics_website',
        permissionKey: 'menu-statistics_website',
        icon: null,
        link: '/statistics/pageAnalysis',
      },
    },
  ],
};
