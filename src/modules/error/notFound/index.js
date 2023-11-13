import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Empty, Button,
} from 'antd';

const NotFound = () => (
  <Empty description="Ops, 页面跑丢了" style={{ marginTop: 100 }}>
    <NavLink to="/"><Button type="primary">回到首页</Button></NavLink>
  </Empty>
);

export default NotFound;
