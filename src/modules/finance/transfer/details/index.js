import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import moment from 'moment';
import {
  message, Space, Button, Form, Row, Col, Drawer, Tag, Card,
} from 'antd';
import { useQuery } from 'react-query';
import { httpRequest } from '@utils';
import { globalStyles } from '@styles';
import { datetimeFormat, storageKeys, verifyStatus } from '@constants';
import { Table, inputType, FormItem } from '@/components';

const { Content } = globalStyles;
const sendStatus = {
  BUSINESS: 'DIRECTOR_PASS',
  BUSINESS_DIRECTOR: 'FINANCE_PASS',
  FINANCE: '',
};
const generateColumns = () => [
  {
    title: '申请日期',
    dataIndex: 'applyTime',
    key: 'applyTime',
    render(_, record) {
      return record.applyTime && moment(Number(record.applyTime)).format(datetimeFormat.dateTime);
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
      <Tag color={verifyStatus[record?.status]?.tag}>{verifyStatus[record?.status]?.text}</Tag>
    ),
  },
];
const generateFields = (isAble = true) => [
  {
    label: '审核意见',
    name: 'remark',
    type: inputType.inputTextArea,
    inputProps: {
      disabled: !isAble,
      placeholder: '请输入审核意见',
    },
  },
];
const isTransferAuth = localStorage
  .getItem(storageKeys.permissions)
  .includes('ui-finance-transfer-review');
const isFinanceAuth = localStorage
  .getItem(storageKeys.permissions)
  .includes('ui-finance-transfer-financeReview');
const validateMessages = {
  // eslint-disable-next-line no-template-curly-in-string
  required: '${label}不能为空！',
};
const Review = () => {
  const [visible, setVisible] = useState(false);
  const [batch, setBatch] = useState(0);
  const [status, setStatus] = useState(false);
  const [detailData, setDetailData] = useState({});
  const [fileList, setFileList] = useState([]);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const showDrawer = () => {
    setVisible(true);
  };
  const onClose = () => {
    setVisible(false);
  };
  const fetchFileList = async (fileVOS) => {
    try {
      const res = await Promise.all(
        fileVOS.map((item) => httpRequest.get('/file/fetchUrl', {
          params: {
            fileKey: item.fileKey,
          },
        })),
      );
      if (res.some((item) => item.code !== 0)) {
        throw new Error(res.find((item) => item.code !== 0).msg);
      }
      return res.map((item, index) => ({
        name: fileVOS[index].fileName,
        url: item.data,
      }));
    } catch (err) {
      console.log({ err });
    }
    return '';
  };
  const {
    isLoading, isError, error, data,
  } = useQuery(['transferDetail', id], async () => {
    const res = await httpRequest.post(`/admin/transfer/transferDetail/inquiry/${id}`);
    if (res.code !== 0) {
      throw new Error(res.msg);
    }
    const fileUrls = await fetchFileList(res.data.fileVOS);
    setFileList(fileUrls);
    form.setFieldsValue({ remark: res.data.transferNodeInfoVOS[2]?.remark });
    setBatch(() => res.data.batchNo);
    setStatus(() => {
      if (res.data?.status === 'INIT' && isTransferAuth) {
        return true;
      } if (res.data?.status === 'DIRECTOR_PASS' && isFinanceAuth) {
        return true;
      }
      return false;
    });
    setDetailData({
      ...res.data,
      ...res.data.transferNodeInfoVOS,
    });
    return res.data?.list;
  });
  if (isError) {
    message.error(error.message);
  }
  const columns = generateColumns();
  const fields = generateFields(status);
  const handleSubmit = async (value) => {
    try {
      const res = await httpRequest.post('/admin/transfer/transferApply/check', {
        batchNo: detailData.batchNo,
        remark: form.getFieldValue('remark'),
        status: value,
      });
      if (res.code !== 0) {
        throw new Error(res.msg);
      }
      message.success('操作成功');
      navigate('/finance/transfer');
    } catch (err) {
      message.error(err.message);
    }
  };
  return (
    <Content>
      <Space style={{ fontSize: '16px', fontWeight: 'bold' }}>
        <span>
          批次：
          {batch}
        </span>
        <Button onClick={showDrawer} type="primary" size="small" shape="round">
          批次信息
        </Button>
      </Space>
      <Table
        loading={isLoading}
        columns={columns}
        dataSource={data}
        pagination={false}
        scroll={{ y: 500 }}
        style={{ marginTop: '20px', marginBottom: '20px' }}
      />
      <Form form={form} validateMessages={validateMessages}>
        <Row>
          <Col span={24} style={{ height: '32px' }}>
            申请理由：
            {detailData[0]?.remark}
          </Col>
          {detailData[1] && (
            <Col span={24} style={{ height: '32px' }}>
              主管审核：
              {detailData[1]?.remark}
            </Col>
          )}
          {fields.map((f) => (
            <Col span={24}>
              <FormItem
                name={f.name}
                label={f.label}
                type={f.type}
                rules={f.rules}
                inputProps={f.inputProps}
                showAllOption={f.showAllOption}
                labelAlign="left"
                wrapperCol={{ span: 8 }}
              />
            </Col>
          ))}
          <Row>
            <>
              <Col>申请附件：</Col>
              <Col>
                {fileList.map((item) => (
                  <Col span={24}>
                    <Button type="link" href={item.url} style={{ padding: '0px' }}>
                      {item.name}
                    </Button>
                  </Col>
                ))}
              </Col>
            </>
          </Row>
          <Col span={24} style={{ height: '32px' }} offset={10}>
            <Space>
              <Button
                type="primary"
                onClick={() => {
                  navigate('/finance/transfer');
                }}
              >
                取消
              </Button>
              {status && (
                <>
                  <Button
                    type="primary"
                    ghost
                    onClick={() => {
                      handleSubmit(detailData.currentNode === 'BUSINESS' ? 'DIRECTOR_REJECT' : 'FINANCE_REJECT');
                    }}
                  >
                    拒绝
                  </Button>
                  <Button
                    type="primary"
                    ghost
                    onClick={() => {
                      handleSubmit(sendStatus[detailData.currentNode]);
                    }}
                  >
                    同意
                  </Button>
                </>
              )}
            </Space>
          </Col>
        </Row>
      </Form>
      <Drawer
        title="批次详细信息"
        placement="right"
        onClose={onClose}
        visible={visible}
        closable={false}
      >
        {detailData.transferNodeInfoVOS?.map((item, index) => (
          <Card
            title={['申请信息', '主管审核', '财务审核'][index]}
            bordered={false}
            style={{ width: '100%' }}
          >
            <Row gutter={[10, 8]}>
              <Col span={24}>
                姓名：
                {item?.userName}
              </Col>
              <Col span={24}>
                理由:
                {item?.remark}
              </Col>
              <Col span={24}>
                时间：
                {moment(item?.dealTime).format(datetimeFormat.dateTime)}
              </Col>
            </Row>
          </Card>
        ))}
      </Drawer>
    </Content>
  );
};

export default Review;
