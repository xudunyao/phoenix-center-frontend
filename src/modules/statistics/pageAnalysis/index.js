import React, { useState } from 'react';
import { Tabs } from 'antd';
import { globalStyles } from '@styles';
import TabContent from './tabContent';

const { Content } = globalStyles;
const { TabPane } = Tabs;

const Review = () => (
  <Content>
    <Tabs defaultActiveKey="1" destroyInactiveTabPane>
      <TabPane tab="小程序" key="applet">
        <TabContent type="MINI_PROGRAM" />
      </TabPane>
      <TabPane tab="H5" key="h5">
        <TabContent type="H5" />
      </TabPane>
    </Tabs>
  </Content>
);

export default Review;
