import React, { useState } from 'react';
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
    title: '交易编号',
    dataIndex: 'serialNo',
    key: 'serialNo',
  },
  {
    title: '手机号',
    dataIndex: 'mobile',
    key: 'mobile',
  },
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '身份证',
    dataIndex: 'idCard',
    key: 'idCard',
  },
  {
    title: '交易金额(元)',
    dataIndex: 'changeAmount',
    key: 'changeAmount',
    render(text, record, index) {
      return numeral(record.changeAmount).format(moneyFormat.twoDecimal);
    },
  },
  {
    title: '余额(元)',
    dataIndex: 'afterAmount',
    key: 'afterAmount',
    render(text, record, index) {
      return numeral(record.afterAmount).format(moneyFormat.twoDecimal);
    },
  },
  {
    title: '交易类型',
    dataIndex: 'tradeType',
    key: 'tradeType',
  },
  {
    title: '资金类型',
    dataIndex: 'billType',
    key: 'billType',
  },
  {
    title: '支付渠道',
    dataIndex: 'paymentChannel',
    key: 'paymentChannel',
  },
  {
    title: '交易状态',
    dataIndex: 'payStatus',
    key: 'payStatus',
  },
  {
    title: '流水时间',
    dataIndex: 'serialTime',
    key: 'serialTime',
    render(text, record, index) {
      return record.serialTime && moment(Number(record.serialTime)).format(datetimeFormat.dateTime);
    },
  },
  {
    title: '备注',
    dataIndex: 'remark',
    key: 'remark',
  },
];
const Review = () => {
  const [searchCriteria, setSearchCriteria] = useState({ pageSize: 10 });
  const [statistics, setStatistics] = useState({});
  const search = { ...searchCriteria };
  const {
    isLoading, isError, error, data,
  } = useQuery(['transaction', search], async () => {
    const res = await httpRequest.post('/admin/wallet/transaction/inquiry', search);
    if (res.code !== 0) {
      throw new Error(res.msg);
    }
    setSearchCriteria({ ...searchCriteria, total: res.data?.total });
    setStatistics({
      totalAmount: res.data?.total,
      income: res.data?.income,
      outlay: res.data?.outlay,
    });
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
      tradeTimeStart: date && moment(date[0]).startOf('day').format('x'),
      tradeTimeEnd: date && moment(date[1]).endOf('day').format('x'),
      timestamp: new Date().getTime(),
    });
  };
  const handleTableChange = (params) => {
    setSearchCriteria({ ...searchCriteria, ...params, pageNumber: params.current - 1 });
  };
  return (
    <>
      <Search onSubmit={handleSearch} />
      <Space style={{ fontSize: '16px', fontWeight: 'bold' }}>
        <span style={{ fontSize: '20px' }}>合计：</span>
        <span>
          平台支出：￥
          {numeral(statistics.income).format(moneyFormat.twoDecimal)}
        </span>
        <span>
          用户提现：￥
          {numeral(statistics.outlay).format(moneyFormat.twoDecimal)}
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
