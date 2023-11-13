import React, { lazy } from 'react';
import dashboard from '@modules/dashboard';
import member from '@modules/member';
import enterprise from '@modules/enterprise';
import order from '@modules/order';
import setting from '@/modules/setting';
import post from '@/modules/post';
import staff from '@/modules/staff';
import finance from '@/modules/finance';
import operate from '@/modules/operate';
import statistics from '@/modules/statistics';

const NotAuthorized = lazy(() => import('@modules/error/notAuthorized'));
export default [
  dashboard,
  operate,
  member,
  staff,
  order,
  enterprise,
  post,
  setting,
  finance,
  statistics,
  {
    path: 'not-authorized',
    element: <NotAuthorized />,
  },
];
