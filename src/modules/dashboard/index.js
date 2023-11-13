import React from 'react';
import { Image } from 'antd';
import { DashboardOutlined } from '@ant-design/icons';
import { ProtectedRoute } from '@components';

const Dashboard = () => (
  <div style={{ margin: '100px auto 0', width: 300 }}>
    <Image preview={false} src={process.env.REACT_APP_BRAND_URL} width={300} />
  </div>
);

export default {
  index: true,
  element: <ProtectedRoute allowAccess title="控制台" component={<Dashboard />} />,
  options: {
    title: '控制台',
    key: 'dashboard',
    icon: <DashboardOutlined />,
    link: '/',
    allowAccess: true,
  },
};
