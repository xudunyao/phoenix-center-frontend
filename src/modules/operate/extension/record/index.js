import React, { useState } from 'react';
import {
  Button, message, Popconfirm, Image,
} from 'antd';
import { EditOutlined } from '@ant-design/icons';
import moment from 'moment';
import { globalStyles } from '@styles';
import { useQuery } from 'react-query';
import { datetimeFormat } from '@constants';
import { Table } from '@/components';
import { httpRequest } from '@/utils';
import Search from './search';
import DetailForm from '../form';

const { Content } = globalStyles;
const generateColumns = ({ onEditClick }) => [
  {
    title: '渠道名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '描述',
    dataIndex: 'desc',
    key: 'desc',
  },
  {
    title: '推广用户端',
    dataIndex: 'userClient',
    key: 'userClient',
  },
  {
    title: '渠道链接',
    dataIndex: 'channelUrl',
    key: 'channelUrl',
  },
  {
    title: '创建时间',
    dataIndex: 'createdTime',
    key: 'createdTime',
    render(text, record, index) {
      return record.createdTime && moment(Number(record.createdTime)).format(datetimeFormat.date);
    },
  },
  {
    title: '操作人',
    dataIndex: 'operator',
    key: 'operator',
  },
  {
    title: '更新时间',
    dataIndex: 'updateTime',
    key: 'updateTime',
    render(text, record, index) {
      return record.updateTime && moment(Number(record.updateTime)).format(datetimeFormat.date);
    },
  },
  {
    title: '二维码',
    dataIndex: 'qrcodeUrl',
    key: 'qrcodeUrl',
    render: (text, record, index) => <Image src={text} alt="二维码" style={{ width: '100px', height: '100px' }} />,
  },
  {
    title: '操作',
    dataIndex: 'operate',
    key: 'operate',
    render: (text, record, index) => (
      <Button type="link" icon={<EditOutlined />} onClick={() => onEditClick(record)}>
        修改
      </Button>
    ),
  },
];
const Extension = () => {
  const [searchCriteria, setSearchCriteria] = useState({ pageSize: 10 });
  const [currentUserId, setCurrentUserId] = useState();
  const [visible, setVisible] = useState(false);
  const search = { ...searchCriteria };
  const {
    isLoading, isError, error, data, refetch,
  } = useQuery(['record', search], async () => {
    const res = await httpRequest.post('/admin/channel/inquiry', search);
    if (res.code !== 0) {
      throw new Error(res.msg);
    }
    setSearchCriteria({ ...searchCriteria, total: res.data.total });
    return res.data?.content;
  });
  if (isError) {
    message.error(error.message);
  }
  const handleCloseModel = (refresh) => {
    setCurrentUserId(null);
    setVisible(false);
    if (refresh) {
      refetch();
    }
  };
  const columns = generateColumns({
    onEditClick: (record) => {
      setCurrentUserId(record.id);
      setVisible(true);
    },
  });
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
  const handleAdd = () => {
    setVisible(true);
  };
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
      <DetailForm
        visible={visible}
        id={currentUserId}
        onClose={handleCloseModel}
        title="添加渠道"
      />
    </>
  );
};
export default Extension;
