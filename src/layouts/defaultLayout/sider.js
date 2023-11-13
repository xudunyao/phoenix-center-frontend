import React, { useState } from 'react';
import { MenuOutlined } from '@ant-design/icons';
import { useLocation, useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import { SideMenu } from '@/components';
import authStore from '@/stores/auth';
import appRoutes from '@/routes/appRoutes';
import { StyledLayout as Layout, Logo, MenuCollapsedButton } from './styles';
import { getMenusFromRoutes } from './utils';

const MENU_COLLAPSED_KEY = 'menu-collapsed';

const Sider = () => {
  const location = useLocation();
  const params = useParams();
  const [collapsed, setCollapsed] = useState(localStorage.getItem(MENU_COLLAPSED_KEY) === 'true');

  let staticPath = location.pathname;
  if (params) {
    Object.keys(params).forEach((key) => {
      staticPath = staticPath.replace(params[key], `:${key}`);
    });
  }
  const { menus, currentMenuKeys } = getMenusFromRoutes(
    appRoutes || [],
    authStore.permissions,
    authStore.isAdmin,
    staticPath,
  );
  const toggleCollapsed = () => {
    localStorage.setItem(MENU_COLLAPSED_KEY, !collapsed);
    setCollapsed(!collapsed);
  };

  const logoUrl = collapsed ? process.env.REACT_APP_LOGO_URL : process.env.REACT_APP_BRAND_URL;

  return (
    <Layout.Sider collapsed={collapsed} theme="light">
      <Logo to="/">
        <img src={logoUrl} alt={process.env.REACT_APP_WEBSITE_TITLE} />
        <h1>{process.env.REACT_APP_WEBSITE_TITLE}</h1>
      </Logo>
      <div className="menu">
        <SideMenu
          menus={menus}
          selectedKeys={currentMenuKeys}
          defaultOpenKeys={currentMenuKeys}
        />
      </div>
      <MenuCollapsedButton type="text" onClick={toggleCollapsed} style={{ marginBottom: 16 }}>
        <MenuOutlined />
      </MenuCollapsedButton>
    </Layout.Sider>
  );
};

export default observer(Sider);
