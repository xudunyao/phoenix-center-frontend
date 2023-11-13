import React, { useState } from 'react';
import { httpRequest } from '@utils';
import moment from 'moment';
import { globalStyles } from '@styles';
import { datetimeFormat } from '@/constants';
import { Table } from '@/components';
import Search from './search';

const { Content } = globalStyles;
const generateColumns = () => [
  {
    title: '序号',
    render(text, record, index) {
      return `${index + 1}`;
    },
  },
  {
    title: '身份证号码',
    dataIndex: 'identityCard',
    key: 'identityCard',
  },
  {
    title: '工作状态',
    dataIndex: 'jobStatusName',
    key: 'jobStatusName',
  },
  {
    title: '在职时长',
    dataIndex: 'duration',
    key: 'duration',
  },
  {
    title: '离职时间',
    dataIndex: 'resigningDate',
    key: 'resigningDate',
    render: (text, record) => (record.resigningDate
      ? moment(Number(record.resigningDate)).format(datetimeFormat.dateTime)
      : ''),
  },
  {
    title: '离职类型',
    dataIndex: 'resigningName',
    key: 'resigningName',
  },
  {
    title: '事业群名称',
    dataIndex: 'bgName',
    key: 'bgName',
  },
  {
    title: '事业处',
    dataIndex: 'buName',
    key: 'buName',
  },
  {
    title: '厂区名称',
    dataIndex: 'facName',
    key: 'facName',
  },
  {
    title: '员工类型',
    dataIndex: 'empTypeName',
    key: 'empTypeName',
  },
  {
    title: '招聘来源',
    dataIndex: 'hireSource',
    key: 'hireSource',
  },
  {
    title: '公司名称',
    dataIndex: 'companyName',
    key: 'companyName',
  },
  {
    title: '派遣公司名称',
    dataIndex: 'pcompanyName',
    key: 'pcompanyName',
  },
];

const Inquire = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const columns = generateColumns();
  const reset = () => {
    setData();
  };
  const handleSearch = async (searchValue) => {
    setIsLoading(true);
    const res = await httpRequest.get(`/admin/hrInfo/${searchValue.identityCard}`);
    if (res.code !== 0) {
      throw new Error(res.msg);
    }
    setData(res.data);
    setIsLoading(false);
  };

  return (
    <>
      <Search onSubmit={handleSearch} reset={reset} />
      <Content>
        <Table loading={isLoading} columns={columns} dataSource={data} scroll={{ x: 1500 }} />
      </Content>
    </>
  );
};

export default Inquire;
