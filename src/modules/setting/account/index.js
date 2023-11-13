import React, { useState } from 'react';
import {
  Button, message, Popconfirm, Tag, Modal, Checkbox, Col, Row,
} from 'antd';
import { EditOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { useQuery } from 'react-query';
import moment from 'moment';
import { httpRequest } from '@utils';
import { globalStyles } from '@styles';
import { datetimeFormat } from '@constants';
import { Table } from '@/components';

import SettingAccountModel from '../components/settingAccountModel';

import Search from './search';

const { Content } = globalStyles;
const generateColumns = ({ onStatusChange, onEditClick, onAuthClick }) => [
  {
    title: '用户名',
    dataIndex: 'userName',
    key: 'userName',
  },
  {
    title: '手机号',
    dataIndex: 'phoneNum',
    key: 'phoneNum',
  },
  {
    title: '工号',
    dataIndex: 'jobNo',
    key: 'jobNo',
  },
  {
    title: '邮箱',
    dataIndex: 'email',
    key: 'email',
  },
  {
    title: '状态',
    dataIndex: 'disable',
    key: 'disable',
    render: (text, record, index) => (
      <Tag color={text ? 'error' : 'green'}>{text ? '禁用' : '启用'}</Tag>
    ),
  },
  {
    title: '创建时间',
    dataIndex: 'createdDate',
    key: 'createdDate',
    render: (text, record, index) => (record.createdDate ? moment(record.createdDate).format(datetimeFormat.date) : null),
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    fixed: 'right',
    width: 250,
    render: (text, record, index) => (
      <>
        <Button type="link" icon={<EditOutlined />} onClick={() => onEditClick(record)}>
          编辑
        </Button>
        <Button type="link" onClick={() => onAuthClick(record)}>
          权限
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
  const [searchCriteria, setSearchCriteria] = useState({ pageSize: 10 });
  const [currentUserId, setCurrentUserId] = useState();
  const [list, setList] = useState([]);
  const [role, setRole] = useState([]);
  const [visible, setVisible] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const search = { ...searchCriteria, total: 0 };

  const {
    isLoading, isError, error, data, refetch,
  } = useQuery(
    ['reissueDailySalary', search],
    async () => {
      const res = await httpRequest.post('/admin/userInfo/inquiry', search);
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
        const res = await httpRequest.post(
          record.disable
            ? `/admin/userInfo/enable/${record.userId}`
            : `/admin/userInfo/disable/${record.userId}`,
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
    onEditClick: (row) => {
      setCurrentUserId(row?.userId);
      setVisible(true);
    },
    onAuthClick: async (row) => {
      setIsModalVisible(true);
      setCurrentUserId(row?.userId);
      try {
        const [roleList, userInfo] = await Promise.all([
          httpRequest.get('/role/list'),
          httpRequest.get(`/admin/userInfo/role/${row?.userId}`),
        ]);
        setList(
          roleList.data.map((item) => ({
            label: item.roleName,
            value: item.roleId,
          })),
        );
        setRole(userInfo.data.map((item) => item.roleId));
      } catch (err) {
        message.error(err?.message || '获取权限失败');
      }
    },
  });
  const handleSearch = (searchval) => {
    const { registerDate, ...rest } = searchval;
    setSearchCriteria({
      ...searchCriteria,
      ...rest,
      registerStartTime: registerDate && moment(registerDate[0]).startOf('day').format('x'),
      registerEndTime: registerDate && moment(registerDate[1]).endOf('day').format('x'),
      timestamp: new Date().getTime(),
    });
  };
  const handleTableChange = (params) => {
    setSearchCriteria({ ...searchCriteria, ...params, pageNumber: params.current - 1 });
  };
  const handleCloseModel = (refresh) => {
    setCurrentUserId(null);
    setVisible(false);
    if (refresh) {
      refetch();
    }
  };
  const openAccountModel = () => {
    setVisible(true);
    setCurrentUserId(null);
  };
  const handleOk = async () => {
    try {
      const res = await httpRequest.put(`/admin/userInfo/role/${currentUserId}`, {
        roles: role,
      });
      if (res?.code !== 0) {
        throw new Error(res.msg);
      }
      message.success('关联角色成功');
    } catch (err) {
      message.error(err?.message || '关联角色失败');
    }
    setIsModalVisible(false);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
  };
  const onChange = (value) => {
    setRole([...value]);
  };
  return (
    <>
      <Search onSubmit={handleSearch} openAccountModel={openAccountModel} />
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
      <SettingAccountModel
        visible={visible}
        id={currentUserId}
        onClose={handleCloseModel}
        title={currentUserId ? '编辑用户' : '添加用户'}
      />
      <Modal
        title="权限配置"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="确认"
        cancelText="取消"
      >
        <Checkbox.Group style={{ width: '100%' }} value={role} onChange={onChange}>
          <Row>
            {list.map((item) => (
              <Col span={6} key={item.value}>
                <Checkbox value={item.value}>{item.label}</Checkbox>
              </Col>
            ))}
          </Row>
        </Checkbox.Group>
      </Modal>
    </>
  );
};

export default Review;
