import React, { useState } from 'react';
import {
  Tabs,
} from 'antd';
import { observer } from 'mobx-react-lite';
import loginBg from '@/assets/images/login_bg.png';
import logo from '@/assets/images/logo.png';
import { LoginContent, TabsContent } from './style';
import LoginForm from './components/loginForm';

const { TabPane } = Tabs;

const tabList = [{
  key: 'pwd',
  name: '账户密码登录',
}, {
  key: 'sms',
  name: '手机验证码登录',
}];
const Login = () => {
  const [tabsKey, setTabskey] = useState('pwd');
  const onChange = (key) => {
    setTabskey(key);
  };
  return (
    <LoginContent>
      <div className="content-left" />
      <div className="content-right" />
      <div className="content-shadow" />
      <div className="content">
        <div className="content-item-left">
          <img className="login-bg" src={loginBg} alt="" />
        </div>
        <div className="content-item-right">
          <div className="login">
            <img className="logo" src={logo} alt="" />
            <TabsContent tabBarStyle={{ border: 'none' }} centered defaultActiveKey="pwd" onChange={onChange}>
              {
                tabList.map((f) => (
                  <TabPane tab={f.name} key={f.key}>
                    <LoginForm type={tabsKey} />
                  </TabPane>
                ))
              }
            </TabsContent>
          </div>
        </div>
      </div>
    </LoginContent>
  );
};

export default observer(Login);
