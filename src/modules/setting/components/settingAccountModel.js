import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-query';
import md5 from 'js-md5';
import PropTypes from 'prop-types';
import {
  Modal, Form, Spin, message,
} from 'antd';
import { FormItem, inputType } from '@/components';
import { httpRequest } from '@/utils';

const generateFields = (id) => [
  {
    key: 'userName',
    name: 'userName',
    label: '用户名',
    type: inputType.input,
    inputProps: {
      placeholder: '请填写用户名',
    },
    rules: [{ required: true }],
  },
  {
    key: 'password',
    name: 'password',
    label: '密码',
    type: inputType.input,
    inputProps: {
      placeholder: '请填写密码',
    },
    rules: !id ? [{ required: true }] : null,
  }, {
    key: 'phoneNum',
    name: 'phoneNum',
    label: '手机号',
    type: inputType.input,
    inputProps: {
      placeholder: '请填写手机号',
    },
    rules: [{ required: true }],
  }, {
    key: 'email',
    name: 'email',
    label: '邮箱',
    type: inputType.input,
    inputProps: {
      placeholder: '请填写邮箱',
    },
  }, {
    key: 'jobNo',
    name: 'jobNo',
    label: '工号',
    type: inputType.input,
    inputProps: {
      placeholder: '请填写工号',
    },
  },
];

const validateMessages = {
  // eslint-disable-next-line no-template-curly-in-string
  required: '${label}不能为空！',
};

const SettingAccountModel = ({
  id, visible, onClose, title,
}) => {
  const [submitting, setSubmitting] = useState(false);
  const [form] = Form.useForm();
  const fields = generateFields(id);
  const getData = async (userId) => {
    const res = await httpRequest.get(`/admin/userInfo/detail/${userId}`);
    if (res?.code === 0) {
      form.setFieldsValue({
        ...res.data,
      });
      return res.data;
    }
    throw new Error(res.msg);
  };

  const { isLoading, error } = useQuery(['account-details', id, visible], () => visible && id && getData(id));

  useEffect(() => {
    if (error) {
      message.error(error?.message || '获取信息失败');
      onClose();
    }
  }, [error]);

  useEffect(() => {
    form.resetFields();
  }, [visible]);
  const handleFinish = async (val) => {
    const { password, ...rest } = val;
    try {
      setSubmitting(true);
      const payload = {
        password: md5(`${password}erGDxe8L`),
        ...rest,
      };
      const res = await httpRequest.post(id ? `/admin/userInfo/edit/${id}` : '/admin/userInfo/add', payload);
      if (res?.code === 0) {
        onClose(true);
      } else {
        throw new Error(res.msg);
      }
    } catch (err) {
      message.error(err?.message || '提交失败');
    } finally {
      setSubmitting(false);
    }
  };
  return (
    <Modal
      title={title}
      visible={visible}
      width={500}
      onCancel={onClose}
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

SettingAccountModel.propTypes = {
  id: PropTypes.string.isRequired,
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};
export default SettingAccountModel;
