import React, { useState } from 'react';
import moment from 'moment';
import PropTypes from 'prop-types';
import { message, Table } from 'antd';
import { useQuery } from 'react-query';
import { httpRequest } from '@utils';
import Search from './search';

const generateColumns = () => [
  {
    title: '日期',
    dataIndex: 'date',
    key: 'date',
  },
  {
    title: '页面路径',
    dataIndex: 'pagePath',
    key: 'pagePath',
  },
  {
    title: '渠道来源',
    dataIndex: 'channelName',
    key: 'channelName',
  },
  {
    title: '页面备注',
    dataIndex: 'pageRemark',
    key: 'pageRemark',
  },
  {
    title: '页面访问人数',
    dataIndex: 'visitorsCount',
    key: 'visitorsCount',
  },
  {
    title: '页面访问次数',
    dataIndex: 'visitTimes',
    key: 'visitTimes',
  },
];
const TabContent = ({ type }) => {
  const [searchCriteria, setSearchCriteria] = useState({ pageSize: 10 });
  const search = { ...searchCriteria, type };
  const {
    isLoading, isError, error, data,
  } = useQuery(['statistics', search], async () => {
    const res = await httpRequest.post('/admin/track/inquiry', search);
    if (res.code !== 0) {
      throw new Error(res.msg);
    }
    setSearchCriteria({ ...searchCriteria, total: res.data.total });
    return res.data;
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
      startTime: date && moment(date[0]).startOf('day').format('x'),
      endTime: date && moment(date[1]).endOf('day').format('x'),
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
      startTime: date && moment(date[0]).startOf('day').format('x'),
      endTime: date && moment(date[1]).endOf('day').format('x'),
      type,
      timestamp: new Date().getTime(),
    };
    try {
      const res = await httpRequest.post('/admin/track/export', params);
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
      <Table
        loading={isLoading}
        columns={columns}
        dataSource={data}
        pagination={{
          ...searchCriteria,
          showSizeChanger: true,
        }}
        bordered
        onChange={handleTableChange}
      />
    </>
  );
};
TabContent.propTypes = {
  type: PropTypes.string,
};

TabContent.defaultProps = {
  type: '',
};
export default TabContent;
