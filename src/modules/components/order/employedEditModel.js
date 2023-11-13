/* eslint-disable consistent-return */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Modal, Form, Spin,
} from 'antd';
import { FormItem, inputType } from '@/components';
import { datetimeFormat } from '@/constants';

const generateFields = () => [
  {
    key: 'dailyEndDate',
    name: 'dailyEndDate',
    label: '离职日期',
    type: inputType.datePicker,
    inputProps: {
      placeholder: '请选择离职日期',
      format: datetimeFormat.date,
    },
    rules: [{ required: true }],
  },
  {
    key: 'status',
    name: 'status',
    label: '离职类型',
    type: inputType.select,
    showAllOption: false,
    inputProps: {
      placeholder: '请选择在离职状态',
      options: [{
        label: '未面试',
        value: 'notInterView',
      }, {
        label: '待入职',
        value: 'notEmploayed',
      }],
    },
    rules: [{ required: true }],
  }, {
    key: 'tags',
    name: 'tags',
    label: '离职标签',
    type: inputType.checkboxGroup,
    inputProps: {
      options: [{
        label: '辞职',
        value: 'value1',
      }, {
        label: '自离',
        value: 'value2',
      }, {
        label: '被工厂开除',
        value: 'value3',
      }, {
        label: '放弃入职',
        value: 'value4',
      }],
    },
  }, {
    key: 'reason',
    name: 'reason',
    label: '原因',
    type: inputType.inputTextArea,
    inputProps: {
      placeholder: '请填写离职原因',
    },
  },
];

const fields = generateFields();
const validateMessages = {
  // eslint-disable-next-line no-template-curly-in-string
  required: '${label}不能为空！',
};

const DetailFormModal = ({
  id, visible, onClose, title,
}) => {
  const [submitting, setSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();

  const handleFinish = (val) => {
    // TODO
  };
  return (
    <Modal
      title={title}
      visible={visible}
      width={500}
      onCancel={onClose(true)}
      onOk={() => form.submit()}
      confirmLoading={submitting}
    >
      <Spin spinning={isLoading}>
        <Form
          labelCol={{ span: 6 }}
          form={form}
          onFinish={handleFinish}
          validateMessages={validateMessages}
        >
          {
            fields.map((f) => (
              <FormItem
                name={f.name}
                label={f.label}
                type={f.type}
                inputProps={f.inputProps}
                rules={f.rules}
                labelAlign="right"
                showAllOption={f.showAllOption}
              />
            ))
          }
        </Form>
      </Spin>
    </Modal>
  );
};

DetailFormModal.propTypes = {
  id: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};

export default DetailFormModal;
