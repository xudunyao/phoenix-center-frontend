import React, { useState } from 'react';
import moment from 'moment';
import numeral from 'numeral';
import {
  message, Table, Tag, Timeline, Drawer, Row, Col,
} from 'antd';
import { useQuery } from 'react-query';
import { httpRequest } from '@utils';
import { datetimeFormat, moneyFormat, verifyStatus } from '@constants';
import Search from './search';

const uniqueStatus = {
  INIT: '已提交',
  DIRECTOR_PASS: '通过',
  DIRECTOR_REJECT: '主管不通过',
  FINANCE_PASS: '通过',
  FINANCE_REJECT: '财务不通过',
};
const generateColumns = ({ onStatusClick }) => [
  {
    title: '转账日期',
    dataIndex: 'sendTime',
    key: 'sendTime',
    render(text, record, index) {
      return record.sendTime && moment(Number(record.sendTime)).format(datetimeFormat.dateTime);
    },
  },
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '手机号',
    dataIndex: 'mobile',
    key: 'mobile',
  },
  {
    title: '身份证',
    dataIndex: 'idCard',
    key: 'idCard',
  },
  {
    title: '转账金额(元)',
    dataIndex: 'amount',
    key: 'amount',
    render(text, record, index) {
      return record.amount && numeral(record.amount).format(moneyFormat.twoDecimal);
    },
  },
  {
    title: '备注',
    dataIndex: 'remark',
    key: 'remark',
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
];
const Review = () => {
  const [searchCriteria, setSearchCriteria] = useState({ pageSize: 10 });
  const search = { ...searchCriteria, total: 10 };
  const [visible, setVisible] = useState(false);
  const [process, setProcess] = useState([]);
  const {
    isLoading, isError, error, data,
  } = useQuery(['transferRecord', search], async () => {
    const res = await httpRequest.post('/admin/transfer/transferRecord/inquiry', search);
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
  const handleSearch = (searchValue) => {
    const { time, ...rest } = searchValue;
    setSearchCriteria({
      ...searchCriteria,
      ...rest,
      sendTimeStart: time && moment(time[0]).startOf('day').format('x'),
      sendTimeEnd: time && moment(time[1]).endOf('day').format('x'),
      timestamp: new Date().getTime(),
    });
  };
  const handleTableChange = (params) => {
    setSearchCriteria({ ...searchCriteria, ...params, pageNumber: params.current - 1 });
  };
  return (
    <>
      <Search onSubmit={handleSearch} />
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
