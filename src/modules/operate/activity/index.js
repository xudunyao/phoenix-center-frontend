import React, { useState, lazy } from 'react';
import { Tabs } from 'antd';
import { globalStyles } from '@styles';

const { Content } = globalStyles;
const { TabPane } = Tabs;
const User = lazy(() => import('./user'));
const Gift = lazy(() => import('./gift'));
const Activity = lazy(() => import('./activity'));
const Approval = lazy(() => import('./approval'));
const Review = () => (
  <Content>
    <Tabs defaultActiveKey="1" destroyInactiveTabPane>
      <TabPane tab="用户统计" key="1">
        <User />
      </TabPane>
      <TabPane tab="礼包数据" key="2">
        <Gift />
      </TabPane>
      <TabPane tab="活动岗位" key="3">
        <Activity />
      </TabPane>
      <TabPane tab="活动审批" key="4">
        <Approval />
      </TabPane>
    </Tabs>
  </Content>
);

export default Review;
