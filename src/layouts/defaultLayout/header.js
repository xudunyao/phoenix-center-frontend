import React from 'react';
import { observer } from 'mobx-react-lite';
import Cookies from 'js-cookie';

import authStore from '@stores/auth';
import { httpRequest } from '@utils';
import { message } from 'antd';
import { Header as MyHeader } from '@/components';
import { storageKeys } from '@/constants';
import { StyledHeader } from './styles';
import BreadCrumb from './breadcrumb';

const Header = () => {
  const handleLogout = async () => {
    try {
      const res = await httpRequest.post('/sso/user/logout');
      if (res.code === 0) {
        authStore.clearlogInfo();
        Cookies.remove(storageKeys.token);
        Cookies.remove(storageKeys.username);
        localStorage.removeItem(storageKeys.isAdmin);
        localStorage.removeItem(storageKeys.mobile);
      } else {
        message.error(res.msg);
      }
    } catch (err) {
      message.error(err?.msg || '退出失败');
    } finally {
      message.success('退出成功');
    }
  };
  return (
    <StyledHeader>
      <BreadCrumb />
      <MyHeader username={authStore.profile?.username} onLogout={handleLogout} />
    </StyledHeader>
  );
};

export default observer(Header);
