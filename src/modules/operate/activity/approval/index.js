import React, { useState } from 'react';
import { Button, message } from 'antd';
import moment from 'moment';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import { httpRequest } from '@utils';
import { globalStyles } from '@styles';
import { datetimeFormat, approvalStatus } from '@constants';
import { Table } from '@/components';
import Search from './search';

const { Content } = globalStyles;
const generateColumns = ({ onStatusChange, onEditClick }) => [
  {
    title: '批次号',
    dataIndex: 'batchNo',
    key: 'batchNo',
  },
  {
    title: '申请时间',
    dataIndex: 'applyTime',
    key: 'applyTime',
    render(text, record, index) {
      return record.applyTime ? moment(record.applyTime).format(datetimeFormat.date) : null;
    },
  },
  {
    title: '1288.8大礼包总金额',
    dataIndex: 'activityAward',
    key: 'activityAward',
  },
  {
    title: '邀请好友总金额',
    dataIndex: 'recommendAward',
    key: 'recommendAward',
  },
  {
    title: '申请人',
    dataIndex: 'applyUser',
    key: 'applyUser',
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render(text, record, index) {
      return approvalStatus[record.status];
    },
  },
  {
    title: '审核时间',
    dataIndex: 'approvalTime',
    key: 'approvalTime',
    render(text, record, index) {
      return record.approvalTime ? moment(record.approvalTime).format(datetimeFormat.date) : null;
    },
  },
  {
    title: '操作',
    dataIndex: 'action',
    key: 'action',
    fixed: 'right',
    width: 50,
    render: (text, record, index) => (
      <Button type="link" onClick={() => onEditClick(record)}>
        详情
      </Button>
    ),
  },
];

const Review = () => {
  const navigate = useNavigate();
  const [searchCriteria, setSearchCriteria] = useState({ pageSize: 10 });
  const search = { ...searchCriteria, total: 15 };
  const {
    isLoading, isError, error, data, refetch,
  } = useQuery(['role', search], async () => {
    const res = await httpRequest.post('/admin/award/audit/inquiry', search);
    if (res.code === 0) {
      setSearchCriteria({ ...searchCriteria, total: res.data.total });
      return res.data.content;
    }
    throw new Error(res.msg);
  });
  if (isError) {
    message.error(error.message);
  }
  const columns = generateColumns({
    onEditClick: (record) => {
      navigate(`/operate/activity/inviteNew/${record.batchNo}`);
    },
  });
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
  const handleAdd = () => {
    navigate('/operate/activity/inviteNew/add');
  };
  return (
    <>
      <Search onSubmit={handleSearch} onClick={handleAdd} />
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
    </>
  );
};

export default Review;
