import React, { useState } from 'react';
import {
  Button, message, Popconfirm, Tag, Tooltip,
} from 'antd';
import { useNavigate } from 'react-router-dom';
import { EditOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { useQuery } from 'react-query';
import { httpRequest } from '@utils';
import { globalStyles } from '@styles';
import { Table } from '@/components';
import Search from './search';

const { Content } = globalStyles;
const generateColumns = ({ onStatusChange, onEditClick }) => [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    width: 30,
    render: (text, record, index) => index + 1,
  },
  {
    title: '角色',
    dataIndex: 'name',
    key: 'name',
    width: 80,
  },
  {
    title: '权限',
    dataIndex: 'permissions',
    key: 'permissions',
    width: 250,
    ellipsis: {
      showTitle: false,
    },
    render: (params) => (
      <Tooltip
        placement="bottomLeft"
        title={params.map((item, index) => (
          <Tag
            key={item}
            color="green"
            style={{ width: '70px', textAlign: 'center', marginBottom: '5px' }}
          >
            {item}
          </Tag>
        ))}
        overlayInnerStyle={{ background: '#fff' }}
      >
        {params.map((item, index) => (
          <Tag key={item} color="blue">
            {item}
          </Tag>
        ))}
      </Tooltip>
    ),
  },
  {
    title: '状态',
    dataIndex: 'disable',
    key: 'disable',
    width: 30,
    render: (text, record, index) => (
      <Tag color={text ? 'error' : 'green'}>{text ? '禁用' : '启用'}</Tag>
    ),
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    fixed: 'right',
    width: 200,
    render: (text, record, index) => (
      <>
        <Button type="link" icon={<EditOutlined />} onClick={() => onEditClick(record)}>
          编辑
        </Button>
        <Popconfirm
          title={`确认${record.disable ? '启用' : '禁用'}吗？`}
          okText="确定"
          cancelText="再想想"
          onConfirm={() => onStatusChange(record)}
        >
          <Button icon={text ? <CheckOutlined /> : <CloseOutlined />} type="link">
            {record.disable ? '启用' : '禁用'}
          </Button>
        </Popconfirm>
      </>
    ),
  },
];

const Review = () => {
  const navigate = useNavigate();
  const [searchCriteria, setSearchCriteria] = useState({ pageSize: 10 });
  const search = { ...searchCriteria, total: 15 };
  const {
    isLoading, isError, error, data, refetch,
  } = useQuery(
    ['role', search],
    async () => {
      const res = await httpRequest.post('/role/inquiry', search);
      if (res.code === 0) {
        setSearchCriteria({ ...searchCriteria, total: res.data.total });
        return res.data.content;
      }
      throw new Error(res.msg);
    },
  );
  if (isError) {
    message.error(error.message);
  }
  const columns = generateColumns({
    onStatusChange: async (record) => {
      try {
        const res = await httpRequest.put(
          record.disable ? `/role/${record.id}/enable` : `/role/${record.id}/disable`,
        );
        if (res?.code === 0) {
          refetch();
        } else {
          throw new Error(res.msg);
        }
      } catch (err) {
        message.error(err?.message || '提交失败');
      }
    },
    onEditClick: (record) => {
      navigate(`/setting/jurisdiction/${record.id}/edit`);
    },
  });
  const handleSearch = (searchValue) => {
    setSearchCriteria(searchValue);
  };
  const handleTableChange = (params) => {
    setSearchCriteria({ ...searchCriteria, ...params, pageNumber: params.current - 1 });
  };
  const handleAdd = () => {
    navigate('/setting/jurisdiction/add');
  };
  return (
    <>
      <Search onSubmit={handleSearch} onClick={handleAdd} />
      <Content>
        <Table
          loading={isLoading}
          columns={columns}
          dataSource={data}
          pagination={{
            ...searchCriteria,
            showSizeChanger: true,
            total: searchCriteria?.total || 0,
            showTotal: (total) => `共 ${total} 条`,
          }}
          onChange={handleTableChange}
        />
      </Content>
    </>
  );
};

export default Review;
