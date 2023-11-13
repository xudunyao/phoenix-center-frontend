import React, { useState } from 'react';
import { useQuery } from 'react-query';
import { httpRequest } from '@utils';
import { globalStyles } from '@styles';
import { datetimeFormat } from '@constants';
import moment from 'moment';
import { message } from 'antd';
import { Table } from '@/components';
import Search from './search';
import MyForm from './form';

const { Content } = globalStyles;
const generateColumns = () => [
  {
    title: '手机号',
    dataIndex: 'mobile',
    key: 'mobile',
  },
  {
    title: '渠道昵称',
    dataIndex: 'channelNickname',
    key: 'channelNickname',
  },
  {
    title: '渠道来源',
    dataIndex: 'sourceChannelName',
    key: 'sourceChannelName',
  },
  {
    title: '姓名',
    dataIndex: 'realName',
    key: 'realName',
  },
  {
    title: '性别',
    dataIndex: 'sex',
    key: 'sex',
    render(text, record, index) {
      return record.sex === 'MALE' ? '男' : '女';
    },
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: '渠道ID',
    dataIndex: 'channelID',
    key: 'channelID',
  },
  {
    title: '线索来源',
    dataIndex: 'clueFrom',
    key: 'clueFrom',
  },
  {
    title: '线索日期',
    dataIndex: 'clueDate',
    key: 'clueDate',
    render(text, record, index) {
      return moment(Number(record.clueDate)).format(datetimeFormat.date);
    },
  },
  {
    title: '地区',
    dataIndex: 'location',
    key: 'location',
  },
  {
    title: '导入时间',
    dataIndex: 'importTime',
    key: 'importTime',
    render(text, record, index) {
      return moment(Number(record.importTime)).format(datetimeFormat.date);
    },
  },
];
const Review = () => {
  const [visible, setVisible] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState({ pageSize: 10 });
  const search = { ...searchCriteria };
  const {
    isLoading, isError, error, data, refetch,
  } = useQuery(['flowPool', search], async () => {
    const res = await httpRequest.post('/admin/flowPool/inquiry', search);
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
      startTime: date && moment(date[0]).startOf('day').format('x'),
      endTime: date && moment(date[1]).endOf('day').format('x'),
      timestamp: new Date().getTime(),
    });
  };
  const handleTableChange = (params) => {
    setSearchCriteria({ ...searchCriteria, ...params, pageNumber: params.current - 1 });
  };
  const handleOk = async (form) => {
    const validateRes = await form.validateFields();
    const { clueDate } = form.getFieldsValue();
    if (!validateRes) {
      return;
    }
    try {
      const res = await httpRequest.post('/admin/flowPool/clue', {
        ...form.getFieldsValue(),
        clueDate: moment(clueDate).format('x'),
      });
      if (res.code !== 0) {
        throw new Error(res.msg);
      }
      refetch();
      message.success('添加成功');
    } catch (err) {
      message.error(err.msg || '添加失败');
    } finally {
      setVisible(false);
      form.resetFields();
    }
  };
  const onCancel = (form) => {
    form.resetFields();
    setVisible(false);
  };
  const handleAdd = () => {
    setVisible(true);
  };
  return (
    <>
      <Search onSubmit={handleSearch} onAdd={handleAdd} refetch={refetch} />
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
      <MyForm visible={visible} handleOk={handleOk} onCancel={onCancel} />
    </>
  );
};

export default Review;
