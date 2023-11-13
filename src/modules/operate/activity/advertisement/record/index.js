import React, { useState } from 'react';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { globalStyles } from '@styles';
import { Button, message, Tag } from 'antd';
import { useQuery } from 'react-query';
import { Table } from '@/components';
import { datetimeFormat } from '@/constants';
import { httpRequest } from '@/utils';

import Search from './search';

const { Content } = globalStyles;
const Advertisement = () => {
  const navigate = useNavigate();
  const [searchCriteria, setSearchCriteria] = useState({ pageSize: 10 });
  const enumColor = {
    TAKE_DOWN: 'red',
    PUBLISHED: 'green',
    PENDING: 'blue',
  };
  const enumRecord = {
    TAKE_DOWN: '已下线',
    PUBLISHED: '已发布',
    PENDING: '待发布',
  };
  const generateColumns = ({ offline, edit }) => [
    {
      title: '广告ID',
      dataIndex: 'id',
      key: 'id',
    }, {
      title: '广告名称',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '投放位置',
      dataIndex: 'putPosition',
      key: 'putPosition',
      render: (_, record) => (
        <span>{record.putPosition === 'HOME_BANNER' ? '首页Banner' : '首页弹窗'}</span>
      ),
    }, {
      title: '投放对象',
      dataIndex: 'putObject',
      key: 'putObject',
      render: (_, record) => (
        <span>{record.putObject === 'ALL' ? '全部会员' : '注册会员'}</span>
      ),
    }, {
      title: '发布状态',
      dataIndex: 'status',
      key: 'status',
      render: (_, record, index) => (
        <Tag color={enumColor[record.status]}>{enumRecord[record.status]}</Tag>
      ),
    }, {
      title: '点击量',
      dataIndex: 'clickCount',
      key: 'clickCount',
    }, {
      title: '更新时间',
      dataIndex: 'updateTime',
      key: 'updateTime',
      render(_, record) {
        return record.updateTime && moment(Number(record.updateTime)).format(datetimeFormat.dateTime);
      },
    }, {
      title: '操作',
      dataIndex: 'operate',
      key: 'operate',
      render: (_, record) => (
        <>
          <Button type="link" onClick={() => offline(_, record)} disabled={record.status === 'TAKE_DOWN'}>下线</Button>
          <Button type="link" onClick={() => edit(_, record)}>编辑</Button>
        </>
      ),
    },
  ];
  const handleSearch = (searchValue) => {
    setSearchCriteria({
      ...searchCriteria,
      ...searchValue,
      timestamp: new Date().getTime(),
    });
  };
  const handleTableChange = (params) => {
    setSearchCriteria({ ...searchCriteria, ...params, pageNumber: params.current - 1 });
  };
  const handleAdd = () => {
    navigate('create');
  };
  const search = { ...searchCriteria };
  const {
    isLoading, isError, error, data, refetch,
  } = useQuery(['banner', search], async () => {
    const res = await httpRequest.post('/admin/banner/inquiry', search);
    if (res.code === 0) {
      setSearchCriteria({ ...searchCriteria, total: res.data.total });
      return res.data.content;
    }
    throw new Error(res.msg);
  });
  if (isError) {
    message.error(error);
  }
  const columns = generateColumns({
    edit: (_, record) => {
      navigate(`/operate/activity/advertisement/${record.id}/edit`);
    },
    offline: async (_, record) => {
      try {
        const res = await httpRequest.put(`/admin/banner/offline/${record.id}`);
        if (res.code !== 0) {
          throw new Error(res.msg);
        }
      } catch (err) {
        message.error(err.message);
      } finally {
        refetch();
      }
    },
  });

  return (
    <>
      <Search onSubmit={handleSearch} onAdd={handleAdd} />
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
export default Advertisement;
