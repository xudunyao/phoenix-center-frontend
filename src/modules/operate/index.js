import React, { lazy } from 'react';
import { Outlet } from 'react-router-dom';
import * as Icon from '@ant-design/icons';
import { ProtectedRoute } from '@components';
import Advertisement from './activity/advertisement';

const InviteNew = lazy(() => import('./activity'));
const Extension = lazy(() => import('./extension/record'));
const Details = lazy(() => import('./activity/approval/details'));
const Add = lazy(() => import('./activity/approval/add'));

export default {
  path: 'operate',
  element: <Outlet />,
  options: {
    title: '运营管理',
    key: 'menu-operation',
    permissionKey: 'menu-operation',
    icon: <Icon.SettingOutlined />,
    link: '/operate',
  },
  children: [
    {
      path: 'extension',
      element: <Outlet />,
      options: {
        title: '推广管理',
        key: 'menu-operation_promotion',
        permissionKey: 'menu-operation_promotion',
        icon: null,
        link: '/operate/extension',
      },
      children: [
        {
          index: true,
          path: 'channel',
          element: (
            <ProtectedRoute
              permissionKey="menu-operation_promotion_channel"
              title="渠道配置"
              component={<Extension />}
            />
          ),
          options: {
            title: '渠道配置',
            key: 'menu-operation_promotion_channel',
            permissionKey: 'menu-operation_promotion_channel',
            icon: null,
            link: '/operate/extension/channel',
          },
        },
      ],
    },
    {
      path: 'activity',
      element: <Outlet />,
      options: {
        title: '活动管理',
        key: 'menu-operation_activity',
        permissionKey: 'menu-operation_activity',
        icon: null,
        link: '/operate/activity',
      },
      children: [
        {
          path: 'advertisement',
          element: <Outlet />,
          options: {
            title: '广告管理',
            key: 'menu-operation_ad',
            permissionKey: 'menu-operation_ad',
            icon: null,
            link: '/operate/activity/advertisement',
          },
          children: Advertisement,
        },
        {
          path: 'inviteNew',
          element: (
            <ProtectedRoute
              permissionKey="menu-menu-operation_inviteManager"
              title="邀新管理"
              component={<InviteNew />}
            />
          ),
          options: {
            title: '邀新管理',
            key: 'menu-operation_inviteManager ',
            permissionKey: 'menu-operation_inviteManager',
            icon: null,
            link: '/operate/activity/inviteNew',
          },
        },
        {
          path: '/operate/activity/inviteNew/:id',
          element: <ProtectedRoute title="详情" key="menu-employer" component={<Details />} />,
        },
        {
          path: '/operate/activity/inviteNew/add',
          element: <ProtectedRoute title="增加" key="menu-employer" component={<Add />} />,
        },
      ],
    },
  ],
};
