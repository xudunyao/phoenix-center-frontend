import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';
import { message } from 'antd';
import { useQuery } from 'react-query';
import { httpRequest } from '@utils';
import { globalStyles } from '@styles';
import { datetimeFormat } from '@constants';
import { Table } from '@/components';
import Search from './search';

const { Content } = globalStyles;
const generateColumns = () => [
  {
    title: '手机号',
    dataIndex: 'mobile',
    key: 'mobile',
  },
  {
    title: '姓名',
    dataIndex: 'realName',
    key: 'realName',
  },
  {
    title: '身份证',
    dataIndex: 'idNo',
    key: 'idNo',
  },
  {
    title: '性别',
    dataIndex: 'sex',
    key: 'sex',
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
  },
  {
    title: '地址',
    dataIndex: 'street',
    render(text, record) {
      return [record.province, record.city, record.district, record.street]
        .toString()
        .replace(/,/g, '');
    },
  },
  {
    title: '推荐人姓名',
    dataIndex: 'recommendName',
    key: 'recommendName',
  },
  {
    title: '推荐人手机号',
    dataIndex: 'recommendMobile',
    key: 'recommendMobile',
  },
  {
    title: '是否实名',
    dataIndex: 'validation',
    key: 'validation',
    render(text, record, index) {
      return record.validation ? '已实名' : '未实名';
    },
  },
  {
    title: '注册端',
    dataIndex: 'platform',
    key: 'platform',
  },
  {
    title: '工作状态',
    dataIndex: 'workStatus',
    key: 'workStatus',
  },
  {
    title: '渠道来源',
    dataIndex: 'sourceChannel',
    key: 'sourceChannel',
  },
  {
    title: '日期',
    dataIndex: 'registrationDate',
    key: 'registrationDate',
    render(text, record, index) {
      return moment(Number(record.registrationDate)).format(datetimeFormat.dateTime);
    },
  },
  {
    title: '入职次数',
    dataIndex: 'entryTimes',
    key: 'entryTimes',
  },
];
const Review = () => {
  const [searchCriteria, setSearchCriteria] = useState({ pageSize: 10 });
  const navigate = useNavigate();
  const search = { ...searchCriteria };
  const {
    isLoading, isError, error, data,
  } = useQuery(['member', search], async () => {
    const res = await httpRequest.post('/admin/member/inquiry', search);
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
      const res = await httpRequest.post('/admin/member/exportMember', params);
      if (res.code !== 0) {
        throw new Error(res.msg);
      }
      message.success('导出成功');
    } catch (err) {
      message.error(err.message || '导出失败');
      console.log(err);
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
          rowKey={(record) => record.memberId}
          onChange={handleTableChange}
          scroll={{ x: 1500 }}
        />
      </Content>
    </>
  );
};

export default Review;
