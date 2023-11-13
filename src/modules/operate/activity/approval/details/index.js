import React, { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { httpRequest } from '@utils';
import {
  Card, Row, Col, Space, message, Table, Button,
} from 'antd';
import moment from 'moment';
import { useQuery } from 'react-query';
import { datetimeFormat, approvalStatus } from '@constants';
import { globalStyles } from '@styles';

const { Content } = globalStyles;

const columns = [
  {
    title: '序号',
    dataIndex: 'index',
    key: 'index',
    width: 30,
    render: (text, record, index) => index + 1,
  },
  {
    title: '用户姓名',
    dataIndex: 'realName',
    key: 'realName',
  },
  {
    title: '用户手机号',
    dataIndex: 'mobile',
    key: 'mobile',
  },
  {
    title: '用户礼包奖励',
    dataIndex: 'userAward',
    key: 'userAward',
  },
  {
    title: '节点',
    dataIndex: 'stage',
    key: 'stage',
  },
  {
    title: '状态变更时间',
    dataIndex: 'stageChangeTime',
    key: 'stageChangeTime',
    width: 300,
    render(text, record, index) {
      return record.stageChangeTime
        ? moment(record.stageChangeTime).format(datetimeFormat.date)
        : null;
    },
  },
  {
    title: '邀请人',
    dataIndex: 'recommendName',
    key: 'recommendName',
  },
  {
    title: '邀请人手机号',
    dataIndex: 'recommendMobile',
    key: 'recommendMobile',
  },
  {
    title: '邀请人奖励',
    dataIndex: 'recommendAward',
    key: 'recommendAward',
  },
];
const ServiceDetails = () => {
  const [baseInfo, setBaseInfo] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const timer = useRef(null);
  const [link, setLink] = useState('');
  const { id } = useParams();
  const {
    isLoading, isError, error, data, refetch,
  } = useQuery(
    ['orderAll'],
    async () => {
      const res = await httpRequest.get(`/admin/award/audit/detail/${id}`);
      if (res.code !== 0) {
        throw new Error(res.msg);
      }
      setBaseInfo(res.data);
      return res.data.list;
    },
  );
  if (isError) {
    message.error(error.message);
  }
  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await httpRequest.put(`/admin/award/audit/commit/${id}`);
      if (res.code !== 0) {
        throw new Error(res.msg);
      }
      message.success('提交成功');
      refetch();
    } catch (err) {
      message.error(err.message);
    } finally {
      setLoading(false);
    }
  };
  const handleDelete = async () => {
    try {
      const res = await httpRequest.put(`/admin/award/audit/cancel/${id}`);
      if (res.code !== 0) {
        throw new Error(res.msg);
      }
      message.success('删除成功');
    } catch (err) {
      message.error(err.message);
    } finally {
      navigate('/operate/activity/inviteNew');
    }
  };
  const exportTask = async () => {
    try {
      const res = await httpRequest.post(`/admin/award/audit/export/${id}`);
      if (res.code !== 0) {
        throw new Error(res.msg);
      }
      setLink(res.data);
      if (res.data) {
        clearTimeout(timer.current);
        const a = document.createElement('a');
        a.setAttribute('href', res.data);
        a.setAttribute('download', '文件名');
        a.click();
      }
    } catch (err) {
      console.log({ err });
    }
  };
  const handleExport = async () => {
    if (!link) {
      message.info('正在导出中!');
      if (timer.current) return;
      timer.current = setTimeout(() => {
        exportTask();
      }, 500);
    } else {
      const a = document.createElement('a');
      a.setAttribute('href', link);
      a.setAttribute('download', '文件名');
      a.click();
    }
  };
  return (
    <Content>
      <Card style={{ width: '100%', marginBottom: '20px' }}>
        <Row gutter={[20, 10]}>
          <Col span={24}>基本信息</Col>
          <Col span={6}>
            批次：
            {baseInfo.batchNo}
          </Col>
          <Col span={6}>
            申请时间：
            {baseInfo.applyTime
              ? moment(baseInfo.applyTime).format(datetimeFormat.dateTime)
              : null}
          </Col>
          <Col span={6}>
            申请人:
            {baseInfo.applyUser}
          </Col>
          <Col span={6} />
          <Col span={6}>
            1288.8大礼包总金额：
            {baseInfo.activityAward}
          </Col>
          <Col span={6}>
            邀请好友总金额：
            {baseInfo.recommendAward}
          </Col>
          <Col span={6}>
            汇总金额：
            {baseInfo.amountAward}
          </Col>
          <Col span={6}>
            状态：
            {approvalStatus[baseInfo.status]}
          </Col>
          <Col span={6}>
            备注：
            {baseInfo.remark}
          </Col>
          <Col span={6}>
            <Button type="primary" onClick={handleExport}>
              导出报表
            </Button>
          </Col>
          <Col span={6} />
          <Col span={6}>
            <Space>
              {baseInfo.status === 'PENDING' && (
                <>
                  <Button type="primary" onClick={handleSubmit} loading={loading}>
                    提交
                  </Button>
                  <Button type="primary" onClick={handleDelete}>
                    删除
                  </Button>
                </>
              )}
            </Space>
          </Col>
        </Row>
      </Card>
      <Table
        loading={isLoading}
        columns={columns}
        dataSource={data}
        pagination={false}
        scroll={{ y: 500, x: 1500 }}
      />
    </Content>
  );
};

export default ServiceDetails;
