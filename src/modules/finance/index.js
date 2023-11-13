import React, { lazy } from 'react';
import { Outlet } from 'react-router-dom';
import * as Icon from '@ant-design/icons';
import { ProtectedRoute } from '@components';

const Transaction = lazy(() => import('./transaction'));
const Withdraw = lazy(() => import('./withdraw'));
const Balance = lazy(() => import('./balance'));
const Transfer = lazy(() => import('./transfer'));
const Details = lazy(() => import('./transfer/details'));
const AddForm = lazy(() => import('./transfer/components/addForm'));
export default {
  path: 'finance',
  element: <Outlet />,
  options: {
    title: '财务报表',
    key: 'menu-finance',
    permissionKey: 'menu-finance',
    icon: <Icon.TransactionOutlined />,
    link: '/finance',
  },
  children: [
    {
      path: 'transaction',
      element: (
        <ProtectedRoute
          permissionKey="menu-finance_trade"
          title="交易记录"
          component={<Transaction />}
        />
      ),
      options: {
        title: '交易记录',
        key: 'menu-finance_trade',
        permissionKey: 'menu-finance_trade',
        icon: null,
        link: '/finance/transaction',
      },
    },
    {
      path: 'withdraw',
      element: (
        <ProtectedRoute
          permissionKey="menu-finance_withdraw"
          title="提现记录"
          allowAccess
          component={<Withdraw />}
        />
      ),
      options: {
        title: '提现记录',
        key: 'menu-finance_withdraw',
        permissionKey: 'menu-finance_withdraw',
        icon: null,
        link: '/finance/withdraw',
      },
    },
    {
      path: 'balance',
      element: (
        <ProtectedRoute
          permissionKey="menu-finance_balance"
          title="用户余额"
          component={<Balance />}
        />
      ),
      options: {
        title: '用户余额',
        key: 'menu-finance_balance',
        permissionKey: 'menu-finance_balance',
        icon: null,
        link: '/finance/balance',
      },
    },
    {
      path: 'transfer',
      element: (
        <ProtectedRoute
          permissionKey="menu-finance_transfer"
          title="转账"
          component={<Transfer />}
        />
      ),
      options: {
        title: '转账',
        key: 'menu-finance_transfer',
        permissionKey: 'menu-finance_transfer',
        icon: null,
        link: '/finance/transfer',
      },
    },
    {
      path: '/finance/transfer/:id/details',
      element: (
        <ProtectedRoute
          title="审核"
          permissionKey="menu-employer"
          component={<Details />}
        />
      ),
    },
    {
      path: '/finance/transfer/add',
      element: (
        <ProtectedRoute
          title="审核"
          permissionKey="menu-employer"
          component={<AddForm />}
        />
      ),
    },
  ],
};
