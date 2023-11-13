import React, { useState } from 'react';
import { Button, message } from 'antd';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { ContainerOutlined } from '@ant-design/icons';
import moment from 'moment';
import { httpRequest } from '@utils';
import { globalStyles } from '@styles';
import { datetimeFormat } from '@constants';
import { Table } from '@/components';
import Search from './search';

const { Content } = globalStyles;
const generateColumns = ({ onDetailClick }) => [
  {
    title: '用工单位',
    dataIndex: 'coreCompanyName',
    key: 'coreCompanyName',
  },
  {
    title: '单位简称',
    dataIndex: 'shortName',
    key: 'shortName',
  },
  {
    title: '所属集团',
    dataIndex: 'group',
    key: 'group',
  },
  {
    title: '单位地址',
    dataIndex: 'workAddress',
    key: 'workAddress',
  },
  {
    title: '所属行业',
    dataIndex: 'industry',
    key: 'industry',
  },
  {
    title: '企业类型',
    dataIndex: 'companyType',
    key: 'companyType',
  },
  {
    title: '企业规模',
    dataIndex: 'enterpriseSize',
    key: 'enterpriseSize',
  },
  {
    title: '劳务公司',
    dataIndex: 'tenantName',
    key: 'tenantName',
  },
  {
    title: '创建日期',
    dataIndex: 'createdDate',
    key: 'createdDate',
    render(text, record, index) {
      return moment(Number(record.createdDate)).format('YYYY-MM-DD');
    },
  },
  {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
    width: 100,
    fixed: 'right',
    render: (text, record, index) => (
      <Button type="link" icon={<ContainerOutlined />} onClick={() => onDetailClick(record)}>
        详情
      </Button>
    ),
  },
];
const Review = () => {
  const [searchCriteria, setSearchCriteria] = useState({ pageSize: 10 });
  const navigate = useNavigate();
  const search = { ...searchCriteria, total: 10 };
  const {
    isLoading, isError, error, data,
  } = useQuery(['employer', search], async () => {
    const res = await httpRequest.post('/coreCompany/inquiry', search);
    if (res.code !== 0) {
      throw new Error(res.msg);
    }
    setSearchCriteria({ ...searchCriteria, total: res.data.total });
    return res.data?.content;
  });
  if (isError) {
    message.error(error.message);
  }
  const columns = generateColumns({
    onDetailClick: (record) => {
      navigate(`${record.id}`);
    },
  });
  const handleSearch = (searchValue) => {
    const { date, ...rest } = searchValue;
    setSearchCriteria({
      ...searchCriteria,
      ...rest,
      createdDateStart: date && moment(date[0]).startOf('day').format('x'),
      createdDateEnd: date && moment(date[1]).endOf('day').format('x'),
      timestamp: new Date().getTime(),
    });
  };
  const handleTableChange = (params) => {
    setSearchCriteria({ ...searchCriteria, ...params, pageNumber: params.current - 1 });
  };
  return (
    <>
      <Search onSubmit={handleSearch} />
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
