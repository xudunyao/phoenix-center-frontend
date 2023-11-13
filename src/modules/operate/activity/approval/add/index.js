import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Form, Button, Space, Row, Col, message, Table,
} from 'antd';
import moment from 'moment';
import numeral from 'numeral';
import { useQuery } from 'react-query';
import { globalStyles } from '@styles';
import { datetimeFormat, moneyFormat } from '@constants';
import { FormItem, inputType } from '@/components';
import { httpRequest } from '@/utils';

const { Content } = globalStyles;
const columns = [
  {
    title: '用户姓名',
    dataIndex: 'realName',
    key: 'realName',
  },
  {
    title: '用户手机号',
    dataIndex: 'mobile',
    key: 'mobile',
    width: 200,
  },
  {
    title: '1288.8应发金额',
    dataIndex: 'userAward',
    key: 'userAward',
    width: 150,
    render(text, record, index) {
      return numeral(record.userAward).format(moneyFormat.twoDecimal);
    },
  },
  {
    title: '用户状态',
    dataIndex: 'stage',
    key: 'stage',
  },
  {
    title: '状态变更时间',
    dataIndex: 'stageChangeTime',
    key: 'stageChangeTime',
    width: 280,
    render(text, record, index) {
      return record.stageChangeTime
        ? moment(record.stageChangeTime).format(datetimeFormat.dateTime)
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
    title: '邀请应发金额',
    dataIndex: 'recommendAward',
    key: 'recommendAward',
    render(text, record, index) {
      return numeral(record.recommendAward).format(moneyFormat.twoDecimal);
    },
  },
];
const generateFields = () => [
  {
    label: '备注',
    name: 'remark',
    type: inputType.inputTextArea,
    inputProps: {
      placeholder: '请输入备注',
    },
  },
];
const Add = () => {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { isError, error, data } = useQuery(['dispatchAwardList'], async () => {
    const res = await httpRequest.get('admin/award/audit/dispatchAwardList');
    if (res.code !== 0) {
      throw new Error(res.msg);
    }
    return res.data.map((item) => ({ ...item, key: item.dispatchId }));
  });
  if (isError) {
    message.error(error.msg);
  }
  const onSelectChange = (newSelectedRowKeys) => {
    setSelectedRowKeys(newSelectedRowKeys);
  };
  const handleSubmit = async () => {
    if (selectedRowKeys.length <= 0) {
      message.warn('未选择需要发放奖励的记录');
      return;
    }
    try {
      const res = await httpRequest.post('admin/award/audit', {
        remark: form.getFieldsValue().remark,
        dispatchAwardDetailListIds: selectedRowKeys,
      });
      if (res.code !== 0) {
        throw new Error(res.msg);
      }
      message.success('新增成功');
      navigate('/operate/activity/inviteNew');
    } catch (err) {
      message.error(err.message);
    }
  };
  const handleCancel = () => {
    navigate('/operate/activity/inviteNew');
  };
  const rowSelection = {
    selectedRowKeys,
    onChange: onSelectChange,
    selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT, Table.SELECTION_NONE],
  };
  const fields = generateFields();
  const validateMessages = {
    // eslint-disable-next-line no-template-curly-in-string
    required: "'${label}' 是必选字段",
  };
  return (
    <Content>
      <Row>（请手动勾选审批名单数据）</Row>
      <Table
        rowSelection={rowSelection}
        columns={columns}
        dataSource={data}
        scroll={{ y: 500, x: 1500 }}
        pagination={false}
        locale={{ selectionAll: '全选所有', selectInvert: '反选当页', selectNone: '清空所有' }}
      />
      <Form form={form} validateMessages={validateMessages} style={{ marginTop: '20px' }}>
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
              labelCol={{ span: 2 }}
              wrapperCol={{ span: 22 }}
            />
          </Col>
        ))}
        <Col span={24} style={{ height: '32px' }} offset={10}>
          <Space>
            <Button type="primary" onClick={handleCancel}>
              取消
            </Button>
            <Button type="primary" ghost onClick={handleSubmit}>
              确认
            </Button>
          </Space>
        </Col>
      </Form>
    </Content>
  );
};

export default Add;
