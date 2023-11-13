import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Button, message, Space, Tabs,
} from 'antd';
import { globalStyles } from '@styles';
import Record from './components/record';
import Verify from './components/verify';

const { Content } = globalStyles;
const { TabPane } = Tabs;

const Review = () => {
  const onChange = (key) => {
    console.log(key);
  };
  return (
    <Content>
      <Button
        type="link"
        style={{ marginTop: '20px', border: '1px solid' }}
        href="/finance/transfer/add"
        shape="round"
      >
        转账
      </Button>
      <Tabs defaultActiveKey="1" onChange={onChange} destroyInactiveTabPane>
        <TabPane tab="转账记录" key="1">
          <Record />
        </TabPane>
        <TabPane tab="转账审核" key="2">
          <Verify />
        </TabPane>
      </Tabs>
    </Content>
  );
};

export default Review;
