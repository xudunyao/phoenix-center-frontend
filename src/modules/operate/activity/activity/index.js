import React, { useState, useEffect } from 'react';
import { httpRequest } from '@utils';
import {
  Card, message, Tag,
} from 'antd';
import { useQuery } from 'react-query';
import { Table } from '@/components';
import Search from './search';

const Activity = () => {
  const [searchCriteria, setSearchCriteria] = useState({ pageSize: 10 });
  const search = {
    ...searchCriteria,
  };

  const {
    isError, error, data,
  } = useQuery(['jobs', search], async () => {
    const res = await httpRequest.post('admin/registerAwardPosition/inquiry', search);
    if (res.code !== 0) {
      throw new Error(res.msg);
    }
    setSearchCriteria({ ...searchCriteria, total: res.data.total });
    return res.data?.content;
  });
  if (isError) {
    message.error(error.msg);
  }

  const handleSearch = (searchValue) => {
    const { date, ...rest } = searchValue;
    setSearchCriteria({
      ...searchCriteria,
      ...rest,
      timestamp: new Date().getTime(),
    });
  };
  const handleTableChange = (params) => {
    setSearchCriteria({ ...searchCriteria, ...params, pageNumber: params.current - 1 });
  };

  const columns = [
    {
      title: '序号',
      dataIndex: 'serialNumber',
      key: 'serialNumber',
      render(text, record, index) {
        return `${index + 1}`;
      },
    },
    {
      title: '岗位名称',
      dataIndex: 'positionName',
      key: 'positionName',
    },
    {
      title: '岗位价格',
      dataIndex: 'orderPrice',
      key: 'orderPrice',
    },
    {
      title: '企业名称',
      dataIndex: 'tenantName',
      key: 'tenantName',
    },
    {
      title: '是否上架',
      dataIndex: 'publish',
      key: 'publish',
      render: (text, record, index) => (
        <Tag color={record.publish ? 'green' : 'red'}>{record.publish ? '已上架' : '已下架'}</Tag>
      ),
    },
    {
      title: '报名人数',
      dataIndex: 'signedUpCount',
      key: 'signedUpCount',
    },
    {
      title: '面试人数',
      dataIndex: 'interviewCount',
      key: 'interviewCount',
    },
    {
      title: '面试通过人数',
      dataIndex: 'interviewPassCount',
      key: 'interviewPassCount',
    },
    {
      title: '成功入职人数',
      dataIndex: 'entrySuccessCount',
      key: 'entrySuccessCount',
    },
  ];
  return (
    <>
      <Search onSubmit={handleSearch} />
      <Table
        dataSource={data}
        columns={columns}
        pagination={{
          ...searchCriteria,
          showSizeChanger: true,
        }}
        onChange={handleTableChange}
      />
    </>
  );
};
export default Activity;
