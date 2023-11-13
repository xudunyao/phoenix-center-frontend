import React from 'react';
import { useLocation, NavLink, useParams } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import authStore from '@stores/auth';
import documentStore from '@stores/document';
import appRoutes from '@/routes/appRoutes';
import { getMenusFromRoutes } from './utils';

import { StyledBreadcrumb as Breadcrumb } from './styles';

const BreadCrumb = () => {
  const location = useLocation();
  const routeParams = useParams();

  let staticPath = location.pathname;
  if (routeParams) {
    Object.keys(routeParams).forEach((key) => {
      staticPath = staticPath.replace(routeParams[key], `:${key}`);
    });
  }

  const { menus, currentMenuKeys } = getMenusFromRoutes(appRoutes || [], authStore.permissions, authStore.isAdmin, staticPath);

  const currentMenu = menus.find(({ key }) => key === currentMenuKeys[0]);

  const itemRender = (route, params, routes, paths) => {
    const last = routes.indexOf(route) === routes.length - 1;
    return last ? (
      <span>{route.breadcrumbName}</span>
    ) : (
      <NavLink to={paths.join('/')}>{route.breadcrumbName}</NavLink>
    );
  };

  const getRoutes = (menuList = [], depth = 0) => {
    const routes = [];
    menuList.forEach((menu) => {
      if (menu?.visible !== false) {
        routes.push({
          path: menu?.link?.split('/')[depth + 1],
          breadcrumbName: menu?.title,
          children: menu?.children?.length ? getRoutes(menu.children, depth + 1) : [],
        });
      }
    });
    return routes;
  };

  const routes = getRoutes([currentMenu]) || [];

  if (staticPath !== '/not-authorized' && documentStore.pageTitle && location.pathname !== currentMenu?.link) {
    routes.push({
      path: location.pathname,
      breadcrumbName: documentStore.pageTitle,
    });
  }

  return <Breadcrumb itemRender={itemRender} routes={routes} />;
};

export default observer(BreadCrumb);
