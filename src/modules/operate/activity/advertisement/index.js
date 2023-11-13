import React, { lazy } from 'react';
import { ProtectedRoute } from '@components';

const DetailForm = lazy(() => import('./form'));
const Record = lazy(() => import('./record'));

export default [{
  index: true,
  element: <ProtectedRoute title="广告管理" permissionKey="operate-activity-advertisement" component={<Record />} />,
  options: {
    title: '广告管理',
    permissionKey: 'operate-activity-advertisement',
    key: 'operate-activity-advertisement_index',
    icon: null,
    link: '/operate/activity/advertisement',
    displayInMenu: false,
  },
}, {
  path: 'create',
  element: <ProtectedRoute title="新建广告" permissionKey="operate-activity-advertisement" component={<DetailForm />} />,
  options: {
    title: '新建广告',
    permissionKey: 'operate-activity-advertisement',
    key: 'operate-activity-advertisement-create',
    icon: null,
    link: '/operate/activity/advertisement/create',
    displayInMenu: false,
  },
}, {
  path: ':id/edit',
  element: <ProtectedRoute title="编辑广告" permissionKey="operate-activity-advertisement" component={<DetailForm />} />,
  options: {
    title: '编辑广告',
    permissionKey: 'operate-activity-advertisement',
    key: 'operate-activity-advertisement-edit',
    icon: null,
    link: '/operate/activity/advertisement/:attendanceGroupId/edit',
    displayInMenu: false,
  },
}];
