import React, { useState } from 'react';
import { useQuery } from 'react-query';
import moment from 'moment';
import { httpRequest } from '@utils';
import { message } from 'antd';
import { globalStyles } from '@styles';
import { datetimeFormat } from '@constants';
import { Table } from '@/components';

import Search from './search';

const { Content } = globalStyles;
const columns = [
  {
    title: '劳务公司',
    dataIndex: 'tenantName',
    key: 'tenantName',
  }, {
    title: '会员姓名',
    dataIndex: 'name',
    key: 'name',
  }, {
    title: '会员手机号',
    dataIndex: 'mobile',
    key: 'mobile',
  }, {
    title: '会员身份证',
    dataIndex: 'idNo',
    key: 'idNo',
  }, {
    title: '年龄',
    dataIndex: 'age',
    key: 'age',
  }, {
    title: '性别',
    dataIndex: 'sex',
    key: 'sex',
  }, {
    title: '民族',
    dataIndex: 'nation',
    key: 'nation',
  }, {
    title: '贯籍',
    dataIndex: 'address',
    key: 'address',
  }, {
    title: '订单来源',
    dataIndex: 'channelSource',
    key: 'channelSource',
  }, {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
  }, {
    title: '岗位名称',
    dataIndex: 'positionName',
    key: 'positionName',
  }, {
    title: '岗位类型',
    dataIndex: 'typeOfWork',
    key: 'typeOfWork',
  }, {
    title: '工价',
    dataIndex: 'orderPrice',
    key: 'orderPrice',
  }, {
    title: '平台补贴',
    dataIndex: 'subsidyAmount',
    key: 'subsidyAmount',
  }, {
    title: '用工单位简称',
    dataIndex: 'companyShortName',
    key: 'companyShortName',
  }, {
    title: '报名日期',
    dataIndex: 'signUpDate',
    key: 'signUpDate',
    render(text, record, index) {
      return record.signUpDate ? moment(record.signUpDate).format(datetimeFormat.date) : null;
    },
  }, {
    title: '订单日期',
    dataIndex: 'orderDate',
    key: 'orderDate',
    render(text, record, index) {
      return record.orderDate ? moment(record.orderDate).format(datetimeFormat.date) : null;
    },
  }, {
    title: '来源渠道',
    dataIndex: 'sourceChannelName',
    key: 'sourceChannelName',
  },
];

const ToEmployed = () => {
  const [searchCriteria, setSearchCriteria] = useState({ pageSize: 10 });
  const search = { ...searchCriteria, total: 0 };

  const {
    isLoading,
    isError,
    error,
    data,
    refetch,
  } = useQuery(['orderAll', search], async () => {
    const res = await httpRequest.post('/order/employment/inquiry', search);
    if (res.code === 0) {
      setSearchCriteria({ ...searchCriteria, total: res.data.total });
      return res.data.content;
    }
    throw new Error(res.msg);
  });
  if (isError) {
    message.error(error.message);
  }

  const handleSearch = (searchval) => {
    const { signUpDate, ...rest } = searchval;
    setSearchCriteria({
      ...searchCriteria,
      ...rest,
      signUpDateStart: signUpDate && moment(signUpDate[0]).startOf('day').format('x'),
      signUpDateEnd: signUpDate && moment(signUpDate[1]).endOf('day').format('x'),
      timestamp: new Date().getTime(),
    });
  };
  const handleTableChange = (params) => {
    setSearchCriteria({ ...searchCriteria, ...params, pageNumber: params.current - 1 });
  };
  const exportHandle = async (val) => {
    const { signUpDate, ...rest } = val;
    const params = {
      ...rest,
      signUpDateStart: signUpDate && moment(signUpDate[0]).startOf('day').format('x'),
      signUpDateEnd: signUpDate && moment(signUpDate[1]).endOf('day').format('x'),
      timestamp: new Date().getTime(),
    };
    try {
      const res = await httpRequest.post('/order/employment/export', params);
      if (res.code === 0) {
        message.success('导出成功');
      } else {
        message.error(res.msg);
      }
    } catch (err) {
      message.error(err?.message);
    }
  };
  return (
    <>
      <Search onSubmit={handleSearch} exportHandle={exportHandle} />
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
        />
      </Content>
    </>
  );
};

export default ToEmployed;
