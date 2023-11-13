import React, { useState } from 'react';
import {
  Button, message, Popconfirm, Image, Tag,
} from 'antd';
import {
  EditOutlined,
  ContainerOutlined,
  StopOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { useQuery } from 'react-query';
import { useNavigate } from 'react-router-dom';
import { httpRequest } from '@utils';
import { globalStyles } from '@styles';
import { Table } from '@/components';

import Search from './search';

const { Content } = globalStyles;
const generateColumns = ({ onDetailClick, onEditClick, onFrozenClick }) => [
  {
    title: '企业名称',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '注册号',
    dataIndex: 'registerCode',
    key: 'registerCode',
  },
  {
    title: '公司办公地址',
    dataIndex: 'workAddress',
    key: 'workAddress',
  },
  {
    title: '企业法人',
    dataIndex: 'legalPerson',
    key: 'legalPerson',
  },
  {
    title: '管理员',
    dataIndex: 'adminName',
    key: 'adminName',
  },
  {
    title: '管理账号',
    dataIndex: 'adminAccount',
    key: 'adminAccount',
  },
  {
    title: '账号状态',
    dataIndex: 'disable',
    key: 'disable',
    render: (text, record, index) => (record.disable ? <Tag color="red">冻结</Tag> : <Tag color="green">正常</Tag>),
  },
  {
    title: '注册地址',
    dataIndex: 'registerAddress',
    key: 'registerAddress',
  },
  {
    title: '企业LOGO',
    dataIndex: 'logoUrl',
    key: 'logoUrl',
    render: (text, record, index) => <Image width={50} src={record.logoUrl} />,
  },
  {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
    width: 300,
    fixed: 'right',
    render: (text, record, index) => (
      <>
        <Button type="link" icon={<ContainerOutlined />} onClick={() => onDetailClick(record)}>
          详情
        </Button>
        <Button type="link" icon={<EditOutlined />} onClick={() => onEditClick(record)}>
          编辑
        </Button>
        <Popconfirm
          title={`确定要${record.disable ? '启用' : '冻结'}该企业吗？`}
          okText="确定"
          cancelText="再想想"
          onConfirm={() => onFrozenClick(record)}
        >
          <Button type="link" icon={record.disable ? <CheckCircleOutlined /> : <StopOutlined />}>
            {record.disable ? '启用' : '冻结'}
          </Button>
        </Popconfirm>
      </>
    ),
  },
];
const Review = () => {
  const [searchCriteria, setSearchCriteria] = useState({ pageSize: 10 });
  const navigate = useNavigate();
  const search = { ...searchCriteria, total: 10 };
  const {
    isLoading, isError, error, data, refetch,
  } = useQuery(['labourServices', search], async () => {
    const res = await httpRequest.post('/tenant/inquiry', search);
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
    onDetailClick: (record) => {
      navigate(`/enterprise/labour-services/${record.id}`);
    },
    onEditClick: (record) => {
      navigate(`/enterprise/labour-services/${record.id}/edit`);
    },
    onFrozenClick: async (record) => {
      try {
        const res = await httpRequest.put(
          record.disable ? `/tenant/enable/${record.id}` : `/tenant/disable/${record.id}`,
        );
        if (res.code === 0) {
          message.success(`${record.disable ? '启用' : '冻结'}企业成功`);
        } else {
          message.error(res.msg);
        }
      } catch (e) {
        message.error(e.msg);
      } finally {
        refetch();
      }
    },
  });
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
