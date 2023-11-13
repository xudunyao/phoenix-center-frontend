import React, { useState } from 'react';
import moment from 'moment';
import {
  message, Table, Button, Popconfirm, Tag, Timeline, Drawer, Row, Col,
} from 'antd';
import { useQuery } from 'react-query';
import { httpRequest } from '@utils';
import { useNavigate } from 'react-router-dom';
import { datetimeFormat, verifyStatus, storageKeys } from '@constants';

const uniqueStatus = {
  INIT: '已提交',
  DIRECTOR_PASS: '通过',
  DIRECTOR_REJECT: '主管不通过',
  FINANCE_PASS: '通过',
  FINANCE_REJECT: '财务不通过',
};
const isTransferAuth = localStorage
  .getItem(storageKeys.permissions)
  .includes('ui-finance-transfer-review');
const isFinanceAuth = localStorage
  .getItem(storageKeys.permissions)
  .includes('ui-finance-transfer-financeReview');
const generateColumns = ({ onEditClick, onWithdrawClick, onStatusClick }) => [
  {
    title: '批次',
    dataIndex: 'batchNo',
    key: 'batchNo',
  },
  {
    title: '申请日期',
    dataIndex: 'applyTime',
    key: 'applyTime',
    render(text, record, index) {
      return record.applyTime && moment(record.applyTime).format(datetimeFormat.dateTime);
    },
  },
  {
    title: '申请理由',
    dataIndex: 'reason',
    key: 'reason',
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    render: (text, record, index) => (
      <Tag color={verifyStatus[record?.status]?.tag} onClick={() => onStatusClick(record)}>
        {verifyStatus[record?.status]?.text}
      </Tag>
    ),
  },
  {
    title: '操作',
    dataIndex: 'operation',
    key: 'operation',
    width: 200,
    fixed: 'right',
    render: (text, record, index) => (
      <>
        <Button type="link" onClick={() => onEditClick(record)}>
          {(() => {
            if (record.status === 'INIT' && isTransferAuth) {
              return '审核';
            }
            if (record.status === 'DIRECTOR_PASS' && isFinanceAuth) {
              return '审核';
            }
            return '详情';
          })()}
        </Button>
        {record.retract ? (
          <Popconfirm
            title="确定要撤回吗？"
            okText="确定"
            cancelText="再想想"
            onConfirm={() => onWithdrawClick(record)}
          >
            <Button type="link">撤回</Button>
          </Popconfirm>
        ) : null}
      </>
    ),
  },
];
const Review = () => {
  const [searchCriteria, setSearchCriteria] = useState({ pageSize: 10 });
  const [visible, setVisible] = useState(false);
  const [process, setProcess] = useState([]);
  const navigate = useNavigate();
  const search = { ...searchCriteria, total: 10 };
  const {
    isLoading, isError, error, data, refetch,
  } = useQuery(
    ['transferApply', search],
    async () => {
      const res = await httpRequest.post('/admin/transfer/transferApply/inquiry', search);
      if (res.code !== 0) {
        throw new Error(res.msg);
      }
      setSearchCriteria({ ...searchCriteria, total: res.data.total });
      return res.data?.content;
    },
  );
  if (isError) {
    message.error(error.message);
  }
  const columns = generateColumns({
    onEditClick: (record) => {
      navigate(`/finance/transfer/${record.batchNo}/details`);
    },
    onWithdrawClick: async (record) => {
      try {
        const res = await httpRequest.post(
          `/admin/transfer/transferApply/retract/${record.batchNo}`,
        );
        if (res.code !== 0) {
          throw new Error(res.msg);
        }
        message.success('撤回成功');
        refetch();
      } catch (err) {
        message.error(err.message || '撤回失败');
      }
    },
    onStatusClick: async (record) => {
      try {
        const res = await httpRequest.get(`/admin/transfer/transferNode/${record.batchNo}`);
        if (res.code !== 0) {
          throw new Error(res.msg);
        }
        setProcess(res.data);
        setVisible(true);
      } catch (err) {
        message.error(err.message || '流程获取失败');
      }
    },
  });
  const handleTableChange = (params) => {
    setSearchCriteria({ ...searchCriteria, ...params, pageNumber: params.current - 1 });
  };
  return (
    <>
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
      <Drawer
        title="审核流程"
        placement="left"
        closable={false}
        onClose={() => setVisible(false)}
        visible={visible}
      >
        <Timeline>
          {process.map((item, index) => (
            <Timeline.Item color={`${item.status ? 'green' : 'gray'}`}>
              <Row
                style={{
                  color: `${
                    ['DIRECTOR_REJECT', 'FINANCE_REJECT', undefined, null].includes(item.status)
                      ? 'gray'
                      : 'green'
                  }`,
                }}
              >
                <Col span={24}>{item.nodeName}</Col>
                <>
                  <Col span={24}>
                    操作人：
                    {item.username}
                  </Col>
                  <Col span={24}>
                    时间：
                    {item.dealTime ? moment(item.dealTime).format(datetimeFormat.dateTime) : null}
                  </Col>
                  {index !== 3 && (
                    <Col span={24}>
                      {index === 0 ? '申请理由：' : '审核意见：'}
                      {item.remark}
                    </Col>
                  )}
                  <Col span={24}>
                    状态：
                    {uniqueStatus[item?.status]}
                  </Col>
                </>
              </Row>
            </Timeline.Item>
          ))}
        </Timeline>
      </Drawer>
    </>
  );
};

export default Review;
