import React, { useState, useEffect } from 'react';
import moment from 'moment';
import {
  Card, Col, Row, message,
} from 'antd';
import { useQuery } from 'react-query';
import { globalStyles } from '@styles';
import { httpRequest } from '@utils';
import { Table } from '@/components';
import { datetimeFormat } from '@/constants';
import Search from './search';
import stringName from '../constants';

const { Content } = globalStyles;

const columns = [
  {
    title: '序号',
    dataIndex: 'number',
    key: 'number',
    render(_, record, index) {
      return `${index + 1}`;
    },
  },
  {
    title: '用户姓名',
    dataIndex: stringName.memberName,
    key: stringName.memberName,
  },
  {
    title: '用户手机',
    dataIndex: stringName.memberMobile,
    key: stringName.memberMobile,
  },
  {
    title: '邀请人',
    dataIndex: stringName.recommendName,
    key: stringName.recommendName,
  },
  {
    title: '邀请人手机',
    dataIndex: stringName.recommendMobile,
    key: stringName.recommendMobile,
  },
  {
    title: '被邀请人状态',
    dataIndex: stringName.currentStageDesc,
    key: stringName.currentStageDesc,
  },
  {
    title: '注册时间',
    dataIndex: stringName.registerTime,
    key: stringName.registerTime,
    render(_, record) {
      return record.registerTime && moment(Number(record.registerTime)).format(datetimeFormat.dateTime);
    },
  },
  {
    title: '报名时间',
    dataIndex: stringName.signUpTime,
    key: stringName.signUpTime,
    render(_, record) {
      return record.signUpTime && moment(Number(record.signUpTime)).format(datetimeFormat.dateTime);
    },
  },
  {
    title: '面试时间',
    dataIndex: stringName.interviewTime,
    key: stringName.interviewTime,
    render(_, record) {
      return record.interviewPassTime && moment(Number(record.interviewPassTime)).format(datetimeFormat.dateTime);
    },
  },
  {
    title: '通知面试时间',
    dataIndex: stringName.interviewPassTime,
    key: stringName.interviewPassTime,
    render(_, record) {
      return record.entryTime && moment(Number(record.entryTime)).format(datetimeFormat.dateTime);
    },
  },
  {
    title: '入职时间',
    dataIndex: stringName.entryTime,
    key: stringName.entryTime,
    render(_, record) {
      return record.interviewTime && moment(Number(record.interviewTime)).format(datetimeFormat.dateTime);
    },
  },
];

const getInformation = (data) => [
  {
    title: '邀请注册人数',
    data: data.total,
  },
  {
    title: '报名人数',
    data: data.signUpTotal,
  },
  {
    title: '面试人数',
    data: data.interviewTotal,
  },
  {
    title: '通过面试人数',
    data: data.interviewPassTotal,
  },
  {
    title: '成功入职人数',
    data: data.entrySuccessTotal,
  },
  {
    title: '当日被邀请人数',
    data: data.currentDayTotal,
  },
  {
    title: '本周被邀请人数',
    data: data.thisWeekTotal,
  },
];

const contentStyle = { border: '1px solid #c0c0c0', marginLeft: '23px', textAlign: 'center' };
const User = () => {
  const [searchCriteria, setSearchCriteria] = useState({ pageSize: 10 });
  const [informationData, setInformationData] = useState({});
  const information = getInformation(informationData);
  const fetchData = async () => {
    const res = await httpRequest.get('admin/invite/statistics');
    setInformationData(res.data);
  };
  const search = { ...searchCriteria };
  useEffect(() => {
    fetchData();
  }, []);
  const {
    isLoading, isError, error, data,
  } = useQuery(['invite', search], async () => {
    const { registerTime, ...rest } = search;
    const registerTimeStart = registerTime ? moment(registerTime[0]).startOf('day').format('x') : null;
    const registerTimeEnd = registerTime ? moment(registerTime[1]).endOf('day').format('x') : null;

    const res = await httpRequest.post('/admin/invite/inquiry', { ...rest, registerTimeStart, registerTimeEnd });
    if (res.code !== 0) {
      throw new Error(res.msg);
    }
    setSearchCriteria({ ...searchCriteria, total: res.data.total });
    return res.data.content;
  });
  if (isError) {
    message.error(error);
  }
  const handleSearch = (searchValue) => {
    setSearchCriteria({
      ...searchCriteria,
      ...searchValue,
      timestamp: new Date().getTime(),
    });
  };
  const exportHandle = async (val) => {
    const { registerTime, ...rest } = val;
    const params = {
      ...rest,
      registerStartTime: registerTime && moment(registerTime[0]).startOf('day').format('x'),
      registerEndTime: registerTime && moment(registerTime[1]).endOf('day').format('x'),
      timestamp: new Date().getTime(),
    };
    try {
      const res = await httpRequest.post('/admin/invite/export', params);
      if (res.code !== 0) {
        throw new Error(res.msg);
      }
      message.success('导出成功');
    } catch (err) {
      message.error(err.message || '导出失败');
    }
  };
  const handleTableChange = (params) => {
    setSearchCriteria({ ...searchCriteria, ...params, pageNumber: params.current - 1 });
  };
  return (
    <>
      <Row gutter={[16, 24]}>
        {
        information.map((f) => (
          <Col className="gutter-row" span={4}>
            <Content style={contentStyle}>
              <div style={{ color: '#c0c0c0' }}>{f.title}</div>
              <div style={{ lineHeight: '30px', fontSize: '30px' }}>{f.data}</div>
            </Content>
          </Col>
        ))
        }
      </Row>
      <Search onSubmit={handleSearch} exportHandle={exportHandle} />
      <Table
        dataSource={data}
        columns={columns}
        loading={isLoading}
        pagination={{
          ...searchCriteria,
          showSizeChanger: true,
        }}
        onChange={handleTableChange}
      />
    </>
  );
};

export default User;
