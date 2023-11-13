import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import md5 from 'js-md5';
import {
  Avatar, Space, Dropdown, Menu, Modal, message, Form,
} from 'antd';
import {
  UserOutlined, InsuranceOutlined, LockOutlined, PhoneOutlined,
} from '@ant-design/icons';
import { httpRequest } from '@/utils';
import VerifyCode from '@/modules/components/verifyCode';
import FormItem, { inputType } from '../formItem';
import { HeaderContainer, MyForm } from './styles';
import { storageKeys } from '@/constants';

const getSmsFields = ({ onSendSms, sendStatus, restSendStatus }) => [
  {
    name: 'phone',
    label: '手机号',
    type: inputType.input,
    inputProps: {
      placeholder: '手机号',
      prefix: <PhoneOutlined />,
    },
    rules: [
      {
        required: true,
      },
    ],
  },
  {
    name: 'smsValidCode',
    label: '验证码',
    inputProps: {
      placeholder: '验证码',
      prefix: <InsuranceOutlined />,
      suffix: (
        <VerifyCode onSendSms={sendStatus ? onSendSms : () => {}} restSendStatus={restSendStatus} />
      ),
      maxLength: 6,
    },
    rules: [
      {
        required: true,
      },
    ],
  },
  {
    name: 'password',
    label: '密码',
    type: inputType.password,
    inputProps: {
      placeholder: '请输入密码',
      prefix: <LockOutlined />,
    },
    rules: [
      {
        required: true,
      },
    ],
  },
];
const Header = ({ username, onLogout }) => {
  const [showModal, setShowModal] = useState(false);
  const [form] = Form.useForm();
  const [sendStatus, setSendStatus] = useState(true);
  const smsFields = getSmsFields({
    sendStatus,
    onSendSms: async (cb) => {
      const formValue = form.getFieldValue();
      if (formValue?.phone) {
        const res = await httpRequest.post('/sms/send', {
          mobile: formValue?.phone,
          type: 'center_pc_modify_password',
        });
        if (res.code === 0) {
          message.success('验证码已发送');
          if (cb) {
            cb();
          }
          setSendStatus(false);
        } else {
          message.error(res.msg);
        }
      } else {
        message.error('请输入手机号');
      }
    },
    restSendStatus: () => {
      setSendStatus(true);
    },
  });
  const validateMessages = {
    required: '此选项不能为空！',
  };
  const onFinish = async (val) => {
    const { password, smsValidCode } = form.getFieldsValue();
    try {
      if (sendStatus) {
        message.warn('请发送验证码后在确认');
        return;
      }
      const res = await httpRequest.post('admin/user/modify/password', {
        validCode: smsValidCode,
        password: md5(`${password}erGDxe8L`),
      });
      if (res.code !== 0) {
        throw new Error(res.msg);
      }
      message.success('修改密码成功');
      onLogout();
    } catch (err) {
      message.error(err.message);
    }
  };
  useEffect(() => {
    form.setFieldsValue({
      phone: localStorage.getItem(storageKeys.mobile),
    });
  }, []);
  return (
    <HeaderContainer className="header">
      <Space>
        <Dropdown
          overlay={(
            <Menu>
              <Menu.Item key="logout" onClick={onLogout}>
                退出登录
              </Menu.Item>
              <Menu.Item key="changePassword" onClick={() => setShowModal(true)}>
                修改密码
              </Menu.Item>
            </Menu>
          )}
        >
          <Space>
            <span className="username">{username}</span>
            <Avatar size={30} icon={<UserOutlined />} />
          </Space>
        </Dropdown>
      </Space>
      <Modal
        title="修改新密码"
        visible={showModal}
        okText="确认"
        cancelText="取消"
        onOk={onFinish}
        onCancel={() => setShowModal(false)}
      >
        <MyForm
          form={form}
          validateMessages={validateMessages}
          onFinish={onFinish}
          wrapperCol={{ span: 18, offset: 3 }}
        >
          {smsFields.map((f) => (
            <FormItem
              key={f.name}
              name={f.name}
              inputProps={f.inputProps}
              type={f.type}
              rules={f.rules}
            />
          ))}
        </MyForm>
      </Modal>
    </HeaderContainer>
  );
};
Header.propTypes = {
  username: PropTypes.string.isRequired,
  onLogout: PropTypes.func,
};

Header.defaultProps = {
  onLogout: () => {},
};
export default Header;
