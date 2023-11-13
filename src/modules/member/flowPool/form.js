import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Modal, Form, Row, Col,
} from 'antd';
import { options as optionHooks } from '@/hooks';
import { inputType, FormItem } from '@/components';
import { genderOptions, pattern } from '@/constants';

const generateFields = ({ sourceChannel }) => [
  {
    label: '手机号',
    name: 'mobile',
    type: inputType.input,
    rules: [{ required: true, message: '请输入正确的手机号码', pattern: pattern.mobile }],
    inputProps: {
      placeholder: '请输入手机号',
    },
  },
  {
    label: '昵称',
    name: 'channelNickname',
    type: inputType.input,
    inputProps: {
      placeholder: '请输入昵称',
    },
  },
  {
    label: '渠道来源',
    name: 'sourceChannelCode',
    type: inputType.select,
    rules: [{ required: true }],
    showAllOption: false,
    inputProps: {
      placeholder: '请选择渠道来源',
      options: sourceChannel,
    },
  },
  {
    label: '姓名',
    name: 'realName',
    type: inputType.input,
    inputProps: {
      placeholder: '请输入姓名',
    },
  },
  {
    label: '性别',
    name: 'sex',
    type: inputType.radioGroup,
    inputProps: {
      placeholder: '请选择性别',
      options: genderOptions,
    },
  },
  {
    label: '年龄',
    name: 'age',
    type: inputType.input,
    inputProps: {
      placeholder: '请输入年龄',
    },
  },
  {
    label: '渠道ID',
    name: 'channelID',
    type: inputType.input,
    inputProps: {
      placeholder: '请输入渠道id',
    },
  },
  {
    label: '线索来源',
    name: 'clueFrom',
    type: inputType.input,
    inputProps: {
      placeholder: '请输入线索来源',
    },
  },
  {
    label: '线索日期',
    name: 'clueDate',
    type: inputType.datePicker,
    inputProps: {
      placeholder: '请选择线索日期',
      format: 'YYYY-MM-DD',
    },
  },
  {
    label: '地区',
    name: 'location',
    type: inputType.input,
    inputProps: {
      placeholder: '请输入地区',
    },
  },
];
const validateMessages = {
  // eslint-disable-next-line no-template-curly-in-string
  required: '${label}不能为空！',
};
const MyForm = ({ visible, handleOk, onCancel }) => {
  const [form] = Form.useForm();
  const { sourceChannel } = optionHooks.useSourceChannel();
  const fields = generateFields({ sourceChannel });
  const handleSubmit = () => {
    form.submit();
  };
  return (
    <Modal
      title={<div style={{ textAlign: 'center' }}>新增线索</div>}
      visible={visible}
      onOk={() => {
        handleOk(form);
      }}
      closable={false}
      cancelText="取消"
      okText="确定"
      centered
      bodyStyle={{
        height: '100%',
        textAlign: 'center',
      }}
      onCancel={() => {
        onCancel(form);
      }}
    >
      <Form form={form} validateMessages={validateMessages} onFinish={handleSubmit}>
        <Row>
          {fields.map((f) => (
            <Col span={12}>
              <FormItem
                name={f.name}
                label={f.label}
                type={f.type}
                rules={f.rules}
                inputProps={f.inputProps}
                showAllOption={f.showAllOption}
                labelAlign="right"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
              />
            </Col>
          ))}
        </Row>
      </Form>
    </Modal>
  );
};
MyForm.propTypes = {
  visible: PropTypes.bool,
  handleOk: PropTypes.func,
  onCancel: PropTypes.func,
};
MyForm.defaultProps = {
  visible: false,
  handleOk: () => {},
  onCancel: () => {},
};

export default MyForm;
