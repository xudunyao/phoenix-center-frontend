import React, { useState } from 'react';
import {
  message, Button, Popconfirm, Modal,
} from 'antd';
import { EditOutlined, StopOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useQuery } from 'react-query';
import numeral from 'numeral';
import moment from 'moment';
import { httpRequest } from '@utils';
import { globalStyles } from '@styles';
import { moneyFormat, datetimeFormat } from '@constants';
import { Table } from '@/components';
import Search from './search';

const { Content } = globalStyles;
const generateColumns = ({ onEditClick, onFrozenClick }) => [
  {
    title: '手机号',
    dataIndex: 'mobile',
    key: 'mobile',
  },
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '身份证',
    dataIndex: 'idCard',
    key: 'idCard',
  },
  {
    title: '余额(元)',
    dataIndex: 'balance',
    key: 'balance',
    render(text, record, index) {
      return numeral(record.balance).format(moneyFormat.twoDecimal);
    },
  },
  {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
    width: 300,
    fixed: 'right',
    render: (text, record, index) => (
      <>
        <Button type="link" icon={<EditOutlined />} onClick={() => onEditClick(record)}>
          交易记录
        </Button>
        <Popconfirm
          title={`确定要${record.disable ? '启用' : '冻结'}该账号吗？`}
          okText="确定"
          cancelText="再想想"
          onConfirm={() => onFrozenClick(record)}
        >
          <Button
            type="link"
            icon={record.disable ? <CheckCircleOutlined /> : <StopOutlined />}
            danger={!record.disable}
          >
            {record.disable ? '启用' : '冻结'}
          </Button>
        </Popconfirm>
      </>
    ),
  },
];
const dealColumns = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    render(text, record, index) {
      return index + 1;
    },
  },
  {
    title: '交易类型',
    dataIndex: 'tradeType',
    key: 'tradeType',
  },
  {
    title: '调整金额',
    dataIndex: 'changeAmount',
    key: 'changeAmount',
  },
  {
    title: '交易时间',
    dataIndex: 'serialTime',
    key: 'serialTime',
    render(text, record, index) {
      return record.serialTime && moment(Number(record.serialTime)).format(datetimeFormat.dateTime);
    },
  },
  {
    title: '账单类型',
    dataIndex: 'billType',
    key: 'billType',
  },
];
const Review = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchCriteria, setSearchCriteria] = useState({ pageSize: 10 });
  const [searchCriteriaModal, setSearchCriteriaModal] = useState({ pageSize: 10 });
  const [dealRecord, setDealRecord] = useState([]);
  const [dealLoading, setDealLoading] = useState(false);
  const search = { ...searchCriteria, total: 10 };
  const searchModal = { ...searchCriteriaModal, total: 10 };
  const {
    isLoading, isError, error, data, refetch,
  } = useQuery(['balance', search], async () => {
    const res = await httpRequest.post('/admin/wallet/balance/inquiry', search);
    if (res.code !== 0) {
      throw new Error(res.msg);
    }
    setSearchCriteria({ ...searchCriteria, total: res.data.total });
    return res.data?.content;
  });
  if (isError) {
    message.error(error.message);
  }

  const modalTable = useQuery(['modalTable', searchModal], async () => {
    const res = await httpRequest.post('/admin/wallet/member/transaction/inquiry', searchModal);
    if (res.code !== 0) {
      throw new Error(res.msg);
    }
    setSearchCriteriaModal({ ...searchCriteriaModal, total: res.data.total });
    setDealRecord(res.data?.content);
    return res.data?.content;
  });

  const columns = generateColumns({
    onEditClick: (record) => {
      setDealLoading(true);
      setSearchCriteriaModal({ ...searchCriteriaModal, memberId: record.memberId });
      setIsModalVisible(true);
      setDealLoading(false);
    },
    onFrozenClick: async (record) => {
      try {
        const res = await httpRequest.post(
          record.disable
            ? `/admin/wallet/enable/${record.walletId}`
            : `/admin/wallet/disable/${record.walletId}`,
        );
        if (res.code === 0) {
          message.success(`${record.disable ? '启用' : '冻结'}该用户钱包成功`);
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
  const handleModalTableChange = (params) => {
    setSearchCriteriaModal({ ...searchCriteriaModal, ...params, pageNumber: params.current - 1 });
  };
  const exportHandle = async (searchValue) => {
    const params = {
      ...searchValue,
      timestamp: new Date().getTime(),
    };
    try {
      const res = await httpRequest.post('/admin/wallet/balance/export', params);
      if (res.code !== 0) {
        throw new Error(res.msg);
      }
      message.success('导出成功');
    } catch (err) {
      message.error(err.message || '导出失败');
    }
  };
  const handleOk = () => {
    setIsModalVisible(false);
  };
  const handleCancel = () => {
    setIsModalVisible(false);
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
          onChange={handleTableChange}
        />
      </Content>
      <Modal
        title="交易记录"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        width="800px"
        bodyStyle={{ padding: '0 100px', height: '530px' }}
        okText="确认"
        cancelText="取消"
      >
        <Table
          loading={dealLoading}
          columns={dealColumns}
          dataSource={dealRecord}
          pagination={{
            ...searchCriteriaModal,
            showSizeChanger: true,
          }}
          onChange={handleModalTableChange}
          scroll={{
            y: 420,
          }}
        />
      </Modal>
    </>
  );
};

export default Review;
