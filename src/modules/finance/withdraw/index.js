import React, { useState, useEffect } from 'react';
import moment from 'moment';
import numeral from 'numeral';
import { message, Space } from 'antd';
import { useQuery } from 'react-query';
import { httpRequest } from '@utils';
import { globalStyles } from '@styles';
import { datetimeFormat, moneyFormat } from '@constants';
import { Table } from '@/components';
import Search from './search';

const { Content } = globalStyles;
const generateColumns = () => [
  {
    title: '交易订单号',
    dataIndex: 'thirdSerialNo',
    key: 'thirdSerialNo',
  },
  {
    title: '手机号',
    dataIndex: 'mobile',
    key: 'mobile',
  },
  {
    title: '身份证',
    dataIndex: 'idCard',
    key: 'idCard',
  },
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '收款账号',
    dataIndex: 'bankNo',
    key: 'bankNo',
  },
  {
    title: '代扣金额(元)',
    dataIndex: 'outAmount',
    key: 'outAmount',
    render(text, record, index) {
      return record.outAmount ? numeral(record.outAmount).format(moneyFormat.twoDecimal) : null;
    },
  },
  {
    title: '提现金额(元)',
    dataIndex: 'withdrawAmount',
    key: 'withdrawAmount',
    render(text, record, index) {
      return numeral(record.withdrawAmount).format(moneyFormat.twoDecimal);
    },
  },
  {
    title: '期末余额(元)',
    dataIndex: 'balance',
    key: 'balance',
    render(text, record, index) {
      return numeral(record.balance).format(moneyFormat.twoDecimal);
    },
  },
  {
    title: '提现日期',
    dataIndex: 'withdrawTime',
    key: 'withdrawTime',
    render(text, record, index) {
      return moment(Number(record.withdrawTime)).format(datetimeFormat.dateTime);
    },
  },
];
const Review = () => {
  const [searchCriteria, setSearchCriteria] = useState({ pageSize: 10 });
  const [balance, setBalance] = useState(0);
  const search = { ...searchCriteria, total: 10 };
  const {
    isLoading, isError, error, data,
  } = useQuery(['withdrawRecord', search], async () => {
    const res = await httpRequest.post('/admin/wallet/withdrawRecord/inquiry', search);
    if (res.code !== 0) {
      throw new Error(res.msg);
    }
    setSearchCriteria({ ...searchCriteria, total: res.data.total });
    return res.data?.content;
  });
  if (isError) {
    message.error(error.message);
  }
  const columns = generateColumns();
  const handleSearch = (searchValue) => {
    const { date, ...rest } = searchValue;
    setSearchCriteria({
      ...searchCriteria,
      ...rest,
      registerStartTime: date && moment(date[0]).startOf('day').format('x'),
      registerEndTime: date && moment(date[1]).endOf('day').format('x'),
      timestamp: new Date().getTime(),
    });
  };
  const handleTableChange = (params) => {
    setSearchCriteria({ ...searchCriteria, ...params, pageNumber: params.current - 1 });
  };
  const exportHandle = async (val) => {
    const { date, ...rest } = val;
    const params = {
      ...rest,
      registerStartTime: date && moment(date[0]).startOf('day').format('x'),
      registerEndTime: date && moment(date[1]).endOf('day').format('x'),
      timestamp: new Date().getTime(),
    };
    try {
      const res = await httpRequest.post('/admin/wallet/withdrawRecord/export', params);
      if (res.code !== 0) {
        throw new Error(res.msg);
      }
      message.success('导出成功');
    } catch (err) {
      message.error(err.message || '导出失败');
      console.log(err);
    }
  };
  const getBalance = async () => {
    try {
      const res = await httpRequest.get('/admin/wallet/balance');
      if (res.code !== 0) {
        throw new Error(res.msg);
      }
      setBalance(res.data);
    } catch (err) {
      message.error(err.message || '获取余额失败');
      console.log(err);
    }
  };
  useEffect(() => {
    getBalance();
  }, []);
  return (
    <>
      <Search onSubmit={handleSearch} exportHandle={exportHandle} />
      <Space style={{ fontSize: '16px', fontWeight: 'bold' }}>
        <span>
          企业账户余额：
          {numeral(balance).format(moneyFormat.twoDecimal)}
        </span>
      </Space>
      <Content>
        <Table
          loading={isLoading}
          columns={columns}
          dataSource={data}
          pagination={{
            ...searchCriteria,
            showSizeChanger: true,
          }}
          onChange={handleTableChange}
          scroll={{ x: 1500 }}
        />
      </Content>
    </>
  );
};

export default Review;
